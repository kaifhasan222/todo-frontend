"use client";

import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import type { AuthMode } from "../types/auth";
import { AuthForm } from "./AuthForm";
import styles from "../styles/AuthShell.module.css";

const MODE_COPY: Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    cta: string;
  }
> = {
  login: {
    title: "Welcome back.",
    subtitle: "Pick up your task list where you left off.",
    cta: "Sign in",
  },
  register: {
    title: "Build a focused workspace.",
    subtitle: "Create a secure account and keep your todo flow in one place.",
    cta: "Create account",
  },
};

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const copy = MODE_COPY[mode];

  return (
    <main className={styles.page}>
      <div className={styles.gridBackdrop} aria-hidden="true" />
      <section className={styles.shell}>
        <aside className={styles.hero}>
          <div className={styles.heroBadge}>
            <ShieldCheck size="0.95rem" aria-hidden="true" />
            Secure cookie session
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <CheckCircle2 size="1rem" aria-hidden="true" />
              <span>Protected routes</span>
            </div>
            <div className={styles.statCard}>
              <Sparkles size="1rem" aria-hidden="true" />
              <span>Clean validation</span>
            </div>
          </div>
          <ul className={styles.featureList}>
            <li>Register, login, logout, and session restore.</li>
            <li>Inline validation with clear field-by-field feedback.</li>
            <li>Todo dashboard stays protected until you sign in.</li>
          </ul>
        </aside>

        <section className={styles.card}>
          <div className={styles.modeTabs} role="tablist" aria-label="Authentication mode">
            {(["login", "register"] as const).map((item) => (
              <button
                aria-selected={mode === item}
                className={mode === item ? styles.tabActive : styles.tab}
                key={item}
                role="tab"
                type="button"
                onClick={() => setMode(item)}
              >
                {item === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <div className={styles.cardHeader}>
            <span className={styles.cardKicker}>Task Vault</span>
            <h2>{copy.cta}</h2>
            <p>Fast, friendly authentication with protected session cookies.</p>
          </div>

          <AuthForm mode={mode} />
        </section>
      </section>
    </main>
  );
}
