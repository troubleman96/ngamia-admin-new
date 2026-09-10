import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type ActivityLog = {
  id: string;
  workspace_id?: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_credits: number;
  latency_ms: number;
  status: "completed" | "failed" | "cancelled";
  error_code?: string | null;
  created_at: string;
};

export type ActivitySummary = {
  total_requests: number;
  total_tokens: number;
  total_cost_credits: number;
  period_start: string;
  period_end: string;
  by_model: Array<{
    model: string;
    request_count: number;
    total_tokens: number;
    total_cost_credits: number;
  }>;
};

export type Period = "today" | "week" | "month" | "year";

export function useActivity(options?: {
  limit?: number;
  offset?: number;
  model?: string;
  status?: string;
  workspaceId?: string;
}) {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));
  if (options?.model) params.set("model", options.model);
  if (options?.status) params.set("status", options.status);
  if (options?.workspaceId) params.set("workspace_id", options.workspaceId);

  return useQuery({
    queryKey: ["activity", options],
    queryFn: () => api.get<ActivityLog[]>(`/v1/activity?${params.toString()}`),
  });
}

export function useActivitySummary(
  period: Period = "month",
  workspaceId?: string
) {
  const params = new URLSearchParams({ period });
  if (workspaceId) params.set("workspace_id", workspaceId);

  return useQuery({
    queryKey: ["activity-summary", period, workspaceId],
    queryFn: () => api.get<ActivitySummary>(`/v1/activity/summary?${params.toString()}`),
  });
}