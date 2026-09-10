# ADR 0001: Standalone administrator console

## Status

Accepted

## Decision

Ngamia administration lives in a standalone Next.js application and is not exposed through the customer-facing web app. The console uses the API's administrator authentication boundary and presents only operations supported by the API.

## Rationale

Administrator credentials, MFA, navigation, and destructive workflows have a different trust boundary from customer product UX. Separating the applications reduces accidental exposure and lets the console evolve around operations work while preserving the customer app's shared design language.
