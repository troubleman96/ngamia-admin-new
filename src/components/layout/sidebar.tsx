"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Key,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  X,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/lib/api/hooks/profile";
import { clearTokens } from "@/lib/api/client";
import { useActiveWorkspace } from "@/lib/auth/workspace-context";

const isAdminRole = (role?: string) =>
  role === "admin" || role === "super_admin";

function AdminNavItem({
  admin,
  collapsed,
  onNavigate,
}: {
  admin: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  if (!admin) return null;
  const active = pathname.startsWith("/admin");
  return (
    <Link
      href="/admin/users"
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground",
        active && "bg-secondary text-foreground",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? "Admin" : undefined}
    >
      <ShieldCheck className="h-4 w-4 shrink-0" />
      <span className={cn("truncate", collapsed && "hidden")}>Admin</span>
    </Link>
  );
}

const navSections = [
  {
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/chat", label: "Chat", icon: MessageSquare },
      { href: "/api-keys", label: "API Keys", icon: Key },
    ],
  },
  {
    items: [
      { href: "/billing", label: "Billing", icon: Wallet },
      { href: "/usage", label: "Usage", icon: BarChart3 },
    ],
  },
];

function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { data: profile } = useProfile();
  const { workspace, workspaces, setWorkspaceId } = useActiveWorkspace();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "h-8 w-full justify-between border-dashed text-[13px] font-medium",
              collapsed && "w-10 px-0 justify-center"
            )}
          />
        }
      >
        <span className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary text-[10px] font-semibold text-secondary-foreground">
            {profile?.full_name?.charAt(0) ?? "U"}
          </span>
          <span className={cn("truncate", collapsed && "hidden")}>
            {workspace?.name ?? "Workspace"}
          </span>
        </span>
        {!collapsed && (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" sideOffset={8} className="w-52">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            className={cn(ws.is_default && "font-medium")}
            onClick={() => setWorkspaceId(ws.id)}
          >
            <span className="truncate">{ws.name}</span>
            {ws.id === workspace?.id && (
              <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                Active
              </span>
            )}
            {ws.is_default && ws.id !== workspace?.id && (
              <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                Default
              </span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings/workspaces" />}>
          <Plus className="h-3.5 w-3.5" />
          Manage workspaces
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SidebarNav({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useProfile();
  const admin = isAdminRole(profile?.role);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navSections.map((section, i) => (
          <div key={i} className="mb-2">
            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground",
                    active && "bg-secondary text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className={cn("truncate", collapsed && "hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
        <div className="mb-2">
          <AdminNavItem admin={admin} collapsed={collapsed} onNavigate={onNavigate} />
        </div>
      </nav>

      <div className="px-3 py-2">
        <Link
          href="/settings/profile"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground",
            pathname.startsWith("/settings") && "bg-secondary text-foreground",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className={cn("truncate", collapsed && "hidden")}>Settings</span>
        </Link>

        <div className={cn("mt-1 border-t pt-2", collapsed && "hidden")}>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {profile?.full_name?.charAt(0) ?? "U"}
              </span>
              <span className="truncate text-[12px] font-medium">
                {profile?.full_name ?? "Ngamia User"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-60 flex-col border-r bg-sidebar lg:flex">
      <div className="flex h-13 shrink-0 items-center gap-2 px-3 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            N
          </span>
          <span className="truncate text-[15px] font-semibold tracking-tight">
            Ngamia
          </span>
        </Link>
      </div>
      <div className="px-3 pb-1">
        <WorkspaceSwitcher />
      </div>
      <SidebarNav />
    </aside>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Open menu">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        }
      />
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="flex-row items-center justify-between px-3 py-3">
          <SheetTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              N
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Ngamia</span>
          </SheetTitle>
          <SheetClose render={<Button variant="ghost" size="icon" aria-label="Close menu" />}>
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetHeader>
        <div className="px-3 pb-1">
          <WorkspaceSwitcher />
        </div>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}