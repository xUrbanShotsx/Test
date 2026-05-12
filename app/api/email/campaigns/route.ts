import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/db'

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-001'

const DEMO_CAMPAIGNS = [
  { id: 'ec1', creatorId: DEMO_USER_ID, propertyId: null, name: 'Wollongong Market Update — May 2026', subject: 'Your Wollongong Property Update', previewText: 'Median prices up 8% — what it means for you', htmlBody: '<p>Demo email body</p>', plainText: null, fromName: 'James Spinelli', fromEmail: 'james@innovate-ai.com.au', replyTo: null, status: 'sent', scheduledAt: null, sentAt: new Date(Date.now() - 5 * 86400000).toISOString(), campaignType: 'market_update', totalRecipients: 486, delivered: 478, opened: 201, clicked: 44, bounced: 8, unsubscribed: 2, createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: null, recipients: [] },
  { id: 'ec2', creatorId: DEMO_USER_ID, propertyId: 'p1', name: 'Just Listed — 12 Ocean Avenue', subject: 'New Listing: 4 Bed Ocean Views in Wollongong', previewText: 'Inspection this Saturday 10am', htmlBody: '<p>Demo email body</p>', plainText: null, fromName: 'James Spinelli', fromEmail: 'james@innovate-ai.com.au', replyTo: null, status: 'sent', scheduledAt: null, sentAt: new Date(Date.now() - 18 * 86400000).toISOString(), campaignType: 'new_listing', totalRecipients: 312, delivered: 308, opened: 156, clicked: 72, bounced: 4, unsubscribed: 1, createdAt: new Date(Date.now() - 18 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: { address: '12 Ocean Avenue', suburb: 'Wollongong' }, recipients: [] },
  { id: 'ec3', creatorId: DEMO_USER_ID, propertyId: null, name: 'Free Appraisal — Spring Campaign', subject: 'Is Now the Right Time to Sell?', previewText: 'Find out what your home is worth — free appraisal', htmlBody: '<p>Demo email body</p>', plainText: null, fromName: 'James Spinelli', fromEmail: 'james@innovate-ai.com.au', replyTo: null, status: 'scheduled', scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(), sentAt: null, campaignType: 'vendor_appraisal', totalRecipients: 624, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: null, recipients: [] },
  { id: 'ec4', creatorId: DEMO_USER_ID, propertyId: 'p3', name: 'Just Sold — 3 Fairy Street Record Result', subject: 'SOLD — Record Price in Fairy Meadow', previewText: 'We achieved $1,875,000 — buyers still searching', htmlBody: '<p>Demo email body</p>', plainText: null, fromName: 'James Spinelli', fromEmail: 'james@innovate-ai.com.au', replyTo: null, status: 'sent', scheduledAt: null, sentAt: new Date(Date.now() - 14 * 86400000).toISOString(), campaignType: 'just_sold', totalRecipients: 198, delivered: 195, opened: 110, clicked: 38, bounced: 3, unsubscribed: 0, createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: { address: '3 Fairy Street', suburb: 'Fairy Meadow' }, recipients: [] },
]

export async function GET() {
  if (hasDatabase() && prisma) {
    try {
      const campaigns = await prisma.emailCampaign.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { address: true, suburb: true } },
          recipients: { select: { id: true, status: true } },
        },
      })
      return NextResponse.json(campaigns)
    } catch { /* fall through */ }
  }
  return NextResponse.json(DEMO_CAMPAIGNS)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (hasDatabase() && prisma) {
      const campaign = await prisma.emailCampaign.create({
        data: {
          creatorId: DEMO_USER_ID,
          propertyId: body.propertyId || null,
          name: body.name,
          subject: body.subject,
          previewText: body.previewText || null,
          htmlBody: body.htmlBody,
          plainText: body.plainText || null,
          fromName: body.fromName || 'Innovate.AI Realty',
          fromEmail: body.fromEmail || 'hello@innovate-ai.com.au',
          campaignType: body.campaignType || 'listing',
          status: 'draft',
        },
      })
      return NextResponse.json(campaign, { status: 201 })
    }

    const mock = { id: `demo_${Date.now()}`, ...body, status: 'draft', totalRecipients: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    return NextResponse.json(mock, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
