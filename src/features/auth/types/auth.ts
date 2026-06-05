export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

export type AuthMode = "login" | "register";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: PublicUser;
}

export interface SessionResponse {
  user: PublicUser;
}
