# ADR 0002: Analytics and capability boundaries

## Status

Accepted

## Decision

The admin UI uses the API's aggregate analytics endpoints for KPI cards and ranked breakdowns. It does not invent trend values. Time-series charts remain unavailable until the API exposes time-bucketed analytics. UI modules without a platform-wide admin endpoint show an explicit capability state instead of calling customer-scoped endpoints.

## Rationale

Operational dashboards must not imply precision the backend does not provide. Keeping aggregates distinct from time-series data prevents misleading charts, while explicit capability states make missing backend work visible to product and API owners.
