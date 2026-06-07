"use client";

import { RefreshCw, Search } from "lucide-react";

import { Modal } from "@/shared/components/Modal";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { useTodoUiStore } from "@/shared/store/useTodoUiStore";
import { useDebouncedValue } from "@/shared/utils/useDebouncedValue";
import { useLogoutMutation } from "@/features/auth/hooks/useAuth";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from "../hooks/useTodos";
import { getTodoCounts } from "../utils/filterTodos";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import styles from "../styles/TodoApp.module.css";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
] as const;

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Title A-Z", value: "title_asc" },
  { label: "Title Z-A", value: "title_desc" },
  { label: "Completed first", value: "completed_first" },
  { label: "Pending first", value: "pending_first" },
] as const;

export function TodoApp() {
  const { filter, search, sort, modal, selectedTodo, closeModal, openModal, setFilter, setSearch, setSort } =
    useTodoUiStore();
  const debouncedSearch = useDebouncedValue(search, 350);
  const user = useAuthSessionStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const createTodo = useCreateTodoMutation();
  const updateTodo = useUpdateTodoMutation();
  const deleteTodo = useDeleteTodoMutation();
  const listQuery = useTodosQuery({
    search: debouncedSearch,
    status: filter,
    sort,
  });
  const statsQuery = useTodosQuery({
    status: "all",
    sort: "newest",
  });
  const todos = listQuery.data ?? [];
  const counts = getTodoCounts(statsQuery.data ?? []);
  const isLoading = listQuery.isLoading;
  const isError = listQuery.isError;
  const refetch = listQuery.refetch;
  const isFetching = listQuery.isFetching;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>Todo Studio</span>
            <h1>Plan, finish, repeat.</h1>
            <p>Fast todo management wired to your Express API.</p>
          </div>
          <div className={styles.headerActions}>
            {user ? <div className={styles.userChip}>{user.name}</div> : null}
            <button
              aria-label="Refresh todos"
              className={styles.refreshButton}
              disabled={isFetching}
              type="button"
              onClick={() => refetch()}
            >
              <RefreshCw aria-hidden="true" size="1.125rem" />
            </button>
            <button
              className={styles.logoutButton}
              disabled={logoutMutation.isPending}
              type="button"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </button>
          </div>
        </header>

        <section className={styles.stats} aria-label="Todo counts">
          <div>
            <span>{counts.total}</span>
            <p>Total</p>
          </div>
          <div>
            <span>{counts.active}</span>
            <p>Active</p>
          </div>
          <div>
            <span>{counts.completed}</span>
            <p>Completed</p>
          </div>
          <div>
            <span>{counts.overdue}</span>
            <p>Overdue</p>
          </div>
        </section>

        <section className={styles.panel}>
          <TodoForm
            isSubmitting={createTodo.isPending}
            onSubmit={(input) => createTodo.mutate(input)}
          />

          <div className={styles.toolbar}>
            <div className={styles.search}>
              <Search aria-hidden="true" size="1rem" />
              <input
                aria-label="Search todos"
                placeholder="Search todos"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className={styles.toolbarControls}>
              <label className={styles.sortLabel} htmlFor="todo-sort">
                <span>Sort</span>
                <select
                  className={styles.sortSelect}
                  id="todo-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as typeof sort)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.segmented} aria-label="Filter todos">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    aria-pressed={filter === option.value}
                    className={
                      filter === option.value
                        ? styles.segmentActive
                        : styles.segment
                    }
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.state}>Loading todos...</div>
          ) : null}

          {isError ? (
            <div className={styles.state}>
              Could not load todos. Check backend port 5000.
            </div>
          ) : null}

          {!isLoading && !isError && todos.length === 0 ? (
            <div className={styles.state}>No todos match this view.</div>
          ) : null}

          {!isLoading && !isError && todos.length > 0 ? (
            <ul className={styles.list}>
              {todos.map((todo) => (
                <TodoItem
                  isUpdating={updateTodo.isPending}
                  key={todo.id}
                  todo={todo}
                  onDelete={(item) => openModal("delete", item)}
                  onEdit={(item) => openModal("edit", item)}
                  onToggle={(item) =>
                    updateTodo.mutate({
                      id: item.id,
                      input: { completed: !item.completed },
                    })
                  }
                />
              ))}
            </ul>
          ) : null}
        </section>
      </section>

      <Modal
        description="Update the title and keep your list tidy."
        isOpen={modal === "edit" && Boolean(selectedTodo)}
        title="Edit todo"
        onClose={closeModal}
      >
        {selectedTodo ? (
          <div className={styles.modalBody}>
            <TodoForm
              initialTodo={selectedTodo}
              isSubmitting={updateTodo.isPending}
              mode="edit"
              submitLabel="Save changes"
              onSubmit={(input) =>
                updateTodo.mutate(
                  {
                    id: selectedTodo.id,
                    input,
                  },
                  {
                    onSuccess: closeModal,
                  },
                )
              }
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        description="This action removes the todo from the backend list."
        isOpen={modal === "delete" && Boolean(selectedTodo)}
        title="Delete todo"
        onClose={closeModal}
      >
        {selectedTodo ? (
          <div className={styles.modalBody}>
            <p className={styles.confirmText}>{selectedTodo.title}</p>
            <div className={styles.confirmActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={styles.deleteButton}
                disabled={deleteTodo.isPending}
                type="button"
                onClick={() =>
                  deleteTodo.mutate(selectedTodo, {
                    onSuccess: closeModal,
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
}
