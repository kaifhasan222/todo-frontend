import type { TodoFilter } from "@/shared/store/useTodoUiStore";
import type { Todo } from "../types/todo";

export const filterTodos = (
  todos: Todo[],
  filter: TodoFilter,
  search: string,
): Todo[] => {
  const searchValue = search.trim().toLowerCase();

  return todos.filter((todo) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);
    const matchesSearch = todo.title.toLowerCase().includes(searchValue);

    return matchesFilter && matchesSearch;
  });
};

export const getTodoCounts = (todos: Todo[]) => {
  const completed = todos.filter((todo) => todo.completed).length;

  return {
    total: todos.length,
    active: todos.length - completed,
    completed,
  };
};
