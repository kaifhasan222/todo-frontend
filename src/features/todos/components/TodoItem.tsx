"use client";

import { Check, Pencil, Trash2 } from "lucide-react";

import { formatDueDate, isOverdue } from "../utils/filterTodos";
import type { Todo, TodoPriority } from "../types/todo";
import styles from "../styles/TodoItem.module.css";

interface TodoItemProps {
  todo: Todo;
  isUpdating?: boolean;
  onDelete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
}

export function TodoItem({
  todo,
  isUpdating = false,
  onDelete,
  onEdit,
  onToggle,
}: TodoItemProps) {
  const overdue = isOverdue(todo);
  const priorityClass: Record<TodoPriority, string> = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
  };

  return (
    <li className={styles.item}>
      <button
        aria-label={todo.completed ? "Mark todo active" : "Mark todo complete"}
        className={todo.completed ? styles.checkDone : styles.check}
        disabled={isUpdating}
        type="button"
        onClick={() => onToggle(todo)}
      >
        {todo.completed ? <Check aria-hidden="true" size="1rem" /> : null}
      </button>

      <div className={styles.content}>
        <p className={todo.completed ? styles.doneTitle : styles.title}>
          {todo.title}
        </p>
        <div className={styles.meta}>
          <span className={`${styles.priorityBadge} ${priorityClass[todo.priority]}`}>
            {todo.priority}
          </span>
          {todo.due_date ? (
            <span className={overdue ? styles.overdueBadge : styles.dueBadge}>
              {overdue ? "Overdue" : `Due ${formatDueDate(todo.due_date)}`}
            </span>
          ) : null}
          <span className={todo.completed ? styles.doneBadge : styles.badge}>
            {todo.completed ? "Completed" : "Active"}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          aria-label="Edit todo"
          className={styles.actionButton}
          type="button"
          onClick={() => onEdit(todo)}
        >
          <Pencil aria-hidden="true" size="1rem" />
        </button>
        <button
          aria-label="Delete todo"
          className={styles.dangerButton}
          type="button"
          onClick={() => onDelete(todo)}
        >
          <Trash2 aria-hidden="true" size="1rem" />
        </button>
      </div>
    </li>
  );
}
