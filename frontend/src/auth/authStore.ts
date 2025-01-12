import { createSignal } from "solid-js";

import { User } from "../api/types";

const [isLoggedIn, setIsLoggedIn] = createSignal(!!localStorage.getItem("jwt"));

const [user, setUser] = createSignal(decodeToken(localStorage.getItem("jwt")));

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

export { isLoggedIn, user };

function decodeToken(token: string | null): User | null {
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
