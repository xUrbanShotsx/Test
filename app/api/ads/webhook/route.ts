/**
 * POST /api/ads/webhook
 * Stripe webhook — receives payment.intent.succeeded and credits the ad wallet.
 *
 * To register in Stripe Dashboard:
 *   Endpoint URL: https://yourdomain.com/api/ads/webhook
 *   Events: checkout.session.completed
 *
 * Set STRIPE_WEBHOOK_SECRET in .env to the signing secret from Stripe Dashboard.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adStore } from '@/lib/adStore'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey)
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      // Allow unsigned in dev if no webhook secret is set
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook signature invalid'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.metadata?.type === 'ad_wallet_topup' && session.payment_status === 'paid') {
      const amountAud = parseFloat(session.metadata.amountAud ?? '0')
      if (amountAud > 0) {
        adStore.addFunds(
          Math.round(amountAud * 100),
          session.payment_intent as string ?? session.id,
          `Stripe top-up — $${amountAud} AUD`,
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}
