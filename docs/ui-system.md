# Ngamia Admin UI System

This is the source of truth for the admin console’s visual and interaction patterns.

## Shell and navigation

- Desktop uses a fixed 16rem grouped sidebar.
- Mobile uses a compact top bar and full-screen navigation drawer.
- Groups are Overview, Operations, and Control.
- Every page uses `AdminLayout`; do not create one-off shells.
- The footer contains administrator identity, profile, theme controls, and sign out.

## Visual language

Use the existing semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary`, `bg-muted`, `border`, and `text-destructive`. Do not introduce arbitrary colors for product states. Geist is the application font.

Use `text-xl` page titles, `text-lg` section titles, `text-sm` supporting copy, and `text-xs` metadata. Prefer cards for independent information groups and `divide-y` lists for operational logs.

## Interaction patterns

- Every page has a title, description, loading state, error state, empty state, and responsive layout.
- Every form control has a visible label and matching `id`.
- Set `type="button"` for non-submit buttons and `type="submit"` inside forms.
- Disable mutation buttons while pending and show success/failure feedback.
- Destructive actions require confirmation; sensitive mutations require a reason where the API supports it.
- Icon-only buttons require `aria-label` and visible focus.

## Data integrity

Use `/v1/admin/*` for platform-wide data. Never call a customer-scoped endpoint to make an admin screen look populated. Never invent values for charts. Aggregate APIs support KPI cards and rankings; time-series charts require time-bucketed API data.

## Responsive and accessibility rules

Use responsive grid/flex layouts, never fixed-width tables that overflow the viewport. Keep keyboard focus visible, use semantic headings, communicate status with text as well as color, and make mobile drawers explicitly closable.
