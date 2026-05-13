'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    setLoading(true)
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 700))

    // Set auth cookie (1-day expiry)
    document.cookie = 'propulse_auth=1; path=/; max-age=86400; SameSite=Lax'

    // Store agent name from email prefix for welcome context
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    localStorage.setItem('propulse_agent_email', email)
    localStorage.setItem('propulse_agent_display', name)

    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--canvas)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'var(--font-display)',
    }}>
      {/* Ambient glow — subtle, not distracting */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)',
      }} />

      <div style={{
        width: '100%', maxWidth: 380,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44, height: 44,
            borderRadius: 12,
            border: '1px solid var(--hairline)',
            background: 'var(--canvas-card)',
            marginBottom: 16,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>

          <div style={{
            fontSize: 20,
            fontWeight: 400,
            color: 'var(--ink)',
            letterSpacing: '-0.03em',
            marginBottom: 6,
          }}>
            Propulse
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--mute)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}>
            Real Estate Marketing Platform
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--canvas-card)',
          border: '1px solid var(--hairline)',
          borderRadius: 12,
          padding: '28px 28px 24px',
        }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 4 }}>
              Sign in to your account
            </div>
            <div style={{ fontSize: 12, color: 'var(--mute)' }}>
              Enter your agency credentials to continue
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--mute)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 7,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@agency.com.au"
                autoComplete="email"
                required
                className="input"
                style={{ fontSize: 14 }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--mute)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 7,
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="input"
                style={{ fontSize: 14 }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '9px 13px',
                borderRadius: 8,
                border: '1px solid var(--hairline)',
                background: 'rgba(255,255,255,0.03)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--mute)',
                letterSpacing: '0.04em',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 4, fontSize: 14, padding: '11px 0' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--hairline)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--fg4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>Demo</div>
            <div style={{ width: 1, height: 10, background: 'var(--hairline)' }} />
            <div style={{ fontSize: 11, color: 'var(--mute)' }}>
              Any email · any password (min 4 chars)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--fg4)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Powered by Claude · Anthropic
          </div>
        </div>
      </div>
    </div>
  )
}
