"use client";

import { Skeleton } from "@/shared/components/Skeleton";
import styles from "../styles/TodoTable.module.css";

interface TodoTableSkeletonProps {
  rowCount?: number;
}

export function TodoTableSkeleton({ rowCount = 8 }: TodoTableSkeletonProps) {
  return (
    <div className={styles.wrap} aria-busy="true" aria-live="polite">
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
          {Array.from({ length: rowCount }).map((_, index) => (
            <tr className={styles.skeletonRow} key={index}>
              <td className={styles.skeletonTitleCell}>
                <Skeleton className={styles.skeletonTitle} variant="text" />
              </td>
              <td className={styles.skeletonCell}>
                <Skeleton className={styles.skeletonBadge} variant="block" />
              </td>
              <td className={styles.skeletonCell}>
                <Skeleton className={styles.skeletonBadge} variant="block" />
              </td>
              <td className={styles.skeletonCell}>
                <Skeleton className={styles.skeletonTags} variant="block" />
              </td>
              <td className={styles.skeletonCell}>
                <Skeleton className={styles.skeletonBadge} variant="block" />
              </td>
              <td className={styles.skeletonActionsCell}>
                <Skeleton className={styles.skeletonIcon} variant="block" />
                <Skeleton className={styles.skeletonIcon} variant="block" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
