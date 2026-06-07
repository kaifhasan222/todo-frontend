import type { TodoFilter } from "@/shared/store/useTodoUiStore";
import type { Todo } from "../types/todo";

const isOverdue = (todo: Todo): boolean => {
  if (todo.completed || !todo.due_date) {
    return false;
  }

  const dueDate = new Date(todo.due_date);
  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const endOfDueDay = new Date(dueDate);
  endOfDueDay.setHours(23, 59, 59, 999);

  return endOfDueDay.getTime() < Date.now();
};

export const getTodoCounts = (todos: Todo[]) => {
  const completed = todos.filter((todo) => todo.completed).length;
  const overdue = todos.filter((todo) => isOverdue(todo)).length;

  return {
    total: todos.length,
    active: todos.length - completed,
    completed,
    overdue,
    completionRate:
      todos.length === 0 ? 0 : Math.round((completed / todos.length) * 100),
  };
};

export const formatDueDate = (dueDate: string | null): string => {
  if (!dueDate) {
    return "";
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export { isOverdue };
