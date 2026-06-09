"use client";

import { Skeleton } from "./Skeleton";
import styles from "./PageSkeleton.module.css";

interface PageSkeletonProps {
  ariaLabel?: string;
}

export function PageSkeleton({
  ariaLabel = "Loading page",
}: PageSkeletonProps) {
  return (
    <main className={styles.page} aria-busy="true" aria-label={ariaLabel}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <Skeleton className={styles.kicker} variant="text" />
            <Skeleton className={styles.title} variant="text" />
            <Skeleton className={styles.subtitle} variant="text" />
          </div>
          <div className={styles.actions}>
            <Skeleton className={styles.actionPill} variant="block" />
            <Skeleton className={styles.actionIcon} variant="block" />
            <Skeleton className={styles.actionPillSmall} variant="block" />
          </div>
        </header>

        <section className={styles.stats}>
          {Array.from({ length: 4 }).map((_, index) => (
            <article className={styles.stat} key={index}>
              <Skeleton className={styles.statNumber} variant="text" />
              <Skeleton className={styles.statLabel} variant="text" />
            </article>
          ))}
        </section>

        <section className={styles.panel}>
          <Skeleton className={styles.panelControl} variant="block" />
          <div className={styles.toolbar}>
            <Skeleton className={styles.search} variant="block" />
            <Skeleton className={styles.filter} variant="block" />
            <Skeleton className={styles.filter} variant="block" />
          </div>
          <div className={styles.table}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div className={styles.row} key={index}>
                <Skeleton className={styles.rowTitle} variant="text" />
                <Skeleton className={styles.rowBadge} variant="block" />
                <Skeleton className={styles.rowBadge} variant="block" />
                <Skeleton className={styles.rowActions} variant="block" />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
