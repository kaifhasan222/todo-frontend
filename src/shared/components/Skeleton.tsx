"use client";

import styles from "./Skeleton.module.css";

interface SkeletonProps {
  variant?: "text" | "block" | "circle";
  className?: string;
  ariaLabel?: string;
}

export function Skeleton({
  variant = "block",
  className = "",
  ariaLabel,
}: SkeletonProps) {
  return (
    <span
      aria-busy="true"
      aria-label={ariaLabel}
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      role={ariaLabel ? "status" : "presentation"}
    />
  );
}
