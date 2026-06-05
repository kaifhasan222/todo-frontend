import { requestJson } from "@/shared/utils/requestJson";

import type {
  AuthSuccessResponse,
  LoginInput,
  RegisterInput,
  SessionResponse,
} from "../types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth`;

export const authApi = {
  getSession: async (): Promise<SessionResponse> =>
    requestJson<SessionResponse>(`${AUTH_ENDPOINT}/me`, {
      method: "GET",
      cache: "no-store",
    }),

  login: async (input: LoginInput): Promise<AuthSuccessResponse> =>
    requestJson<AuthSuccessResponse>(`${AUTH_ENDPOINT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }),

  register: async (input: RegisterInput): Promise<AuthSuccessResponse> =>
    requestJson<AuthSuccessResponse>(`${AUTH_ENDPOINT}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }),

  logout: async (): Promise<{ message: string }> =>
    requestJson<{ message: string }>(`${AUTH_ENDPOINT}/logout`, {
      method: "POST",
    }),
};
