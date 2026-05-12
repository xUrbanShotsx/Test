'use client'

import { useState } from 'react'
import AISMSComposer from '@/components/sms/AISMSComposer'
import SMSConversations from '@/components/sms/SMSConversations'

const TABS = ['Compose & Send', 'Conversations', 'Responses']

const metrics = [
  { label: 'Sent this month',       value: '1,840', sub: 'Vendor + buyer' },
  { label: 'Delivery rate',         value: '98%',   sub: 'Opt-out: 0.4%' },
  { label: 'Reply rate',            value: '27%',   sub: 'Industry avg 8%' },
  { label: 'Vendor leads via SMS',  value: '12',    sub: 'This month' },
]

const responses = [
  { name: 'Sarah Mitchell', mobile: '0412 345 678', message: 'Yes please! When can we meet?',                 time: '8m ago',  campaign: "What's Your Home Worth?", type: 'vendor', sentiment: 'hot' },
  { name: 'Tom Bradley',    mobile: '0423 456 789', message: 'Interested — what are houses selling for?',     time: '34m ago', campaign: 'Market Update SMS',        type: 'vendor', sentiment: 'warm' },
  { name: 'Jenny Liu',      mobile: '0456 789 012', message: 'Still looking. Can we do Saturday?',            time: '1h ago',  campaign: 'New Listing Alert',        type: 'buyer',  sentiment: 'warm' },
  { name: 'Amanda Ross',    mobile: '0434 567 890', message: 'Great timing — we were just thinking about it', time: '2h ago',  campaign: 'Just Sold Neighbour',      type: 'vendor', sentiment: 'hot' },
  { name: 'Robert Kim',     mobile: '0467 890 123', message: 'Please remove me from your list',              time: '3h ago',  campaign: 'Market Update SMS',        type: 'vendor', sentiment: 'unsubscribe' },
]

const sentimentStyle: Record<string, { color: string; label: string; bg: string }> = {
  hot:         { color: 'var(--ink)',       label: 'Hot',     bg: 'rgba(255,255,255,0.08)' },
  warm:        { color: 'var(--body-text)', label: 'Warm',    bg: 'transparent' },
  unsubscribe: { color: 'var(--mute)',      label: 'Opt-out', bg: 'transparent' },
}

export default function SMSPage() {
  const [activeTab, setActiveTab] = useState('Compose & Send')

  const hotCount = responses.filter(r => r.sentiment !== 'unsubscribe').length

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

      {/* Tabs */}
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
              {tab === 'Responses' && hotCount > 0 && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  padding: '1px 6px', borderRadius: 'var(--radius-pill)',
                  background: 'var(--ink)', color: 'var(--canvas)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{hotCount}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'Compose & Send' && <AISMSComposer />}
          {activeTab === 'Conversations' && <SMSConversations />}
          {activeTab === 'Responses' && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>SMS Responses</div>
                <div style={{ fontSize: 13, color: 'var(--ink)' }}>Inbound replies — respond to convert to leads</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 80px 70px', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--hairline)', marginBottom: 4 }}>
                {['Contact & Message', 'Campaign', 'Signal', 'Time'].map(h => (
                  <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
                ))}
              </div>

              {responses.map((r, i) => (
                <div key={i} className="row-hover" style={{
                  display: 'grid', gridTemplateColumns: '1fr 160px 80px 70px', gap: 12,
                  padding: '12px 0', borderBottom: i < responses.length - 1 ? '1px solid var(--hairline)' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 3 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--body-text)', marginBottom: 2 }}>&ldquo;{r.message}&rdquo;</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', letterSpacing: '0.06em' }}>{r.mobile}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--mute)' }}>{r.campaign}</div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--hairline)',
                    color: sentimentStyle[r.sentiment]?.color || 'var(--mute)',
                    background: sentimentStyle[r.sentiment]?.bg || 'transparent',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    display: 'inline-block',
                  }}>{sentimentStyle[r.sentiment]?.label || r.sentiment}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)' }}>{r.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
