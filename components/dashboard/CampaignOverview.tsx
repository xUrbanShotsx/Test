const campaigns = [
  { name: "What's Your Home Worth? — Wollongong",      type: 'Vendor Appraisal', status: 'live',      metric: '4.2% CVR',    sub: '840 sent',       highlight: true },
  { name: 'Just Sold — 12 Ocean Ave (Neighbour Drop)', type: 'Vendor Outreach',  status: 'live',      metric: '11 enquiries', sub: '3 appraisals',  highlight: false },
  { name: 'Thirroul Market Report Q2',                 type: 'Vendor Report',    status: 'live',      metric: '38% open',     sub: '220 sent',       highlight: false },
  { name: 'Buyer Alert — Ocean Views Under $900k',     type: 'Buyer Campaign',   status: 'live',      metric: '42 clicks',    sub: '312 sent',       highlight: false },
  { name: 'Corrimal Vendor SMS Blast',                 type: 'SMS Outreach',     status: 'scheduled', metric: '—',            sub: 'Tomorrow 9am',   highlight: false },
  { name: 'Free Appraisal — Corrimal FB Ad',           type: 'Social Ad',        status: 'draft',     metric: '—',            sub: 'Draft',          highlight: false },
]

const statusColor: Record<string, string> = {
  live:      'var(--ink)',
  scheduled: 'var(--body-text)',
  draft:     'var(--mute)',
}

export default function CampaignOverview() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>Active Campaigns</div>
          <div style={{ fontSize: 13, color: 'var(--ink)' }}>All channels · vendor &amp; buyer</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 12px' }}>View all</button>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {campaigns.map((c, i) => (
          <div key={i} style={{
            minWidth: 200, flexShrink: 0, padding: '16px',
            background: c.highlight ? 'var(--canvas-soft)' : 'var(--canvas-card)',
            border: `1px solid ${c.highlight ? 'rgba(255,255,255,0.15)' : 'var(--hairline)'}`,
            borderRadius: 8, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--hairline)',
                color: statusColor[c.status],
                background: c.status === 'live' ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}>{c.status}</span>
              {c.highlight && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ↑ top
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{c.type}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Result</div>
                <div style={{ fontSize: 16, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{c.metric}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Info</div>
                <div style={{ fontSize: 12, color: 'var(--mute)' }}>{c.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
