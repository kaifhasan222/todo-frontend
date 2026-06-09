"use client";

import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";

import { ThemeToggle } from "@/shared/components/ThemeToggle";

import styles from "../styles/AuthShell.module.css";

export function ResetPasswordView() {
  return (
    <main className={styles.page}>
      <div className={styles.gridBackdrop} aria-hidden="true" />
      <div className={styles.themeDock}>
        <ThemeToggle />
      </div>

      <section className={styles.verifyShell}>
        <div className={styles.verifyCard}>
          <div className={styles.heroBadge}>
            <ShieldCheck size="0.95rem" aria-hidden="true" />
            Password reset
          </div>
          <div className={styles.verifyIcon}>
            <KeyRound size="1.8rem" aria-hidden="true" />
          </div>
          <h1 className={styles.verifyTitle}>Use OTP reset</h1>
          <p className={styles.verifyText}>
            Password reset now happens with a 6-digit OTP on the forgot password screen.
          </p>
          <Link className={styles.textLink} href="/forgot-password">
            Go to forgot password
          </Link>
        </div>
      </section>
    </main>
  );
}
