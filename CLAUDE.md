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
- Payload CMS admin panel is at `/admin` (API works, but browser UI has issues due to /_next path conflict with Nuxt)
- Nuxt platform dashboard is at `/platform` (moved from /admin to avoid conflict)
- **Known Issue**: Payload admin panel doesn't fully load in browser because Nuxt intercepts `/_next` static assets. Workaround: Use Payload API directly or access admin via internal URL if needed.

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

## Test Credentials (Production)

- `admin@admin.admin` / `Loloo123!` - Admin user (user ID 1)
- `provider@provider.provider` / `provider123` - Provider user (user ID 2)
- `provider@test.com` / `provider123` - Provider user (user ID 3)
- `enjoyer@enjoyer.enjoyer` / `enjoyer123` - Regular user (user ID 4)

## Test Credentials (Local Development)

- `provider@provider.provider` / `provider123` - Provider user
- `testprovider@gmail.com` / `Test1234!` - Test provider

## rb-payload / BookFlow Integration

WaterCloset is registered as an app in rb-payload's multi-tenant booking engine.

### Credentials
- **App ID**: 5
- **App Slug**: mywatercloset
- **API Key Prefix**: `mwc_`
- **Master API Key**: `mwc_6oCSws9ZQvhK5tULEkCSg7qo3cqorTtB`
- **API Base URL**: https://reusablebook-payload-production.up.railway.app
- **Documentation**: https://reusablebook-payload-production.up.railway.app/docs/marketplace

### Environment Variables (add to .env)
```
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
RB_PAYLOAD_API_KEY=mwc_6oCSws9ZQvhK5tULEkCSg7qo3cqorTtB
```

### Key Endpoints
- `POST /api/provision/tenant` - Create tenant for a new rental business
- `GET /api/services` - List services (rental items)
- `GET /api/availability/month` - Check monthly availability
- `POST /api/bookings` - Create a booking

### Integration Pattern
1. Each WaterCloset provider becomes an rb-payload "tenant"
2. Provider properties become "services" (with inventory mode)
3. Configure webhooks to sync booking events back to WaterCloset
4. Use the embeddable booking widget OR build custom UI with the API
