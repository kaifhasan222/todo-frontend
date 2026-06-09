export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  is_email_verified: boolean;
  email_verified_at: string | null;
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

export interface RegisterPendingResponse {
  message: string;
  code?: string;
}

export type RegisterResponse = RegisterPendingResponse | AuthSuccessResponse;

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface SessionResponse {
  user: PublicUser;
}

export interface ResendVerificationInput {
  email: string;
}

export type VerifyEmailResponse = AuthSuccessResponse;
