/**
 * POST /api/reapit/test
 * Tests Reapit credentials by performing a live token + API call.
 * Accepts { clientId, clientSecret, customerId } in the request body
 * and temporarily overrides env vars for the test.
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { clientId, clientSecret } = await req.json() as {
      clientId: string
      clientSecret: string
      customerId?: string
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json({ ok: false, error: 'Client ID and Secret are required' }, { status: 400 })
    }

    // Step 1: Get token
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const tokenRes = await fetch('https://connect.reapit.cloud/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId }),
    })

    if (!tokenRes.ok) {
      const body = await tokenRes.text()
      return NextResponse.json({
        ok: false,
        error: `Authentication failed (${tokenRes.status}) — check your Client ID and Secret`,
        detail: body,
      }, { status: 401 })
    }

    const tokenData = await tokenRes.json()
    const token = tokenData.access_token

    // Step 2: Ping the /negotiators endpoint to verify API access
    const apiRes = await fetch('https://platform.reapit.cloud/negotiators?pageSize=1', {
      headers: {
        Authorization: `Bearer ${token}`,
        'api-version': '2020-01-31',
      },
    })

    if (!apiRes.ok) {
      return NextResponse.json({
        ok: false,
        error: `Connected but API access denied (${apiRes.status}) — check your app permissions`,
      }, { status: 403 })
    }

    const apiData = await apiRes.json()

    return NextResponse.json({
      ok: true,
      message: 'Successfully connected to Reapit Foundations',
      totalNegotiators: apiData.totalCount ?? 0,
    })
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Unexpected error',
    }, { status: 500 })
  }
}
