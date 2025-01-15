import { getToken } from "../auth/authStore";
import { UserCreds } from "../auth/types";
import { JwtDTO, ListDTO, ListParams, UserDTO } from "./types";

const API_URL = import.meta.env.VITE_API;
const SC_UNAUTHORIZED = 401;

const endpoints = {
  getUsersURL: `${API_URL}/users`,
  loginURL: `${API_URL}/login`,
  registerURL: `${API_URL}/register`,
  getListsURL: `${API_URL}/lists`,
  createListURL: `${API_URL}/lists`,
};

type Opts = {
  headers?: {
    Authorization?: string;
    "Content-Type"?: string;
  };
  method?: string;
  body?: string;
};

export function getUsers(): Promise<Array<UserDTO>> {
  return get(endpoints.getUsersURL);
}

export function getLists(): Promise<Array<ListDTO>> {
  return get(endpoints.getListsURL, true);
}

export function createList(list: ListParams): Promise<ListDTO> {
  return post(endpoints.createListURL, list);
}

export function loginUser(user: UserCreds): Promise<JwtDTO> {
  return post(endpoints.loginURL, user);
}

export function registerUser(user: UserCreds): Promise<JwtDTO> {
  return post(endpoints.registerURL, user);
}

async function get(url: string, auth: boolean = false) {
  const opts: Opts = {};
  if (auth) {
    opts.headers = { Authorization: `Bearer ${getToken()}` };
  }

  const resp = await fetch(url, opts);

  if (resp.status === SC_UNAUTHORIZED) {
    throw new Error("unauthorized");
  }

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.error ?? "error getting resource");
  }

  return data;
}

async function post(url: string, body: any, auth: boolean = false) {
  const opts: Opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  if (auth && opts.headers) {
    opts.headers.Authorization = `Bearer ${getToken()}`;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (resp.status === SC_UNAUTHORIZED) {
    throw new Error("unauthorized");
  }

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.error ?? "error posting resource");
  }

  return data;
}
