"use client";

import styles from "../styles/TodoPagination.module.css";
import type { TodoPagination as TodoPaginationType } from "../types/todo";

interface TodoPaginationProps {
  pagination: TodoPaginationType;
  currentStart: number;
  currentEnd: number;
  isFetching?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function TodoPagination({
  pagination,
  currentStart,
  currentEnd,
  isFetching = false,
  onNext,
  onPrevious,
}: TodoPaginationProps) {
  const hasPrevious = pagination.page > 1;
  const hasNext = pagination.page < pagination.totalPages;

  return (
    <footer className={styles.pagination} aria-label="Todo pagination">
      <div className={styles.summary}>
        <span>
          Showing {currentStart}-{currentEnd} of {pagination.total}
        </span>
        <span>
          Page {pagination.page} of {pagination.totalPages || 1}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.button}
          disabled={!hasPrevious || isFetching}
          type="button"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          className={styles.button}
          disabled={!hasNext || isFetching}
          type="button"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </footer>
  );
}
