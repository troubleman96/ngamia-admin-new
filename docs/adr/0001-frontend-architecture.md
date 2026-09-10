# Shadcn/ui for the component library

We use shadcn/ui (New York style, neutral base) instead of the SaaS template's
hand-rolled CSS class primitives. shadcn components are copied into the repo
(no runtime dependency), theme natively via CSS custom properties, and are
fully accessible. This gives faster iteration on a premium SaaS than raw CSS.

# Generated REST client + TanStack Query, not tRPC

The Ngamia backend is a plain REST API with an OpenAPI spec and we don't
control it, so we talk to it through generated types and TanStack Query hooks.
tRPC was rejected: it would require a server-side proxy layer we don't need.

# Credit-based billing UI, not subscription tiers

Ngamia is credit-based (mobile money top-ups), not a monthly subscription.
The app surfaces the credit balance, top-up flow, and immutable transaction
ledger. Marketing "pricing tiers" exist only on the landing page.

# SSE streaming in the chat playground

The playground calls `POST /v1/chat/completions` with `stream: true` and
consumes the OpenAI-shaped SSE stream with a native `ReadableStream` reader.
No SSE library is needed since the gateway mirrors OpenAI's wire format exactly.

# Purple product theme

The product is themed around a deep purple accent (`#7c3aed`, violet-600) on a
graphite surface ladder adapted from the Coollabs system. This differentiates
the product while keeping premium light/dark contrast.