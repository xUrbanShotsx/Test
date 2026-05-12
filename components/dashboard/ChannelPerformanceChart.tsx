'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { week: 'W1', vendor: 8, buyer: 14 },
  { week: 'W2', vendor: 12, buyer: 18 },
  { week: 'W3', vendor: 9, buyer: 22 },
  { week: 'W4', vendor: 18, buyer: 19 },
  { week: 'W5', vendor: 14, buyer: 28 },
  { week: 'W6', vendor: 22, buyer: 24 },
  { week: 'W7', vendor: 19, buyer: 31 },
  { week: 'W8', vendor: 27, buyer: 26 },
]

const tip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.dataKey === 'vendor' ? 'var(--fg)' : 'var(--fg3)', marginBottom: 2 }}>
          {p.dataKey === 'vendor' ? 'Vendor' : 'Buyer'}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function ChannelPerformanceChart() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>Lead Generation Trend</div>
          <div style={{ fontSize: 13, color: 'var(--ink)' }}>Vendor vs buyer leads · last 8 weeks</div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ label: 'Vendor', color: '#fff' }, { label: 'Buyer', color: 'var(--fg3)' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#666666" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#666666" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" tick={{ fill: 'var(--fg3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--fg3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={tip} />
          <Area type="monotone" dataKey="vendor" stroke="#ffffff" strokeWidth={1.5} fill="url(#gv)" />
          <Area type="monotone" dataKey="buyer" stroke="#555555" strokeWidth={1.5} fill="url(#gb)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
