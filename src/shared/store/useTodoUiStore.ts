import { create } from "zustand";

import type { Todo } from "@/features/todos/types/todo";

export type TodoFilter = "all" | "active" | "completed";
export type TodoModal = "edit" | "delete" | null;

interface TodoUiState {
  filter: TodoFilter;
  search: string;
  modal: TodoModal;
  selectedTodo: Todo | null;
  setFilter: (filter: TodoFilter) => void;
  setSearch: (search: string) => void;
  openModal: (modal: Exclude<TodoModal, null>, todo: Todo) => void;
  closeModal: () => void;
}

export const useTodoUiStore = create<TodoUiState>((set) => ({
  filter: "all",
  search: "",
  modal: null,
  selectedTodo: null,
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  openModal: (modal, todo) => set({ modal, selectedTodo: todo }),
  closeModal: () => set({ modal: null, selectedTodo: null }),
}));
