"use client";

import { useState } from "react";
import { Activity, BarChart3, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useActivity,
  useActivitySummary,
  type Period,
} from "@/lib/api/hooks/activity";
import { useActiveWorkspace } from "@/lib/auth/workspace-context";
import { cn, formatCredits, formatRelativeTime } from "@/lib/utils";

const PERIODS: Array<{ value: Period; label: string }> = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function UsagePage() {
  const [period, setPeriod] = useState<Period>("month");
  const { workspace } = useActiveWorkspace();
  const workspaceId = workspace?.id;
  const { data: summary, isLoading: summaryLoading } = useActivitySummary(
    period,
    workspaceId
  );
  const { data: activity, isLoading: activityLoading } = useActivity({
    limit: 50,
    workspaceId,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Usage</h1>
          <p className="text-sm text-muted-foreground">
            Track your API activity and credit consumption.
          </p>
        </div>
        {workspace && (
          <Badge variant="secondary" className="font-mono text-xs">
            {workspace.slug}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-semibold tracking-tight">
                {formatCredits(summary?.total_requests ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-semibold tracking-tight">
                {formatCredits(summary?.total_tokens ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-semibold tracking-tight">
                {formatCredits(summary?.total_cost_credits ?? 0)}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                  credits
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              size="sm"
              variant={period === p.value ? "default" : "ghost"}
              onClick={() => setPeriod(p.value)}
              className="h-8 px-3 text-xs"
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Filter className="h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      {summary && summary.by_model.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="h-4 w-4 text-primary" />
              By model
            </CardTitle>
            <CardDescription className="text-sm">
              Break down of requests and cost per model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.by_model.map((m) => {
                const pct = summary.total_requests
                  ? Math.round((m.request_count / summary.total_requests) * 100)
                  : 0;
                return (
                  <div key={m.model}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{m.model}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.request_count} req · {formatCredits(m.total_cost_credits)} credits
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="h-4 w-4 text-primary" />
            Request log
          </CardTitle>
          <CardDescription className="text-sm">
            One row per gateway call
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : activity && activity.length > 0 ? (
            <div className="divide-y">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3">
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
                      {formatRelativeTime(item.created_at)}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="font-mono text-xs text-muted-foreground">
                      {item.prompt_tokens}+{item.completion_tokens} tokens
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.latency_ms}ms
                    </p>
                  </div>
                  <Badge
                    variant={item.status === "failed" ? "destructive" : "secondary"}
                    className="capitalize"
                  >
                    {item.status}
                  </Badge>
                  <span className="w-20 text-right text-sm font-medium">
                    {item.cost_credits.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Activity className="h-5 w-5" />
              </div>
              <p className="empty-state-title">No activity yet</p>
              <p className="empty-state-description">
                Make your first API call to see usage here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}