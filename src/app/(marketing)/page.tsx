"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  AudioLines,
  Video,
  FileText,
  Wand2,
  Zap,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MessageSquare,
    title: "Chat Completions",
    description:
      "OpenAI-compatible chat API. Works with every existing OpenAI SDK — just point your base_url at Ngamia.",
  },
  {
    icon: ImageIcon,
    title: "Vision & Images",
    description:
      "Understand images, receipts, and documents. Generate images from text prompts with leading models.",
  },
  {
    icon: AudioLines,
    title: "Audio & Voice",
    description:
      "Speech-to-text, text-to-speech, and a combined voice pipeline — with Kiswahili support built in.",
  },
  {
    icon: Video,
    title: "Video Understanding",
    description:
      "Analyze videos and generate new ones with models from a single gateway.",
  },
  {
    icon: Wand2,
    title: "Embeddings",
    description:
      "Semantic search and RAG powered by leading embedding models, billed per token.",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description:
      "Extract data from invoices, receipts, and contracts. Localized for East Africa.",
  },
];

const stats = [
  { value: "100+", label: "Models available" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "M-Pesa", label: "Top up with mobile money" },
  { value: "24ms", label: "Median first token" },
];

const tiers = [
  {
    name: "Starter",
    price: "0",
    description: "For trying out Ngamia",
    features: ["Sign-up bonus credits", "Access to free models", "Community support"],
    cta: "Create account",
    href: "/register",
  },
  {
    name: "Pro",
    price: "Credit-based",
    description: "For production workloads",
    features: [
      "Top up with M-Pesa & mobile money",
      "All models from the catalog",
      "Usage analytics",
      "Priority support",
    ],
    cta: "Get started",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For scale",
    features: ["Dedicated capacity", "Custom models", "SLA & onboarding", "Invoiced billing"],
    cta: "Contact sales",
    href: "/register",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 lg:pt-32">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            Built for East Africa — credit top-ups via mobile money
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Intelligent APIs for{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Africa
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            One API to every AI model. Chat, vision, audio, video, and embeddings —
            billed in Tanzanian Shillings, paid the way you like to pay.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="h-11 px-6">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-11 px-6">
                Open playground
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xl font-semibold tracking-tight sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">One gateway, every model</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Stop juggling provider dashboards and API keys. Call one endpoint, get any model.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-transparent p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Try a model in your browser
              </h2>
              <p className="mt-3 text-muted-foreground">
                Use our playground to test any model before you write a line of code.
                See token usage and credits in real time.
              </p>
            </div>
            <Link href="/register">
              <Button size="lg">
                Open the playground <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Simple, credit-based pricing</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Pay only for what you use. Top up with mobile money whenever you need to.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border bg-card p-6 ${
                tier.highlighted ? "border-primary ring-1 ring-primary" : ""
              }`}
            >
              {tier.highlighted && (
                <span className="mb-3 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{tier.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={tier.href} className="mt-8">
                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to build?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Create your account, add credits, and call your first model in under five minutes.
          </p>
          <Link href="/register" className="mt-6 inline-block">
            <Button size="lg" className="h-11 px-6">
              Start building <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}