'use client'

const HOT_LEADS = [
  { name: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong', score: 94, trigger: 'Opened email 6×, clicked CTA', stage: 'Appraisal Done',   action: 'Call now' },
  { name: 'Lisa Park',      address: '18 Panorama Dr, Bulli',    score: 89, trigger: 'Referral · appraisal Monday',    stage: 'Appraisal Booked', action: 'Prepare CMA' },
  { name: 'Jenny Liu',      address: '8 Beach Rd, Thirroul',     score: 82, trigger: 'Replied YES to SMS today',        stage: 'Interested',       action: 'Book appraisal' },
]

export default function HotLeadsWidget() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, fontWeight: 400,
            color: 'var(--mute)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 5,
          }}>Hot Leads Today</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            AI-ranked · act now for best conversion
          </div>
        </div>
        <a href="/dashboard/vendors" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--mute)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '4px 10px',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-pill)',
        }}>Pipeline →</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {HOT_LEADS.map((l, i) => (
          <div key={i} className="row-hover" style={{
            display: 'flex', gap: 14, padding: '14px 0',
            borderBottom: i < HOT_LEADS.length - 1 ? '1px solid var(--hairline)' : 'none',
            alignItems: 'center', cursor: 'pointer', borderRadius: 4,
          }}>
            {/* Score circle — xAI: thin hairline ring */}
            <div style={{
              width: 40, height: 40,
              borderRadius: '50%',
              border: '1px solid var(--hairline)',
              background: l.score >= 90 ? 'var(--ink)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11, fontWeight: 400,
                color: l.score >= 90 ? 'var(--canvas)' : 'var(--ink)',
                letterSpacing: '-0.02em',
              }}>{l.score}</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{l.name}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9, color: 'var(--mute)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>{l.stage}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.address}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l.trigger}</div>
            </div>

            <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 12px', flexShrink: 0 }}>
              {l.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
