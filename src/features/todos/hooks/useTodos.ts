import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { todoApi } from "../api/todoApi";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "../types/todo";

const TODO_QUERY_KEY = ["todos"] as const;

export function useTodosQuery() {
  return useQuery({
    queryKey: TODO_QUERY_KEY,
    queryFn: todoApi.getTodos,
  });
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
      toast.success("Todo added");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTodoInput }) =>
      todoApi.updateTodo(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
      toast.success("Todo updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: Todo) => todoApi.deleteTodo(todo.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
      toast.success("Todo deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
