export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "all" | "active" | "completed";
export type TodoSort =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "completed_first"
  | "pending_first";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
  due_date: string | null;
  priority: TodoPriority;
  created_at: string;
}

export interface CreateTodoInput {
  title: string;
  due_date?: string | null;
  priority?: TodoPriority;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  due_date?: string | null;
  priority?: TodoPriority;
}

export interface TodoQueryParams {
  search?: string;
  status?: TodoStatus;
  sort?: TodoSort;
}
