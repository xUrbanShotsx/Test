/**
 * POST /api/social/publish
 * Publishes a post to one or more connected social platforms.
 *
 * Body:
 *   platforms: ('facebook' | 'instagram' | 'linkedin')[]
 *   message: string       — the post text
 *   imageUrl?: string     — public image URL (required for Instagram)
 *   scheduleAt?: string   — ISO date, optional (not yet fully implemented)
 *
 * Returns per-platform results.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getToken, type Platform } from '@/lib/socialTokens'

interface PublishBody {
  platforms: Platform[]
  message: string
  imageUrl?: string
  scheduleAt?: string
}

export async function POST(req: NextRequest) {
  const body: PublishBody = await req.json()
  const { platforms, message, imageUrl } = body

  if (!platforms?.length || !message) {
    return NextResponse.json({ error: 'platforms and message are required' }, { status: 400 })
  }

  const results: Record<string, { ok: boolean; postId?: string; error?: string }> = {}

  for (const platform of platforms) {
    const token = getToken(platform)
    if (!token) {
      results[platform] = { ok: false, error: 'Account not connected' }
      continue
    }

    try {
      switch (platform) {
        case 'facebook':
          results.facebook = await publishToFacebook(token.pageId!, token.pageAccessToken!, message, imageUrl)
          break
        case 'instagram':
          results.instagram = await publishToInstagram(token.instagramAccountId!, token.pageAccessToken!, message, imageUrl)
          break
        case 'linkedin':
          results.linkedin = await publishToLinkedIn(token.accessToken, message, imageUrl)
          break
      }
    } catch (err) {
      results[platform] = { ok: false, error: err instanceof Error ? err.message : 'Publish failed' }
    }
  }

  const allOk = Object.values(results).every(r => r.ok)
  return NextResponse.json({ ok: allOk, results }, { status: allOk ? 200 : 207 })
}

// ─── Facebook ─────────────────────────────────────────────────────────────────

async function publishToFacebook(pageId: string, pageToken: string, message: string, imageUrl?: string) {
  let endpoint: string
  let body: Record<string, string>

  if (imageUrl) {
    endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`
    body = { message, url: imageUrl, access_token: pageToken }
  } else {
    endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`
    body = { message, access_token: pageToken }
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `Facebook API error ${res.status}`)
  }
  return { ok: true, postId: data.id ?? data.post_id }
}

// ─── Instagram ────────────────────────────────────────────────────────────────

async function publishToInstagram(igAccountId: string, pageToken: string, caption: string, imageUrl?: string) {
  if (!imageUrl) {
    throw new Error('Instagram requires an image URL to publish a post')
  }

  // Step 1: Create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${igAccountId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: pageToken }),
    }
  )
  const container = await containerRes.json()
  if (!containerRes.ok || container.error) {
    throw new Error(container.error?.message ?? 'Failed to create Instagram media container')
  }

  // Step 2: Publish the container
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: pageToken }),
    }
  )
  const publishData = await publishRes.json()
  if (!publishRes.ok || publishData.error) {
    throw new Error(publishData.error?.message ?? 'Failed to publish Instagram post')
  }

  return { ok: true, postId: publishData.id }
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

async function publishToLinkedIn(accessToken: string, text: string, imageUrl?: string) {
  // Get the member's URN
  const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const me = await meRes.json()
  const authorUrn = `urn:li:person:${me.sub}`

  // Build UGC Post payload
  interface ShareContent {
    shareCommentary: { text: string }
    shareMediaCategory: string
    media?: Array<{
      status: string
      description: { text: string }
      originalUrl: string
      title: { text: string }
    }>
  }

  const shareContent: ShareContent = {
    shareCommentary: { text },
    shareMediaCategory: imageUrl ? 'ARTICLE' : 'NONE',
  }

  if (imageUrl) {
    shareContent.media = [{
      status: 'READY',
      description: { text },
      originalUrl: imageUrl,
      title: { text: text.slice(0, 100) },
    }]
  }

  const payload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': shareContent,
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(payload),
  })

  if (!postRes.ok) {
    const err = await postRes.text()
    throw new Error(`LinkedIn API error ${postRes.status}: ${err}`)
  }

  const postId = postRes.headers.get('x-restli-id') ?? 'unknown'
  return { ok: true, postId }
}
