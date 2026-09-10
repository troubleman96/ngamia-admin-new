"use client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Activity, CreditCard, Coins } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";

type Overview = Record<string, number | string | undefined>;
const metric = (data: Overview | undefined, ...keys: string[]) => keys.map((key) => data?.[key]).find((value) => value !== undefined) ?? 0;
export default function AnalyticsOverviewPage() {
  const query = useQuery({ queryKey: ["admin-analytics-overview"], queryFn: () => api.get<Overview>("/v1/admin/analytics/overview") });
  const cards = [["Requests", metric(query.data, "total_requests", "requests"), Activity], ["Unique users", metric(query.data, "unique_users", "active_users"), Users], ["Credits used", metric(query.data, "total_credits", "credits_used"), Coins], ["Revenue", metric(query.data, "revenue", "total_revenue"), CreditCard]] as const;
  return <AdminLayout><div className="space-y-5"><div><h2 className="text-lg font-semibold">Analytics overview</h2><p className="text-sm text-muted-foreground">Platform health and commercial performance from the admin API.</p></div>{query.isError && <Card className="border-destructive/30 p-4 text-sm text-destructive">Analytics could not be loaded. Confirm the API analytics routes are deployed.</Card>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon]) => <Card key={label} className="p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{query.isLoading ? "—" : typeof value === "number" ? value.toLocaleString() : value}</p></Card>)}</div><Card className="p-5"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Trend charts</h3><p className="text-sm text-muted-foreground">The current API exposes aggregate analytics only. Time-series charts will activate after the time-bucket endpoint is added.</p></div></div><div className="mt-6 flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">No time-series data available yet</div></Card></div></AdminLayout>;
}
