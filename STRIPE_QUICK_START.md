# Stripe Connect Quick Start

Get Stripe Connect running in 5 minutes.

## 1. Get Stripe Test Keys

1. Go to https://dashboard.stripe.com/register
2. Create account (or login)
3. Switch to **Test Mode** (toggle in top right)
4. Go to Developers → API keys
5. Copy:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

## 2. Configure Environment

**Backend** - Create `/apps/api/.env`:
```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/watercloset
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_xxxxx  # ← Your secret key
STRIPE_WEBHOOK_SECRET=whsec_temp
STRIPE_PLATFORM_FEE_PERCENT=15
```

**Frontend** - Create `/.env`:
```bash
NUXT_PUBLIC_API_URL=http://localhost:3001
NUXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx  # ← Your publishable key
```

## 3. Start Services

```bash
# Terminal 1 - Backend
cd apps/api
pnpm install
pnpm run dev

# Terminal 2 - Frontend
pnpm install
pnpm run dev
```

## 4. Test the Flow

1. Open http://localhost:3000
2. Register as provider
3. Login
4. Go to `/manage` (dashboard)
5. Click "Connect Stripe Now" on blue banner
6. Click "Connect with Stripe"
7. Complete Stripe onboarding with test data:
   - Business: `Test LLC`
   - Bank routing: `110000000`
   - Bank account: `000123456789`
   - SSN: `000000000`
8. Should redirect back with success message

## 5. Verify It Works

Check these:
- ✓ Green success message shows
- ✓ Account status shows "Complete"
- ✓ "Open Stripe Dashboard" button works
- ✓ Blue alert banner disappears

## Common Issues

**"Stripe not loaded"**
→ Check `NUXT_PUBLIC_STRIPE_KEY` is set

**"Failed to create onboarding link"**
→ Check `STRIPE_SECRET_KEY` in backend .env

**"Cannot connect to database"**
→ Start PostgreSQL: `brew services start postgresql`

**Backend won't start**
→ Check port 3001 is free: `lsof -ti:3001 | xargs kill -9`

## Next Steps

- Read [STRIPE_CONNECT_README.md](./STRIPE_CONNECT_README.md) for architecture
- See [STRIPE_TESTING_GUIDE.md](./STRIPE_TESTING_GUIDE.md) for test scenarios
- Review [STRIPE_IMPLEMENTATION_SUMMARY.md](./STRIPE_IMPLEMENTATION_SUMMARY.md) for code changes

## File Locations

Modified files:
- `/app/pages/manage/settings.vue` - Settings with Stripe tab
- `/app/pages/manage/index.vue` - Dashboard with alerts

Backend (already existed):
- `/apps/api/src/endpoints/stripe.ts` - API endpoints

Composables (already existed):
- `/app/composables/useStripe.ts` - Stripe operations

## Test Cards

When testing payments:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth required: `4000 0025 0000 3155`

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits

## Production

When going live:
1. Switch to Live Mode in Stripe
2. Get live API keys
3. Update .env files with live keys
4. Test with real bank account
5. Complete business verification

---

Need help? Check the detailed guides linked above.
