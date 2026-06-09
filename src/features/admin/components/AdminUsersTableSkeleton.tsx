"use client";

import { Skeleton } from "@/shared/components/Skeleton";
import styles from "../styles/AdminDashboard.module.css";

interface AdminUsersTableSkeletonProps {
  rowCount?: number;
}

export function AdminUsersTableSkeleton({
  rowCount = 5,
}: AdminUsersTableSkeletonProps) {
  return (
    <div className={styles.tableWrap} aria-busy="true" aria-live="polite">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <tr className={styles.skeletonRow} key={index}>
              <td>
                <div className={styles.skeletonIdentity}>
                  <Skeleton className={styles.skeletonName} variant="text" />
                  <Skeleton className={styles.skeletonEmail} variant="text" />
                </div>
              </td>
              <td>
                <Skeleton className={styles.skeletonRole} variant="block" />
              </td>
              <td>
                <Skeleton className={styles.skeletonDate} variant="text" />
              </td>
              <td>
                <div className={styles.actions}>
                  <Skeleton className={styles.skeletonSelect} variant="block" />
                  <Skeleton className={styles.skeletonAction} variant="block" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
