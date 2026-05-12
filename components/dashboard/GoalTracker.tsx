'use client'

const GOALS = [
  { label: 'Listings this month',    current: 9,  target: 12, unit: '' },
  { label: 'Appraisals booked',      current: 16, target: 20, unit: '' },
  { label: 'Vendor leads generated', current: 68, target: 80, unit: '' },
  { label: 'Email open rate',        current: 41, target: 35, unit: '%', achieved: true },
]

export default function GoalTracker() {
  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Eyebrow + title */}
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10, fontWeight: 400,
          color: 'var(--mute)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 5,
        }}>Monthly Goals</div>
        <div style={{ fontSize: 13, color: 'var(--body-text)', fontFamily: 'var(--font-display)' }}>
          Progress toward targets
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {GOALS.map(g => {
          const pct = Math.min((g.current / g.target) * 100, 100)
          const done = g.achieved || g.current >= g.target
          return (
            <div key={g.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: 'var(--body-text)', fontFamily: 'var(--font-display)' }}>{g.label}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10, fontWeight: 400,
                  color: done ? 'var(--ink)' : 'var(--mute)',
                  letterSpacing: '0.06em',
                }}>
                  {g.current}{g.unit} / {g.target}{g.unit}
                  {done && <span style={{ marginLeft: 6 }}>✓</span>}
                </span>
              </div>
              {/* Hairline progress bar */}
              <div style={{ height: 2, background: 'var(--hairline)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 99,
                  background: done ? 'var(--ink)' : 'rgba(255,255,255,0.35)',
                  transition: 'width 0.4s',
                }} />
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9, color: 'var(--fg4)',
                letterSpacing: '0.08em',
                marginTop: 5,
              }}>
                {done
                  ? 'TARGET REACHED'
                  : `${g.target - g.current}${g.unit} TO GO · ${Math.round(pct)}%`
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
