"use client";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
type User = { user_id?: string; full_name?: string; email?: string; requests?: number; cost_credits?: number; credits?: number };
export default function UserAnalyticsPage() { const query = useQuery({ queryKey: ["admin-analytics-users"], queryFn: () => api.get<User[]>("/v1/admin/analytics/users") }); return <AdminLayout><Card className="overflow-hidden"><div className="border-b p-5"><h2 className="font-semibold">Usage by user</h2><p className="text-sm text-muted-foreground">Customer usage and spend ranking.</p></div>{query.isLoading ? <p className="p-5 text-sm text-muted-foreground">Loading user analytics…</p> : <div className="divide-y">{(query.data ?? []).map((user, index) => <div key={`${user.user_id}-${index}`} className="flex items-center justify-between p-4"><div><p className="font-medium">{user.full_name ?? user.email ?? user.user_id ?? "Unknown user"}</p><p className="text-sm text-muted-foreground">{user.email ?? ""}</p></div><span className="text-sm">{user.cost_credits ?? user.credits ?? 0} credits</span></div>)}</div>}</Card></AdminLayout>; }
