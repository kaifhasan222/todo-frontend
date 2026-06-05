import { useCallback, useState } from "react";

interface TodoValidationState {
  title: string;
}

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

export function useTodoValidation() {
  const [errors, setErrors] = useState<TodoValidationState>({ title: "" });

  const validate = useCallback((title: string): boolean => {
    const titleError = validateTitle(title);
    setErrors({ title: titleError });
    return !titleError;
  }, []);

  const clearErrors = useCallback(() => setErrors({ title: "" }), []);

  return {
    errors,
    validate,
    clearErrors,
  };
}
