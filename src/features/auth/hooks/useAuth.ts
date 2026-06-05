"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";

import { authApi } from "../api/authApi";
import type { LoginInput, RegisterInput } from "../types/auth";

const AUTH_SESSION_KEY = ["auth", "session"] as const;

export function useAuthSession() {
  const setLoading = useAuthSessionStore((state) => state.setLoading);
  const setAuthenticated = useAuthSessionStore(
    (state) => state.setAuthenticated,
  );
  const setUnauthenticated = useAuthSessionStore(
    (state) => state.setUnauthenticated,
  );

  useEffect(() => {
    setLoading();
  }, [setLoading]);

  const sessionQuery = useQuery({
    queryKey: AUTH_SESSION_KEY,
    queryFn: authApi.getSession,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (sessionQuery.isSuccess && sessionQuery.data) {
      setAuthenticated(sessionQuery.data.user);
      return;
    }

    if (sessionQuery.isError) {
      setUnauthenticated();
    }
  }, [
    sessionQuery.data,
    sessionQuery.isError,
    sessionQuery.isSuccess,
    setAuthenticated,
    setUnauthenticated,
  ]);

  return null;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore(
    (state) => state.setAuthenticated,
  );

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: async (data) => {
      setAuthenticated(data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY });
      toast.success("Welcome back");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore(
    (state) => state.setAuthenticated,
  );

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: async (data) => {
      setAuthenticated(data.user);
      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_KEY });
      toast.success("Account created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setUnauthenticated = useAuthSessionStore(
    (state) => state.setUnauthenticated,
  );

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      setUnauthenticated();
      queryClient.removeQueries({ queryKey: ["todos"] });
      queryClient.removeQueries({ queryKey: AUTH_SESSION_KEY });
      toast.success("Signed out");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
