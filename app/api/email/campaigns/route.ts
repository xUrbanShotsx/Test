import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DEMO_USER_ID } from '@/lib/utils'

export async function GET() {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { address: true, suburb: true } },
        recipients: { select: { id: true, status: true } },
      },
    })
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
