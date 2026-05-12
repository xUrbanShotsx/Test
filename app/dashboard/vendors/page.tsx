'use client'

import { useState } from 'react'

const STAGES = ['All', 'Contacted', 'Interested', 'Appraisal Booked', 'Appraisal Done', 'Listed']

const LEADS = [
  { id: 1, name: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong', status: 'Hot',  stage: 'Appraisal Done',   source: 'Email',    score: 94, days: 3,  phone: '0412 345 678', notes: 'Ready to list. Wants $1.4M+. Appraisal done Thu.' },
  { id: 2, name: 'Tom Bradley',    address: '15 Cliff Dr, Bulli',        status: 'Warm', stage: 'Interested',       source: 'SMS',      score: 71, days: 8,  phone: '0423 456 789', notes: 'Replied to SMS. Interested but waiting to see market.' },
  { id: 3, name: 'Amanda Ross',   address: '23 Corrimal St, Corrimal',   status: 'Warm', stage: 'Appraisal Booked', source: 'Social',   score: 68, days: 5,  phone: '0434 567 890', notes: 'Appraisal booked for Fri 2pm. Motivated to sell in 3 months.' },
  { id: 4, name: 'David Chen',    address: '44 Marine Dr, Wollongong',   status: 'Cold', stage: 'Contacted',        source: 'Campaign', score: 42, days: 14, phone: '0445 678 901', notes: 'Opened email 3x but not replied. Try follow-up call.' },
  { id: 5, name: 'Jenny Liu',     address: '8 Beach Rd, Thirroul',       status: 'Hot',  stage: 'Interested',       source: 'Referral', score: 82, days: 2,  phone: '0456 789 012', notes: 'Referred by past client. Very keen to discuss selling.' },
  { id: 6, name: 'Robert Kim',    address: '31 Hill St, Fairy Meadow',   status: 'Cold', stage: 'Contacted',        source: 'Email',    score: 35, days: 21, phone: '0467 890 123', notes: 'No response. Re-engage in 30 days.' },
  { id: 7, name: 'Lisa Park',     address: '18 Panorama Dr, Bulli',      status: 'Hot',  stage: 'Appraisal Booked', source: 'Referral', score: 89, days: 1,  phone: '0478 234 567', notes: 'New referral. Wants to sell before end of quarter.' },
  { id: 8, name: 'Mark Evans',    address: '5 Summit Rd, Wollongong',    status: 'Warm', stage: 'Appraisal Done',   source: 'SMS',      score: 74, days: 6,  phone: '0489 345 678', notes: 'Appraisal done. Discussing price expectations. Wants $1.15M.' },
]

export default function VendorsPage() {
  const [activeStage, setActiveStage] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<typeof LEADS[0] | null>(null)
  const [sortBy, setSortBy] = useState<'score' | 'days' | 'name'>('score')

  const stageCounts = STAGES.slice(1).map(s => ({ stage: s, count: LEADS.filter(l => l.stage === s).length }))

  const filtered = LEADS
    .filter(l => activeStage === 'All' || l.stage === activeStage)
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.address.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'score' ? b.score - a.score : sortBy === 'days' ? a.days - b.days : a.name.localeCompare(b.name))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1300 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>Vendor Pipeline</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Potential sellers ranked by AI score</div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12 }}>+ Add Lead</button>
      </div>

      {/* Funnel stages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {stageCounts.map(({ stage, count }, i) => (
          <button key={stage} onClick={() => setActiveStage(activeStage === stage ? 'All' : stage)}
            style={{
              padding: '16px 18px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${activeStage === stage ? 'rgba(255,255,255,0.3)' : 'var(--hairline)'}`,
              background: activeStage === stage ? 'var(--canvas-soft)' : 'var(--canvas-card)',
            }}>
            <div style={{ fontSize: 28, fontWeight: 400, color: 'var(--ink)', marginBottom: 5, letterSpacing: '-0.03em' }}>{count}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stage}</div>
            <div style={{ marginTop: 10, height: 1, background: 'var(--hairline)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${(count / LEADS.length) * 100}%`, height: '100%', background: `rgba(255,255,255,${0.2 + i * 0.12})` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors…" className="input" style={{ width: 220 }} />
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {(['score', 'days', 'name'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding: '5px 12px', fontSize: 11, cursor: 'pointer',
                borderRadius: 'var(--radius-pill)', border: '1px solid var(--hairline)',
                background: sortBy === s ? 'var(--ink)' : 'transparent',
                color: sortBy === s ? 'var(--canvas)' : 'var(--mute)',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          {/* Table */}
          <div style={{ flex: 1, overflowX: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px 60px 50px', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--hairline)' }}>
              {['Vendor', 'Stage', 'Source', 'Score', 'Status', 'Days'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--mute)', fontSize: 13 }}>No vendor leads match this filter</div>
            )}

            {filtered.map((l, i) => (
              <div key={l.id} onClick={() => setSelectedLead(selectedLead?.id === l.id ? null : l)}
                className="row-hover"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px 60px 50px',
                  gap: 10, padding: '12px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--hairline)' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                  background: selectedLead?.id === l.id ? 'var(--canvas-soft)' : 'transparent',
                }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink)' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.address}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--body-text)' }}>{l.stage}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l.source}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--hairline)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${l.score}%`, height: '100%', background: l.score >= 80 ? 'var(--ink)' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', width: 22, flexShrink: 0 }}>{l.score}</span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--hairline)',
                  color: l.status === 'Hot' ? 'var(--ink)' : l.status === 'Warm' ? 'var(--body-text)' : 'var(--mute)',
                  background: l.status === 'Hot' ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}>{l.status}</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)' }}>{l.days}d</div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selectedLead && (
            <div style={{ width: 280, borderLeft: '1px solid var(--hairline)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink)', marginBottom: 4 }}>{selectedLead.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selectedLead.address}</div>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Phone', selectedLead.phone],
                  ['Source', selectedLead.source],
                  ['Stage', selectedLead.stage],
                  ['Days active', `${selectedLead.days}d`],
                  ['AI Score', `${selectedLead.score}/100`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink)' }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Notes</div>
                <div style={{ fontSize: 12, color: 'var(--body-text)', lineHeight: 1.6 }}>{selectedLead.notes}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ fontSize: 12 }}>Book Appraisal</button>
                <button className="btn btn-ghost" style={{ fontSize: 12 }}>Send Email</button>
                <button className="btn btn-ghost" style={{ fontSize: 12 }}>Send SMS</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
