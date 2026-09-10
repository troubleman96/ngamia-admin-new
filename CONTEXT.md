# Ngamia Admin Context

## Glossary

- **Administrator**: An internal Ngamia operator authenticated through the admin boundary; roles are `admin` and `super_admin`.
- **Customer**: A regular Ngamia user whose account, workspaces, usage, payments, and API keys may be inspected by an administrator.
- **Platform catalog**: The provider and model inventory used by the gateway, including availability and pricing controls.
- **Operational activity**: Usage, payment, authentication, and administrative events used to diagnose platform behavior.
- **Sensitive mutation**: A role, status, pricing, balance, or global setting change that requires explicit confirmation and should be auditable.
- **Operational activity**: Platform usage and payment events used to understand system behavior.
- **Audit event**: A durable record of an administrator mutation, including actor, target, reason, and request context.
- **Analytics aggregate**: A summary returned by the current API; it is not a time-series datapoint.
