"use client";

import { Users, CreditCard, Activity, Boxes } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";

const cards = [
  ["Users", "Manage customer accounts and access", "/admin/users", Users],
  ["Payments", "Review deposits and settlement state", "/admin/payments", CreditCard],
  ["Activity", "Inspect usage and platform events", "/admin/activity", Activity],
  ["Model catalog", "Control provider and model availability", "/admin/catalog", Boxes],
] as const;

export default function AdminIndex() {
  return <AdminLayout><div className="grid gap-4 sm:grid-cols-2">{cards.map(([title, description, href, Icon]) => <a key={href} href={href}><Card className="h-full p-5 transition-colors hover:border-primary"><Icon className="mb-4 h-5 w-5 text-primary" /><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></Card></a>)}</div></AdminLayout>;
}
