"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useLogoutMutation } from "@/features/auth/hooks/useAuth";
import { Modal } from "@/shared/components/Modal";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";
import { ApiRequestError } from "@/shared/utils/requestJson";
import {
  useAdminUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../hooks/useAdmin";
import type { AdminUser, UserRole } from "../types/admin";
import styles from "../styles/AdminDashboard.module.css";

const formatJoinedDate = (value: string | null): string => {
  if (!value) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
};

export function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const sessionUser = useAuthSessionStore((state) => state.user);
  const setUnauthenticated = useAuthSessionStore(
    (state) => state.setUnauthenticated,
  );
  const logoutMutation = useLogoutMutation();
  const usersQuery = useAdminUsersQuery();
  const updateRoleMutation = useUpdateUserRoleMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const users = usersQuery.data?.users ?? [];
  const counts = useMemo(() => {
    const total = users.length;
    const admins = users.filter((user) => user.role === "ADMIN").length;

    return {
      total,
      admins,
      members: total - admins,
    };
  }, [users]);

  const isDeletingSelectedUser =
    deleteUserMutation.isPending &&
    selectedUser !== null &&
    deleteUserMutation.variables === selectedUser.id;

  useEffect(() => {
    if (!(usersQuery.error instanceof ApiRequestError)) {
      return;
    }

    if (usersQuery.error.status !== 403) {
      return;
    }

    setUnauthenticated();
    toast.error("Your admin access is no longer available. Please sign in again.");
    router.replace("/");
  }, [router, setUnauthenticated, usersQuery.error]);

  const handleRoleChange = (userId: number, nextRole: UserRole) => {
    updateRoleMutation.mutate({ id: userId, role: nextRole });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) {
      return;
    }

    deleteUserMutation.mutate(selectedUser.id, {
      onSuccess: () => setSelectedUser(null),
    });
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>Admin Console</span>
            <h1>Manage account access with confidence.</h1>
            <p>
              Review every signed-up user, promote trusted teammates, and keep
              the final admin account protected.
            </p>
          </div>

          <div className={styles.headerActions}>
            {sessionUser ? (
              <div className={styles.userChip}>
                <Shield size="0.95rem" aria-hidden="true" />
                {sessionUser.name}
              </div>
            ) : null}
            <Link className={styles.linkButton} href="/">
              Open Todo App
            </Link>
            <ThemeToggle />
            <button
              className={styles.logoutButton}
              disabled={logoutMutation.isPending}
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              Logout
            </button>
          </div>
        </header>

        <section className={styles.stats} aria-label="User counts">
          <article>
            <Users size="1.1rem" aria-hidden="true" />
            <strong>{counts.total}</strong>
            <span>Total users</span>
          </article>
          <article>
            <Shield size="1.1rem" aria-hidden="true" />
            <strong>{counts.admins}</strong>
            <span>Admins</span>
          </article>
          <article>
            <Users size="1.1rem" aria-hidden="true" />
            <strong>{counts.members}</strong>
            <span>Standard users</span>
          </article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>People</span>
              <h2>Admin-managed users</h2>
            </div>
          </div>

          {usersQuery.isLoading ? (
            <div className={styles.state}>Loading users...</div>
          ) : null}

          {usersQuery.isError ? (
            <div className={styles.state}>
              Could not load admin users. Check your backend auth flow.
            </div>
          ) : null}

          {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 ? (
            <div className={styles.state}>No users found yet.</div>
          ) : null}

          {!usersQuery.isLoading && !usersQuery.isError && users.length > 0 ? (
            <div className={styles.tableWrap}>
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
                  {users.map((user) => {
                    const isCurrentUser = user.id === sessionUser?.id;
                    const isRoleUpdating =
                      updateRoleMutation.isPending &&
                      updateRoleMutation.variables?.id === user.id;

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className={styles.identity}>
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                            {isCurrentUser ? (
                              <small className={styles.meBadge}>You</small>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <span
                            className={
                              user.role === "ADMIN"
                                ? styles.roleAdmin
                                : styles.roleUser
                            }
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{formatJoinedDate(user.created_at)}</td>
                        <td>
                          <div className={styles.actions}>
                            <select
                              aria-label={`Change role for ${user.name}`}
                              className={styles.select}
                              disabled={isRoleUpdating}
                              value={user.role}
                              onChange={(event) =>
                                handleRoleChange(
                                  user.id,
                                  event.target.value as UserRole,
                                )
                              }
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>

                            <button
                              className={styles.deleteButton}
                              disabled={isCurrentUser}
                              type="button"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Trash2 size="0.95rem" aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </section>

      <Modal
        description="This permanently removes the selected account and its data."
        isOpen={Boolean(selectedUser)}
        title="Delete user"
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser ? (
          <div className={styles.modalBody}>
            <p className={styles.confirmText}>
              Delete <strong>{selectedUser.name}</strong> from the platform?
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteButton}
                disabled={isDeletingSelectedUser}
                type="button"
                onClick={handleDeleteUser}
              >
                Delete user
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        description="Your current admin session will be closed."
        isOpen={isLogoutModalOpen}
        title="Logout"
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <div className={styles.modalBody}>
          <p className={styles.confirmText}>Are you sure you want to logout?</p>
          <div className={styles.confirmActions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className={styles.confirmDeleteButton}
              disabled={logoutMutation.isPending}
              type="button"
              onClick={() =>
                logoutMutation.mutate(undefined, {
                  onSuccess: () => setIsLogoutModalOpen(false),
                })
              }
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
