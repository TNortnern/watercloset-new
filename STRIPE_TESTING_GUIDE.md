# Stripe Connect Testing Guide

This guide walks through testing the Stripe Connect onboarding flow locally.

## Prerequisites

### 1. Stripe Test Account
- Sign up at https://dashboard.stripe.com/register
- Switch to Test Mode (toggle in top right)
- Get your test API keys from Developers → API keys

### 2. Environment Setup

**Backend** (`/apps/api/.env`):
```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env` in root):
```bash
NUXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx
```

### 3. Database Setup
Ensure PostgreSQL is running and migrations are applied:
```bash
cd apps/api
pnpm run build
pnpm run payload migrate
```

### 4. Start Services
```bash
# Terminal 1 - API/Backend
cd apps/api
pnpm run dev

# Terminal 2 - Frontend
pnpm run dev
```

## Test Scenarios

### Scenario 1: New Provider - First Connection

**Steps:**
1. Login as provider (create one if needed)
2. Navigate to `/manage` (provider dashboard)
3. Verify blue alert banner appears: "Connect Stripe to Get Paid"
4. Click "Connect Stripe Now" button
5. Should redirect to `/manage/settings?tab=payouts`
6. Verify "Payouts" tab is active
7. Verify "Connect with Stripe" card is displayed
8. Click "Connect with Stripe" button
9. Should redirect to Stripe onboarding flow

**Stripe Test Data:**
- Business Name: `Test Provider LLC`
- Business Type: `Company`
- Country: `United States`
- Industry: `Software`

**Bank Account (Test Mode):**
- Routing Number: `110000000` (Test routing)
- Account Number: `000123456789` (Test account)

**Identity Verification (Test Mode):**
- SSN: `000000000` (Test SSN)
- DOB: Any valid date
- Address: Any valid US address

**Expected Results:**
- Redirected back to `/manage/settings?tab=payouts&stripe=complete`
- Green success message displayed
- Account status shows:
  - ✓ Onboarding Complete
  - ✓ Charges Enabled
  - ✓ Payouts Enabled
  - Account ID visible
- Dashboard alert banner disappears

### Scenario 2: Incomplete Onboarding

**Steps:**
1. Start onboarding (Steps 1-8 from Scenario 1)
2. In Stripe onboarding flow, click "Back" or close the window
3. Should redirect to `/manage/settings?tab=payouts&stripe=refresh`
4. Verify error message appears in red
5. Navigate back to `/manage`
6. Verify yellow warning banner appears: "Complete Your Stripe Setup"
7. Click "Complete Setup"
8. Should redirect back to Stripe to finish

**Expected Results:**
- Error message displays
- Yellow warning persists on dashboard
- Can resume onboarding
- After completion, shows success

### Scenario 3: Alert Dismissal

**Steps:**
1. As provider without Stripe (fresh account)
2. Navigate to `/manage`
3. Verify alert banner appears
4. Click "Dismiss" button on banner
5. Refresh page
6. Verify alert does NOT reappear
7. Open browser DevTools → Application → Local Storage
8. Verify `stripe-alert-dismissed` = `true`

**Expected Results:**
- Alert persists dismissal across page loads
- LocalStorage correctly stores preference
- Can be re-shown by clearing localStorage

### Scenario 4: Stripe Dashboard Access

**Steps:**
1. Complete onboarding (Scenario 1)
2. Navigate to `/manage/settings?tab=payouts`
3. Click "Open Stripe Dashboard" button
4. Should open new tab to Stripe Express Dashboard
5. Verify you can access Stripe dashboard
6. Close Stripe tab
7. Back in WaterCloset, click "Refresh Status"
8. Verify status reloads

**Expected Results:**
- Stripe dashboard opens in new tab
- Dashboard shows test account
- Can view payouts, settings, etc.
- Status refresh updates UI

### Scenario 5: Tab Navigation via Query Param

