/**
 * POST /api/ads/campaigns
 * Creates an ad campaign, deducts the total budget from the wallet,
 * and (when credentials are configured) submits to Meta Ads + LinkedIn Campaign Manager APIs.
 *
 * GET /api/ads/campaigns
 * Returns all campaigns.
 */
import { NextRequest, NextResponse } from 'next/server'
import { adStore } from '@/lib/adStore'
import { getToken } from '@/lib/socialTokens'

export async function GET() {
  return NextResponse.json({ campaigns: adStore.getCampaigns() })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    name, objective, platforms, dailyBudget, totalBudget,
    startDate, endDate, headline, body: adBody, imageUrl,
    targetSuburbs, ageMin, ageMax,
  } = body as {
    name: string
    objective: string
    platforms: ('facebook' | 'instagram' | 'linkedin')[]
    dailyBudget: number    // AUD dollars
    totalBudget: number    // AUD dollars
    startDate: string
    endDate: string
    headline: string
    body: string
    imageUrl?: string
    targetSuburbs: string[]
    ageMin: number
    ageMax: number
  }

  const totalCents = Math.round(totalBudget * 100)
  const balance = adStore.getBalance()

  if (totalCents > balance) {
    return NextResponse.json({
      error: `Insufficient balance. You have $${(balance / 100).toFixed(2)} available but need $${totalBudget.toFixed(2)}.`,
    }, { status: 402 })
  }

  const campaignId = `camp_${Date.now()}`
  const platformCampaignIds: Record<string, string> = {}

  // ── Meta Ads API (Facebook + Instagram) ────────────────────────────────────
  const hasMeta = platforms.includes('facebook') || platforms.includes('instagram')
  if (hasMeta) {
    const fbToken = getToken('facebook') ?? getToken('instagram')
    const adAccountId = process.env.META_AD_ACCOUNT_ID
    if (fbToken && adAccountId) {
      try {
        const splitBudget = platforms.filter(p => p === 'facebook' || p === 'instagram').length > 0
          ? Math.round((dailyBudget * 100) / 2)
          : Math.round(dailyBudget * 100)

        const campaignRes = await fetch(
          `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              objective: objective === 'VENDOR_LEADS' ? 'LEAD_GENERATION'
                : objective === 'PROPERTY_VIEWS' ? 'LINK_CLICKS'
                : objective === 'APPRAISAL_BOOKINGS' ? 'LEAD_GENERATION'
                : 'BRAND_AWARENESS',
              status: 'ACTIVE',
              special_ad_categories: ['HOUSING'],   // Required for real estate
              daily_budget: splitBudget,
              access_token: fbToken.pageAccessToken ?? fbToken.accessToken,
            }),
          }
        )
        const campaignData = await campaignRes.json()
        if (campaignData.id) platformCampaignIds.meta = campaignData.id
      } catch {
        // Log but don't fail — campaign recorded in our system
      }
    }
  }

  // ── LinkedIn Campaign Manager API ──────────────────────────────────────────
  if (platforms.includes('linkedin')) {
    const liToken = getToken('linkedin')
    const liAccountId = process.env.LINKEDIN_ACCOUNT_ID
    if (liToken && liAccountId) {
      try {
        const campaignRes = await fetch(
          'https://api.linkedin.com/v2/adCampaignsV2',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${liToken.accessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0',
            },
            body: JSON.stringify({
              account: `urn:li:sponsoredAccount:${liAccountId}`,
              name,
              status: 'ACTIVE',
              type: 'TEXT_AD',
              costType: 'CPM',
              unitCost: { amount: String(Math.round(dailyBudget * 100)), currencyCode: 'AUD' },
              dailyBudget: { amount: String(Math.round(dailyBudget * 100)), currencyCode: 'AUD' },
              totalBudget: { amount: String(totalCents), currencyCode: 'AUD' },
              runSchedule: {
                start: new Date(startDate).getTime(),
                end: new Date(endDate).getTime(),
              },
              targetingCriteria: {
                include: {
                  and: [
                    { or: { 'urn:li:adTargetingFacet:ageRanges': [`urn:li:ageRange:(${ageMin},${ageMax})`] } },
                  ],
                },
              },
              objectiveType: objective === 'VENDOR_LEADS' || objective === 'APPRAISAL_BOOKINGS'
                ? 'LEAD_GENERATION' : 'BRAND_AWARENESS',
            }),
          }
        )
        const liData = await campaignRes.json()
        if (liData.id) platformCampaignIds.linkedin = String(liData.id)
      } catch {
        // Log but don't fail
      }
    }
  }

  // ── Record in our store ───────────────────────────────────────────────────
  const campaign = {
    id: campaignId,
    name,
    objective: objective as 'VENDOR_LEADS' | 'PROPERTY_VIEWS' | 'BRAND_AWARENESS' | 'APPRAISAL_BOOKINGS',
    platforms,
    status: 'active' as const,
    dailyBudget: Math.round(dailyBudget * 100),
    totalBudget: totalCents,
    spent: 0,
    startDate,
    endDate,
    headline,
    body: adBody,
    imageUrl,
    targetSuburbs,
    ageMin,
    ageMax,
    platformCampaignIds,
    createdAt: new Date().toISOString(),
    impressions: 0,
    clicks: 0,
    leads: 0,
  }

  adStore.addCampaign(campaign)
  adStore.deductBudget(totalCents, `Campaign: ${name}`)

  return NextResponse.json({ ok: true, campaign })
}
