/**
 * GET /api/reapit/properties?page=1&pageSize=50&marketingMode=selling&status=forSale
 * Proxies the Reapit /properties endpoint and maps results to our schema.
 */
import { NextRequest, NextResponse } from 'next/server'
import { reapitAPI, mapReapitProperty } from '@/lib/reapit'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const data = await reapitAPI.getProperties({
      pageSize: Number(sp.get('pageSize') ?? 50),
      pageNumber: Number(sp.get('page') ?? 1),
      marketingMode: sp.get('marketingMode') ?? 'selling',
      status: sp.get('status') ?? undefined,
      address: sp.get('address') ?? undefined,
      negotiatorId: sp.get('negotiatorId') ?? undefined,
    })

    return NextResponse.json({
      properties: data._embedded.map(mapReapitProperty),
      total: data.totalCount,
      page: data.pageNumber,
      totalPages: data.totalPageCount,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('401') || message.includes('403') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
