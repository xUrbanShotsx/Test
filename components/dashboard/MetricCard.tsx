interface MetricCardProps {
  label: string
  value: string
  sub?: string
  change?: string
  positive?: boolean
  icon?: string
}

export default function MetricCard({ label, value, sub, change, positive = true }: MetricCardProps) {
  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      {/* Mono eyebrow label */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 400,
        color: 'var(--mute)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 14,
      }}>
        {label}
      </div>

      {/* Value — xAI display style: weight 400, tight tracking */}
      <div style={{
        fontSize: 36,
        fontWeight: 400,
        color: 'var(--ink)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        fontFamily: 'var(--font-display)',
      }}>
        {value}
      </div>

      {sub && (
        <div style={{
          fontSize: 12,
          color: 'var(--mute)',
          marginTop: 6,
          fontFamily: 'var(--font-display)',
        }}>
          {sub}
        </div>
      )}

      {change && (
        <div style={{ marginTop: 14 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: positive ? 'var(--ink)' : 'var(--mute)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--hairline)',
            background: positive ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}>
            {positive ? '↑' : '↓'} {change}
          </span>
        </div>
      )}
    </div>
  )
}
