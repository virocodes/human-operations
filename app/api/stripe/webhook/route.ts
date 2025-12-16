import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Create Supabase admin client for webhooks (no user session required)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  console.log('[Webhook] Received request')

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  if (!signature) {
    console.error('[Webhook] No signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('[Webhook] Event verified:', event.type)
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('[Webhook] Processing checkout.session.completed')
      console.log('[Webhook] Session metadata:', session.metadata)
      console.log('[Webhook] Customer ID:', session.customer)

      // Get the Supabase user ID from metadata
      const userId = session.metadata?.supabase_user_id

      if (!userId) {
        console.error('[Webhook] No user ID in checkout session metadata')
        console.error('[Webhook] Full session object:', JSON.stringify(session, null, 2))
        return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
      }

      // Update user payment status using admin client
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          has_paid: true,
          payment_date: new Date().toISOString(),
          stripe_customer_id: session.customer as string,
        })
        .eq('id', userId)
        .select()

      if (error) {
        console.error('[Webhook] Failed to update user payment status:', error)
        console.error('[Webhook] Error details:', JSON.stringify(error, null, 2))
        return NextResponse.json(
          { error: 'Failed to update payment status' },
          { status: 500 }
        )
      }

      console.log(`[Webhook] ✓ Payment successful for user ${userId}`)
      console.log('[Webhook] Updated user data:', data)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', paymentIntent.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
