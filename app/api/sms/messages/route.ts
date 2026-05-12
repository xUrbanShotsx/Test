import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DEMO_USER_ID } from '@/lib/utils'

export async function GET() {
  try {
    const campaigns = await prisma.smsCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { address: true, suburb: true } },
        recipients: { select: { id: true, status: true } },
      },
    })
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch SMS campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Create campaign
    const campaign = await prisma.smsCampaign.create({
      data: {
        creatorId: DEMO_USER_ID,
        propertyId: body.propertyId || null,
        name: body.name || `SMS Campaign ${new Date().toLocaleDateString()}`,
        body: body.body,
        campaignType: body.campaignType || 'listing',
        status: 'draft',
        totalRecipients: (body.contactIds || []).length,
      },
    })

    // TODO: Create recipients and send via Twilio in production
    // For now, simulate sending
    await prisma.smsCampaign.update({
      where: { id: campaign.id },
      data: { status: 'sent', sentAt: new Date() },
    })

    return NextResponse.json({ campaign, sent: (body.contactIds || []).length }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send SMS campaign' }, { status: 500 })
  }
}
