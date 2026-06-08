"use client";

import { Loader2 } from "lucide-react";

import { useAuthSession } from "../hooks/useAuth";
import { AuthScreen } from "./AuthScreen";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { TodoApp } from "@/features/todos/components/TodoApp";
import styles from "../styles/AuthShell.module.css";

export function AuthGate() {
  useAuthSession();
  const status = useAuthSessionStore((state) => state.status);

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
    return <TodoApp />;
  }

  return <AuthScreen />;
}
