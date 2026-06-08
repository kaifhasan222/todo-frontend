"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { useAuthSession } from "../hooks/useAuth";
import { AuthScreen } from "./AuthScreen";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { TodoApp } from "@/features/todos/components/TodoApp";
import styles from "../styles/AuthShell.module.css";

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
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCard}>
          <Loader2 className={styles.spinnerLarge} size="1.5rem" />
          <p>Refreshing your secure session...</p>
        </div>
      </main>
    );
  }

  if (status === "authenticated") {
    if (!user) {
      return (
        <main className={styles.loadingPage}>
          <div className={styles.loadingCard}>
            <Loader2 className={styles.spinnerLarge} size="1.5rem" />
            <p>Loading your workspace...</p>
          </div>
        </main>
      );
    }

    if (view === "admin") {
      if (user.role !== "ADMIN") {
        return (
          <main className={styles.loadingPage}>
            <div className={styles.loadingCard}>
              <Loader2 className={styles.spinnerLarge} size="1.5rem" />
              <p>Redirecting to your workspace...</p>
            </div>
          </main>
        );
      }

      return <AdminDashboard />;
    }

    if (user.role === "ADMIN") {
      return (
        <main className={styles.loadingPage}>
          <div className={styles.loadingCard}>
            <Loader2 className={styles.spinnerLarge} size="1.5rem" />
            <p>Opening your admin console...</p>
          </div>
        </main>
      );
    }

    return <TodoApp />;
  }

  return <AuthScreen initialMode={initialMode} />;
}
