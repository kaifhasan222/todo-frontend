"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";

import { authApi } from "../api/authApi";
import type {
  ForgotPasswordInput,
  AuthSuccessResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  ResetPasswordInput,
  VerifyOtpInput,
} from "../types/auth";

const AUTH_SESSION_KEY = ["auth", "session"] as const;

const isAuthenticatedRegisterResponse = (
  response: RegisterResponse,
): response is AuthSuccessResponse =>
  "user" in response && "accessToken" in response;

const isAuthenticatedLoginResponse = (
  response: LoginResponse,
): response is AuthSuccessResponse =>
  "user" in response && "accessToken" in response;

export function useAuthSession() {
  const setLoading = useAuthSessionStore((state) => state.setLoading);
  const setAuthenticated = useAuthSessionStore(
    (state) => state.setAuthenticated,
  );
  const setUnauthenticated = useAuthSessionStore(
    (state) => state.setUnauthenticated,
  );
  const queryClient = useQueryClient();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const restoreSession = async () => {
      setLoading();

      try {
        const refreshResponse = await authApi.refresh();
        const session = await authApi.getSession();

        setAuthenticated(session.user, refreshResponse.accessToken);
        queryClient.setQueryData(AUTH_SESSION_KEY, session);
      } catch {
        setUnauthenticated();
        queryClient.removeQueries({ queryKey: AUTH_SESSION_KEY });
      }
    };

    void restoreSession();
  }, [queryClient, setAuthenticated, setLoading, setUnauthenticated]);

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
      if (isAuthenticatedLoginResponse(data)) {
        setAuthenticated(data.user, data.accessToken);
        queryClient.setQueryData(AUTH_SESSION_KEY, { user: data.user });
      }

      toast.success(data.message);
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
      if (isAuthenticatedRegisterResponse(data)) {
        setAuthenticated(data.user, data.accessToken);
        queryClient.setQueryData(AUTH_SESSION_KEY, { user: data.user });
      }

      toast.success(data.message);
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

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore(
    (state) => state.setAuthenticated,
  );

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
    onSuccess: (data) => {
      if ("user" in data && "accessToken" in data) {
        setAuthenticated(data.user, data.accessToken);
        queryClient.setQueryData(AUTH_SESSION_KEY, { user: data.user });
      }

      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore(
    (state) => state.setAuthenticated,
  );

  return useMutation({
    mutationFn: (input: VerifyOtpInput) => authApi.verifyOtp(input),
    onSuccess: (data) => {
      setAuthenticated(data.user, data.accessToken);
      queryClient.setQueryData(AUTH_SESSION_KEY, { user: data.user });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
