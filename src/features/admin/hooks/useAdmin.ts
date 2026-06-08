"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { adminApi } from "../api/adminApi";
import type { UserRole } from "../types/admin";

const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: () => adminApi.getUsers(),
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();
  const currentUser = useAuthSessionStore((state) => state.user);
  const setUnauthenticated = useAuthSessionStore(
    (state) => state.setUnauthenticated,
  );

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });

      if (data.user.id === currentUser?.id && data.user.role !== "ADMIN") {
        setUnauthenticated();
        queryClient.removeQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
        queryClient.removeQueries({ queryKey: ["auth", "session"] });
        toast.success("Your admin access changed. Please sign in again.");
        return;
      }

      toast.success("User role updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success("User deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
