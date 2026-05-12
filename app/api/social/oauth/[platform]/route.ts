/**
 * GET /api/social/oauth/[platform]
 * Generates the OAuth redirect URL for the given platform and redirects the browser.
 * Supported: facebook, instagram, linkedin
 *
 * Facebook/Instagram share the same Meta OAuth flow — we request both pages + IG scopes.
 * Instagram account discovery happens in the callback via the Graph API.
 */
import { NextRequest, NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params

  switch (platform) {
    case 'facebook':
    case 'instagram': {
      const appId = process.env.META_APP_ID
      if (!appId) {
        return NextResponse.json(
          { error: 'META_APP_ID is not configured. Add it to your .env file.' },
          { status: 500 }
        )
      }

      // We request scopes for both Facebook Pages AND Instagram publishing
      // The user chooses which pages/IG accounts to grant during the Meta auth dialog
      const scope = [
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_posts',
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_insights',
        'business_management',
      ].join(',')

      const callbackUrl = `${BASE}/api/social/callback/facebook`
      const url = new URL('https://www.facebook.com/v19.0/dialog/oauth')
      url.searchParams.set('client_id', appId)
      url.searchParams.set('redirect_uri', callbackUrl)
      url.searchParams.set('scope', scope)
      url.searchParams.set('response_type', 'code')
      // State encodes which UI button was clicked, used post-callback for redirect
      url.searchParams.set('state', platform)

      return NextResponse.redirect(url.toString())
    }

    case 'linkedin': {
      const clientId = process.env.LINKEDIN_CLIENT_ID
      if (!clientId) {
        return NextResponse.json(
          { error: 'LINKEDIN_CLIENT_ID is not configured. Add it to your .env file.' },
          { status: 500 }
        )
      }

      const callbackUrl = `${BASE}/api/social/callback/linkedin`
      const url = new URL('https://www.linkedin.com/oauth/v2/authorization')
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('client_id', clientId)
      url.searchParams.set('redirect_uri', callbackUrl)
      url.searchParams.set('scope', 'openid profile w_member_social r_organization_social w_organization_social')
      url.searchParams.set('state', 'linkedin_connect')

      return NextResponse.redirect(url.toString())
    }

    default:
      return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 })
  }
}
