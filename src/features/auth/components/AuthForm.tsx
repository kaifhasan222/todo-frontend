"use client";

import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { ApiRequestError } from "@/shared/utils/requestJson";

import { authApi } from "../api/authApi";
import { useLoginMutation, useRegisterMutation } from "../hooks/useAuth";
import {
  type AuthErrors,
  type AuthValues,
  useAuthValidation,
} from "../hooks/useAuthValidation";
import type { AuthMode } from "../types/auth";
import styles from "../styles/AuthShell.module.css";

interface AuthFormProps {
  mode: AuthMode;
}

const initialValues: AuthValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const getFriendlyAuthError = (error: unknown, mode: AuthMode): string => {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      return "Invalid email or password.";
    }

    if (error.status === 403 && error.code === "EMAIL_NOT_VERIFIED") {
      return "Please verify your email before signing in.";
    }

    if (error.status === 404 && mode === "login") {
      return "We could not find an account with that email.";
    }

    if (error.status === 400 && mode === "register") {
      if (error.message === "User already exists") {
        return "An account with that email already exists.";
      }
    }

    return error.message;
  }

  return getErrorMessage(error);
};

export function AuthForm({ mode }: AuthFormProps) {
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<AuthValues>(initialValues);
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const {
    errors,
    validate,
    clearFieldError,
    setFormError,
    clearFormError,
    clearAllErrors,
  } = useAuthValidation(mode);

  useEffect(() => {
    setValues(initialValues);
    setShowPassword(false);
    setSuccessMessage("");
    setVerificationEmail("");
    clearAllErrors();
  }, [clearAllErrors, mode]);

  const updateField = (field: keyof AuthValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field as keyof AuthErrors]) {
      clearFieldError(field as keyof AuthErrors);
    }

    if (errors.form) {
      clearFormError();
    }

    if (successMessage) {
      setSuccessMessage("");
    }

    if (field === "password" && mode === "register" && errors.confirmPassword) {
      clearFieldError("confirmPassword");
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail || isResending) {
      return;
    }

    setIsResending(true);

    try {
      const response = await authApi.resendVerificationEmail({
        email: verificationEmail,
      });
      setSuccessMessage(response.message);
      toast.success(response.message);
    } catch (error) {
      setFormError(getFriendlyAuthError(error, "login"));
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate(values)) {
      return;
    }

    try {
      if (mode === "login") {
        await loginMutation.mutateAsync({
          email: values.email.trim(),
          password: values.password,
        });
      } else {
        const response = await registerMutation.mutateAsync({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        });
        setSuccessMessage(response.message);
        setVerificationEmail(values.email.trim());
        setValues((current) => ({
          ...current,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      if (
        mode === "login" &&
        error instanceof ApiRequestError &&
        error.status === 403 &&
        error.code === "EMAIL_NOT_VERIFIED"
      ) {
        setVerificationEmail(values.email.trim());
      }

      setFormError(getFriendlyAuthError(error, mode));
      return;
    }
  };

  const isSubmitting =
    mode === "login" ? loginMutation.isPending : registerMutation.isPending;
  const helperText =
    mode === "login"
      ? "Use your registered email and password to continue."
      : "Create your account with a strong password and keep your tasks protected.";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.formLead}>{helperText}</p>

      {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}
      {successMessage ? <div className={styles.formSuccess}>{successMessage}</div> : null}

      {mode === "register" ? (
        <Field
          autoComplete="name"
          icon={<User size="1rem" aria-hidden="true" />}
          id="auth-name"
          label="Full name"
          placeholder="Alex Morgan"
          value={values.name}
          error={errors.name}
          disabled={isSubmitting}
          onChange={(value) => updateField("name", value)}
        />
      ) : null}

      <Field
        autoComplete="email"
        icon={<Mail size="1rem" aria-hidden="true" />}
        id="auth-email"
        label="Email address"
        placeholder="alex@example.com"
        value={values.email}
        error={errors.email}
        disabled={isSubmitting}
        onChange={(value) => updateField("email", value)}
        type="email"
      />

      <Field
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        icon={<Lock size="1rem" aria-hidden="true" />}
        id="auth-password"
        label="Password"
        placeholder="Enter your password"
        value={values.password}
        error={errors.password}
        disabled={isSubmitting}
        onChange={(value) => updateField("password", value)}
        type={showPassword ? "text" : "password"}
        trailingAction={
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
        }
      />

      {mode === "register" ? (
        <Field
          autoComplete="new-password"
          icon={<Lock size="1rem" aria-hidden="true" />}
          id="auth-confirm-password"
          label="Confirm password"
          placeholder="Repeat your password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          onChange={(value) => updateField("confirmPassword", value)}
          type={showPassword ? "text" : "password"}
        />
      ) : null}

      {mode === "register" ? (
        <p className={styles.passwordHint}>
          Password must include at least 8 characters, upper and lowercase
          letters, a number, and a special character.
        </p>
      ) : null}

      {verificationEmail ? (
        <div className={styles.infoCard}>
          <p className={styles.infoTitle}>Need another verification email?</p>
          <p className={styles.infoText}>
            We can resend the link to <strong>{verificationEmail}</strong>.
          </p>
          <button
            className={styles.secondaryButton}
            disabled={isResending}
            type="button"
            onClick={handleResendVerification}
          >
            {isResending ? (
              <>
                <Loader2 className={styles.spinner} size="1rem" />
                Sending email
              </>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>
      ) : null}

      <button className={styles.submitButton} disabled={isSubmitting} type="submit">
        {isSubmitting ? <Loader2 className={styles.spinner} size="1rem" /> : null}
        <span>
          {isSubmitting
            ? mode === "login"
              ? "Signing in"
              : "Creating account"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </span>
        {!isSubmitting ? <ArrowRight size="1rem" aria-hidden="true" /> : null}
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  icon: ReactNode;
  disabled?: boolean;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  trailingAction?: ReactNode;
}

function Field({
  id,
  label,
  value,
  error,
  placeholder,
  icon,
  disabled = false,
  type = "text",
  autoComplete,
  onChange,
  trailingAction,
}: FieldProps) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.labelRow}>
        <span className={styles.fieldLabel}>{label}</span>
      </span>
      <div className={error ? styles.inputShellError : styles.inputShell}>
        <span className={styles.inputIcon} aria-hidden="true">
          {icon}
        </span>
        <input
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete={autoComplete}
          className={styles.input}
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {trailingAction ? <div className={styles.trailing}>{trailingAction}</div> : null}
      </div>
      {error ? (
        <p className={styles.fieldError} id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </label>
  );
}
