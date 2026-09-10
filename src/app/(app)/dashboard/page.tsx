"use client";

import Link from "next/link";
import {
  Wallet,
  Plus,
  MessageSquare,
  Key,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBalance } from "@/lib/api/hooks/billing";
import { useActivity, useActivitySummary } from "@/lib/api/hooks/activity";
import { useProfile } from "@/lib/api/hooks/profile";
import { cn, formatCredits, formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const { data: profile } = useProfile();
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const { data: summary, isLoading: summaryLoading } = useActivitySummary("month");
  const { data: recentActivity, isLoading: activityLoading } = useActivity({ limit: 5 });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your AI usage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Credit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight">
                {formatCredits(balance?.balance ?? 0)}
              </div>
            )}
            <div className="mt-1 text-xs text-muted-foreground">credits</div>
            {balance && balance.balance < balance.low_balance_threshold && (
              <div className="callout callout-warning mt-3 text-xs">
                Balance is below your threshold.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight">
                {formatCredits(summary?.total_cost_credits ?? 0)}
              </div>
            )}
            <div className="mt-1 text-xs text-muted-foreground">
              {formatCredits(summary?.total_requests ?? 0)} requests ·{" "}
              {formatCredits(summary?.total_tokens ?? 0)} tokens
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              render={<Link href="/billing" />}
              variant="secondary"
              className="justify-start bg-white/10 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4" /> Top up credits
            </Button>
            <Button
              render={<Link href="/chat" />}
              variant="secondary"
              className="justify-start bg-white/10 text-white hover:bg-white/20"
            >
              <MessageSquare className="h-4 w-4" /> Send a message
            </Button>
            <Button
              render={<Link href="/api-keys" />}
              variant="secondary"
              className="justify-start bg-white/10 text-white hover:bg-white/20"
            >
              <Key className="h-4 w-4" /> Create an API key
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              Your latest API calls
            </CardDescription>
          </div>
          <Button render={<Link href="/usage" />} variant="ghost" size="sm" className="text-primary">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentActivity && recentActivity.length > 0 ? (
            <div className="divide-y">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      item.status === "completed"
                        ? "bg-green-500"
                        : item.status === "failed"
                          ? "bg-destructive"
                          : "bg-muted-foreground/50"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.model}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCredits(item.total_tokens)} tokens ·{" "}
                      {formatRelativeTime(item.created_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      item.cost_credits < 0 ? "text-muted-foreground" : "text-green-600"
                    )}
                  >
                    {item.cost_credits.toFixed(4)} credits
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Activity className="h-6 w-6" />
              </div>
              <p className="empty-state-title">No activity yet</p>
              <p className="empty-state-description">
                Start using the API to see your usage here.
              </p>
              <Button render={<Link href="/chat" />} size="sm" className="mt-3">
                Open Playground
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}