export type UserRole = "ADMIN" | "USER";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string | null;
}

export interface AdminUsersResponse {
  users: AdminUser[];
}

export interface UpdateUserRoleResponse {
  message: string;
  user: AdminUser;
}
