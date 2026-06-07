import { useCallback, useState } from "react";

import type { TodoPriority } from "../types/todo";

interface TodoValidationState {
  title: string;
  dueDate: string;
  priority: string;
}

const VALID_PRIORITIES: TodoPriority[] = ["low", "medium", "high"];

const validateTitle = (title: string): string => {
  const value = title.trim();

  if (!value) {
    return "Todo title is required.";
  }

  if (value.length < 3) {
    return "Use at least three characters.";
  }

  if (value.length > 80) {
    return "Keep the title under eighty characters.";
  }

  return "";
};

const validateDueDate = (dueDate: string): string => {
  if (!dueDate) {
    return "";
  }

  const parsed = new Date(dueDate);

  if (Number.isNaN(parsed.getTime())) {
    return "Enter a valid due date.";
  }

  return "";
};

const validatePriority = (priority: string): string => {
  if (!VALID_PRIORITIES.includes(priority as TodoPriority)) {
    return "Select a valid priority.";
  }

  return "";
};

export function useTodoValidation() {
  const [errors, setErrors] = useState<TodoValidationState>({
    title: "",
    dueDate: "",
    priority: "",
  });

  const validate = useCallback(
    (input: { title: string; dueDate: string; priority: string }): boolean => {
      const titleError = validateTitle(input.title);
      const dueDateError = validateDueDate(input.dueDate);
      const priorityError = validatePriority(input.priority);

      setErrors({
        title: titleError,
        dueDate: dueDateError,
        priority: priorityError,
      });

      return !titleError && !dueDateError && !priorityError;
    },
    [],
  );

  const clearErrors = useCallback(
    () =>
      setErrors({
        title: "",
        dueDate: "",
        priority: "",
      }),
    [],
  );

  return {
    errors,
    validate,
    clearErrors,
  };
}
