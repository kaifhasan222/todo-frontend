import { requestJson } from "@/shared/utils/requestJson";

import type {
  AuthSuccessResponse,
  LoginInput,
  RefreshTokenResponse,
  RegisterInput,
  SessionResponse,
} from "../types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth`;

export const authApi = {
  getSession: async (): Promise<SessionResponse> =>
    requestJson<SessionResponse>(`${AUTH_ENDPOINT}/me`, {
      auth: "required",
      method: "GET",
      cache: "no-store",
    }),

  login: async (input: LoginInput): Promise<AuthSuccessResponse> =>
    requestJson<AuthSuccessResponse>(`${AUTH_ENDPOINT}/login`, {
      auth: "none",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }),

  register: async (input: RegisterInput): Promise<AuthSuccessResponse> =>
    requestJson<AuthSuccessResponse>(`${AUTH_ENDPOINT}/register`, {
      auth: "none",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }),

  logout: async (): Promise<{ message: string }> =>
    requestJson<{ message: string }>(`${AUTH_ENDPOINT}/logout`, {
      auth: "none",
      method: "POST",
    }),

  refresh: async (): Promise<RefreshTokenResponse> =>
    requestJson<RefreshTokenResponse>(`${AUTH_ENDPOINT}/refresh`, {
      auth: "none",
      method: "POST",
    }),
};
