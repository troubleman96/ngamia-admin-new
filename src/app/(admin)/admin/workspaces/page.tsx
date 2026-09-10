"use client";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";

type Workspace = { id?: string; slug?: string; name?: string; owner_email?: string; created_at?: string };
export default function WorkspacesPage() {
  const query = useQuery({ queryKey: ["admin-workspaces"], queryFn: () => api.get<Workspace[]>("/v1/workspaces") });
  return <AdminLayout><Card className="overflow-hidden"><div className="flex items-center gap-3 border-b p-5"><Building2 className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Workspaces</h2><p className="text-sm text-muted-foreground">Customer workspace inventory.</p></div></div>{query.isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading workspaces…</div> : <div className="divide-y">{(query.data ?? []).map((workspace, i) => <div key={workspace.id ?? workspace.slug ?? i} className="flex items-center justify-between p-4"><div><p className="font-medium">{workspace.name ?? workspace.slug ?? "Unnamed workspace"}</p><p className="text-sm text-muted-foreground">{workspace.owner_email ?? "Owner unavailable"}</p></div><span className="text-xs text-muted-foreground">{workspace.created_at ? new Date(workspace.created_at).toLocaleDateString() : "—"}</span></div>)}</div>}</Card></AdminLayout>;
}
