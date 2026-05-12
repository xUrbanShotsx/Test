'use client'

import { useState } from 'react'
import AISMSComposer from '@/components/sms/AISMSComposer'
import SMSConversations from '@/components/sms/SMSConversations'

const TABS = ['Compose & Send', 'Conversations', 'Responses']

const metrics = [
  { label: 'Sent this month', value: '1,840', sub: 'Vendor + buyer' },
  { label: 'Delivery rate', value: '98%', sub: 'Opt-out: 0.4%' },
  { label: 'Reply rate', value: '27%', sub: 'Industry avg 8%' },
  { label: 'Vendor leads via SMS', value: '12', sub: 'This month' },
]

const responses = [
  { name: 'Sarah Mitchell', mobile: '0412 345 678', message: 'Yes please! When can we meet?', time: '8m ago', campaign: "What's Your Home Worth?", type: 'vendor', sentiment: 'hot' },
  { name: 'Tom Bradley', mobile: '0423 456 789', message: 'Interested — what are houses selling for in Bulli?', time: '34m ago', campaign: 'Market Update SMS', type: 'vendor', sentiment: 'warm' },
  { name: 'Jenny Liu', mobile: '0456 789 012', message: 'Still looking. Can we do Saturday?', time: '1h ago', campaign: 'New Listing Alert', type: 'buyer', sentiment: 'warm' },
  { name: 'Amanda Ross', mobile: '0434 567 890', message: 'Great timing — we were just thinking about it', time: '2h ago', campaign: 'Just Sold Neighbour', type: 'vendor', sentiment: 'hot' },
  { name: 'Robert Kim', mobile: '0467 890 123', message: 'Please remove me from your list', time: '3h ago', campaign: 'Market Update SMS', type: 'vendor', sentiment: 'unsubscribe' },
]

const sentimentStyle: Record<string, { bg: string; color: string; label: string }> = {
  hot:         { bg: 'var(--surface3)', color: 'var(--fg)',  label: 'Hot' },
  warm:        { bg: 'var(--surface2)', color: 'var(--fg2)', label: 'Warm' },
  unsubscribe: { bg: 'transparent',    color: 'var(--fg4)', label: 'Opt-out' },
}

export default function SMSPage() {
  const [activeTab, setActiveTab] = useState('Compose & Send')

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

      {/* Tabs */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '13px 16px', fontSize: 12,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? 'var(--fg)' : 'var(--fg3)',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--fg)' : '2px solid transparent',
                cursor: 'pointer', marginBottom: -1, position: 'relative',
              }}>
              {tab}
              {tab === 'Responses' && (
                <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--fg)', color: 'var(--bg)', borderRadius: 3, padding: '1px 5px', fontWeight: 800 }}>
                  {responses.filter(r => r.sentiment !== 'unsubscribe').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'Compose & Send' && <AISMSComposer />}
          {activeTab === 'Conversations' && <SMSConversations />}
          {activeTab === 'Responses' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>SMS Responses</div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>Inbound replies — reply to convert to leads</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 70px', gap: 12, padding: '5px 0', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                {['Contact & Message', 'Campaign', 'Type', 'Time'].map(h => (
                  <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>

              {responses.map((r, i) => (
                <div key={i} className="row-hover" style={{
                  display: 'grid', gridTemplateColumns: '1fr 160px 80px 70px', gap: 12,
                  padding: '11px 0', borderBottom: i < responses.length - 1 ? '1px solid var(--border2)' : 'none',
                  alignItems: 'center', cursor: 'pointer', borderRadius: 4,
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2, fontStyle: 'italic' }}>"{r.message}"</div>
                    <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 2 }}>{r.mobile}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{r.campaign}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                    ...sentimentStyle[r.sentiment],
                    border: '1px solid var(--border)',
                  }}>{sentimentStyle[r.sentiment]?.label || r.sentiment}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{r.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
