interface MetricCardProps {
  label: string
  value: string
  sub?: string
  change?: string
  positive?: boolean
  icon?: string
}

export default function MetricCard({ label, value, sub, change, positive = true, icon }: MetricCardProps) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--fg3)', fontWeight: 500, letterSpacing: '0.01em' }}>{label}</span>
        {icon && <span style={{ fontSize: 16, opacity: 0.6 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 5 }}>{sub}</div>}
      {change && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: positive ? 'var(--fg)' : 'var(--fg3)',
            background: positive ? 'var(--surface3)' : 'transparent',
            padding: '2px 6px', borderRadius: 4,
          }}>
            {positive ? '↑' : '↓'} {change}
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg4)' }}>vs last month</span>
        </div>
      )}
    </div>
  )
}
