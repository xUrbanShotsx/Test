import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/db'

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-001'

const DEMO_POSTS = [
  { id: 'sp1', authorId: DEMO_USER_ID, propertyId: 'p1', platforms: '["instagram","facebook"]', caption: 'Just listed in Wollongong — 4 bed with breathtaking ocean views. Open for inspection this Saturday 10am. DM for details.', hashtags: '["#wollongong","#realestate","#oceanviews","#forsale"]', imageUrls: '[]', canvaDesignId: null, status: 'published', scheduledAt: null, publishedAt: new Date(Date.now() - 18 * 86400000).toISOString(), campaignType: 'new_listing', impressions: 5842, reach: 4210, clicks: 312, engagement: 267, createdAt: new Date(Date.now() - 18 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: { address: '12 Ocean Avenue', suburb: 'Wollongong' } },
  { id: 'sp2', authorId: DEMO_USER_ID, propertyId: null, platforms: '["facebook","instagram","linkedin"]', caption: 'Thinking of selling? The Wollongong market is moving fast — median prices up 8% this year. Book a free appraisal with our team today.', hashtags: '["#wollongong","#propertymarket","#freeappraisal","#sellingsmarter"]', imageUrls: '[]', canvaDesignId: null, status: 'published', scheduledAt: null, publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(), campaignType: 'vendor_appraisal', impressions: 7104, reach: 5680, clicks: 189, engagement: 344, createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: null },
  { id: 'sp3', authorId: DEMO_USER_ID, propertyId: 'p3', platforms: '["facebook","instagram"]', caption: 'JUST SOLD — 3 Fairy Street, Fairy Meadow. Congratulations to our vendors on their outstanding result. We still have buyers searching in this area.', hashtags: '["#justsold","#fairymeadow","#recordprice","#innovateairealty"]', imageUrls: '[]', canvaDesignId: null, status: 'published', scheduledAt: null, publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(), campaignType: 'just_sold', impressions: 9230, reach: 7410, clicks: 208, engagement: 512, createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: { address: '3 Fairy Street', suburb: 'Fairy Meadow' } },
  { id: 'sp4', authorId: DEMO_USER_ID, propertyId: null, platforms: '["instagram"]', caption: 'Market insight: Wollongong is seeing record low days-on-market this quarter. Our listings are selling in an average of 18 days. Is your home next?', hashtags: '["#wollongong","#propertymarket","#marketinsight","#realestate"]', imageUrls: '[]', canvaDesignId: null, status: 'scheduled', scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(), publishedAt: null, campaignType: 'market_report', impressions: 0, reach: 0, clicks: 0, engagement: 0, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString(), property: null },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  if (hasDatabase() && prisma) {
    try {
      const posts = await prisma.socialPost.findMany({
        where: status ? { status } : {},
        orderBy: { createdAt: 'desc' },
        include: { property: { select: { address: true, suburb: true } } },
      })
      return NextResponse.json(posts)
    } catch { /* fall through */ }
  }

  const data = status ? DEMO_POSTS.filter(p => p.status === status) : DEMO_POSTS
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (hasDatabase() && prisma) {
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
    }

    const mock = { id: `demo_${Date.now()}`, authorId: DEMO_USER_ID, ...body, platforms: JSON.stringify(body.platforms || []), hashtags: JSON.stringify(body.hashtags || []), imageUrls: '[]', status: body.scheduledAt ? 'scheduled' : 'draft', impressions: 0, reach: 0, clicks: 0, engagement: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    return NextResponse.json(mock, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
