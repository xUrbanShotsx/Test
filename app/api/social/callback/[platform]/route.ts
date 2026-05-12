/**
 * GET /api/social/callback/[platform]
 * OAuth callback handler for all social platforms.
 *
 * Facebook callback also discovers the linked Instagram Business Account.
 * After storing the token, redirects back to /dashboard/social?connected=[platform]
 */
import { NextRequest, NextResponse } from 'next/server'
import { setToken, type Platform } from '@/lib/socialTokens'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params
  const sp = req.nextUrl.searchParams
  const code = sp.get('code')
  const error = sp.get('error')

  const redirectBase = `${BASE}/dashboard/social`

  if (error || !code) {
    const desc = sp.get('error_description') ?? 'Access denied'
    return NextResponse.redirect(`${redirectBase}?error=${encodeURIComponent(desc)}`)
  }

  try {
    if (platform === 'facebook') {
      return await handleFacebook(code, redirectBase, sp.get('state') ?? 'facebook')
    }
    if (platform === 'linkedin') {
      return await handleLinkedIn(code, redirectBase)
    }
    return NextResponse.redirect(`${redirectBase}?error=Unknown+platform`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'OAuth error'
    return NextResponse.redirect(`${redirectBase}?error=${encodeURIComponent(msg)}`)
  }
}

// ─── Facebook / Instagram ─────────────────────────────────────────────────────

async function handleFacebook(code: string, redirectBase: string, state: string) {
  const appId = process.env.META_APP_ID!
  const appSecret = process.env.META_APP_SECRET!
  const callbackUrl = `${BASE}/api/social/callback/facebook`

  // Step 1: Exchange code for user access token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUrl)}&` +
    `client_secret=${appSecret}&code=${code}`
  )
  if (!tokenRes.ok) throw new Error('Failed to exchange Facebook code for token')
  const tokenData = await tokenRes.json()
  const userToken: string = tokenData.access_token

  // Step 2: Get long-lived user token
  const llRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${userToken}`
  )
  const llData = await llRes.json()
  const longLivedToken: string = llData.access_token ?? userToken
  const expiresIn: number = llData.expires_in ?? 5184000 // 60 days default

  // Step 3: Get Facebook Pages the user manages
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedToken}&fields=id,name,access_token,followers_count`
  )
  const pagesData = await pagesRes.json()
  const page = pagesData.data?.[0] // Use first page

  // Step 4: Store Facebook account
  setToken('facebook', {
    platform: 'facebook',
    accessToken: longLivedToken,
    expiresAt: Date.now() + expiresIn * 1000,
    pageId: page?.id,
    pageAccessToken: page?.access_token,
    accountName: page?.name ?? 'Facebook Page',
    followers: page?.followers_count ?? 0,
    connectedAt: new Date().toISOString(),
  })

  // Step 5: Discover linked Instagram Business Account
  if (page?.id && page?.access_token) {
    try {
      const igRes = await fetch(
        `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      )
      const igData = await igRes.json()
      const igId: string | undefined = igData.instagram_business_account?.id

      if (igId) {
        // Get IG account details
        const igInfoRes = await fetch(
          `https://graph.facebook.com/v19.0/${igId}?fields=name,username,followers_count,profile_picture_url&access_token=${page.access_token}`
        )
        const igInfo = await igInfoRes.json()

        setToken('instagram', {
          platform: 'instagram',
          accessToken: page.access_token,
          expiresAt: Date.now() + expiresIn * 1000,
          instagramAccountId: igId,
          pageId: page.id,
          pageAccessToken: page.access_token,
          accountName: igInfo.name ?? 'Instagram Account',
          accountHandle: igInfo.username ? `@${igInfo.username}` : undefined,
          avatarUrl: igInfo.profile_picture_url,
          followers: igInfo.followers_count ?? 0,
          connectedAt: new Date().toISOString(),
        })
      }
    } catch {
      // IG discovery is optional — continue
    }
  }

  // Redirect back, showing which platform(s) connected
  const connected = state === 'instagram' ? 'instagram' : 'facebook'
  return NextResponse.redirect(`${redirectBase}?connected=${connected}&tab=Accounts`)
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

async function handleLinkedIn(code: string, redirectBase: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID!
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!
  const callbackUrl = `${BASE}/api/social/callback/linkedin`

  // Step 1: Exchange code for token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: callbackUrl,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })
  if (!tokenRes.ok) throw new Error('Failed to exchange LinkedIn code for token')
  const tokenData = await tokenRes.json()
  const accessToken: string = tokenData.access_token
  const expiresIn: number = tokenData.expires_in ?? 5184000

  // Step 2: Get profile info via OpenID userinfo endpoint
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const profile = await profileRes.json()

  setToken('linkedin', {
    platform: 'linkedin',
    accessToken,
    expiresAt: Date.now() + expiresIn * 1000,
    accountName: profile.name ?? (`${profile.given_name ?? ''} ${profile.family_name ?? ''}`.trim() || 'LinkedIn Account'),
    accountHandle: profile.email,
    avatarUrl: profile.picture,
    connectedAt: new Date().toISOString(),
  })

  return NextResponse.redirect(`${redirectBase}?connected=linkedin&tab=Accounts`)
}
