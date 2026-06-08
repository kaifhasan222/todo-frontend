import { requestJson } from "@/shared/utils/requestJson";

import type {
  AdminUsersResponse,
  UpdateUserRoleResponse,
  UserRole,
} from "../types/admin";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const ADMIN_ENDPOINT = `${API_BASE_URL}/api/admin`;

export const adminApi = {
  getUsers: async (): Promise<AdminUsersResponse> =>
    requestJson<AdminUsersResponse>(`${ADMIN_ENDPOINT}/users`, {
      auth: "required",
      method: "GET",
      cache: "no-store",
    }),

  updateUserRole: async (
    id: number,
    role: UserRole,
  ): Promise<UpdateUserRoleResponse> =>
    requestJson<UpdateUserRoleResponse>(`${ADMIN_ENDPOINT}/users/${id}/role`, {
      auth: "required",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }),

  deleteUser: async (id: number): Promise<{ message: string }> =>
    requestJson<{ message: string }>(`${ADMIN_ENDPOINT}/users/${id}`, {
      auth: "required",
      method: "DELETE",
    }),
};
