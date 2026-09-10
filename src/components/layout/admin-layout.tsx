"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings2, CreditCard, ShieldAlert, LayoutDashboard, Activity, Boxes, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/api/hooks/profile";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/catalog", label: "Model catalog", icon: Boxes },
  { href: "/admin/workspaces", label: "Workspaces", icon: Building2 },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading } = useProfile();
  const pathname = usePathname();

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Admin access required
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You need an admin role to view this section.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Manage users, payments, and platform settings.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-b">
        {adminNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-t-md border-b-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                active && "border-primary text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
