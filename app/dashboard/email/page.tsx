'use client'

import { useState } from 'react'
import AIEmailComposer from '@/components/email/AIEmailComposer'
import ContactTable from '@/components/email/ContactTable'
import SequenceBuilder from '@/components/email/SequenceBuilder'

const TABS = ['Compose', 'Sequences', 'Campaigns', 'Contacts']

const metrics = [
  { label: 'Campaigns sent', value: '23', sub: 'This month' },
  { label: 'Avg open rate', value: '41%', sub: 'Industry avg 22%' },
  { label: 'Vendor leads generated', value: '18', sub: 'From email this month' },
  { label: 'Total contacts', value: '1,284', sub: 'Vendors + buyers' },
]

const campaigns = [
  { name: "What's Your Home Worth? — Wollongong", type: 'Vendor Appraisal', status: 'sent', sent: 840, opened: 345, clicked: 72, date: '2 days ago', openRate: '41%', leads: 11 },
  { name: 'Just Sold — 12 Ocean Ave Neighbour Drop', type: 'Vendor Outreach', status: 'sent', sent: 140, opened: 79, clicked: 28, date: '4 days ago', openRate: '56%', leads: 6 },
  { name: 'Thirroul Market Report Q2', type: 'Market Report', status: 'sent', sent: 220, opened: 84, clicked: 18, date: '6 days ago', openRate: '38%', leads: 4 },
  { name: 'Corrimal Free Appraisal Offer', type: 'Vendor Appraisal', status: 'scheduled', sent: 0, opened: 0, clicked: 0, date: 'Tomorrow 9am', openRate: '—', leads: 0 },
  { name: 'Buyer Alert — Ocean Views Under $900k', type: 'Buyer Campaign', status: 'sent', sent: 312, opened: 131, clicked: 42, date: '1 week ago', openRate: '42%', leads: 3 },
  { name: 'Corrimal Vendor SMS Blast (Email Follow-up)', type: 'Vendor Outreach', status: 'draft', sent: 0, opened: 0, clicked: 0, date: 'Draft', openRate: '—', leads: 0 },
]

const statusStyle: Record<string, { bg: string; color: string }> = {
  sent:      { bg: 'var(--surface2)', color: 'var(--fg2)' },
  scheduled: { bg: 'var(--surface2)', color: 'var(--fg)' },
  draft:     { bg: 'transparent',    color: 'var(--fg4)' },
}

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState('Compose')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1300 }}>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {metrics.map((m) => (
          <div key={m.label} className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg2)', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--fg4)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '13px 16px',
                fontSize: 12,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? 'var(--fg)' : 'var(--fg3)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--fg)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -1,
              }}
            >
              {tab}
              {tab === 'Contacts' && (
                <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--surface3)', borderRadius: 3, padding: '1px 5px', color: 'var(--fg4)' }}>
                  1,284
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'Compose' && <AIEmailComposer />}
          {activeTab === 'Sequences' && <SequenceBuilder />}

          {activeTab === 'Campaigns' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>Email Campaigns</div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>Vendor &amp; buyer outreach campaigns</div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setActiveTab('Compose')}>+ New Campaign</button>
              </div>

              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 70px 80px 70px', gap: 12, padding: '5px 0', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                {['Campaign', 'Type', 'Sent', 'Opened', 'Clicked', 'Open Rate', 'Leads'].map(h => (
                  <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>

              {campaigns.map((c, i) => (
                <div key={i} className="row-hover" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 70px 70px 70px 80px 70px',
                  gap: 12,
                  padding: '11px 0',
                  borderBottom: i < campaigns.length - 1 ? '1px solid var(--border2)' : 'none',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderRadius: 4,
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{c.date}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                    border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--fg3)',
                  }}>{c.type}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{c.sent || '—'}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{c.opened || '—'}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{c.clicked || '—'}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.openRate !== '—' ? 'var(--fg)' : 'var(--fg4)' }}>{c.openRate}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.leads > 0 ? 'var(--fg)' : 'var(--fg4)' }}>{c.leads > 0 ? `+${c.leads}` : '—'}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Contacts' && <ContactTable />}
        </div>
      </div>
    </div>
  )
}
