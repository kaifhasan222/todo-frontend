import { create } from "zustand";

import type { PublicUser } from "@/features/auth/types/auth";

export type AuthSessionStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthSessionState {
  status: AuthSessionStatus;
  user: PublicUser | null;
  setLoading: () => void;
  setAuthenticated: (user: PublicUser) => void;
  setUnauthenticated: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  status: "loading",
  user: null,
  setLoading: () => set({ status: "loading", user: null }),
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setUnauthenticated: () => set({ status: "unauthenticated", user: null }),
}));
