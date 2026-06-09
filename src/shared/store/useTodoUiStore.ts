import { create } from "zustand";

import type { Todo, TodoPriority, TodoView } from "@/features/todos/types/todo";

export type TodoFilter = "all" | "active" | "completed";
export type TodoSort =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "completed_first"
  | "pending_first"
  | "due_date"
  | "priority";
export type TodoModal = "edit" | "delete" | "permanentDelete" | null;
export type TodoPriorityFilter = TodoPriority | "all";

interface TodoUiState {
  filter: TodoFilter;
  sort: TodoSort;
  priorityFilter: TodoPriorityFilter;
  tagFilter: string;
  search: string;
  view: TodoView;
  modal: TodoModal;
  selectedTodo: Todo | null;
  setFilter: (filter: TodoFilter) => void;
  setSort: (sort: TodoSort) => void;
  setPriorityFilter: (priorityFilter: TodoPriorityFilter) => void;
  setTagFilter: (tagFilter: string) => void;
  setSearch: (search: string) => void;
  setView: (view: TodoView) => void;
  openModal: (modal: Exclude<TodoModal, null>, todo: Todo) => void;
  closeModal: () => void;
}

export const useTodoUiStore = create<TodoUiState>((set) => ({
  filter: "all",
  sort: "newest",
  priorityFilter: "all",
  tagFilter: "",
  search: "",
  view: "active",
  modal: null,
  selectedTodo: null,
  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  setTagFilter: (tagFilter) => set({ tagFilter }),
  setSearch: (search) => set({ search }),
  setView: (view) => set({ view }),
  openModal: (modal, todo) => set({ modal, selectedTodo: todo }),
  closeModal: () => set({ modal: null, selectedTodo: null }),
}));
