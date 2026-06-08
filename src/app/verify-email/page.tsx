import { VerifyEmailView } from "@/features/auth/components/VerifyEmailView";

interface VerifyEmailPageProps {
  searchParams?: Promise<{
    token?: string;
    email?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <VerifyEmailView
      initialEmail={resolvedSearchParams?.email}
      initialToken={resolvedSearchParams?.token}
    />
  );
}
