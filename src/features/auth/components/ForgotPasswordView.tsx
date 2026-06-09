"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { useForgotPasswordMutation, useResetPasswordMutation } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../hooks/useAuthValidation";
import styles from "../styles/AuthShell.module.css";

type ForgotStep = "email" | "reset";

export function ForgotPasswordView() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setFormError("");
    setSuccessMessage("");
  };

  const requestOtp = async () => {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    clearMessages();

    if (nextEmailError) {
      return;
    }

    try {
      const response = await forgotPasswordMutation.mutateAsync({
        email: email.trim(),
      });
      setSuccessMessage(response.message);
      setStep("reset");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestOtp();
  };

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextOtpError = /^\d{6}$/.test(otp.trim()) ? "" : "Enter the 6-digit OTP";
    const nextPasswordError = validatePassword(password);
    const nextConfirmPasswordError = confirmPassword
      ? password === confirmPassword
        ? ""
        : "Passwords do not match"
      : "Confirm your password";

    setOtpError(nextOtpError);
    setPasswordError(nextPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);
    clearMessages();

    if (nextOtpError || nextPasswordError || nextConfirmPasswordError) {
      return;
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        email: email.trim(),
        otp: otp.trim(),
        password,
      });
      router.replace(response.user.role === "ADMIN" ? "/admin" : "/");
    } catch (error) {
      setFormError(getErrorMessage(error));
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
            Password reset
          </div>

          <div className={styles.verifyIcon}>
            {step === "reset" ? (
              <CheckCircle2 size="1.8rem" aria-hidden="true" />
            ) : (
              <Mail size="1.8rem" aria-hidden="true" />
            )}
          </div>

          <h1 className={styles.verifyTitle}>Reset your password</h1>
          <p className={styles.verifyText}>
            {step === "email"
              ? "Enter your account email and we will send a 6-digit OTP."
              : `Enter the OTP sent to ${email.trim()} and choose a new password.`}
          </p>

          {formError ? <div className={styles.formError}>{formError}</div> : null}
          {successMessage ? <div className={styles.formSuccess}>{successMessage}</div> : null}

          {step === "email" ? (
            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <label className={styles.field} htmlFor="forgot-email">
                <span className={styles.labelRow}>
                  <span className={styles.fieldLabel}>Email address</span>
                </span>
                <div className={emailError ? styles.inputShellError : styles.inputShell}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <Mail size="1rem" />
                  </span>
                  <input
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "forgot-email-error" : undefined}
                    autoComplete="email"
                    className={styles.input}
                    disabled={forgotPasswordMutation.isPending}
                    id="forgot-email"
                    placeholder="alex@example.com"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                      clearMessages();
                    }}
                  />
                </div>
                {emailError ? (
                  <p className={styles.fieldError} id="forgot-email-error">
                    {emailError}
                  </p>
                ) : null}
              </label>

              <button
                className={styles.submitButton}
                disabled={forgotPasswordMutation.isPending}
                type="submit"
              >
                {forgotPasswordMutation.isPending ? (
                  <Loader2 className={styles.spinner} size="1rem" />
                ) : null}
                <span>{forgotPasswordMutation.isPending ? "Sending OTP" : "Send OTP"}</span>
                {!forgotPasswordMutation.isPending ? (
                  <ArrowRight size="1rem" aria-hidden="true" />
                ) : null}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleResetSubmit}>
              <label className={styles.field} htmlFor="forgot-otp">
                <span className={styles.labelRow}>
                  <span className={styles.fieldLabel}>6-digit OTP</span>
                </span>
                <div className={otpError ? styles.inputShellError : styles.inputShell}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <Lock size="1rem" />
                  </span>
                  <input
                    aria-invalid={Boolean(otpError)}
                    aria-describedby={otpError ? "forgot-otp-error" : undefined}
                    autoComplete="one-time-code"
                    className={styles.input}
                    disabled={resetPasswordMutation.isPending}
                    id="forgot-otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                      setOtpError("");
                      clearMessages();
                    }}
                  />
                </div>
                {otpError ? (
                  <p className={styles.fieldError} id="forgot-otp-error">
                    {otpError}
                  </p>
                ) : null}
              </label>

              <label className={styles.field} htmlFor="forgot-password">
                <span className={styles.labelRow}>
                  <span className={styles.fieldLabel}>New password</span>
                </span>
                <div className={passwordError ? styles.inputShellError : styles.inputShell}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <Lock size="1rem" />
                  </span>
                  <input
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "forgot-password-error" : undefined}
                    autoComplete="new-password"
                    className={styles.input}
                    disabled={resetPasswordMutation.isPending}
                    id="forgot-password"
                    placeholder="Enter your new password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError("");
                      setConfirmPasswordError("");
                      clearMessages();
                    }}
                  />
                  <div className={styles.trailing}>
                    <button
                      className={styles.iconButton}
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? (
                        <EyeOff size="1rem" aria-hidden="true" />
                      ) : (
                        <Eye size="1rem" aria-hidden="true" />
                      )}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                </div>
                {passwordError ? (
                  <p className={styles.fieldError} id="forgot-password-error">
                    {passwordError}
                  </p>
                ) : null}
              </label>

              <label className={styles.field} htmlFor="forgot-confirm-password">
                <span className={styles.labelRow}>
                  <span className={styles.fieldLabel}>Confirm password</span>
                </span>
                <div
                  className={
                    confirmPasswordError ? styles.inputShellError : styles.inputShell
                  }
                >
                  <span className={styles.inputIcon} aria-hidden="true">
                    <Lock size="1rem" />
                  </span>
                  <input
                    aria-invalid={Boolean(confirmPasswordError)}
                    aria-describedby={
                      confirmPasswordError ? "forgot-confirm-password-error" : undefined
                    }
                    autoComplete="new-password"
                    className={styles.input}
                    disabled={resetPasswordMutation.isPending}
                    id="forgot-confirm-password"
                    placeholder="Repeat your new password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setConfirmPasswordError("");
                      clearMessages();
                    }}
                  />
                </div>
                {confirmPasswordError ? (
                  <p className={styles.fieldError} id="forgot-confirm-password-error">
                    {confirmPasswordError}
                  </p>
                ) : null}
              </label>

              <p className={styles.passwordHint}>
                Password must include at least 8 characters, upper and lowercase
                letters, a number, and a special character.
              </p>

              <button
                className={styles.submitButton}
                disabled={resetPasswordMutation.isPending}
                type="submit"
              >
                {resetPasswordMutation.isPending ? (
                  <Loader2 className={styles.spinner} size="1rem" />
                ) : null}
                <span>
                  {resetPasswordMutation.isPending ? "Resetting password" : "Reset password"}
                </span>
                {!resetPasswordMutation.isPending ? (
                  <ArrowRight size="1rem" aria-hidden="true" />
                ) : null}
              </button>

              <button
                className={styles.secondaryButton}
                disabled={forgotPasswordMutation.isPending || resetPasswordMutation.isPending}
                type="button"
                onClick={requestOtp}
              >
                {forgotPasswordMutation.isPending ? (
                  <Loader2 className={styles.spinner} size="1rem" />
                ) : (
                  <RefreshCw size="1rem" aria-hidden="true" />
                )}
                {forgotPasswordMutation.isPending ? "Sending OTP" : "Resend OTP"}
              </button>
            </form>
          )}

          <Link className={styles.textLink} href="/?mode=login">
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
