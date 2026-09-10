"use client";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";

type Event = { id?: string; event_type?: string; provider?: string; model_code?: string; status?: string; cost_credits?: number; created_at?: string };

export default function ActivityPage() {
  const query = useQuery({ queryKey: ["admin-activity"], queryFn: () => api.get<Event[]>("/v1/admin/activity?limit=50") });
  return <AdminLayout><Card className="overflow-hidden"><div className="flex items-center gap-3 border-b p-5"><Activity className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Operational activity</h2><p className="text-sm text-muted-foreground">Recent platform events and usage signals.</p></div></div>{query.isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading activity…</div> : query.isError ? <div className="p-6 text-sm text-destructive">Unable to load activity.</div> : <div className="divide-y">{(query.data ?? []).map((event, i) => <div key={event.id ?? i} className="flex items-center justify-between gap-4 p-4 text-sm"><div><p className="font-medium">{event.event_type ?? event.model_code ?? "Platform event"}</p><p className="text-muted-foreground">{event.provider ?? "Ngamia gateway"} · {event.status ?? "recorded"}</p></div><time className="text-xs text-muted-foreground">{event.created_at ? new Date(event.created_at).toLocaleString() : "—"}</time></div>)}</div>}</Card></AdminLayout>;
}
