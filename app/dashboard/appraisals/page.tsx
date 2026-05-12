'use client'

import { useState } from 'react'

const APPRAISALS = [
  { id: 1, vendor: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong',  date: 'Thu 15 May · 2:00pm',  status: 'done',   outcome: 'Proceeding',     priceRange: '$1,350,000 – $1,450,000', notes: 'Vendor very keen. Expects $1.4M. Discussing marketing strategy.', agentScore: 92, followUp: 'May 18' },
  { id: 2, vendor: 'Amanda Ross',   address: '23 Corrimal St, Corrimal',   date: 'Fri 16 May · 2:00pm',  status: 'booked', outcome: '—',               priceRange: 'TBC',                     notes: 'Booked via email campaign. Has lived there 12 years. Motivated by school zone change.', agentScore: 68, followUp: 'May 16' },
  { id: 3, vendor: 'Lisa Park',     address: '18 Panorama Dr, Bulli',      date: 'Mon 19 May · 10:00am', status: 'booked', outcome: '—',               priceRange: 'TBC',                     notes: 'Referred by past client James Wong. Wants to sell before end of quarter.', agentScore: 89, followUp: 'May 19' },
  { id: 4, vendor: 'Mark Evans',    address: '5 Summit Rd, Wollongong',    date: 'Tue 13 May · 11:00am', status: 'done',   outcome: 'Considering',    priceRange: '$1,100,000 – $1,200,000', notes: 'Wants $1.15M. Will decide after viewing comparable sales.', agentScore: 74, followUp: 'May 17' },
  { id: 5, vendor: 'Helen Carter',  address: '9 Harbour View, Thirroul',   date: 'Wed 7 May · 3:00pm',   status: 'done',   outcome: 'Not Proceeding', priceRange: '$980,000 – $1,050,000',   notes: 'Decided to stay. Re-contact in 6 months.', agentScore: 29, followUp: 'Nov 2025' },
]

const statsData = [
  { label: 'This month',      value: '16' },
  { label: 'Proceeding',      value: '9',  sub: '56% conversion' },
  { label: 'Considering',     value: '4',  sub: 'Follow-up pipeline' },
  { label: 'Upcoming booked', value: '3',  sub: 'Next 7 days' },
]

const OUTCOME_COLORS: Record<string, string> = {
  'Proceeding':     'var(--ink)',
  'Considering':    'var(--body-text)',
  'Not Proceeding': 'var(--mute)',
  '—':              'var(--mute)',
}

export default function AppraisalsPage() {
  const [filter, setFilter] = useState<'all' | 'booked' | 'done'>('all')
  const [selected, setSelected] = useState<typeof APPRAISALS[0] | null>(null)
  const [showBooking, setShowBooking] = useState(false)

  const filtered = APPRAISALS.filter(a => filter === 'all' || a.status === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1300 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>Appraisals</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Book, track and convert vendor appraisals</div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setShowBooking(v => !v)}>
          {showBooking ? '✕ Cancel' : '+ Book Appraisal'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {statsData.map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 6 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Booking form */}
      {showBooking && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 18 }}>Book New Appraisal</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['Vendor Name', 'Sarah Mitchell'],
              ['Property Address', '12 Ocean Ave, Wollongong'],
              ['Phone', '0412 345 678'],
              ['Email', 'sarah@email.com'],
              ['Date & Time', 'Fri 16 May · 2:00pm'],
              ['Source', 'Email campaign / referral / etc.'],
            ].map(([label, placeholder]) => (
              <div key={label}>
                <label className="label-upper">{label}</label>
                <input placeholder={placeholder} className="input" />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <label className="label-upper">Notes</label>
            <textarea rows={3} placeholder="Any context about this vendor lead…" className="input" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ fontSize: 12 }}>Book Appraisal</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>Save & Send Confirmation SMS</button>
          </div>
        </div>
      )}

      {/* List card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Filter tabs */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', gap: 6 }}>
          {(['all', 'booked', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', cursor: 'pointer',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--hairline)',
              background: filter === f ? 'var(--ink)' : 'transparent',
              color: filter === f ? 'var(--canvas)' : 'var(--mute)',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {f === 'all' ? `All (${APPRAISALS.length})` : f === 'booked' ? `Booked (${APPRAISALS.filter(a => a.status === 'booked').length})` : `Completed (${APPRAISALS.filter(a => a.status === 'done').length})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 120px 70px 80px', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--hairline)' }}>
              {['Vendor', 'Address', 'Date', 'Outcome', 'Score', 'Follow-up'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
              ))}
            </div>

            {filtered.map((a, i) => (
              <div key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)}
                className="row-hover"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 110px 120px 70px 80px',
                  gap: 10, padding: '12px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--hairline)' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                  background: selected?.id === a.id ? 'var(--canvas-soft)' : 'transparent',
                }}>
                <div style={{ fontSize: 13, color: 'var(--ink)' }}>{a.vendor}</div>
                <div style={{ fontSize: 11, color: 'var(--mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.address}</div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--body-text)' }}>{a.date.split('·')[0].trim()}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.06em' }}>{a.date.split('·')[1]?.trim()}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: '2px 9px', borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--hairline)',
                  color: a.status === 'booked' ? 'var(--ink)' : OUTCOME_COLORS[a.outcome],
                  background: a.status === 'booked' ? 'rgba(255,255,255,0.07)' : 'transparent',
                  display: 'inline-block',
                }}>
                  {a.status === 'booked' ? 'Upcoming' : a.outcome}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--hairline)', overflow: 'hidden' }}>
                    <div style={{ width: `${a.agentScore}%`, height: '100%', background: a.agentScore >= 70 ? 'var(--ink)' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', width: 20 }}>{a.agentScore}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)' }}>{a.followUp}</div>
              </div>
            ))}
          </div>

          {/* Side panel */}
          {selected && (
            <div style={{ width: 280, borderLeft: '1px solid var(--hairline)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{selected.vendor}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selected.address}</div>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Date', selected.date],
                  ['Status', selected.status === 'booked' ? 'Upcoming' : 'Completed'],
                  ['Outcome', selected.outcome],
                  ['Price range', selected.priceRange],
                  ['Follow-up', selected.followUp],
                  ['AI Score', `${selected.agentScore}/100`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                    <span style={{ fontSize: 12, color: OUTCOME_COLORS[val] || 'var(--ink)' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Notes</div>
                <div style={{ fontSize: 12, color: 'var(--body-text)', lineHeight: 1.6 }}>{selected.notes}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.status === 'booked' ? (
                  <>
                    <button className="btn btn-primary" style={{ fontSize: 12 }}>Mark as Complete</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12 }}>Send Reminder SMS</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary" style={{ fontSize: 12 }}>Convert to Listing</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12 }}>Schedule Follow-up</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12 }}>Send Follow-up Email</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
