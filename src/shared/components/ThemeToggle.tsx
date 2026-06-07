"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./ThemeToggle.module.css";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "task-vault-theme";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  };

  return (
    <button
      className={styles.button}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" size="1rem" />
      ) : (
        <Moon aria-hidden="true" size="1rem" />
      )}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
