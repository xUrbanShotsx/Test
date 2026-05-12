/**
 * GET /api/reapit/contacts?page=1&pageSize=50&name=&email=
 * Proxies the Reapit /contacts endpoint and maps results to our schema.
 */
import { NextRequest, NextResponse } from 'next/server'
import { reapitAPI, mapReapitContact } from '@/lib/reapit'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const data = await reapitAPI.getContacts({
      pageSize: Number(sp.get('pageSize') ?? 50),
      pageNumber: Number(sp.get('page') ?? 1),
      name: sp.get('name') ?? undefined,
      email: sp.get('email') ?? undefined,
    })

    return NextResponse.json({
      contacts: data._embedded.map(mapReapitContact),
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
