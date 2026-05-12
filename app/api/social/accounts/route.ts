/**
 * GET /api/social/accounts
 * Returns the current connection status for all three platforms.
 */
import { NextResponse } from 'next/server'
import { allAccounts, isConnected, type Platform } from '@/lib/socialTokens'

const PLATFORMS: Platform[] = ['facebook', 'instagram', 'linkedin']

export async function GET() {
  const accounts = PLATFORMS.map(p => {
    const connected = isConnected(p)
    const token = connected ? allAccounts().find(a => a.platform === p) : null

    return {
      platform: p,
      connected,
      accountName: token?.accountName ?? null,
      accountHandle: token?.accountHandle ?? null,
      avatarUrl: token?.avatarUrl ?? null,
      followers: token?.followers ?? null,
      connectedAt: token?.connectedAt ?? null,
      expiresAt: token?.expiresAt ?? null,
    }
  })

  return NextResponse.json({ accounts })
}
