export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  is_email_verified: boolean;
  email_verified_at: string | null;
}

export type AuthMode = "login" | "register";
export type OtpPurpose = "REGISTER" | "LOGIN" | "PASSWORD_RESET";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
  purpose: Exclude<OtpPurpose, "PASSWORD_RESET">;
}

export interface AuthMessageResponse {
  message: string;
  code?: string;
  email?: string;
}

export interface OtpRequiredResponse {
  message: string;
  code: "OTP_REQUIRED" | "LOGIN_OTP_REQUIRED" | "OTP_EMAIL_SEND_FAILED";
  email: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: PublicUser;
  accessToken: string;
}

export interface RegisterPendingResponse {
  message: string;
  code?: string;
  email?: string;
}

export type RegisterResponse = RegisterPendingResponse | AuthSuccessResponse;
export type LoginResponse = OtpRequiredResponse | AuthSuccessResponse;

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
export type VerifyOtpResponse = AuthSuccessResponse;
