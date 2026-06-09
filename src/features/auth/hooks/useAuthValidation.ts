"use client";

import { useCallback, useState } from "react";

import type { AuthMode } from "../types/auth";

interface AuthValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthErrors extends AuthValues {
  form: string;
}

const emptyErrors: AuthErrors = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  form: "",
};

const validateName = (name: string): string => {
  const value = name.trim();

  if (!value) {
    return "Name is required";
  }

  if (value.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (value.length > 50) {
    return "Name must be 50 characters or less";
  }

  return "";
};

export const validateEmail = (email: string): string => {
  const value = email.trim();

  if (!value) {
    return "Email is required";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    return "Enter a valid email address";
  }

  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[a-z]/.test(password)) {
    return "Password needs a lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password needs an uppercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password needs a number";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password needs a special character";
  }

  return "";
};

export function useAuthValidation(mode: AuthMode) {
  const [errors, setErrors] = useState<AuthErrors>(emptyErrors);

  const validate = useCallback(
    (values: AuthValues): boolean => {
      const nextErrors: AuthErrors = {
        name: mode === "register" ? validateName(values.name) : "",
        email: validateEmail(values.email),
        password: validatePassword(values.password),
        confirmPassword:
          mode === "register"
            ? values.confirmPassword
              ? values.password === values.confirmPassword
                ? ""
                : "Passwords do not match"
              : "Confirm your password"
            : "",
        form: "",
      };

      if (
        mode === "register" &&
        !nextErrors.name &&
        !nextErrors.email &&
        !nextErrors.password &&
        !values.confirmPassword.trim()
      ) {
        nextErrors.confirmPassword = "Confirm your password";
      }

      setErrors(nextErrors);
      return !Object.values(nextErrors).some(Boolean);
    },
    [mode],
  );

  const clearFieldError = useCallback((field: keyof AuthErrors) => {
    setErrors((current) => ({ ...current, [field]: "" }));
  }, []);

  const setFormError = useCallback((message: string) => {
    setErrors((current) => ({ ...current, form: message }));
  }, []);

  const clearFormError = useCallback(() => {
    setErrors((current) => ({ ...current, form: "" }));
  }, []);

  const clearAllErrors = useCallback(() => setErrors(emptyErrors), []);

  return {
    errors,
    validate,
    clearFieldError,
    setFormError,
    clearFormError,
    clearAllErrors,
  };
}

export type { AuthErrors, AuthValues };
