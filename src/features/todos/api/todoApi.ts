import { requestJson } from "@/shared/utils/requestJson";
import type {
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from "../types/todo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const TODOS_ENDPOINT = `${API_BASE_URL}/api/todos`;

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    return requestJson<Todo[]>(TODOS_ENDPOINT, {
      method: "GET",
      cache: "no-store",
    });
  },

  createTodo: async (input: CreateTodoInput): Promise<Todo> => {
    return requestJson<Todo>(TODOS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  },

  updateTodo: async (id: number, input: UpdateTodoInput): Promise<Todo> => {
    return requestJson<Todo>(`${TODOS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  },

  deleteTodo: async (id: number): Promise<{ message: string }> => {
    return requestJson<{ message: string }>(`${TODOS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  },
};
