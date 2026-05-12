'use client'

import { useState } from 'react'

const INSIGHT = {
  headline: '3 vendor leads require follow-up today — your "What\'s Your Home Worth?" campaign is converting at 4.2%',
  bullets: [
    'Sarah Mitchell at 12 Ocean Ave opened your appraisal email 6× — she is ready to list',
    'Your Just Sold campaign in Thirroul generated 4 new vendor enquiries overnight',
    'SMS blast to Corrimal database: 31% response rate (industry avg 8%)',
    '2 appraisals booked this week, both from your suburb market report campaign',
  ],
  action: 'Call Sarah Mitchell now — highest intent vendor lead this month',
}

export default function AIInsightsBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="card"
      onClick={() => setOpen(v => !v)}
      style={{ padding: '16px 20px', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

        {/* AI pill badge */}
        <div style={{
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--hairline)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: '0.12em',
          color: 'var(--ink)',
          textTransform: 'uppercase',
          flexShrink: 0,
          alignSelf: 'center',
        }}>
          AI
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 400,
              color: 'var(--mute)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Daily Briefing
            </span>
            <span style={{ width: 1, height: 10, background: 'var(--hairline)', display: 'inline-block' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg4)',
              letterSpacing: '0.05em',
            }}>Updated just now</span>
          </div>

          {/* Headline */}
          <p style={{
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-display)',
          }}>
            {INSIGHT.headline}
          </p>

          {open && (
            <div className="fade-in">
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {INSIGHT.bullets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--hairline)', flexShrink: 0, fontSize: 14, marginTop: 1 }}>—</span>
                    <span style={{ fontSize: 13, color: 'var(--body-text)', lineHeight: 1.6 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Recommended action */}
              <div style={{
                marginTop: 16,
                padding: '10px 14px',
                background: 'var(--canvas-soft)',
                border: '1px solid var(--hairline)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Action</span>
                <span style={{ width: 1, height: 10, background: 'var(--hairline)', display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{INSIGHT.action}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chevron */}
        <div style={{
          fontSize: 12,
          color: 'var(--mute)',
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          alignSelf: 'center',
        }}>
          ↓
        </div>
      </div>
    </div>
  )
}
