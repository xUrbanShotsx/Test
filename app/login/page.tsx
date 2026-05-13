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
    await new Promise(r => setTimeout(r, 700))

    document.cookie = 'propulse_auth=1; path=/; max-age=86400; SameSite=Lax'

    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    localStorage.setItem('propulse_agent_email', email)
    localStorage.setItem('propulse_agent_display', name)

    router.push('/dashboard')
  }

  return (
    <>
      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-40px) scale(1.12); }
          66%      { transform: translate(-30px,50px) scale(0.92); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-70px,50px) scale(1.08); }
          66%      { transform: translate(40px,-60px) scale(0.95); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(50px,30px) scale(1.15); }
        }
        @keyframes orb4 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(-40px,-50px) scale(1.1); }
          80%      { transform: translate(30px,40px) scale(0.9); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes gridPulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.7; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#050507',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'var(--font-display)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ── Neon orbs ── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>

          {/* Cyan — top-left */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: 600, height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.22) 0%, rgba(0,200,255,0.08) 45%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'orb1 18s ease-in-out infinite',
          }} />

          {/* Violet/purple — bottom-right */}
          <div style={{
            position: 'absolute', bottom: '-15%', right: '-10%',
            width: 700, height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.1) 45%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'orb2 22s ease-in-out infinite',
          }} />

          {/* Hot pink — top-right */}
          <div style={{
            position: 'absolute', top: '5%', right: '5%',
            width: 420, height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0.06) 50%, transparent 70%)',
            filter: 'blur(36px)',
            animation: 'orb3 15s ease-in-out infinite',
          }} />

          {/* Lime green — bottom-left */}
          <div style={{
            position: 'absolute', bottom: '10%', left: '2%',
            width: 380, height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(57,255,20,0.14) 0%, rgba(57,255,20,0.04) 50%, transparent 70%)',
            filter: 'blur(44px)',
            animation: 'orb4 20s ease-in-out infinite',
          }} />

          {/* Centre glow — warm white core */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }} />

          {/* ── Dot grid ── */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            animation: 'gridPulse 6s ease-in-out infinite',
          }} />

          {/* ── Scanline sweep ── */}
          <div style={{
            position: 'absolute', left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.25), rgba(139,92,246,0.25), transparent)',
            animation: 'scanline 8s linear infinite',
            opacity: 0.6,
          }} />

          {/* ── Edge vignette — keeps centre readable ── */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,7,0.75) 100%)',
          }} />
        </div>

        {/* ── Login card ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 380,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>

          {/* Wordmark */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48, height: 48,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              marginBottom: 16,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 24px rgba(0,240,255,0.15), 0 0 48px rgba(139,92,246,0.1)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>

            <div style={{
              fontSize: 22,
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: 6,
            }}>
              Innovate.ai
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
            }}>
              Real Estate Marketing Platform
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(18,18,22,0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: '28px 28px 24px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 4 }}>
                Sign in to your account
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
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
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 7,
                }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@agency.com.au"
                  autoComplete="email"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontSize: 14,
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(0,240,255,0.45)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,240,255,0.08)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 7,
                }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontSize: 14,
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(139,92,246,0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '9px 13px',
                  borderRadius: 8,
                  border: '1px solid rgba(236,72,153,0.3)',
                  background: 'rgba(236,72,153,0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'rgba(236,72,153,0.9)',
                  letterSpacing: '0.04em',
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '11px 0',
                  borderRadius: 9999,
                  border: 'none',
                  fontSize: 14,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.9) 0%, rgba(139,92,246,0.9) 50%, rgba(236,72,153,0.9) 100%)',
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.15s, filter 0.15s',
                  filter: loading ? 'none' : 'brightness(1)',
                  boxShadow: '0 0 24px rgba(0,240,255,0.2), 0 0 48px rgba(139,92,246,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)' }}
              >
                {loading ? (
                  <>
                    <span className="dot" style={{ background: '#fff' }} />
                    <span className="dot" style={{ background: '#fff' }} />
                    <span className="dot" style={{ background: '#fff' }} />
                  </>
                ) : 'Sign In →'}
              </button>
            </form>

            {/* Demo hint */}
            <div style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>Demo</div>
              <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                Any email · any password (min 4 chars)
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>
              Powered by jyesanjurjo
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
