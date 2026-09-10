# Admin API Integration

`src/lib/api/client.ts` owns admin tokens, refresh, errors, and the Vercel same-origin proxy. Pages should use the `api` helper rather than direct `fetch`.

## Authentication

1. `POST /v1/admin/auth/login`
2. If `mfa_required`, collect a six-digit code.
3. `POST /v1/admin/auth/mfa/verify`
4. Store admin-specific access and refresh tokens.
5. Refresh with `POST /v1/admin/auth/refresh`.

## Response and query conventions

The client unwraps `{ data: ... }` responses. Hooks type the unwrapped value. After mutations, invalidate the narrowest relevant React Query key. Preserve form values when the server rejects a mutation.

## Adding an endpoint

1. Confirm the route in `api/docs/openapi.yaml` and the API module.
2. Confirm payload and response shape.
3. Add a typed query or mutation.
4. Add loading, error, empty, pending, success, and unauthorized states.
5. Verify through `/api/ngamia` on Vercel.
6. Document an explicit capability state if the backend endpoint is absent.
