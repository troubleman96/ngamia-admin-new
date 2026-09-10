"use client";
import { useQuery } from "@tanstack/react-query";
import { Boxes } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/client";

type Model = { id?: string; code?: string; name?: string; provider?: string; status?: string; active?: boolean; input_price?: number; output_price?: number };
export default function CatalogPage() {
  const query = useQuery({ queryKey: ["admin-catalog"], queryFn: () => api.get<Model[]>("/v1/models") });
  return <AdminLayout><Card className="overflow-hidden"><div className="flex items-center gap-3 border-b p-5"><Boxes className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Model catalog</h2><p className="text-sm text-muted-foreground">Availability and provider inventory.</p></div></div>{query.isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading catalog…</div> : <div className="divide-y">{(query.data ?? []).map((model, i) => <div key={model.id ?? model.code ?? i} className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium">{model.name ?? model.code ?? "Unnamed model"}</p><p className="text-sm text-muted-foreground">{model.provider ?? "Unknown provider"}</p></div><Badge variant="secondary">{model.status ?? (model.active === false ? "inactive" : "active")}</Badge></div>)}</div>}</Card></AdminLayout>;
}
