"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { PageSkeleton } from "@/shared/components/PageSkeleton";
import { useAuthSession } from "../hooks/useAuth";
import { AuthScreen } from "./AuthScreen";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { TodoApp } from "@/features/todos/components/TodoApp";

interface AuthGateProps {
  view?: "user" | "admin";
  initialMode?: "login" | "register";
}

export function AuthGate({ view = "user", initialMode = "login" }: AuthGateProps) {
  useAuthSession();
  const router = useRouter();
  const status = useAuthSessionStore((state) => state.status);
  const user = useAuthSessionStore((state) => state.user);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      return;
    }

    if (view === "admin" && user.role !== "ADMIN") {
      router.replace("/");
      return;
    }

    if (view === "user" && user.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [router, status, user, view]);

  if (status === "loading") {
    return <PageSkeleton ariaLabel="Refreshing your secure session" />;
  }

  if (status === "authenticated") {
    if (!user) {
      return <PageSkeleton ariaLabel="Loading your workspace" />;
    }

    if (view === "admin") {
      if (user.role !== "ADMIN") {
        return <PageSkeleton ariaLabel="Redirecting to your workspace" />;
      }

      return <AdminDashboard />;
    }

    if (user.role === "ADMIN") {
      return <PageSkeleton ariaLabel="Opening your admin console" />;
    }

    return <TodoApp />;
  }

  return <AuthScreen initialMode={initialMode} />;
}
