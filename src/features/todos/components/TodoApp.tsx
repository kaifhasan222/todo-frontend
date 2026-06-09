"use client";

import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Modal } from "@/shared/components/Modal";
import { Skeleton } from "@/shared/components/Skeleton";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { useTodoUiStore } from "@/shared/store/useTodoUiStore";
import { useDebouncedValue } from "@/shared/utils/useDebouncedValue";
import { useLogoutMutation } from "@/features/auth/hooks/useAuth";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  usePermanentlyDeleteTodoMutation,
  useRestoreTodoMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from "../hooks/useTodos";
import { TodoForm } from "./TodoForm";
import { TodoPagination } from "./TodoPagination";
import { TodoTable } from "./TodoTable";
import { TodoTableSkeleton } from "./TodoTableSkeleton";
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
  { label: "Due date", value: "due_date" },
  { label: "Priority", value: "priority" },
] as const;

const PRIORITY_OPTIONS = [
  { label: "All priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
] as const;

const VIEW_OPTIONS = [
  { label: "Todos", value: "active" },
  { label: "Trash", value: "trash" },
] as const;

const TODO_PAGE_SIZE = 8;

const EMPTY_SUMMARY = {
  total: 0,
  active: 0,
  completed: 0,
  overdue: 0,
  completionRate: 0,
};

export function TodoApp() {
  const {
    filter,
    search,
    sort,
    priorityFilter,
    tagFilter,
    view,
    modal,
    selectedTodo,
    closeModal,
    openModal,
    setFilter,
    setSearch,
    setSort,
    setPriorityFilter,
    setTagFilter,
    setView,
  } =
    useTodoUiStore();
  const [page, setPage] = useState(1);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 350);
  const debouncedTag = useDebouncedValue(tagFilter, 350);
  const user = useAuthSessionStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const createTodo = useCreateTodoMutation();
  const updateTodo = useUpdateTodoMutation();
  const deleteTodo = useDeleteTodoMutation();
  const restoreTodo = useRestoreTodoMutation();
  const permanentlyDeleteTodo = usePermanentlyDeleteTodoMutation();
  const listQuery = useTodosQuery({
    search: debouncedSearch,
    status: filter,
    sort,
    priority: priorityFilter,
    tag: debouncedTag,
    view,
    page,
    limit: TODO_PAGE_SIZE,
  });
  const todoResponse = listQuery.data;
  const todos = todoResponse?.items ?? [];
  const counts = todoResponse?.summary ?? EMPTY_SUMMARY;
  const pagination = todoResponse?.pagination;
  const isLoading = listQuery.isLoading;
  const isError = listQuery.isError;
  const refetch = listQuery.refetch;
  const isFetching = listQuery.isFetching;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedTag, filter, priorityFilter, sort, view]);

  useEffect(() => {
    const totalPages = pagination?.totalPages ?? 0;

    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }

    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pagination?.totalPages]);

  const pageStart = pagination && pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const pageEnd =
    pagination && pagination.total > 0
      ? Math.min(pagination.page * pagination.limit, pagination.total)
      : 0;

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
            <ThemeToggle />
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
              onClick={() => setIsLogoutModalOpen(true)}
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
          <div className={styles.viewBar}>
            <div className={styles.segmented} aria-label="Todo view">
              {VIEW_OPTIONS.map((option) => (
                <button
                  aria-pressed={view === option.value}
                  className={
                    view === option.value ? styles.segmentActive : styles.segment
                  }
                  key={option.value}
                  type="button"
                  onClick={() => setView(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {view === "active" ? (
            <TodoForm
              isSubmitting={createTodo.isPending}
              onSubmit={(input) =>
                createTodo.mutate(input, {
                  onSuccess: () => setPage(1),
                })
              }
            />
          ) : null}

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
              <label className={styles.sortLabel} htmlFor="todo-priority-filter">
                <span>Priority</span>
                <select
                  className={styles.sortSelect}
                  id="todo-priority-filter"
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value as typeof priorityFilter)
                  }
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.tagFilter} htmlFor="todo-tag-filter">
                <span>Tag</span>
                <input
                  id="todo-tag-filter"
                  placeholder="urgent"
                  value={tagFilter}
                  onChange={(event) => setTagFilter(event.target.value)}
                />
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

          {isFetching && !isLoading ? (
            <div
              aria-label="Refreshing todos"
              className={styles.refetchStrip}
              role="status"
            >
              <Skeleton className={styles.refetchLine} variant="block" />
            </div>
          ) : null}

          {isLoading ? <TodoTableSkeleton rowCount={TODO_PAGE_SIZE} /> : null}

          {isError ? (
            <div className={styles.state}>
              Could not load todos. Check backend port 5000.
            </div>
          ) : null}

          {!isLoading && !isError && todos.length === 0 ? (
            <div className={styles.state}>
              {view === "trash" ? "Trash is empty." : "No todos match this view."}
            </div>
          ) : null}

          {!isLoading && !isError && todos.length > 0 ? (
            <TodoTable
              isActionPending={
                updateTodo.isPending ||
                deleteTodo.isPending ||
                restoreTodo.isPending ||
                permanentlyDeleteTodo.isPending
              }
              todos={todos}
              view={view}
              onDelete={(item) => openModal("delete", item)}
              onEdit={(item) => openModal("edit", item)}
              onPermanentDelete={(item) => openModal("permanentDelete", item)}
              onRestore={(item) => restoreTodo.mutate(item)}
              onToggle={(item) =>
                updateTodo.mutate({
                  id: item.id,
                  input: { completed: !item.completed },
                })
              }
            />
          ) : null}

          {!isLoading && !isError && pagination && pagination.total > 0 ? (
            <TodoPagination
              currentEnd={pageEnd}
              currentStart={pageStart}
              isFetching={isFetching}
              onNext={() => setPage((currentPage) => currentPage + 1)}
              onPrevious={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              pagination={pagination}
            />
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
        description="This action moves the todo to trash."
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

      <Modal
        description="Your current session will be closed."
        isOpen={isLogoutModalOpen}
        title="Logout"
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <div className={styles.modalBody}>
          <p className={styles.confirmText}>Are you sure you want to logout?</p>
          <div className={styles.confirmActions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className={styles.deleteButton}
              disabled={logoutMutation.isPending}
              type="button"
              onClick={() =>
                logoutMutation.mutate(undefined, {
                  onSuccess: () => setIsLogoutModalOpen(false),
                })
              }
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        description="This action permanently removes the todo."
        isOpen={modal === "permanentDelete" && Boolean(selectedTodo)}
        title="Delete forever"
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
                disabled={permanentlyDeleteTodo.isPending}
                type="button"
                onClick={() =>
                  permanentlyDeleteTodo.mutate(selectedTodo, {
                    onSuccess: closeModal,
                  })
                }
              >
                Delete forever
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
}
