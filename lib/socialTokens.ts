/**
 * In-memory social account token store.
 * In production: encrypt and persist these in your database per-user.
 * Survives hot-reload in dev (module singleton).
 */

export type Platform = 'facebook' | 'instagram' | 'linkedin'

export interface SocialToken {
  platform: Platform
  accessToken: string
  refreshToken?: string
  expiresAt: number | null      // Unix ms, null = long-lived
  pageId?: string               // Facebook Page ID
  pageAccessToken?: string      // Facebook Page-level token
  instagramAccountId?: string   // IG Business Account ID
  accountName: string           // Display name
  accountHandle?: string        // e.g. @handle
  avatarUrl?: string
  followers?: number
  connectedAt: string           // ISO date
}

// Module-level singleton — survives Next.js hot reload in dev
const g = global as typeof global & { _socialTokens?: Map<Platform, SocialToken> }
if (!g._socialTokens) g._socialTokens = new Map()
export const tokenStore = g._socialTokens

export function getToken(platform: Platform) {
  return tokenStore.get(platform) ?? null
}

export function setToken(platform: Platform, token: SocialToken) {
  tokenStore.set(platform, token)
}

export function removeToken(platform: Platform) {
  tokenStore.delete(platform)
}

export function isConnected(platform: Platform) {
  const t = tokenStore.get(platform)
  if (!t) return false
  if (t.expiresAt && Date.now() > t.expiresAt) return false
  return true
}

export function allAccounts(): SocialToken[] {
  return Array.from(tokenStore.values())
}
