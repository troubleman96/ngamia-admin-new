"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "For trying out Ngamia AI",
    features: [
      "100 free signup credits",
      "Access to select free models",
      "Community support",
      "Playground access",
    ],
    cta: "Create account",
    highlighted: false,
  },
  {
    name: "Pay-as-you-go",
    price: "From 1,000 TZS",
    description: "For individuals and small teams",
    features: [
      "Top up anytime via mobile money",
      "Every model in the catalog",
      "Usage analytics & per-model breakdown",
      "Email support",
      "Idempotency for safe retries",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For companies at scale",
    features: [
      "Dedicated capacity & custom models",
      "Invoiced billing (USD or TZS)",
      "SLA with 99.9% uptime",
      "Priority onboarding & support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pricing</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Credits are pegged 1:1 to Tanzanian Shillings. Top up with mobile money
          whenever you run low — no monthly commitments.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-2xl border bg-card p-6 ${
              plan.highlighted ? "border-primary ring-1 ring-primary" : ""
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{plan.price}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={plan.cta === "Contact sales" ? "/register" : plan.cta === "Get started" ? "/register" : "/login"} className="mt-8">
              <Button variant={plan.highlighted ? "default" : "outline"} className="w-full">
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
          <h3 className="text-lg font-semibold">How credits work</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every model shows its price per 1,000 tokens. A request is billed by tokens
            consumed. You see exact credit costs on every response in the playground and
            in your usage dashboard. Sign up, get a starter bonus, and never worry about
            surprise invoices.
          </p>
        </div>
      </div>
    </div>
  );
}