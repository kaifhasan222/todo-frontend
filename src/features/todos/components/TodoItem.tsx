"use client";

import { Check, Pencil, Trash2 } from "lucide-react";

import type { Todo } from "../types/todo";
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
        <span className={todo.completed ? styles.doneBadge : styles.badge}>
          {todo.completed ? "Completed" : "Active"}
        </span>
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
