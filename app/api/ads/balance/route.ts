import { NextResponse } from 'next/server'
import { adStore } from '@/lib/adStore'

export async function GET() {
  return NextResponse.json({
    balance: adStore.getBalance(),
    transactions: adStore.getTransactions().slice(0, 20),
    campaigns: adStore.getCampaigns(),
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? null,
    stripeConfigured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== ''),
  })
}
