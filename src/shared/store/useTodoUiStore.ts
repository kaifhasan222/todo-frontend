import { create } from "zustand";

import type { Todo } from "@/features/todos/types/todo";

export type TodoFilter = "all" | "active" | "completed";
export type TodoSort =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "completed_first"
  | "pending_first";
export type TodoModal = "edit" | "delete" | null;

interface TodoUiState {
  filter: TodoFilter;
  sort: TodoSort;
  search: string;
  modal: TodoModal;
  selectedTodo: Todo | null;
  setFilter: (filter: TodoFilter) => void;
  setSort: (sort: TodoSort) => void;
  setSearch: (search: string) => void;
  openModal: (modal: Exclude<TodoModal, null>, todo: Todo) => void;
  closeModal: () => void;
}

export const useTodoUiStore = create<TodoUiState>((set) => ({
  filter: "all",
  sort: "newest",
  search: "",
  modal: null,
  selectedTodo: null,
  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  setSearch: (search) => set({ search }),
  openModal: (modal, todo) => set({ modal, selectedTodo: todo }),
  closeModal: () => set({ modal: null, selectedTodo: null }),
}));
