"use client";
import { Info } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
export default function WorkspacesPage() {
  return <AdminLayout><Card className="p-6"><div className="flex items-start gap-3"><Info className="mt-0.5 h-5 w-5 text-primary" /><div><h2 className="font-semibold">Workspace operations unavailable</h2><p className="mt-1 text-sm text-muted-foreground">The API currently exposes customer-scoped workspace endpoints only. An admin workspace inventory endpoint is required before this screen can safely display platform-wide data.</p></div></div></Card></AdminLayout>;
}
