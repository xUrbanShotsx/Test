'use client'

const HOT_LEADS = [
  { name: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong', score: 94, trigger: 'Opened email 6×, clicked CTA', stage: 'Appraisal Done', action: 'Call now' },
  { name: 'Lisa Park', address: '18 Panorama Dr, Bulli', score: 89, trigger: 'Referral from James Wong · appraisal Mon', stage: 'Appraisal Booked', action: 'Prepare CMA' },
  { name: 'Jenny Liu', address: '8 Beach Rd, Thirroul', score: 82, trigger: 'Replied YES to SMS today', stage: 'Interested', action: 'Book appraisal' },
]

const scoreColor = (s: number) => s >= 85 ? 'var(--fg)' : s >= 70 ? 'var(--fg2)' : 'var(--fg3)'

export default function HotLeadsWidget() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Hot Leads Today</div>
          <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>AI-ranked · act now for best conversion</div>
        </div>
        <a href="/dashboard/vendors" style={{ fontSize: 11, color: 'var(--fg3)', textDecoration: 'none' }}>Full pipeline →</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {HOT_LEADS.map((l, i) => (
          <div key={i} className="row-hover" style={{
            display: 'flex', gap: 12, padding: '12px 0',
            borderBottom: i < HOT_LEADS.length - 1 ? '1px solid var(--border2)' : 'none',
            alignItems: 'center', cursor: 'pointer', borderRadius: 4,
          }}>
            {/* Score ring */}
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${scoreColor(l.score)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 900, color: scoreColor(l.score),
            }}>
              {l.score}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{l.name}</span>
                <span style={{ fontSize: 10, color: 'var(--fg4)' }}>{l.stage}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.address}</div>
              <div style={{ fontSize: 10, color: 'var(--fg4)', fontStyle: 'italic' }}>{l.trigger}</div>
            </div>

            <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 10px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {l.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
