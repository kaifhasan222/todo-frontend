import { AuthGate } from "@/features/auth/components/AuthGate";

interface HomeProps {
  searchParams?: Promise<{
    mode?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const initialMode =
    resolvedSearchParams?.mode === "register" ? "register" : "login";

  return <AuthGate view="user" initialMode={initialMode} />;
}
