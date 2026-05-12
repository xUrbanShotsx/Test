import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/db'

// ─── Demo data (used when no DB is configured) ────────────────────────────────
const DEMO_CONTACTS = [
  { id: 'c1', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.mitchell@email.com', mobile: '0412 345 678', phone: null, type: 'vendor', suburb: 'Wollongong', postcode: '2500', source: 'appraisal', tags: '["hot","follow-up"]', notes: 'Wants to sell in spring. Has 4-bed home on hill.', rating: 5, isSubscribedEmail: true, isSubscribedSMS: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c2', firstName: 'James', lastName: 'Thornton', email: 'jthornton@outlook.com', mobile: '0421 987 654', phone: null, type: 'vendor', suburb: 'Fairy Meadow', postcode: '2519', source: 'referral', tags: '["warm"]', notes: 'Inherited property. Considering selling mid-year.', rating: 4, isSubscribedEmail: true, isSubscribedSMS: false, createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c3', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@gmail.com', mobile: '0435 111 222', phone: null, type: 'buyer', suburb: 'Figtree', postcode: '2525', source: 'portal', tags: '["buyer","active"]', notes: 'Looking for 3-bed, budget $850k-$1.1m.', rating: 4, isSubscribedEmail: true, isSubscribedSMS: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c4', firstName: 'David', lastName: 'Kowalski', email: 'd.kowalski@icloud.com', mobile: '0418 222 333', phone: '02 4200 0001', type: 'vendor', suburb: 'Corrimal', postcode: '2518', source: 'social', tags: '["cold"]', notes: 'Attended open home. Not ready to sell yet.', rating: 2, isSubscribedEmail: true, isSubscribedSMS: false, createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c5', firstName: 'Emma', lastName: 'Nguyen', email: 'emma.nguyen@email.com', mobile: '0444 555 666', phone: null, type: 'buyer', suburb: 'Thirroul', postcode: '2515', source: 'referral', tags: '["buyer","urgent"]', notes: 'Pre-approved $1.2m. Wants to buy before school year.', rating: 5, isSubscribedEmail: true, isSubscribedSMS: true, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c6', firstName: 'Tom', lastName: 'Blackwood', email: 'tblackwood@work.com', mobile: '0450 777 888', phone: null, type: 'vendor', suburb: 'North Wollongong', postcode: '2500', source: 'walk-in', tags: '["warm","appraisal"]', notes: 'Downsizing after kids left home. 5-bed property.', rating: 3, isSubscribedEmail: false, isSubscribedSMS: true, createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c7', firstName: 'Zoe', lastName: 'Patel', email: 'zoe.patel@email.com.au', mobile: '0411 000 111', phone: null, type: 'buyer', suburb: 'Wollongong', postcode: '2500', source: 'portal', tags: '["buyer"]', notes: 'First home buyer. Budget $650k.', rating: 3, isSubscribedEmail: true, isSubscribedSMS: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c8', firstName: 'Mark', lastName: 'Henderson', email: 'mark.henderson@email.com', mobile: '0422 333 444', phone: null, type: 'vendor', suburb: 'Gwynneville', postcode: '2500', source: 'appraisal', tags: '["hot","ready"]', notes: 'Signed agency agreement. Ready to list immediately.', rating: 5, isSubscribedEmail: true, isSubscribedSMS: true, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const search = searchParams.get('search')?.toLowerCase()
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  // ── Try real database first ──────────────────────────────────────────────
  if (hasDatabase() && prisma) {
    try {
      const where: Record<string, unknown> = {}
      if (type) where.type = type
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { suburb: { contains: search, mode: 'insensitive' } },
        ]
      }
      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({ where, orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }], skip: (page - 1) * limit, take: limit }),
        prisma.contact.count({ where }),
      ])
      return NextResponse.json({ contacts, total, page, pages: Math.ceil(total / limit) })
    } catch { /* fall through to mock data */ }
  }

  // ── Demo fallback ────────────────────────────────────────────────────────
  let data = DEMO_CONTACTS
  if (type) data = data.filter(c => c.type === type)
  if (search) data = data.filter(c =>
    c.firstName.toLowerCase().includes(search) ||
    c.lastName.toLowerCase().includes(search) ||
    (c.email ?? '').toLowerCase().includes(search) ||
    (c.suburb ?? '').toLowerCase().includes(search)
  )
  const total = data.length
  const contacts = data.slice((page - 1) * limit, page * limit)
  return NextResponse.json({ contacts, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (hasDatabase() && prisma) {
      if (Array.isArray(body)) {
        const created = await prisma.$transaction(
          body.map((c: Record<string, unknown>) =>
            prisma!.contact.create({
              data: {
                firstName: String(c.firstName || ''),
                lastName: String(c.lastName || ''),
                email: c.email ? String(c.email) : null,
                mobile: c.mobile ? String(c.mobile) : null,
                phone: c.phone ? String(c.phone) : null,
                type: String(c.type || 'buyer'),
                suburb: c.suburb ? String(c.suburb) : null,
                postcode: c.postcode ? String(c.postcode) : null,
                source: 'import',
                tags: JSON.stringify(c.tags || []),
              },
            })
          )
        )
        return NextResponse.json({ created: created.length }, { status: 201 })
      }

      const contact = await prisma.contact.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email || null,
          mobile: body.mobile || null,
          phone: body.phone || null,
          type: body.type || 'buyer',
          suburb: body.suburb || null,
          postcode: body.postcode || null,
          source: body.source || 'manual',
          tags: JSON.stringify(body.tags || []),
          notes: body.notes || null,
        },
      })
      return NextResponse.json(contact, { status: 201 })
    }

    // Demo mode — echo back with generated id
    const mock = {
      id: `demo_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return NextResponse.json(mock, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
