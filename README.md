# Ngamia Admin Console

Standalone Next.js administration console for Ngamia platform operations.

Production: [admin.ngamia.cc](https://admin.ngamia.cc)

## What this app owns

- Admin authentication and staged TOTP MFA
- Users, payments, activity, settings, analytics, and broadcasts
- Administrator profile, theme, responsive navigation, and capability states

The app talks to the Ngamia API through `NEXT_PUBLIC_API_URL`. Production uses the same-origin Vercel proxy at `/api/ngamia`, forwarding to `https://api.ngamia.cc`.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Use `NEXT_PUBLIC_API_URL=http://localhost:8080` for a local API or `/api/ngamia` for the deployed proxy.

## Verification

```bash
npm run lint
npm run build
```

## Documentation

- [UI system and component patterns](docs/ui-system.md)
- [Page and interaction inventory](docs/page-inventory.md)
- [API integration conventions](docs/api-integration.md)
- [Standalone admin decision](docs/adr/0001-standalone-admin-console.md)
- [Analytics capability boundaries](docs/adr/0002-admin-analytics-and-capability-boundaries.md)

## Deployment

The GitHub repository is connected to Vercel. Pushes to `main` deploy automatically. Production uses `NEXT_PUBLIC_API_URL=/api/ngamia`.
