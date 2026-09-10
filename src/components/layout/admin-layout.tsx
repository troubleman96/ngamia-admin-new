"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings2, CreditCard, LayoutDashboard, Activity, Boxes, Building2, BarChart3, TrendingUp, UserRound, Wallet, Bell, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics/overview", label: "Analytics", icon: BarChart3 },
  { href: "/admin/analytics/models", label: "Model usage", icon: TrendingUp },
  { href: "/admin/analytics/users", label: "User usage", icon: UserRound },
  { href: "/admin/analytics/profit", label: "Profit", icon: Wallet },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/catalog", label: "Model catalog", icon: Boxes },
  { href: "/admin/workspaces", label: "Workspaces", icon: Building2 },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/security", label: "Security", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
