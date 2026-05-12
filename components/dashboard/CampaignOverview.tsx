const campaigns = [
  { name: 'What\'s Your Home Worth? — Wollongong', type: 'Vendor Appraisal', status: 'live', metric: '4.2% CVR', sub: '840 sent', highlight: true },
  { name: 'Just Sold — 12 Ocean Ave (Neighbour Drop)', type: 'Vendor Outreach', status: 'live', metric: '11 enquiries', sub: '3 appraisals' },
  { name: 'Thirroul Market Report Q2', type: 'Vendor Report', status: 'live', metric: '38% open', sub: '220 sent' },
  { name: 'Buyer Alert — Ocean Views Under $900k', type: 'Buyer Campaign', status: 'live', metric: '42 clicks', sub: '312 sent' },
  { name: 'Corrimal Vendor SMS Blast', type: 'SMS Outreach', status: 'scheduled', metric: '—', sub: 'Tomorrow 9am' },
  { name: 'Free Appraisal — Corrimal FB Ad', type: 'Social Ad', status: 'draft', metric: '—', sub: 'Draft' },
]

const statusPill: Record<string, { bg: string; color: string; label: string }> = {
  live:      { bg: 'var(--surface3)', color: 'var(--fg)',  label: 'Live' },
  scheduled: { bg: 'var(--surface2)', color: 'var(--fg2)', label: 'Scheduled' },
  draft:     { bg: 'transparent',    color: 'var(--fg3)', label: 'Draft' },
}

export default function CampaignOverview() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Active Campaigns</div>
          <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>All channels · vendor &amp; buyer</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>View all</button>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2 }}>
        {campaigns.map((c, i) => {
          const s = statusPill[c.status]
          return (
            <div key={i} style={{
              minWidth: 200, flexShrink: 0, padding: '14px 16px',
              background: c.highlight ? 'var(--surface2)' : 'var(--surface)',
              border: `1px solid ${c.highlight ? 'var(--surface3)' : 'var(--border2)'}`,
              borderRadius: 10, cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                  background: s.bg, color: s.color, border: '1px solid var(--border)',
                }}>{s.label}</span>
                {c.highlight && <span style={{ fontSize: 10, color: 'var(--fg3)' }}>↑ top performer</span>}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.4, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 12 }}>{c.type}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)' }}>{c.metric}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Info</div>
                  <div style={{ fontSize: 12, color: 'var(--fg2)' }}>{c.sub}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
