'use client'

import { useState, useEffect } from 'react'

type Platform = 'facebook' | 'instagram' | 'linkedin'

interface AccountStatus {
  platform: Platform
  connected: boolean
  accountName: string | null
  accountHandle: string | null
  avatarUrl: string | null
  followers: number | null
  connectedAt: string | null
  expiresAt: number | null
}

const PLATFORM_META: Record<Platform, {
  label: string
  color: string
  icon: string
  desc: string
  docs: string
  setupSteps: string[]
}> = {
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: 'f',
    desc: 'Publish to your Facebook Business Page and reach local vendor leads.',
    docs: 'https://developers.facebook.com/apps',
    setupSteps: [
      'Go to developers.facebook.com and create an app',
      'Add "Facebook Login for Business" product',
      'Set callback URL to your domain + /api/social/callback/facebook',
      'Copy App ID + Secret to META_APP_ID / META_APP_SECRET in .env',
    ],
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    icon: '▣',
    desc: 'Publish photos and carousels to your Instagram Business account.',
    docs: 'https://developers.facebook.com/apps',
    setupSteps: [
      'Instagram uses the same Meta app as Facebook',
      'Enable instagram_content_publish scope in your Meta app',
      'Your Instagram account must be a Business account linked to a Facebook Page',
      'Connecting Facebook will auto-discover your linked Instagram account',
    ],
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: 'in',
    desc: 'Share market updates and listings with your professional network.',
    docs: 'https://www.linkedin.com/developers/apps',
    setupSteps: [
      'Go to linkedin.com/developers and create an app',
      'Request "Share on LinkedIn" and "Sign In with LinkedIn" products',
      'Add callback URL: your domain + /api/social/callback/linkedin',
      'Copy Client ID + Secret to LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET in .env',
    ],
  },
}

function PlatformIcon({ platform, size = 28 }: { platform: Platform; size?: number }) {
  const m = PLATFORM_META[platform]
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: 'var(--fg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 900,
      color: 'var(--bg)', letterSpacing: '-0.03em', flexShrink: 0,
    }}>
      {m.icon}
    </div>
  )
}

