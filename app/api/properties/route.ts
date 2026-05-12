import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DEMO_USER_ID } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const suburb = searchParams.get('suburb')

    const properties = await prisma.property.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(suburb ? { suburb: { contains: suburb } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { leads: { select: { id: true } } },
    })

    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
