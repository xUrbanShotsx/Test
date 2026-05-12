'use client'

import { useState } from 'react'

const NOTIFICATIONS = [
  { id: 1, type: 'hot', title: 'Hot lead — Sarah Mitchell', body: 'Opened appraisal email 6× and clicked CTA. AI score: 94', time: '4m ago', read: false },
  { id: 2, type: 'appraisal', title: 'Appraisal in 1 hour', body: 'Amanda Ross · 23 Corrimal St · 2:00pm today', time: '10m ago', read: false },
  { id: 3, type: 'sms', title: 'SMS reply received', body: 'Amanda Ross: "Great timing — we were just thinking about it"', time: '34m ago', read: false },
  { id: 4, type: 'vendor', title: 'New vendor enquiry', body: 'Via "What\'s Your Home Worth?" campaign · Wollongong', time: '1h ago', read: false },
  { id: 5, type: 'campaign', title: 'Campaign milestone', body: 'Just Sold email reached 50% open rate', time: '2h ago', read: true },
  { id: 6, type: 'ai', title: 'AI insight available', body: 'Corrimal market surge detected — good time to push appraisals', time: '3h ago', read: true },
  { id: 7, type: 'sms', title: 'SMS reply received', body: 'Tom Bradley: "Interested — what are houses selling for?"', time: '4h ago', read: true },
]

const TYPE_ICON: Record<string, string> = {
  hot: '🔥', appraisal: '📅', sms: '💬', vendor: '🏠', campaign: '📊', ai: '✦'
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id: number) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative', width: 34, height: 34,
          borderRadius: 6, background: open ? 'var(--surface2)' : 'var(--surface2)',
          border: `1px solid ${open ? 'var(--fg4)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--fg2)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 7, height: 7,
            background: 'var(--fg)', borderRadius: '50%',
            border: '1.5px solid var(--surface)',
          }} />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />

          {/* Panel */}
          <div style={{
            position: 'absolute', top: 42, right: 0,
            width: 360, maxHeight: 480,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 50, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Notifications</span>
                {unread > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, background: 'var(--fg)', color: 'var(--bg)', borderRadius: 3, padding: '1px 5px' }}>{unread}</span>
                )}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 11, color: 'var(--fg3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {notifications.map((n, i) => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  style={{
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: i < notifications.length - 1 ? '1px solid var(--border2)' : 'none',
                    background: n.read ? 'transparent' : 'var(--surface2)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                  className="row-hover"
                >
                  <div style={{ fontSize: 16, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                    {TYPE_ICON[n.type] || '·'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                      {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg)', flexShrink: 0, marginLeft: 8 }} />}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.4 }}>{n.body}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <button style={{ width: '100%', fontSize: 11, color: 'var(--fg3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                View all activity →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