function SetupDrawer({ platform, onClose }: { platform: Platform; onClose: () => void }) {
  const m = PLATFORM_META[platform]
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div
        style={{
          width: '100%', maxWidth: 560, margin: '0 auto',
          background: 'var(--surface)', borderRadius: '14px 14px 0 0',
          padding: '28px 28px 36px', border: '1px solid var(--border)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <PlatformIcon platform={platform} size={36} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--fg)' }}>Connect {m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>One-time setup required</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg3)', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.6, marginBottom: 20 }}>
          {m.desc}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Setup Steps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {m.setupSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: 'var(--fg)',
                  color: 'var(--bg)', fontSize: 10, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={`/api/social/oauth/${platform}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 7,
              background: 'var(--fg)', color: 'var(--bg)',
              fontSize: 12, fontWeight: 800, textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            Connect {m.label} →
          </a>
          <a
            href={m.docs}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '10px 16px', borderRadius: 7,
              border: '1px solid var(--border)',
              color: 'var(--fg2)', fontSize: 12, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Developer Docs ↗
          </a>
        </div>

        <div style={{
          marginTop: 16, padding: '12px 14px', borderRadius: 7,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5,
        }}>
          <strong style={{ color: 'var(--fg2)' }}>Env variables needed:</strong>{' '}
          {platform === 'linkedin'
            ? 'LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET'
            : 'META_APP_ID, META_APP_SECRET'}
          {' '}+ NEXT_PUBLIC_BASE_URL in your .env file.
        </div>
      </div>
    </div>
  )
}

function AccountCard({
  account,
  onSetup,
  onDisconnect,
}: {
  account: AccountStatus
  onSetup: (p: Platform) => void
  onDisconnect: (p: Platform) => void
}) {
  const m = PLATFORM_META[account.platform]
  const [disconnecting, setDisconnecting] = useState(false)

  async function handleDisconnect() {
    setDisconnecting(true)
    await fetch('/api/social/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: account.platform }),
    })
    onDisconnect(account.platform)
    setDisconnecting(false)
  }

  const fmtDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const daysUntilExpiry = account.expiresAt
    ? Math.floor((account.expiresAt - Date.now()) / 86_400_000)
    : null

  return (
    <div style={{
      padding: 20,
      border: `1px solid ${account.connected ? 'var(--border)' : 'var(--border2)'}`,
      borderRadius: 10,
      background: account.connected ? 'var(--surface)' : 'var(--surface)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <PlatformIcon platform={account.platform} size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)' }}>{m.label}</span>
            {account.connected && (
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99,
                background: 'var(--fg)', color: 'var(--bg)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Connected</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>
            {account.connected
              ? (account.accountHandle ?? account.accountName ?? m.label)
              : m.desc}
          </div>
        </div>

        {/* Status dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: account.connected ? 'var(--fg)' : 'var(--surface3)',
          border: '1px solid var(--border)',
        }} />
      </div>

      {/* Connected stats */}
      {account.connected && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Account', value: account.accountName ?? '—' },
            { label: 'Followers', value: account.followers != null ? account.followers.toLocaleString() : '—' },
            { label: 'Connected', value: fmtDate(account.connectedAt) },
          ].map(s => (
            <div key={s.label} style={{
              padding: '10px 12px', borderRadius: 7,
              background: 'var(--surface2)', border: '1px solid var(--border2)',
            }}>
              <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Token expiry warning */}
      {account.connected && daysUntilExpiry !== null && daysUntilExpiry < 10 && (
        <div style={{
          padding: '9px 12px', borderRadius: 7,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          fontSize: 11, color: 'var(--fg2)',
        }}>
          ⚠ Token expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''} — reconnect to keep publishing.
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {account.connected ? (
          <>
            <a
              href={`/api/social/oauth/${account.platform}`}
              style={{
                fontSize: 12, padding: '7px 14px', borderRadius: 6,
                border: '1px solid var(--border)', color: 'var(--fg2)',
                textDecoration: 'none', fontWeight: 600, background: 'none',
              }}
            >
              Reconnect
            </a>
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="btn btn-ghost"
              style={{ fontSize: 12, color: 'var(--fg3)' }}
            >
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            style={{ fontSize: 12 }}
            onClick={() => onSetup(account.platform)}
          >
            Connect {m.label} →
          </button>
        )}
      </div>
    </div>
  )
}

export default function SocialAccounts({ connectedParam }: { connectedParam?: string | null }) {
  const [accounts, setAccounts] = useState<AccountStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [setupPlatform, setSetupPlatform] = useState<Platform | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/social/accounts')
      .then(r => r.json())
      .then(d => {
        setAccounts(d.accounts ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (connectedParam) {
      const p = connectedParam as Platform
      const m = PLATFORM_META[p]
      if (m) {
        setBanner({ type: 'success', msg: `${m.label} connected successfully!` })
        setTimeout(() => setBanner(null), 5000)
      }
    }
  }, [connectedParam])

  function handleDisconnect(platform: Platform) {
    setAccounts(prev => prev.map(a =>
      a.platform === platform ? { ...a, connected: false, accountName: null, accountHandle: null, followers: null, connectedAt: null, expiresAt: null } : a
    ))
  }

  const connectedCount = accounts.filter(a => a.connected).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      {banner && (
        <div style={{
          padding: '12px 16px', borderRadius: 8,
          background: banner.type === 'success' ? 'var(--fg)' : 'var(--surface2)',
          color: banner.type === 'success' ? 'var(--bg)' : 'var(--fg)',
          fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {banner.type === 'success' ? '✓' : '✕'} {banner.msg}
          <button onClick={() => setBanner(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>
            Connected Accounts
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg3)' }}>
            {loading
              ? 'Loading…'
              : connectedCount === 0
                ? 'No accounts connected — click a platform below to get started.'
                : `${connectedCount} of 3 platform${connectedCount !== 1 ? 's' : ''} connected`}
          </div>
        </div>

        {connectedCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--surface2)', border: '1px solid var(--border)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>
              {connectedCount} Active
            </span>
          </div>
        )}
      </div>

      {/* Platform cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 10 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {accounts.map(account => (
            <AccountCard
              key={account.platform}
              account={account}
              onSetup={setSetupPlatform}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}

      {/* How it works */}
      <div style={{
        padding: 20, borderRadius: 10,
        border: '1px solid var(--border2)', background: 'var(--surface)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--fg)', marginBottom: 14 }}>How publishing works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { n: '01', title: 'Connect accounts', body: 'Link your Facebook Page, Instagram Business account, and LinkedIn profile above.' },
            { n: '02', title: 'Compose with AI', body: 'Go to Compose, generate platform-specific captions with one click.' },
            { n: '03', title: 'Select platforms', body: 'Choose which connected accounts to publish to — post everywhere or just one.' },
            { n: '04', title: 'Post or schedule', body: 'Publish immediately or pick a date and time. Scheduled posts appear in the calendar.' },
          ].map(s => (
            <div key={s.n}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--fg4)', letterSpacing: '0.08em', marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer setup note */}
      <div style={{
        padding: '14px 16px', borderRadius: 8,
        border: '1px solid var(--border2)', background: 'var(--surface)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Developer Setup
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.7 }}>
          Add these to your <code style={{ fontFamily: 'monospace', background: 'var(--surface2)', padding: '1px 5px', borderRadius: 3 }}>.env</code> file, then restart the dev server:
        </div>
        <pre style={{
          marginTop: 10, padding: '12px 14px', borderRadius: 7,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          fontFamily: 'monospace', fontSize: 11, color: 'var(--fg2)',
          lineHeight: 1.8, overflowX: 'auto',
        }}>
{`META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"`}
        </pre>
        <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--fg)', fontWeight: 700, textDecoration: 'underline' }}>Meta Developer Console ↗</a>
          <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--fg)', fontWeight: 700, textDecoration: 'underline' }}>LinkedIn Developer Portal ↗</a>
        </div>
      </div>

      {/* Setup drawer */}
      {setupPlatform && (
        <SetupDrawer platform={setupPlatform} onClose={() => setSetupPlatform(null)} />
      )}
    </div>
  )
}
