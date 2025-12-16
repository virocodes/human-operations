# Payment Integration Setup Guide

This guide walks you through setting up the Stripe payment integration for Human Operations.

## Overview

Human Operations uses a **one-time $19 payment** model:
- No free tier
- Users must pay after completing onboarding to access the app
- Lifetime access after payment

## What's Been Created

### 1. Stripe Products & Prices
- **Product**: "Human Operations"
- **Amount**: $19.00 USD (one-time)
- **Test Mode Price ID**: `price_1Sf6Ae0LOqtcNLZ9Cw1seNQC`
- **Live Mode Price ID**: Create in production (see setup steps)

**Important**: Price IDs are different for test vs live mode. Use environment variables to configure.

### 2. Database Migration
Run this migration in your Supabase SQL Editor:

```sql
-- File: migrations/add_payment_fields.sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_has_paid ON users(has_paid);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
```

### 3. Payment Flow

```
User Journey:
1. Sign up → /login (Google OAuth)
2. Complete onboarding → /onboarding
3. Payment required → /payment
4. Stripe Checkout → User pays $19
5. Webhook updates user → has_paid = true
6. Redirect to app → /home
```

### 4. Files Created

**Frontend:**
- `/app/payment/page.tsx` - Payment landing page

**Backend API:**
- `/app/api/stripe/create-checkout-session/route.ts` - Creates Stripe Checkout
- `/app/api/stripe/webhook/route.ts` - Handles payment success

**Middleware:**
- Updated `middleware.ts` - Enforces payment requirement

## Setup Steps

### Step 1: Run Database Migration

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the migration from `migrations/add_payment_fields.sql`
4. Verify the new columns exist in the `users` table

### Step 2: Configure Stripe Webhook

The webhook is critical - without it, users won't be marked as paid after checkout.

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL:
   - **Development**: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) (see below)
   - **Production**: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed` (required)
   - `payment_intent.payment_failed` (optional, for logging)
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### Step 3: Configure Environment Variables

Add all required Stripe variables to `.env.local`:

```bash
# Test mode (for local development)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY
STRIPE_PRICE_ID=price_1Sf6Ae0LOqtcNLZ9Cw1seNQC
STRIPE_WEBHOOK_SECRET=whsec_FROM_STRIPE_CLI
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For production, use live mode keys:
# STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
# STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID (create in live mode)
# STRIPE_WEBHOOK_SECRET=whsec_FROM_STRIPE_DASHBOARD
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Getting your test keys:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy test secret key and publishable key
3. Test price ID is already created: `price_1Sf6Ae0LOqtcNLZ9Cw1seNQC`

### Step 4: Test Locally with Stripe CLI

For local development, use the Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will output a webhook signing secret - add it to .env.local as STRIPE_WEBHOOK_SECRET
```

**Important**: Make sure you're using **test mode** keys. The Stripe CLI only forwards webhooks in test mode!

### Step 5: Test the Payment Flow

1. Start the dev server: `npm run dev`
2. Create a new user account (or use existing without payment)
3. Complete onboarding
4. You should be redirected to `/payment`
5. Click "Continue to Payment"
6. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code
7. Complete payment
8. Webhook should fire and update `has_paid = true`
9. You should be redirected to `/home`

## Troubleshooting

### "Payment successful but I'm still on /payment"

**Cause**: Webhook didn't fire or failed

**Fix**:
1. Check webhook is configured correctly in Stripe Dashboard
2. For local dev, ensure `stripe listen` is running
3. Check your terminal/logs for webhook errors
4. Manually update the database as a workaround:
   ```sql
   UPDATE users SET has_paid = true WHERE id = 'user_id_here';
   ```

### "Unauthorized" error when clicking payment button

**Cause**: User session issue

**Fix**:
1. Check user is logged in
2. Verify Supabase auth is working
3. Check browser console for errors

### Webhook signature verification failed

**Cause**: Wrong webhook secret

**Fix**:
1. Copy the correct signing secret from Stripe Dashboard
2. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Restart your dev server

### Redirect loop between /payment and /home

**Cause**: Database state mismatch

**Fix**:
1. Check the user's `has_paid` and onboarding `current_phase` in database
2. Ensure `has_paid` is `true` and `current_phase` is `'complete'`
3. Clear browser cookies and try again

## Security Notes

1. **Never commit** `.env.local` - it contains secret keys
2. The webhook secret is **critical** - keep it private
3. Stripe Checkout handles PCI compliance - you never touch card data
4. All payment processing happens on Stripe's secure servers

## Going to Production

Before launching:

1. **Create live mode product and price:**
   - Go to https://dashboard.stripe.com/products (live mode)
   - Create product "Human Operations" with $19 one-time price
   - Copy the live price ID

2. **Update environment variables with live keys:**
   ```bash
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Configure production webhook endpoint:**
   - Go to https://dashboard.stripe.com/webhooks (live mode)
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

4. **Test with real payment** (you can refund it afterward)
5. **Monitor Stripe Dashboard** for successful payments

## Support

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
