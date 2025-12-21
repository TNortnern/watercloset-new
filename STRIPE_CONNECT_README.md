# Stripe Connect Onboarding Flow

This document describes the Stripe Connect integration for WaterCloset providers to receive payments.

## Overview

The Stripe Connect onboarding flow allows providers to:
- Connect their bank account to receive payouts
- Complete identity verification
- Set up automatic payouts
- Access their Stripe Express Dashboard

## Architecture

### Frontend Components

**Provider Dashboard** (`/app/pages/manage/index.vue`)
- Displays prominent alert banner for providers who haven't connected Stripe
- Shows warning for providers with incomplete setup
- Dismissible alerts (stored in localStorage)
- Direct link to settings page with payouts tab

**Provider Settings Page** (`/app/pages/manage/settings.vue`)
- **Payouts Tab**: Complete Stripe Connect management interface
- Three states:
  1. **Not Connected**: Call-to-action to connect Stripe
  2. **Incomplete Setup**: Warning with link to complete onboarding
  3. **Connected**: Full account status dashboard

### Backend Endpoints

All endpoints are in `/apps/api/src/endpoints/stripe.ts`:

#### POST `/api/stripe/connect/onboard`
Creates a Stripe Connect account link for onboarding.
- Creates Express account if none exists
- Returns URL to Stripe onboarding flow
- Redirects back to `/manage/settings?stripe=complete` on success
- Redirects to `/manage/settings?stripe=refresh` on error

#### GET `/api/stripe/connect/status`
Returns current Stripe Connect account status.
```typescript
{
  hasAccount: boolean
  accountId?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
  detailsSubmitted?: boolean
}
```

#### POST `/api/stripe/connect/login`
Creates a login link to Stripe Express Dashboard.
- Returns URL that opens in new tab
- 5-minute expiration
- Full access to Stripe dashboard

### Composables

**useStripe** (`/app/composables/useStripe.ts`)
- `createConnectOnboardingLink()` - Start onboarding
- `getConnectAccountStatus()` - Check account status
- `createConnectLoginLink()` - Access dashboard

**usePayload** (`/app/composables/usePayload.ts`)
- API communication layer
- All requests proxied through `/api/*`

## User Flow

### First-Time Setup

1. Provider logs into dashboard (`/manage`)
2. Sees prominent blue banner: "Connect Stripe to Get Paid"
3. Clicks "Connect Stripe Now" button
4. Redirected to `/manage/settings?tab=payouts`
5. Clicks "Connect with Stripe" button
6. Redirected to Stripe onboarding flow
7. Completes:
   - Business information
   - Bank account connection
   - Identity verification
8. Redirected back to `/manage/settings?stripe=complete`
9. Sees success message
10. Account status shows:
    - ✓ Onboarding Complete
    - ✓ Charges Enabled
    - ✓ Payouts Enabled

### Incomplete Setup

If provider exits onboarding before completing:
1. Redirected to `/manage/settings?stripe=refresh`
2. Sees error message
3. Dashboard shows yellow warning banner
4. Can click "Complete Setup" to resume onboarding

### Managing Account

After connection:
- "Open Stripe Dashboard" - Access full Stripe Express dashboard
- "Refresh Status" - Reload account status
- "View Earnings" - Link to earnings page

## Data Model

### User Collection (`/apps/api/src/collections/Users.ts`)

Provider-specific fields in `providerInfo` group:
```typescript
{
  stripeAccountId: string       // Stripe Connect account ID
  stripeOnboarded: boolean      // Onboarding complete flag
  verified: boolean             // Provider verification status
  businessName?: string         // Business name
  businessType?: string         // Business type (individual, LLC, etc.)
}
```

## Environment Variables

### Frontend (`.env` in root)
```bash
NUXT_PUBLIC_STRIPE_KEY=pk_test_xxx  # Stripe publishable key
```

### Backend (`/apps/api/.env`)
```bash
STRIPE_SECRET_KEY=sk_test_xxx           # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_xxx         # Webhook secret
STRIPE_PLATFORM_FEE_PERCENT=15          # Platform fee (15%)
FRONTEND_URL=http://localhost:3000      # Frontend URL for redirects
```

## Payment Flow

When a booking is created:

1. **Payment Intent Creation** (`POST /api/stripe/create-payment-intent`)
   - Creates payment intent with total booking amount
   - If provider has Stripe Connect:
     ```javascript
     {
       amount: totalAmount,           // e.g., 2000 cents ($20.00)
       currency: 'usd',
       transfer_data: {
         destination: stripeAccountId,  // Provider's account
         amount: providerPayout        // e.g., 1700 cents ($17.00, 85%)
       }
     }
     ```
   - Platform automatically receives 15% fee
   - Provider receives 85% payout

2. **Customer Payment**
   - Customer pays full amount
   - Funds held by platform

3. **Automatic Transfer**
   - After successful payment
   - 85% transferred to provider's Stripe account
   - Payout to provider's bank account per their schedule

## UI States

### Not Connected
```
┌──────────────────────────────────────┐
│ Connect with Stripe                  │
│ Start receiving payments...          │
│                                      │
│ Why connect Stripe?                  │
│ ✓ Receive payments directly         │
│ ✓ Automatic payouts                 │
│ ✓ Secure processing                 │
│ ✓ Track earnings                    │
│                                      │
│ [Connect with Stripe]                │
└──────────────────────────────────────┘
```

### Incomplete Setup
```
┌──────────────────────────────────────┐
│ ⚠️ Complete your Stripe setup        │
│ Your account is not fully set up.   │
│ [Complete Setup]                     │
└──────────────────────────────────────┘
```

### Connected & Active
```
┌──────────────────────────────────────┐
│ Stripe Account Status                │
│                                      │
│ Onboarding Status: ✓ Complete       │
│ Charges Enabled:   ✓ Active         │
│ Payouts Enabled:   ✓ Active         │
│ Account ID:        acct_xxxxx       │
│                                      │
│ [Open Stripe Dashboard] [Refresh]   │
└──────────────────────────────────────┘
```

## Testing

### Test Mode
Use Stripe test mode credentials:
- Test publishable key: `pk_test_...`
- Test secret key: `sk_test_...`

### Test Account Setup
1. Use test mode credentials
2. Complete onboarding with test data:
   - Business name: "Test Business"
   - Tax ID: `000000000`
   - Bank routing: `110000000`
   - Account number: `000123456789`

### Test Payouts
- Create test booking
- Process test payment
- Verify transfer in Stripe dashboard
- Check test payout schedule

## Security

- All Stripe API calls are server-side only
- Account IDs stored in database
- Onboarding links expire after use
- Login links expire after 5 minutes
- All requests require authentication
- Provider can only access their own account

## Error Handling

### Common Errors

**"No Stripe account connected"**
- Provider hasn't started onboarding
- Show "Connect with Stripe" UI

**"Account not found"**
- Database has accountId but Stripe doesn't
- Likely deleted on Stripe side
- Clear accountId and restart onboarding

**"Onboarding incomplete"**
- Provider started but didn't finish
- Show "Complete Setup" UI
- Re-use existing account link

## Support

### Provider Support
- Link to Stripe Express dashboard
- Contact Stripe support directly
- View payout history in Stripe

### Platform Support
- Monitor account statuses
- Check webhook logs
- Review transfer history

## Future Enhancements

- [ ] Webhook handler for account updates
- [ ] Email notifications for payout issues
- [ ] Payout history in app
- [ ] Tax form automation
- [ ] Multi-currency support
- [ ] Custom payout schedules
