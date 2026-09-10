# Admin Page Inventory

| Route | Purpose | API contract | State |
| --- | --- | --- | --- |
| `/admin` | Operations entry point | Navigation | Available |
| `/admin/analytics/overview` | Platform KPIs | `/v1/admin/analytics/overview` | Available |
| `/admin/analytics/models` | Model usage ranking | `/v1/admin/analytics/models` | Available |
| `/admin/analytics/users` | User usage ranking | `/v1/admin/analytics/users` | Available |
| `/admin/analytics/profit` | Revenue/cost/margin | `/v1/admin/analytics/profit` | Available |
| `/admin/users` | Customer administration | `/v1/admin/users` | Available |
| `/admin/payments` | Payment operations | `/v1/admin/payments` | Available |
| `/admin/activity` | Operational activity | `/v1/admin/activity` | Available |
| `/admin/catalog` | Model catalog | `/v1/admin/models` | Available |
| `/admin/notifications` | Broadcasts/history | `/v1/admin/notifications/broadcast*` | Available |
| `/admin/security` | TOTP management | `/v1/admin/mfa/totp/*` | Available |
| `/admin/profile` | Admin identity | Login response metadata | Available |
| `/admin/workspaces` | Platform workspace inventory | No admin endpoint exists | Capability state |
| `/admin/settings` | Admin settings | `/v1/admin/settings` | Available |

Planned API-backed additions: provider CRUD, complete model/pricing management, billing adjustments, exchange-rate management, OpenRouter approvals, audit events, notification safeguards, and time-series analytics.
