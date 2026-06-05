"use client";

import { Plus, Save } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { useTodoValidation } from "../hooks/useTodoValidation";
import styles from "../styles/TodoForm.module.css";

interface TodoFormProps {
  submitLabel?: string;
  initialTitle?: string;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onSubmit: (title: string) => void;
}

export function TodoForm({
  submitLabel = "Add todo",
  initialTitle = "",
  isSubmitting = false,
  mode = "create",
  onSubmit,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const { errors, validate, clearErrors } = useTodoValidation();
  const buttonIcon =
    mode === "create" ? (
      <Plus aria-hidden="true" size="1rem" />
    ) : (
      <Save aria-hidden="true" size="1rem" />
    );

  useEffect(() => {
    setTitle(initialTitle);
    clearErrors();
  }, [clearErrors, initialTitle]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate(title)) {
      return;
    }

    onSubmit(title.trim());

    if (mode === "create") {
      setTitle("");
      clearErrors();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={`${mode}-todo-title`}>
        Todo title
      </label>
      <div className={styles.row}>
        <input
          aria-describedby={errors.title ? `${mode}-todo-error` : undefined}
          aria-invalid={Boolean(errors.title)}
          className={styles.input}
          disabled={isSubmitting}
          id={`${mode}-todo-title`}
          placeholder="Write your next task"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              clearErrors();
            }
          }}
        />
        <button className={styles.button} disabled={isSubmitting} type="submit">
          {buttonIcon}
          <span>{isSubmitting ? "Saving" : submitLabel}</span>
        </button>
      </div>
      {errors.title ? (
        <p className={styles.error} id={`${mode}-todo-error`}>
          {errors.title}
        </p>
      ) : null}
    </form>
  );
}
