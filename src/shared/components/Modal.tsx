"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({
  title,
  description,
  isOpen,
  children,
  onClose,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button
            aria-label="Close modal"
            className={styles.iconButton}
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" size="1.125rem" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
