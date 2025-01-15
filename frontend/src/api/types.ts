export type JwtDTO = {
  jwt: string;
};

export type UserDTO = {
  id: string;
  username: string;
  created_at: string;
};

export type ListDTO = {
  id: string;
  name: string;
  description: string;
};

export type ListParams = {
  name: string;
  description: string;
};
