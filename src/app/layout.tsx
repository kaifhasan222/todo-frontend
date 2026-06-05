import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { QueryProvider } from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Task Vault",
  description: "Protected todo workspace with cookie-based authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
