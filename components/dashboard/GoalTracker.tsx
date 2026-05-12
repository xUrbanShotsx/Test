'use client'

const GOALS = [
  { label: 'Listings this month', current: 9, target: 12, unit: '' },
  { label: 'Appraisals booked', current: 16, target: 20, unit: '' },
  { label: 'Vendor leads generated', current: 68, target: 80, unit: '' },
  { label: 'Email open rate', current: 41, target: 35, unit: '%', inverted: false, achieved: true },
]

export default function GoalTracker() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Monthly Goals</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>Progress toward this month's targets</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {GOALS.map(g => {
          const pct = Math.min((g.current / g.target) * 100, 100)
          const done = g.achieved || g.current >= g.target
          return (
            <div key={g.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--fg2)' }}>{g.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: done ? 'var(--fg)' : 'var(--fg3)' }}>
                  {g.current}{g.unit} / {g.target}{g.unit}
                  {done && <span style={{ marginLeft: 5, fontSize: 10 }}>✓</span>}
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: 99,
                  background: done ? 'var(--fg)' : `rgba(255,255,255,${0.25 + pct / 200})`,
                  transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 4 }}>
                {done ? 'Target reached' : `${g.target - g.current}${g.unit} to go · ${Math.round(pct)}% complete`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