**Steps:**
1. Directly visit `/manage/settings?tab=payouts`
2. Verify Payouts tab is active (not Profile)
3. Navigate to another tab (e.g., Profile)
4. Verify URL doesn't change
5. Use browser back button
6. Verify returns to payouts tab

**Expected Results:**
- Query param controls active tab
- Tab state maintains during navigation
- Back button works correctly

### Scenario 6: Payment Flow (Integration Test)

**Prerequisites:**
- Provider has completed Stripe onboarding
- Property is listed and available

**Steps:**
1. As customer (different account), create booking
2. Complete payment with test card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. ZIP: Any 5 digits
6. Verify payment succeeds
7. Check Stripe dashboard as provider
8. Verify transfer appears in "Transfers" section
9. Check that 85% went to provider, 15% to platform

**Expected Results:**
- Payment processes successfully
- Transfer created automatically
- Provider receives 85% payout
- Platform retains 15% fee

## Debugging

### Check Backend Logs
```bash
# In apps/api terminal
# Look for:
# - "Error creating onboarding link"
# - "Error getting account status"
# - "Error creating login link"
```

### Check Frontend Console
Open browser DevTools → Console. Look for:
- Stripe composable errors
- Network request failures
- State management issues

### Common Issues

**"Failed to create onboarding link"**
- Check `STRIPE_SECRET_KEY` is set correctly
- Verify API is running on port 3001
- Check backend logs for detailed error

**"No Stripe account connected" when there should be**
- Check database: `SELECT "providerInfo" FROM users WHERE role='provider';`
- Verify `stripeAccountId` exists
- Try refreshing status

**Redirect loop**
- Clear localStorage
- Clear browser cache
- Check `FRONTEND_URL` matches actual URL

**Onboarding never completes**
- Verify using test mode credentials
- Check Stripe dashboard for account status
- Try creating new test account

## Verify Database Changes

```sql
-- Check provider's Stripe data
SELECT
  email,
  "providerInfo"->'stripeAccountId' as account_id,
  "providerInfo"->'stripeOnboarded' as onboarded
FROM users
WHERE role = 'provider';
```

Expected after onboarding:
- `account_id`: `"acct_xxxxx"`
- `onboarded`: `true`

## Testing Webhooks (Advanced)

### Using Stripe CLI

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login:
```bash
stripe login
```

3. Forward webhooks:
```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

4. Copy webhook secret and add to `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

5. Trigger test events:
```bash
# Account updated
stripe trigger account.updated

# Payout paid
stripe trigger payout.paid
```

## Manual Testing Checklist

- [ ] Provider can see Stripe alert on dashboard
- [ ] Alert dismissal persists
- [ ] Settings page loads with correct tab from query param
- [ ] Onboarding link redirects to Stripe
- [ ] Test data submission works
- [ ] Success redirect shows green message
- [ ] Error redirect shows red message
- [ ] Account status displays correctly
- [ ] All 4 status indicators work
- [ ] Dashboard link opens in new tab
- [ ] Refresh status button works
- [ ] Alert disappears after successful onboarding
- [ ] Yellow warning shows for incomplete setup
- [ ] Payment creates transfer to provider account
- [ ] Platform fee calculated correctly (15%)

## Production Checklist

Before going live:

- [ ] Replace test keys with live keys
- [ ] Set `FRONTEND_URL` to production URL
- [ ] Test with real bank account (own)
- [ ] Verify identity verification works
- [ ] Test actual payout (may take 2-7 days)
- [ ] Set up webhook endpoint
- [ ] Configure webhook events in Stripe dashboard
- [ ] Enable 2FA on Stripe account
- [ ] Review payout schedule settings
- [ ] Test with small real transaction
- [ ] Document support process for providers
- [ ] Add monitoring/alerting for failed transfers

## Support Resources

- **Stripe Connect Docs**: https://stripe.com/docs/connect
- **Express Dashboard**: https://stripe.com/docs/connect/express-dashboard
- **Test Cards**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
