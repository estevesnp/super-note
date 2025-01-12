import { UserCreds } from "../auth/types";
import { JWT, User } from "./types";

const API_URL = import.meta.env.VITE_API;

const endpoints = {
  getUsersURL: `${API_URL}/users`,
  loginURL: `${API_URL}/login`,
  registerURL: `${API_URL}/register`,
};

async function post(url: string, body: any) {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.error);
  }

  console.log("data", data);

  return data;
}

export async function getUsers(): Promise<Array<User>> {
  const resp = await fetch(endpoints.getUsersURL);
  if (!resp.ok) {
    throw new Error("Error fetching users");
  }

  return await resp.json();
}

export async function loginUser(user: UserCreds): Promise<JWT> {
  return await post(endpoints.loginURL, user);
}

export async function registerUser(user: UserCreds): Promise<JWT> {
  return await post(endpoints.registerURL, user);
}
