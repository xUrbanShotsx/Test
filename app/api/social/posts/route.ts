import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DEMO_USER_ID } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const posts = await prisma.socialPost.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { address: true, suburb: true } } },
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const post = await prisma.socialPost.create({
      data: {
        authorId: DEMO_USER_ID,
        propertyId: body.propertyId || null,
        platforms: JSON.stringify(body.platforms || []),
        caption: body.caption,
        hashtags: JSON.stringify(body.hashtags || []),
        imageUrls: JSON.stringify(body.imageUrls || []),
        campaignType: body.campaignType || null,
        status: body.scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
