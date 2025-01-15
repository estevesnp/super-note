import { createSignal } from "solid-js";
import { JwtUser } from "./types";

const [isLoggedIn, setIsLoggedIn] = createSignal(!!getToken());
const [user, setUser] = createSignal(decodeToken(getToken()));

export { isLoggedIn, user };

export function login(token: string): void {
  localStorage.setItem("jwt", token);
  setIsLoggedIn(true);
  setUser(decodeToken(token));
}

export function logout(): void {
  localStorage.removeItem("jwt");
  setIsLoggedIn(false);
  setUser(null);
}

export function validateToken() {
  if (!isLoggedIn()) {
    return;
  }

  const user = decodeToken(getToken());
  if (user == null) {
    logout();
    return;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (user.exp < currentTime) {
    logout();
  }
}

export function getToken() {
  return localStorage.getItem("jwt");
}

function decodeToken(token: string | null): JwtUser | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length != 3) {
    return null;
  }

  const decoded = atob(parts[1]);

  try {
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
