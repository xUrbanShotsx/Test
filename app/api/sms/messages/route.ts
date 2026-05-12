import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/db'

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-001'

const DEMO_SMS_CAMPAIGNS = [
  { id: 'sms1', creatorId: DEMO_USER_ID, propertyId: null, name: 'Open Home Reminder — Ocean Ave', body: 'Hi {firstName}, reminder: inspection for 12 Ocean Ave this Saturday 10am. Reply STOP to opt out. — James, Innovate.AI Realty', status: 'sent', scheduledAt: null, sentAt: new Date(Date.now() - 3 * 86400000).toISOString(), campaignType: 'inspection', totalRecipients: 48, delivered: 46, failed: 2, replies: 5, createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: { address: '12 Ocean Avenue', suburb: 'Wollongong' }, recipients: [] },
  { id: 'sms2', creatorId: DEMO_USER_ID, propertyId: null, name: 'Vendor Appraisal Blast — Wollongong', body: 'Hi {firstName}, curious what your Wollongong home is worth? We have 6 active buyers right now. Free appraisal — book at innovate-ai.com.au. Reply STOP to opt out.', status: 'sent', scheduledAt: null, sentAt: new Date(Date.now() - 10 * 86400000).toISOString(), campaignType: 'vendor_appraisal', totalRecipients: 218, delivered: 211, failed: 7, replies: 18, createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: null, recipients: [] },
  { id: 'sms3', creatorId: DEMO_USER_ID, propertyId: null, name: 'Just Sold Follow-Up', body: 'Hi {firstName}, we just sold in your street at a record price. If you have considered selling, now is the time. Call James on 0412 345 678.', status: 'scheduled', scheduledAt: new Date(Date.now() + 1 * 86400000).toISOString(), sentAt: null, campaignType: 'just_sold', totalRecipients: 85, delivered: 0, failed: 0, replies: 0, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: null, recipients: [] },
]

export async function GET() {
  if (hasDatabase() && prisma) {
    try {
      const campaigns = await prisma.smsCampaign.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { address: true, suburb: true } },
          recipients: { select: { id: true, status: true } },
        },
      })
      return NextResponse.json(campaigns)
    } catch { /* fall through */ }
  }
  return NextResponse.json(DEMO_SMS_CAMPAIGNS)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (hasDatabase() && prisma) {
      const campaign = await prisma.smsCampaign.create({
        data: {
          creatorId: DEMO_USER_ID,
          propertyId: body.propertyId || null,
          name: body.name || `SMS Campaign ${new Date().toLocaleDateString()}`,
          body: body.body,
          campaignType: body.campaignType || 'listing',
          status: 'sent',
          sentAt: new Date(),
          totalRecipients: (body.contactIds || []).length,
        },
      })
      return NextResponse.json({ campaign, sent: (body.contactIds || []).length }, { status: 201 })
    }

    const mock = { id: `demo_${Date.now()}`, ...body, status: 'sent', sentAt: new Date().toISOString(), totalRecipients: (body.contactIds || []).length, delivered: (body.contactIds || []).length, failed: 0, replies: 0 }
    return NextResponse.json({ campaign: mock, sent: mock.totalRecipients }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to send SMS campaign' }, { status: 500 })
  }
}
