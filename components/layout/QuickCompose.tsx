'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ACTIONS = [
  { label: 'Send Email Campaign', icon: '◉', href: '/dashboard/email', desc: 'Vendor appraisal, Just Sold, market report...' },
  { label: 'Send SMS Blast', icon: '◎', href: '/dashboard/sms', desc: 'Vendor outreach, open home reminders...' },
  { label: 'Create Social Post', icon: '◇', href: '/dashboard/social', desc: 'Just Sold, appraisal ad, market update...' },
  { label: 'Book Appraisal', icon: '◈', href: '/dashboard/appraisals', desc: 'Schedule a property appraisal' },
  { label: 'Add Vendor Lead', icon: '⬡', href: '/dashboard/vendors', desc: 'Add a new potential seller to pipeline' },
  { label: 'Add Property Listing', icon: '◫', href: '/dashboard/properties', desc: 'List a new property and generate marketing' },
]

export default function QuickCompose() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const go = (href: string) => { setOpen(false); router.push(href) }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="btn btn-primary"
        style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6 }}>
        + Create
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
          <div style={{
            position: 'absolute', top: 42, right: 0,
            width: 300, background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 50, overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Create</span>
            </div>
            {ACTIONS.map((a, i) => (
              <button key={a.label} onClick={() => go(a.href)}
                style={{
                  width: '100%', padding: '11px 14px', textAlign: 'left',
                  background: 'transparent', border: 'none',
                  borderBottom: i < ACTIONS.length - 1 ? '1px solid var(--border2)' : 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                }}
                className="row-hover"
              >
                <div style={{ width: 30, height: 30, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--fg2)', flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 2 }}>{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
