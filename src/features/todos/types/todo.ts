export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "all" | "active" | "completed";
export type TodoSort =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "completed_first"
  | "pending_first"
  | "due_date"
  | "priority";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
  due_date: string | null;
  priority: TodoPriority;
  tags: string[];
  created_at: string;
}

export interface TodoSummary {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

export interface TodoPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TodoListResponse {
  items: Todo[];
  pagination: TodoPagination;
  summary: TodoSummary;
}

export interface CreateTodoInput {
  title: string;
  due_date?: string | null;
  priority?: TodoPriority;
  tags?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  due_date?: string | null;
  priority?: TodoPriority;
  tags?: string[];
}

export interface TodoQueryParams {
  search?: string;
  status?: TodoStatus;
  sort?: TodoSort;
  priority?: TodoPriority | "all";
  tag?: string;
  page?: number;
  limit?: number;
}
