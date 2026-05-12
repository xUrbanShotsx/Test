'use client'

import { useState } from 'react'
import AIEmailComposer from '@/components/email/AIEmailComposer'
import ContactTable from '@/components/email/ContactTable'
import SequenceBuilder from '@/components/email/SequenceBuilder'

const TABS = ['Compose', 'Sequences', 'Campaigns', 'Contacts']

const metrics = [
  { label: 'Campaigns sent',         value: '23',   sub: 'This month' },
  { label: 'Avg open rate',          value: '41%',  sub: 'Industry avg 22%' },
  { label: 'Vendor leads generated', value: '18',   sub: 'From email this month' },
  { label: 'Total contacts',         value: '1,284', sub: 'Vendors + buyers' },
]

const campaigns = [
  { name: "What's Your Home Worth? — Wollongong", type: 'Vendor Appraisal',  status: 'sent',      sent: 840, opened: 345, clicked: 72, date: '2 days ago',   openRate: '41%', leads: 11 },
  { name: 'Just Sold — 12 Ocean Ave Neighbour Drop', type: 'Vendor Outreach', status: 'sent',     sent: 140, opened: 79,  clicked: 28, date: '4 days ago',   openRate: '56%', leads: 6 },
  { name: 'Thirroul Market Report Q2',             type: 'Market Report',     status: 'sent',      sent: 220, opened: 84,  clicked: 18, date: '6 days ago',   openRate: '38%', leads: 4 },
  { name: 'Corrimal Free Appraisal Offer',         type: 'Vendor Appraisal',  status: 'scheduled', sent: 0,   opened: 0,   clicked: 0,  date: 'Tomorrow 9am', openRate: '—',   leads: 0 },
  { name: 'Buyer Alert — Ocean Views Under $900k', type: 'Buyer Campaign',    status: 'sent',      sent: 312, opened: 131, clicked: 42, date: '1 week ago',   openRate: '42%', leads: 3 },
  { name: 'Corrimal Vendor SMS Blast (Follow-up)', type: 'Vendor Outreach',   status: 'draft',     sent: 0,   opened: 0,   clicked: 0,  date: 'Draft',        openRate: '—',   leads: 0 },
]

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState('Compose')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1300 }}>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {metrics.map((m) => (
          <div key={m.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontSize: 30, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 5 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--hairline)', padding: '0 20px' }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 16px', fontSize: 13, fontWeight: 400,
              color: activeTab === tab ? 'var(--ink)' : 'var(--mute)',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '1px solid var(--ink)' : '1px solid transparent',
              cursor: 'pointer', marginBottom: -1,
              fontFamily: 'var(--font-display)',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {tab}
              {tab === 'Contacts' && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  padding: '1px 6px', borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--hairline)', color: 'var(--mute)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>1,284</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'Compose'   && <AIEmailComposer />}
          {activeTab === 'Sequences' && <SequenceBuilder />}
          {activeTab === 'Contacts'  && <ContactTable />}

          {activeTab === 'Campaigns' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Email Campaigns</div>
                  <div style={{ fontSize: 13, color: 'var(--ink)' }}>Vendor &amp; buyer outreach campaigns</div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setActiveTab('Compose')}>+ New Campaign</button>
              </div>

              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 60px 60px 60px 80px 60px', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--hairline)', marginBottom: 4 }}>
                {['Campaign', 'Type', 'Sent', 'Opened', 'Clicked', 'Open Rate', 'Leads'].map(h => (
                  <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
                ))}
              </div>

              {campaigns.map((c, i) => (
                <div key={i} className="row-hover" style={{
                  display: 'grid', gridTemplateColumns: '1fr 130px 60px 60px 60px 80px 60px',
                  gap: 12, padding: '11px 0',
                  borderBottom: i < campaigns.length - 1 ? '1px solid var(--hairline)' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--ink)' }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.date}</div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--hairline)', color: 'var(--mute)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{c.type}</span>
                  <span style={{ fontSize: 12, color: 'var(--body-text)' }}>{c.sent || '—'}</span>
                  <span style={{ fontSize: 12, color: 'var(--body-text)' }}>{c.opened || '—'}</span>
                  <span style={{ fontSize: 12, color: 'var(--body-text)' }}>{c.clicked || '—'}</span>
                  <span style={{ fontSize: 13, fontWeight: 400, color: c.openRate !== '—' ? 'var(--ink)' : 'var(--mute)' }}>{c.openRate}</span>
                  <span style={{ fontSize: 13, color: c.leads > 0 ? 'var(--ink)' : 'var(--mute)' }}>{c.leads > 0 ? `+${c.leads}` : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
