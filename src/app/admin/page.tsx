import { AuthGate } from "@/features/auth/components/AuthGate";

export default function AdminPage() {
  return <AuthGate view="admin" />;
}
