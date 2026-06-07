"use client";

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
                <span className={styles.skeletonTitle} />
              </td>
              <td className={styles.skeletonCell}>
                <span className={styles.skeletonBadge} />
              </td>
              <td className={styles.skeletonCell}>
                <span className={styles.skeletonBadge} />
              </td>
              <td className={styles.skeletonCell}>
                <span className={styles.skeletonTags} />
              </td>
              <td className={styles.skeletonCell}>
                <span className={styles.skeletonBadge} />
              </td>
              <td className={styles.skeletonActionsCell}>
                <span className={styles.skeletonIcon} />
                <span className={styles.skeletonIcon} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
