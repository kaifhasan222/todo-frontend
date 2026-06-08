"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Mail, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { ApiRequestError } from "@/shared/utils/requestJson";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";

import { authApi } from "../api/authApi";
import styles from "../styles/AuthShell.module.css";

type VerifyStatus = "loading" | "success" | "error";

const getVerifyMessage = (error: unknown): string => {
  if (error instanceof ApiRequestError) {
    if (error.code === "VERIFICATION_TOKEN_EXPIRED") {
      return "This verification link has expired. Request a new one below.";
    }

    if (error.code === "INVALID_VERIFICATION_TOKEN") {
      return "This verification link is invalid. Request a fresh email below.";
    }

    return error.message;
  }

  return "We could not verify your email right now. Please try again.";
};

interface VerifyEmailViewProps {
  initialToken?: string;
  initialEmail?: string;
}

export function VerifyEmailView({
  initialToken = "",
  initialEmail = "",
}: VerifyEmailViewProps) {
  const router = useRouter();
  const setAuthenticated = useAuthSessionStore((state) => state.setAuthenticated);
  const token = initialToken.trim();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [email, setEmail] = useState(initialEmail);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Request a new verification email.");
      return;
    }

    let isActive = true;

    const verify = async () => {
      setStatus("loading");
      setMessage("Verifying your email...");

      try {
        const response = await authApi.verifyEmail(token);

        if (!isActive) {
          return;
        }

        setAuthenticated(response.user, response.accessToken);
        setStatus("success");
        setMessage("Email verified. Opening your workspace...");
        toast.success(response.message);
        router.replace(response.user.role === "ADMIN" ? "/admin" : "/");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus("error");
        setMessage(getVerifyMessage(error));
      }
    };

    void verify();

    return () => {
      isActive = false;
    };
  }, [router, setAuthenticated, token]);

  const handleResend = async () => {
    if (!email.trim() || isResending) {
      return;
    }

    setIsResending(true);

    try {
      const response = await authApi.resendVerificationEmail({
        email: email.trim(),
      });
      setMessage(response.message);
      setStatus("error");
      toast.success(response.message);
    } catch (error) {
      toast.error(getVerifyMessage(error));
    } finally {
      setIsResending(false);
    }
  };

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
            Email verification
          </div>

          <div className={styles.verifyIcon}>
            {status === "loading" ? (
              <Loader2 className={styles.spinnerLarge} size="1.8rem" aria-hidden="true" />
            ) : status === "success" ? (
              <CheckCircle2 size="1.8rem" aria-hidden="true" />
            ) : (
              <TriangleAlert size="1.8rem" aria-hidden="true" />
            )}
          </div>

          <h1 className={styles.verifyTitle}>
            {status === "loading"
              ? "Checking your link"
              : status === "success"
                ? "Email verified"
                : "Verification issue"}
          </h1>
          <p className={styles.verifyText}>{message}</p>

          {status === "success" ? (
            <div className={styles.verifyActions}>
              <div className={styles.formSuccess}>{message}</div>
              <div className={styles.loadingCard}>
                <Loader2 className={styles.spinnerLarge} size="1.2rem" aria-hidden="true" />
                <p>Signing you in securely...</p>
              </div>
            </div>
          ) : (
            <div className={styles.verifyActions}>
              <label className={styles.field} htmlFor="verify-email">
                <span className={styles.labelRow}>
                  <span className={styles.fieldLabel}>Email address</span>
                </span>
                <div className={styles.inputShell}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <Mail size="1rem" />
                  </span>
                  <input
                    autoComplete="email"
                    className={styles.input}
                    id="verify-email"
                    placeholder="alex@example.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              <button
                className={styles.secondaryButton}
                disabled={isResending || !email.trim()}
                type="button"
                onClick={handleResend}
              >
                {isResending ? (
                  <>
                    <Loader2 className={styles.spinner} size="1rem" />
                    Sending email
                  </>
                ) : (
                  <>
                    <RefreshCw size="1rem" aria-hidden="true" />
                    Resend verification email
                  </>
                )}
              </button>

              <Link className={styles.textLink} href="/?mode=login">
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
