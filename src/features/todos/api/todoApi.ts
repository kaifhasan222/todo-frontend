import { requestJson } from "@/shared/utils/requestJson";
import type {
  CreateTodoInput,
  TodoQueryParams,
  Todo,
  UpdateTodoInput,
} from "../types/todo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const TODOS_ENDPOINT = `${API_BASE_URL}/api/todos`;

const buildTodosUrl = (params?: TodoQueryParams): string => {
  if (!params) {
    return TODOS_ENDPOINT;
  }

  const searchParams = new URLSearchParams();

  if (typeof params.search === "string" && params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params.sort && params.sort !== "newest") {
    searchParams.set("sort", params.sort);
  }

  const queryString = searchParams.toString();

  return queryString ? `${TODOS_ENDPOINT}?${queryString}` : TODOS_ENDPOINT;
};

export const todoApi = {
  getTodos: async (params?: TodoQueryParams): Promise<Todo[]> => {
    return requestJson<Todo[]>(buildTodosUrl(params), {
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
