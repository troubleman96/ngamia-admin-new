"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { WorkspaceProvider } from "@/lib/auth/workspace-context";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background lg:pl-60">
      <Sidebar />
      <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl pb-6">{children}</div>
      </main>
    </div>
  );
}

export default function AdminRouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AdminGuard>{children}</AdminGuard>
      </WorkspaceProvider>
    </AuthProvider>
  );
}