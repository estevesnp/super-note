import { UserCreds } from "../auth/types";
import { User } from "./types";

const API_URL = import.meta.env.VITE_API;

export async function getUsers(): Promise<Array<User>> {
  const resp = await fetch(`${API_URL}/users`);
  if (!resp.ok) {
    throw new Error("Error fetching users");
  }

  return await resp.json();
}

export async function registerUser(user: UserCreds): Promise<User> {
  const resp = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.error);
  }

  return data;
}
