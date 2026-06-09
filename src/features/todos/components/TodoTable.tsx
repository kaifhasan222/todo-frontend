"use client";

import { Check, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { formatDueDate, isOverdue } from "../utils/filterTodos";
import type { Todo, TodoPriority } from "../types/todo";
import styles from "../styles/TodoTable.module.css";

interface TodoTableProps {
  todos: Todo[];
  isActionPending?: boolean;
  view?: "active" | "trash";
  onDelete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onPermanentDelete?: (todo: Todo) => void;
  onRestore?: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
}

export function TodoTable({
  todos,
  isActionPending = false,
  view = "active",
  onDelete,
  onEdit,
  onPermanentDelete,
  onRestore,
  onToggle,
}: TodoTableProps) {
  const priorityClass: Record<TodoPriority, string> = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
  };

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headCell} scope="col">
              Title
            </th>
            <th className={styles.headCell} scope="col">
              Status
            </th>
            <th className={styles.headCell} scope="col">
              Priority
            </th>
            <th className={styles.headCell} scope="col">
              Tags
            </th>
            <th className={styles.headCell} scope="col">
              Due date
            </th>
            <th className={styles.headCell} scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => {
            const overdue = isOverdue(todo);

            return (
              <tr className={styles.row} key={todo.id}>
                <td className={styles.titleCell}>
                  <p className={todo.completed ? styles.doneTitle : styles.title}>
                    {todo.title}
                  </p>
                </td>
                <td className={styles.statusCell}>
                  <button
                    aria-label={
                      todo.completed
                        ? "Mark todo active"
                        : "Mark todo complete"
                    }
                    className={
                      todo.completed
                        ? styles.statusDone
                        : styles.statusActive
                    }
                    disabled={isActionPending || view === "trash"}
                    type="button"
                    onClick={() => onToggle(todo)}
                  >
                    {todo.completed ? (
                      <Check aria-hidden="true" size="0.875rem" />
                    ) : null}
                    <span>{todo.completed ? "Completed" : "Active"}</span>
                  </button>
                </td>
                <td className={styles.priorityCell}>
                  <span
                    className={`${styles.priorityBadge} ${
                      priorityClass[todo.priority]
                    }`}
                  >
                    {todo.priority}
                  </span>
                </td>
                <td className={styles.tagsCell}>
                  {todo.tags.length > 0 ? (
                    <div className={styles.tagsList}>
                      {todo.tags.map((tag) => (
                        <span className={styles.tagChip} key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className={styles.emptyCell}>-</span>
                  )}
                </td>
                <td className={styles.dueCell}>
                  {todo.due_date ? (
                    <span
                      className={overdue ? styles.overdueBadge : styles.dueBadge}
                    >
                      {overdue
                        ? `Overdue ${formatDueDate(todo.due_date)}`
                        : formatDueDate(todo.due_date)}
                    </span>
                  ) : (
                    <span className={styles.emptyCell}>-</span>
                  )}
                </td>
                <td className={styles.actionsCell}>
                  {view === "trash" ? (
                    <>
                      <button
                        aria-label="Restore todo"
                        className={styles.iconButton}
                        disabled={isActionPending || !onRestore}
                        type="button"
                        onClick={() => onRestore?.(todo)}
                      >
                        <RotateCcw aria-hidden="true" size="0.95rem" />
                      </button>
                      <button
                        aria-label="Delete todo forever"
                        className={styles.dangerButton}
                        disabled={isActionPending || !onPermanentDelete}
                        type="button"
                        onClick={() => onPermanentDelete?.(todo)}
                      >
                        <Trash2 aria-hidden="true" size="0.95rem" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        aria-label="Edit todo"
                        className={styles.iconButton}
                        disabled={isActionPending}
                        type="button"
                        onClick={() => onEdit(todo)}
                      >
                        <Pencil aria-hidden="true" size="0.95rem" />
                      </button>
                      <button
                        aria-label="Delete todo"
                        className={styles.dangerButton}
                        disabled={isActionPending}
                        type="button"
                        onClick={() => onDelete(todo)}
                      >
                        <Trash2 aria-hidden="true" size="0.95rem" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
