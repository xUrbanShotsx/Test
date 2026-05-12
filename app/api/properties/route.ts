import { NextResponse } from 'next/server'
import { prisma, hasDatabase } from '@/lib/db'

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-001'

const DEMO_PROPERTIES = [
  { id: 'p1', agentId: DEMO_USER_ID, status: 'active', listingType: 'sale', propertyClass: 'residential', address: '12 Ocean Avenue', suburb: 'Wollongong', state: 'NSW', postcode: '2500', bedrooms: 4, bathrooms: 2, carSpaces: 2, landArea: 620, buildingArea: 248, price: 1450000, displayPrice: '$1,450,000', description: null, features: '["Ocean Views","Pool","Renovated Kitchen","Double Garage"]', images: '[]', inspections: '[]', listedDate: new Date(Date.now() - 18 * 86400000).toISOString(), soldDate: null, soldPrice: null, marketingBrief: null, createdAt: new Date(Date.now() - 18 * 86400000).toISOString(), updatedAt: new Date().toISOString(), leads: [{ id: 'l1' }, { id: 'l2' }, { id: 'l3' }] },
  { id: 'p2', agentId: DEMO_USER_ID, status: 'under-offer', listingType: 'sale', propertyClass: 'residential', address: '7 Cliff Road', suburb: 'Thirroul', state: 'NSW', postcode: '2515', bedrooms: 3, bathrooms: 2, carSpaces: 1, landArea: 450, buildingArea: 180, price: 1150000, displayPrice: 'Offers Over $1.1m', description: null, features: '["Hinterland Views","Deck","Updated Bathrooms"]', images: '[]', inspections: '[]', listedDate: new Date(Date.now() - 30 * 86400000).toISOString(), soldDate: null, soldPrice: null, marketingBrief: null, createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), updatedAt: new Date().toISOString(), leads: [{ id: 'l4' }, { id: 'l5' }] },
  { id: 'p3', agentId: DEMO_USER_ID, status: 'sold', listingType: 'sale', propertyClass: 'residential', address: '3 Fairy Street', suburb: 'Fairy Meadow', state: 'NSW', postcode: '2519', bedrooms: 5, bathrooms: 3, carSpaces: 2, landArea: 820, buildingArea: 380, price: 1875000, displayPrice: null, description: null, features: '["Dual Living","Pool","Study","Workshop"]', images: '[]', inspections: '[]', listedDate: new Date(Date.now() - 60 * 86400000).toISOString(), soldDate: new Date(Date.now() - 14 * 86400000).toISOString(), soldPrice: 1875000, marketingBrief: null, createdAt: new Date(Date.now() - 60 * 86400000).toISOString(), updatedAt: new Date().toISOString(), leads: [] },
  { id: 'p4', agentId: DEMO_USER_ID, status: 'active', listingType: 'sale', propertyClass: 'residential', address: '21 Corrimal Street', suburb: 'Corrimal', state: 'NSW', postcode: '2518', bedrooms: 3, bathrooms: 1, carSpaces: 1, landArea: 556, buildingArea: 132, price: 870000, displayPrice: '$870,000 - $920,000', description: null, features: '["Corner Block","Development Potential","Original Character"]', images: '[]', inspections: '[]', listedDate: new Date(Date.now() - 7 * 86400000).toISOString(), soldDate: null, soldPrice: null, marketingBrief: null, createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date().toISOString(), leads: [{ id: 'l6' }] },
  { id: 'p5', agentId: DEMO_USER_ID, status: 'draft', listingType: 'sale', propertyClass: 'residential', address: '55 Gipps Road', suburb: 'Gwynneville', state: 'NSW', postcode: '2500', bedrooms: 4, bathrooms: 2, carSpaces: 2, landArea: 730, buildingArea: 260, price: 1650000, displayPrice: null, description: null, features: '["City Views","New Kitchen","Entertainers Yard"]', images: '[]', inspections: '[]', listedDate: null, soldDate: null, soldPrice: null, marketingBrief: null, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date().toISOString(), leads: [] },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const suburb = searchParams.get('suburb')?.toLowerCase()

  if (hasDatabase() && prisma) {
    try {
      const where: Record<string, unknown> = {}
      if (status) where.status = status
      if (suburb) where.suburb = { contains: suburb, mode: 'insensitive' }

      const properties = await prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { leads: { select: { id: true } } },
      })
      return NextResponse.json(properties)
    } catch { /* fall through */ }
  }

  let data = DEMO_PROPERTIES
  if (status) data = data.filter(p => p.status === status)
  if (suburb) data = data.filter(p => p.suburb.toLowerCase().includes(suburb))
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (hasDatabase() && prisma) {
      const property = await prisma.property.create({
        data: {
          agentId: DEMO_USER_ID,
          address: body.address,
          suburb: body.suburb,
          state: body.state || 'NSW',
          postcode: body.postcode,
          bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
          bathrooms: body.bathrooms ? parseInt(body.bathrooms) : null,
          carSpaces: body.carSpaces ? parseInt(body.carSpaces) : null,
          landArea: body.landArea ? parseInt(body.landArea) : null,
          buildingArea: body.buildingArea ? parseInt(body.buildingArea) : null,
          price: body.price ? parseInt(body.price) : null,
          displayPrice: body.displayPrice || null,
          description: body.description || null,
          features: JSON.stringify(body.features || []),
          propertyClass: body.propertyClass || 'residential',
          listingType: body.listingType || 'sale',
          marketingBrief: body.marketingBrief || null,
          status: 'draft',
        },
      })
      return NextResponse.json(property, { status: 201 })
    }

    const mock = { id: `demo_${Date.now()}`, ...body, status: 'draft', leads: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    return NextResponse.json(mock, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
