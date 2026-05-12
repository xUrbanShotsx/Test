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
      style={{
        padding: '16px 20px',
        borderColor: 'var(--surface3)',
        cursor: 'pointer',
        background: 'var(--surface)',
      }}
      onClick={() => setOpen(v => !v)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* AI badge */}
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'var(--fg)', color: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, flexShrink: 0, fontWeight: 800,
        }}>AI</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Daily AI Briefing
            </span>
            <span style={{ fontSize: 10, color: 'var(--fg4)' }}>·</span>
            <span style={{ fontSize: 10, color: 'var(--fg4)' }}>Updated just now</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', lineHeight: 1.5 }}>
            {INSIGHT.headline}
          </p>

          {open && (
            <div className="fade-in">
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {INSIGHT.bullets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--fg3)', marginTop: 2, flexShrink: 0, fontSize: 12 }}>—</span>
                    <span style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 14, padding: '10px 12px',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 12 }}>→</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{INSIGHT.action}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ fontSize: 14, color: 'var(--fg3)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ↓
        </div>
      </div>
    </div>
  )
}
