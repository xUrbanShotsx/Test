/**
 * POST /api/social/disconnect
 * Body: { platform: 'facebook' | 'instagram' | 'linkedin' }
 * Removes the stored token for the platform.
 */
import { NextRequest, NextResponse } from 'next/server'
import { removeToken, type Platform } from '@/lib/socialTokens'

export async function POST(req: NextRequest) {
  const { platform } = await req.json() as { platform: Platform }
  if (!platform) return NextResponse.json({ error: 'platform required' }, { status: 400 })
  removeToken(platform)
  return NextResponse.json({ ok: true, platform })
}
