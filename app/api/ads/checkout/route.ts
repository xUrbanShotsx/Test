/**
 * POST /api/ads/checkout
 * Creates a Stripe Checkout session for topping up the ad wallet.
 * Body: { amountAud: number }  — e.g. 100 for $100 AUD
 *
 * Returns { url } — redirect the user to this URL to complete payment.
 * Stripe handles all card details. We never see the card number.
 *
 * On success, Stripe calls our webhook (/api/ads/webhook) which credits the balance.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({
      error: 'STRIPE_SECRET_KEY is not configured. Add it to your .env file.',
      setupRequired: true,
    }, { status: 503 })
  }

  const { amountAud } = await req.json() as { amountAud: number }
  if (!amountAud || amountAud < 10 || amountAud > 10000) {
    return NextResponse.json({ error: 'Amount must be between $10 and $10,000 AUD' }, { status: 400 })
  }

  const stripe = new Stripe(stripeKey)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    currency: 'aud',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Ad Budget Top-Up',
            description: `Add $${amountAud} AUD to your Innovate.AI ad wallet`,
            images: [],
          },
          unit_amount: Math.round(amountAud * 100),  // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'ad_wallet_topup',
      amountAud: String(amountAud),
    },
    success_url: `${BASE}/dashboard/social?tab=Ads&topup=success&amount=${amountAud}`,
    cancel_url: `${BASE}/dashboard/social?tab=Ads&topup=cancelled`,
  })

  return NextResponse.json({ url: session.url, sessionId: session.id })
}
