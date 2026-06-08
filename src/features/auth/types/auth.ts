export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
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
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface SessionResponse {
  user: PublicUser;
}
