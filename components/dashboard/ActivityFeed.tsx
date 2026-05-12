const activities = [
  { label: 'Sarah Mitchell opened appraisal email 6×',                time: '4m ago',  type: 'vendor' },
  { label: "New vendor enquiry via \"What's Your Home Worth?\"",       time: '18m ago', type: 'vendor' },
  { label: 'James Wong replied to SMS — interested in 12 Ocean Ave',  time: '34m ago', type: 'buyer' },
  { label: 'Appraisal booked · 44 Corrimal St · Thu 2pm',             time: '1h ago',  type: 'appraisal' },
  { label: 'Just Sold campaign sent to 140 Thirroul neighbours',       time: '2h ago',  type: 'campaign' },
  { label: 'Market report email — 38% open rate after 2h',            time: '3h ago',  type: 'campaign' },
  { label: 'New buyer lead · Emily C · Budget $1.1m · Beach Rd',      time: '4h ago',  type: 'buyer' },
  { label: 'Facebook ad reached 6,200 homeowners in Wollongong',      time: '5h ago',  type: 'campaign' },
  { label: 'AI generated suburb report for Corrimal',                  time: '6h ago',  type: 'ai' },
  { label: 'Appraisal completed · 7 Beach Rd · Vendor considering',   time: '8h ago',  type: 'appraisal' },
]

// xAI: dot opacity varies by type instead of color
const dotOpacity: Record<string, number> = {
  vendor:    1,
  buyer:     0.5,
  appraisal: 0.7,
  campaign:  0.35,
  ai:        0.55,
}

export default function ActivityFeed() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>Activity</div>
        <div style={{ fontSize: 13, color: 'var(--ink)' }}>Live marketing &amp; lead events</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activities.map((a, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '9px 0',
            borderBottom: i < activities.length - 1 ? '1px solid var(--hairline)' : 'none',
            alignItems: 'flex-start',
          }}>
            <div style={{
              marginTop: 7, width: 5, height: 5, borderRadius: '50%',
              background: 'var(--ink)',
              opacity: dotOpacity[a.type] ?? 0.4,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--body-text)', lineHeight: 1.5 }}>{a.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
