'use client'

import { useState } from 'react'

const THREADS = [
  {
    id: 1, name: 'James Wong', mobile: '0423 456 789', unread: 2,
    messages: [
      { dir: 'out', text: 'Hi James! 12 Ocean Ave just listed at $850k. 3bed/2bath, stunning views. Reply YES to book inspection 🏡', time: '10:30am' },
      { dir: 'in', text: 'Looks great! When is the inspection?', time: '10:45am' },
      { dir: 'out', text: 'This Saturday 10-10:30am! Want us to put your name down?', time: '10:47am' },
      { dir: 'in', text: 'Still interested! Can we do Saturday?', time: '11:02am' },
      { dir: 'in', text: 'And what is the price guide exactly?', time: '11:03am' },
    ]
  },
  {
    id: 2, name: 'Sarah Mitchell', mobile: '0412 345 678', unread: 1,
    messages: [
      { dir: 'out', text: 'Hi Sarah! New listing in Wollongong you might love. Beachside 3bed. Interested?', time: '9:15am' },
      { dir: 'in', text: 'Love the property. What is the price guide?', time: '9:40am' },
    ]
  },
  {
    id: 3, name: 'Lisa Park', mobile: '0456 789 012', unread: 0,
    messages: [
      { dir: 'out', text: 'Hi Lisa, investment opportunity in Wollongong CBD. 7.2% yield. Call us!', time: 'Yesterday' },
      { dir: 'in', text: 'Send me the details please', time: 'Yesterday' },
      { dir: 'out', text: 'Emailing you full IM now. Available for a call Tuesday?', time: 'Yesterday' },
    ]
  },
]

export default function SMSConversations() {
  const [activeThread, setActiveThread] = useState(THREADS[0])
  const [reply, setReply] = useState('')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, height: 500, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Thread list */}
      <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--foreground-muted)' }}>
          CONVERSATIONS ({THREADS.length})
        </div>
        {THREADS.map(t => (
          <div key={t.id} onClick={() => setActiveThread(t)}
            style={{ padding: '12px 14px', cursor: 'pointer', background: activeThread.id === t.id ? 'var(--surface-2)' : 'transparent', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>{t.name}</span>
              {t.unread > 0 && (
                <span style={{ width: 18, height: 18, background: 'var(--green)', color: '#000', borderRadius: '50%', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.unread}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--foreground-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.messages[t.messages.length - 1].text}
            </div>
          </div>
        ))}
      </div>

      {/* Thread view */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>
            {activeThread.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>{activeThread.name}</div>
            <div style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{activeThread.mobile}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeThread.messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.dir === 'out' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.dir === 'out' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.dir === 'out' ? 'linear-gradient(135deg,#FFD940,#FF9500)' : 'var(--surface-3)',
                color: m.dir === 'out' ? '#000' : 'var(--foreground)', fontSize: 13, lineHeight: 1.5 }}>
                {m.text}
                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type a reply..."
            onKeyDown={e => e.key === 'Enter' && reply && setReply('')}
            style={{ flex: 1, padding: '9px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
          <button onClick={() => reply && setReply('')}
            style={{ padding: '9px 16px', background: 'linear-gradient(135deg,#FFD940,#FF9500)', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
