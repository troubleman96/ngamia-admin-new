"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function MarketingNavbar() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            N
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Ngamia</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/#features" className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden h-8 text-[13px] sm:flex">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="hidden h-8 text-[13px] sm:flex">
              Get started
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/#features" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-secondary">
              Features
            </Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-secondary">
              Pricing
            </Link>
            <div className="mt-2 flex gap-2 border-t pt-3">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Sign in</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">Get started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
            N
          </span>
          <span className="text-sm font-medium">Ngamia AI</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/login" className="hover:text-foreground">Sign in</Link>
          <Link href="/register" className="hover:text-foreground">Create account</Link>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Ngamia. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}