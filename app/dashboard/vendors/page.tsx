'use client'

import { useState } from 'react'

const STAGES = ['All', 'Contacted', 'Interested', 'Appraisal Booked', 'Appraisal Done', 'Listed']

const LEADS = [
  { id: 1, name: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong', status: 'Hot', stage: 'Appraisal Done', source: 'Email', score: 94, days: 3, phone: '0412 345 678', notes: 'Ready to list. Wants $1.4M+. Appraisal done Thu.' },
  { id: 2, name: 'Tom Bradley', address: '15 Cliff Dr, Bulli', status: 'Warm', stage: 'Interested', source: 'SMS', score: 71, days: 8, phone: '0423 456 789', notes: 'Replied to SMS. Interested but waiting to see market.' },
  { id: 3, name: 'Amanda Ross', address: '23 Corrimal St, Corrimal', status: 'Warm', stage: 'Appraisal Booked', source: 'Social', score: 68, days: 5, phone: '0434 567 890', notes: 'Appraisal booked for Fri 2pm. Motivated to sell in 3 months.' },
  { id: 4, name: 'David Chen', address: '44 Marine Dr, Wollongong', status: 'Cold', stage: 'Contacted', source: 'Campaign', score: 42, days: 14, phone: '0445 678 901', notes: 'Opened email 3x but not replied. Try follow-up call.' },
  { id: 5, name: 'Jenny Liu', address: '8 Beach Rd, Thirroul', status: 'Hot', stage: 'Interested', source: 'Referral', score: 82, days: 2, phone: '0456 789 012', notes: 'Referred by past client. Very keen to discuss selling.' },
  { id: 6, name: 'Robert Kim', address: '31 Hill St, Fairy Meadow', status: 'Cold', stage: 'Contacted', source: 'Email', score: 35, days: 21, phone: '0467 890 123', notes: 'No response. Consider removing or re-engaging in 30 days.' },
  { id: 7, name: 'Lisa Park', address: '18 Panorama Dr, Bulli', status: 'Hot', stage: 'Appraisal Booked', source: 'Referral', score: 89, days: 1, phone: '0478 234 567', notes: 'New referral. Wants to sell before end of quarter.' },
  { id: 8, name: 'Mark Evans', address: '5 Summit Rd, Wollongong', status: 'Warm', stage: 'Appraisal Done', source: 'SMS', score: 74, days: 6, phone: '0489 345 678', notes: 'Appraisal done. Discussing price expectations. Wants $1.15M.' },
]

const STATUS_COLORS: Record<string, { dot: string; text: string }> = {
  Hot:  { dot: '#ffffff', text: 'var(--fg)' },
  Warm: { dot: '#888888', text: 'var(--fg2)' },
  Cold: { dot: '#333333', text: 'var(--fg4)' },
}

export default function VendorsPage() {
  const [activeStage, setActiveStage] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<typeof LEADS[0] | null>(null)
  const [sortBy, setSortBy] = useState<'score' | 'days' | 'name'>('score')

  const stageCounts = STAGES.slice(1).map(s => ({ stage: s, count: LEADS.filter(l => l.stage === s).length }))

  const filtered = LEADS
    .filter(l => activeStage === 'All' || l.stage === activeStage)
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.address.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'days') return a.days - b.days
      return a.name.localeCompare(b.name)
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1300 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>Vendor Pipeline</div>
          <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 3 }}>Potential sellers ranked by AI lead score</div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12 }}>+ Add Vendor Lead</button>
      </div>

      {/* Funnel overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {stageCounts.map(({ stage, count }, i) => (
          <button key={stage} onClick={() => setActiveStage(activeStage === stage ? 'All' : stage)}
            style={{
              padding: '14px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${activeStage === stage ? 'var(--fg3)' : 'var(--border)'}`,
              background: activeStage === stage ? 'var(--surface2)' : 'var(--surface)',
            }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--fg)', marginBottom: 4 }}>{count}</div>
            <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{stage}</div>
            <div style={{ marginTop: 8, height: 2, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${(count / LEADS.length) * 100}%`, height: '100%', background: `rgba(255,255,255,${0.3 + i * 0.15})`, borderRadius: 99 }} />
            </div>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." className="input"
            style={{ width: 220 }} />
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {(['score', 'days', 'name'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className="btn btn-ghost"
                style={{ fontSize: 11, padding: '5px 10px', background: sortBy === s ? 'var(--surface2)' : 'transparent', color: sortBy === s ? 'var(--fg)' : 'var(--fg3)' }}>
                Sort: {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
          {/* Table */}
          <div style={{ flex: 1, overflowX: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px 60px 50px', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
              {['Vendor', 'Stage', 'Source', 'Score', 'Status', 'Days'].map(h => (
                <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg4)', fontSize: 13 }}>No vendor leads match this filter</div>
            )}

            {filtered.map((l, i) => (
              <div key={l.id} onClick={() => setSelectedLead(selectedLead?.id === l.id ? null : l)}
                className="row-hover"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px 60px 50px',
                  gap: 10, padding: '12px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border2)' : 'none',
                  alignItems: 'center', cursor: 'pointer', borderRadius: 0,
                  background: selectedLead?.id === l.id ? 'var(--surface2)' : 'transparent',
                }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.address}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg2)' }}>{l.stage}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.source}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${l.score}%`, height: '100%', background: l.score >= 80 ? 'var(--fg)' : l.score >= 60 ? 'var(--fg2)' : 'var(--fg4)', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--fg3)', width: 24, flexShrink: 0 }}>{l.score}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[l.status].dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLORS[l.status].text }}>{l.status}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.days}d</div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selectedLead && (
            <div style={{ width: 280, borderLeft: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 3 }}>{selectedLead.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{selectedLead.address}</div>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Phone', selectedLead.phone],
                  ['Source', selectedLead.source],
                  ['Stage', selectedLead.stage],
                  ['Days in pipeline', `${selectedLead.days} days`],
                  ['AI Score', `${selectedLead.score}/100`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--fg4)' }}>{label}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg)', fontWeight: 600, textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5 }}>{selectedLead.notes}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
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
