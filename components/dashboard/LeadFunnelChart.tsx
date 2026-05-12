'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const vendorData = [
  { stage: 'Contacted', count: 68, pct: 100 },
  { stage: 'Interested', count: 41, pct: 60 },
  { stage: 'Appraisal\nBooked', count: 22, pct: 32 },
  { stage: 'Appraisal\nDone', count: 16, pct: 24 },
  { stage: 'Listed', count: 9, pct: 13 },
]

const TooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: 'var(--fg)', marginBottom: 3 }}>{payload[0].value} leads</div>
      <div style={{ color: 'var(--fg3)' }}>{label}</div>
    </div>
  )
}

export default function LeadFunnelChart() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Vendor Lead Funnel</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 3 }}>68 leads contacted this month · 13.2% listing rate</div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={vendorData} barSize={28} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
          <XAxis dataKey="stage" tick={{ fill: 'var(--fg3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--fg3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {vendorData.map((_, i) => (
              <Cell key={i} fill={i === vendorData.length - 1 ? '#ffffff' : `rgba(255,255,255,${0.15 + i * 0.17})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {vendorData.map(d => (
          <div key={d.stage} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)' }}>{d.count}</div>
            <div style={{ fontSize: 10, color: 'var(--fg3)' }}>{d.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
