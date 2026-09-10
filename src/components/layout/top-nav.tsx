"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wallet,
  Plus,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Settings as SettingsIcon,
} from "lucide-react";

import { cn, formatCredits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/lib/api/hooks/profile";
import { useBalance } from "@/lib/api/hooks/billing";
import { clearTokens } from "@/lib/api/client";
import { useActiveWorkspace } from "@/lib/auth/workspace-context";
import { MobileMenu } from "@/components/layout/sidebar";

const isAdminRole = (role?: string) =>
  role === "admin" || role === "super_admin";

const pageLabels = [
  { prefix: "/dashboard", label: "Dashboard" },
  { prefix: "/chat", label: "Chat" },
  { prefix: "/api-keys", label: "API Keys" },
  { prefix: "/billing", label: "Billing" },
  { prefix: "/usage", label: "Usage" },
  { prefix: "/settings", label: "Settings" },
  { prefix: "/admin", label: "Admin" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: balance } = useBalance();
  const { workspace } = useActiveWorkspace();

  const admin = isAdminRole(profile?.role);
  const label = pageLabels
    .filter((p) => pathname.startsWith(p.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0]?.label;
  const lowBalance =
    balance != null && balance.balance <= balance.low_balance_threshold;

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <div className="lg:hidden">
          <MobileMenu />
        </div>
        {(label || workspace) && (
          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            {label && (
              <span className="truncate text-[13px] font-medium tracking-tight">
                {label}
              </span>
            )}
            {workspace && (
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {workspace.name}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/billing"
          aria-label="Credit balance — go to billing"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[12px] font-semibold transition-colors",
            lowBalance
              ? "border-destructive/25 bg-destructive/5 text-destructive hover:bg-destructive/10"
              : "border-border bg-secondary/40 hover:bg-secondary"
          )}
        >
          <Wallet className="h-3.5 w-3.5" />
          <span>{balance ? formatCredits(balance.balance) : "—"} credits</span>
        </Link>

        <Button
          size="sm"
          className="h-8 gap-1 px-2.5 text-[12px] font-semibold"
          render={<Link href="/billing" />}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add credits</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Account menu"
                className="flex h-8 items-center gap-1 rounded-full p-0.5 transition-colors hover:bg-secondary"
              >
                <Avatar size="sm" className="size-7">
                  <AvatarFallback className="bg-primary/10 text-[12px] font-semibold text-primary">
                    {profile?.full_name?.charAt(0) ?? profile?.email?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="mr-1 hidden h-3.5 w-3.5 text-muted-foreground lg:block" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="px-1.5">
              <div className="flex items-center gap-2.5 py-0.5">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile?.full_name?.charAt(0) ?? profile?.email?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {profile?.full_name ?? "Ngamia User"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {profile?.email ?? ""}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/settings/profile" />}>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings/workspaces" />}>
              <SettingsIcon />
              Workspaces
            </DropdownMenuItem>
            {admin && (
              <DropdownMenuItem render={<Link href="/admin/users" />}>
                <ShieldCheck />
                Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}