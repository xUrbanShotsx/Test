const activities = [
  { label: 'Sarah Mitchell opened appraisal email 6×', time: '4m ago', type: 'vendor' },
  { label: 'New vendor enquiry via "What\'s Your Home Worth?"', time: '18m ago', type: 'vendor' },
  { label: 'James Wong replied to SMS — interested in 12 Ocean Ave', time: '34m ago', type: 'buyer' },
  { label: 'Appraisal booked · 44 Corrimal St · Thu 2pm', time: '1h ago', type: 'appraisal' },
  { label: 'Just Sold campaign sent to 140 Thirroul neighbours', time: '2h ago', type: 'campaign' },
  { label: 'Market report email — 38% open rate after 2h', time: '3h ago', type: 'campaign' },
  { label: 'New buyer lead · Emily C · Budget $1.1m · Beach Rd', time: '4h ago', type: 'buyer' },
  { label: 'Facebook ad reached 6,200 homeowners in Wollongong', time: '5h ago', type: 'campaign' },
  { label: 'AI generated suburb report for Corrimal', time: '6h ago', type: 'ai' },
  { label: 'Appraisal completed · 7 Beach Rd · Vendor considering', time: '8h ago', type: 'appraisal' },
]

const dot: Record<string, string> = {
  vendor: '#ffffff',
  buyer: '#555555',
  appraisal: '#888888',
  campaign: '#333333',
  ai: '#666666',
}

export default function ActivityFeed() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Activity Feed</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>Live marketing & lead events</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activities.map((a, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, padding: '9px 0',
            borderBottom: i < activities.length - 1 ? '1px solid var(--border2)' : 'none',
            alignItems: 'flex-start',
          }}>
            <div style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: dot[a.type], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--fg)', lineHeight: 1.4 }}>{a.label}</div>
              <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
