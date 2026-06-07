"use client";

import { Plus, Save } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { useTodoValidation } from "../hooks/useTodoValidation";
import type { CreateTodoInput, Todo, TodoPriority } from "../types/todo";
import styles from "../styles/TodoForm.module.css";

interface TodoFormProps {
  submitLabel?: string;
  initialTodo?: Pick<Todo, "title" | "due_date" | "priority" | "tags"> | null;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onSubmit: (input: CreateTodoInput) => void;
}

export function TodoForm({
  submitLabel = "Add todo",
  initialTodo = null,
  isSubmitting = false,
  mode = "create",
  onSubmit,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialTodo?.title ?? "");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>(
    initialTodo?.priority ?? "medium",
  );
  const [tagsText, setTagsText] = useState("");
  const { errors, validate, clearErrors } = useTodoValidation();
  const buttonIcon =
    mode === "create" ? (
      <Plus aria-hidden="true" size="1rem" />
    ) : (
      <Save aria-hidden="true" size="1rem" />
    );

  useEffect(() => {
    setTitle(initialTodo?.title ?? "");
    setDueDate(initialTodo?.due_date ? initialTodo.due_date.slice(0, 10) : "");
    setPriority(initialTodo?.priority ?? "medium");
    setTagsText(initialTodo?.tags?.join(", ") ?? "");
    clearErrors();
  }, [clearErrors, initialTodo]);

  const normalizeTags = (value: string): string[] =>
    Array.from(
      new Set(
        value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      ),
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate({ title, dueDate, priority })) {
      return;
    }

    onSubmit({
      title: title.trim(),
      due_date: dueDate ? dueDate : null,
      priority,
      tags: normalizeTags(tagsText),
    });

    if (mode === "create") {
      setTitle("");
      setDueDate("");
      setPriority("medium");
      setTagsText("");
      clearErrors();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${mode}-todo-title`}>
          Todo title
        </label>
        <div className={styles.row}>
          <input
            aria-describedby={errors.title ? `${mode}-todo-title-error` : undefined}
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
          <button
            className={styles.button}
            disabled={isSubmitting}
            type="submit"
          >
            {buttonIcon}
            <span>{isSubmitting ? "Saving" : submitLabel}</span>
          </button>
        </div>
        {errors.title ? (
          <p className={styles.error} id={`${mode}-todo-title-error`}>
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${mode}-todo-due-date`}>
            Due date
          </label>
          <input
            aria-describedby={
              errors.dueDate ? `${mode}-todo-due-date-error` : undefined
            }
            aria-invalid={Boolean(errors.dueDate)}
            className={styles.input}
            disabled={isSubmitting}
            id={`${mode}-todo-due-date`}
            type="date"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value);
              if (errors.dueDate) {
                clearErrors();
              }
            }}
          />
          {errors.dueDate ? (
            <p className={styles.error} id={`${mode}-todo-due-date-error`}>
              {errors.dueDate}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${mode}-todo-priority`}>
            Priority
          </label>
          <select
            aria-describedby={
              errors.priority ? `${mode}-todo-priority-error` : undefined
            }
            aria-invalid={Boolean(errors.priority)}
            className={styles.select}
            disabled={isSubmitting}
            id={`${mode}-todo-priority`}
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value as TodoPriority);
              if (errors.priority) {
                clearErrors();
              }
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority ? (
            <p className={styles.error} id={`${mode}-todo-priority-error`}>
              {errors.priority}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${mode}-todo-tags`}>
          Tags
        </label>
        <input
          className={styles.input}
          disabled={isSubmitting}
          id={`${mode}-todo-tags`}
          placeholder="work, personal, urgent"
          value={tagsText}
          onChange={(event) => setTagsText(event.target.value)}
        />
        <p className={styles.helpText}>Comma-separated tags</p>
      </div>
    </form>
  );
}
