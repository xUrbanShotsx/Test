import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (type) where.type = type
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { suburb: { contains: search } },
      ]
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ])

    return NextResponse.json({ contacts, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Bulk import
    if (Array.isArray(body)) {
      const created = await prisma.$transaction(
        body.map((c: any) =>
          prisma.contact.upsert({
            where: { id: c.email || `import-${Date.now()}-${Math.random()}` },
            update: {},
            create: {
              firstName: c.firstName || '',
              lastName: c.lastName || '',
              email: c.email || null,
              mobile: c.mobile || null,
              phone: c.phone || null,
              type: c.type || 'buyer',
              suburb: c.suburb || null,
              postcode: c.postcode || null,
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
