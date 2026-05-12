'use client'

import { useState } from 'react'

const APPRAISALS = [
  {
    id: 1,
    vendor: 'Sarah Mitchell',
    address: '12 Ocean Ave, Wollongong',
    date: 'Thu 15 May · 2:00pm',
    dateRaw: '2025-05-15',
    status: 'done',
    outcome: 'Proceeding',
    priceRange: '$1,350,000 – $1,450,000',
    notes: 'Vendor very keen. Expects $1.4M. Property is well presented. Discussing marketing strategy.',
    agentScore: 92,
    followUp: 'May 18',
  },
  {
    id: 2,
    vendor: 'Amanda Ross',
    address: '23 Corrimal St, Corrimal',
    date: 'Fri 16 May · 2:00pm',
    dateRaw: '2025-05-16',
    status: 'booked',
    outcome: '—',
    priceRange: 'TBC',
    notes: 'Booked via email campaign. Has lived there 12 years. Motivated by school zone change.',
    agentScore: 68,
    followUp: 'May 16',
  },
  {
    id: 3,
    vendor: 'Lisa Park',
    address: '18 Panorama Dr, Bulli',
    date: 'Mon 19 May · 10:00am',
    dateRaw: '2025-05-19',
    status: 'booked',
    outcome: '—',
    priceRange: 'TBC',
    notes: 'Referred by past client James Wong. Wants to sell before end of quarter.',
    agentScore: 89,
    followUp: 'May 19',
  },
  {
    id: 4,
    vendor: 'Mark Evans',
    address: '5 Summit Rd, Wollongong',
    date: 'Tue 13 May · 11:00am',
    dateRaw: '2025-05-13',
    status: 'done',
    outcome: 'Considering',
    priceRange: '$1,100,000 – $1,200,000',
    notes: 'Wants $1.15M. Will decide after viewing comparable sales we send through.',
    agentScore: 74,
    followUp: 'May 17',
  },
  {
    id: 5,
    vendor: 'Helen Carter',
    address: '9 Harbour View, Thirroul',
    date: 'Wed 7 May · 3:00pm',
    dateRaw: '2025-05-07',
    status: 'done',
    outcome: 'Not Proceeding',
    priceRange: '$980,000 – $1,050,000',
    notes: 'Decided to stay. Property needs work and vendor not ready to invest. Re-contact in 6 months.',
    agentScore: 29,
    followUp: 'Nov 2025',
  },
]

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  booked:        { label: 'Booked', bg: 'var(--surface2)', color: 'var(--fg)' },
  done:          { label: 'Completed', bg: 'var(--surface2)', color: 'var(--fg2)' },
  'Not Proceeding': { label: 'Not Proceeding', bg: 'transparent', color: 'var(--fg4)' },
}

const OUTCOME_COLORS: Record<string, string> = {
  'Proceeding': 'var(--fg)',
  'Considering': 'var(--fg2)',
  'Not Proceeding': 'var(--fg4)',
  '—': 'var(--fg4)',
}

const statsData = [
  { label: 'Appraisals this month', value: '16' },
  { label: 'Proceeding to list', value: '9', sub: '56% conversion' },
  { label: 'Considering', value: '4', sub: 'Follow-up pipeline' },
  { label: 'Upcoming booked', value: '3', sub: 'Next 7 days' },
]

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
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>Appraisals</div>
          <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 3 }}>Book, track and convert vendor appraisals to listings</div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setShowBooking(true)}>+ Book Appraisal</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {statsData.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg2)', marginBottom: 2 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 11, color: 'var(--fg4)' }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Booking form modal (inline) */}
      {showBooking && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)' }}>Book New Appraisal</div>
            <button onClick={() => setShowBooking(false)} className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>✕ Cancel</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Vendor Name', placeholder: 'Sarah Mitchell' },
              { label: 'Property Address', placeholder: '12 Ocean Ave, Wollongong' },
              { label: 'Phone', placeholder: '0412 345 678' },
              { label: 'Email', placeholder: 'sarah@email.com' },
              { label: 'Date & Time', placeholder: 'Fri 16 May · 2:00pm' },
              { label: 'Source', placeholder: 'Email campaign / referral / etc.' },
            ].map(field => (
              <div key={field.label}>
                <label className="label-upper">{field.label}</label>
                <input placeholder={field.placeholder} className="input" />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="label-upper">Notes</label>
            <textarea rows={3} placeholder="Any context about this vendor lead..." className="input" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ fontSize: 13 }}>Book Appraisal</button>
            <button className="btn btn-ghost" style={{ fontSize: 13 }}>Save & Send Confirmation SMS</button>
          </div>
        </div>
      )}

      {/* Appraisals list */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Filters */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          {(['all', 'booked', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-ghost"
              style={{
                fontSize: 11, padding: '5px 12px', textTransform: 'capitalize',
                background: filter === f ? 'var(--surface2)' : 'transparent',
                color: filter === f ? 'var(--fg)' : 'var(--fg3)',
                borderColor: filter === f ? 'var(--fg4)' : 'var(--border)',
              }}>
              {f === 'all' ? `All (${APPRAISALS.length})` : f === 'booked' ? `Booked (${APPRAISALS.filter(a => a.status === 'booked').length})` : `Completed (${APPRAISALS.filter(a => a.status === 'done').length})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex' }}>
          {/* Table */}
          <div style={{ flex: 1 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 120px 70px 80px', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
              {['Vendor', 'Address', 'Date', 'Outcome', 'Score', 'Follow-up'].map(h => (
                <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {filtered.map((a, i) => (
              <div key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)}
                className="row-hover"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 110px 120px 70px 80px',
                  gap: 10, padding: '12px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border2)' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                  background: selected?.id === a.id ? 'var(--surface2)' : 'transparent',
                }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{a.vendor}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.address}</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--fg2)' }}>{a.date.split('·')[0].trim()}</div>
                  <div style={{ fontSize: 10, color: 'var(--fg4)' }}>{a.date.split('·')[1]?.trim()}</div>
                </div>
                <div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                    border: '1px solid var(--border)',
                    background: a.status === 'booked' ? 'var(--surface2)' : 'transparent',
                    color: a.status === 'booked' ? 'var(--fg)' : 'var(--fg3)',
                  }}>
                    {a.status === 'booked' ? 'Upcoming' : a.outcome}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${a.agentScore}%`, height: '100%', background: a.agentScore >= 70 ? 'var(--fg)' : 'var(--fg4)', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--fg3)', width: 20 }}>{a.agentScore}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{a.followUp}</div>
              </div>
            ))}
          </div>

          {/* Side detail */}
          {selected && (
            <div style={{ width: 280, borderLeft: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 3 }}>{selected.vendor}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{selected.address}</div>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Date', selected.date],
                  ['Status', selected.status === 'booked' ? 'Upcoming' : 'Completed'],
                  ['Outcome', selected.outcome],
                  ['Price range', selected.priceRange],
                  ['Follow-up', selected.followUp],
                  ['AI Score', `${selected.agentScore}/100`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--fg4)' }}>{label}</span>
                    <span style={{ fontSize: 11, color: OUTCOME_COLORS[val] || 'var(--fg)', fontWeight: 600, textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5 }}>{selected.notes}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
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
