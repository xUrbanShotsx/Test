'use client'

import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const scheduledPosts = [
  { date: new Date(2026, 4, 12), platform: 'Instagram', type: 'New Listing', color: '#e1306c' },
  { date: new Date(2026, 4, 14), platform: 'Facebook', type: 'Open Home', color: '#1877f2' },
  { date: new Date(2026, 4, 14), platform: 'Instagram', type: 'Open Home', color: '#e1306c' },
  { date: new Date(2026, 4, 17), platform: 'LinkedIn', type: 'Market Update', color: '#0a66c2' },
  { date: new Date(2026, 4, 19), platform: 'Facebook', type: 'Just Sold', color: '#1877f2' },
  { date: new Date(2026, 4, 21), platform: 'Instagram', type: 'Brand', color: '#e1306c' },
  { date: new Date(2026, 4, 24), platform: 'Facebook', type: 'New Listing', color: '#1877f2' },
]

export default function SocialCalendar() {
  const [currentMonth] = useState(new Date(2026, 4, 1))

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const getPostsForDay = (day: number) =>
    scheduledPosts.filter(
      (p) =>
        p.date.getFullYear() === currentMonth.getFullYear() &&
        p.date.getMonth() === currentMonth.getMonth() &&
        p.date.getDate() === day
    )

  const monthName = currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>{monthName}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--foreground-muted)', cursor: 'pointer', fontSize: 12 }}>← Prev</button>
          <button style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--foreground-muted)', cursor: 'pointer', fontSize: 12 }}>Next →</button>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--foreground-subtle)', fontWeight: 600, padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          const posts = day ? getPostsForDay(day) : []
          const isToday = day === 11

          return (
            <div
              key={i}
              style={{
                minHeight: 80,
                padding: '8px',
                background: day ? (isToday ? 'var(--accent-dim)' : 'var(--surface-2)') : 'transparent',
                border: `1px solid ${isToday ? 'rgba(255,217,64,0.4)' : day ? 'var(--border)' : 'transparent'}`,
                borderRadius: 8,
                cursor: day ? 'pointer' : 'default',
              }}
            >
              {day && (
                <>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: isToday ? 800 : 500,
                      color: isToday ? 'var(--accent)' : 'var(--foreground)',
                      marginBottom: 4,
                    }}
                  >
                    {day}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {posts.slice(0, 3).map((p, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#fff',
                          background: p.color,
                          borderRadius: 3,
                          padding: '1px 4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.platform[0]} · {p.type}
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <div style={{ fontSize: 10, color: 'var(--foreground-muted)' }}>+{posts.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--foreground-muted)' }}>Channels:</span>
        {[
          { label: 'Instagram', color: '#e1306c' },
          { label: 'Facebook', color: '#1877f2' },
          { label: 'LinkedIn', color: '#0a66c2' },
        ].map((p) => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
            <span style={{ fontSize: 12, color: 'var(--foreground-muted)' }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
