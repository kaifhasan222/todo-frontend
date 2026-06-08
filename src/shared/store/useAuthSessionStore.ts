import { create } from "zustand";

import type { PublicUser } from "@/features/auth/types/auth";

export type AuthSessionStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthSessionState {
  status: AuthSessionStatus;
  user: PublicUser | null;
  accessToken: string | null;
  setLoading: () => void;
  setAuthenticated: (user: PublicUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUnauthenticated: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  status: "loading",
  user: null,
  accessToken: null,
  setLoading: () => set((state) => ({ status: "loading", user: state.user, accessToken: state.accessToken })),
  setAuthenticated: (user, accessToken) =>
    set({ status: "authenticated", user, accessToken }),
  setAccessToken: (accessToken) =>
    set((state) => ({ ...state, accessToken })),
  setUnauthenticated: () =>
    set({ status: "unauthenticated", user: null, accessToken: null }),
}));
