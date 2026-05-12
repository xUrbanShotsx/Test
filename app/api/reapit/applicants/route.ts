/**
 * GET /api/reapit/applicants?page=1&pageSize=100&isActive=true
 * Proxies the Reapit /applicants endpoint (buyers/renters = leads) mapped to our schema.
 */
import { NextRequest, NextResponse } from 'next/server'
import { reapitAPI, mapReapitApplicant } from '@/lib/reapit'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const isActiveParam = sp.get('isActive')

    const data = await reapitAPI.getApplicants({
      pageSize: Number(sp.get('pageSize') ?? 100),
      pageNumber: Number(sp.get('page') ?? 1),
      isActive: isActiveParam !== null ? isActiveParam === 'true' : undefined,
      embed: 'contacts',
    })

    return NextResponse.json({
      applicants: data._embedded.map(mapReapitApplicant),
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
