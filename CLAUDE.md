# WaterCloset New - Project Notes

## Deployment

### Railway (Monolithic)
- **Project**: watercloset-new
- **Workspace**: Trayvon Northern (hobby account)
- **Project URL**: https://railway.com/project/93d228b9-6978-4024-88b5-241769930463
- **Live Site**: https://watercloset-new-production.up.railway.app

**Architecture**: Single container running both Nuxt and Payload via PM2
- Payload runs internally on port 3000
- Nuxt is exposed on Railway's PORT (public)
- Nuxt proxies /api/* to localhost:3000 (internal Payload)

### Tech Stack
- **Frontend**: Nuxt 4 (app/)
- **Backend**: Payload CMS v3.0.0 (apps/api/)
- **Database**: PostgreSQL with PostGIS
- **ORM**: Drizzle (via Payload)

## Important Notes

### Payload v3 WHERE Clause Format
Payload v3 with Drizzle requires URL query string format for WHERE clauses:
- **Correct**: `where[owner][equals]=1`
- **Wrong**: `where={"owner":{"equals":1}}` (JSON format is ignored!)

The `usePayload.ts` composable handles this conversion automatically.

## Local Development

```bash
# Start both API and web dev servers
pnpm dev

# Or separately:
pnpm dev:api  # Payload API on port 3001
pnpm dev:web  # Nuxt app on port 3000
```

## Test Credentials

- `provider@provider.provider` / `provider123` - Provider user (user ID 1)
- `provider2@watercloset.com` / `provider123` - Provider user (user ID 6)
- `testprovider@gmail.com` / `Test1234!` - Test provider (user ID 11)
