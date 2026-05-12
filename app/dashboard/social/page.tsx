'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AIPostComposer from '@/components/social/AIPostComposer'
import SocialCalendar from '@/components/social/SocialCalendar'
import SocialAccounts from '@/components/social/SocialAccounts'
import AdsBudget from '@/components/social/AdsBudget'

const TABS = ['Accounts', 'Compose', 'Ads', 'Scheduled', 'Published', 'Analytics']

const metrics = [
  { label: 'Posts this month', value: '24', sub: 'Vendor + property' },
  { label: 'Total reach', value: '48.2k', sub: 'Across all platforms' },
  { label: 'Vendor enquiries via social', value: '9', sub: 'This month' },
  { label: 'Avg engagement', value: '6.8%', sub: 'Industry avg 2.1%' },
]

function SocialPageInner() {
  const searchParams = useSearchParams()
  const connectedParam = searchParams.get('connected')
  const tabParam = searchParams.get('tab')

  const topupParam = searchParams.get('topup')
  const amountParam = searchParams.get('amount')
  const [activeTab, setActiveTab] = useState<string>(() => tabParam ?? 'Accounts')

  // If redirected back after OAuth or Stripe, switch to correct tab
  useEffect(() => {
    if (connectedParam || tabParam === 'Accounts') setActiveTab('Accounts')
    else if (tabParam === 'Ads' || topupParam) setActiveTab('Ads')
  }, [connectedParam, tabParam, topupParam])

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
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px', fontSize: 13, fontWeight: 400,
                color: activeTab === tab ? 'var(--ink)' : 'var(--mute)',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '1px solid var(--ink)' : '1px solid transparent',
                cursor: 'pointer', marginBottom: -1,
                fontFamily: 'var(--font-display)',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
              {tab}
              {tab === 'Accounts' && <AccountsBadge />}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'Accounts'   && <SocialAccounts connectedParam={connectedParam} />}
          {activeTab === 'Compose'    && <AIPostComposer />}
          {activeTab === 'Ads'        && <AdsBudget topupParam={topupParam} amountParam={amountParam} />}
          {activeTab === 'Scheduled'  && <SocialCalendar />}
          {activeTab === 'Published'  && <PublishedPosts />}
          {activeTab === 'Analytics'  && <SocialAnalytics />}
        </div>
      </div>
    </div>
  )
}

/** Small live badge showing connected account count */
function AccountsBadge() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    fetch('/api/social/accounts')
      .then(r => r.json())
      .then(d => setCount((d.accounts as { connected: boolean }[]).filter(a => a.connected).length))
      .catch(() => null)
  }, [])
  if (count === null) return null
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 400,
      padding: '1px 6px', borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--hairline)',
      background: count > 0 ? 'var(--ink)' : 'transparent',
      color: count > 0 ? 'var(--canvas)' : 'var(--mute)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{count > 0 ? count : '!'}</span>
  )
}

export default function SocialPage() {
  return (
    <Suspense fallback={null}>
      <SocialPageInner />
    </Suspense>
  )
}

function PublishedPosts() {
  const posts = [
    { platform: 'Instagram', type: 'Vendor', caption: 'Just sold in your street — and buyers are still looking. Find out what your home is worth with a free appraisal.', date: '2 days ago', reach: 4200, engagement: '8.4%' },
    { platform: 'Facebook', type: 'Vendor', caption: 'Thinking about selling? The Wollongong market is moving fast — median up 8% this year. Book your free appraisal today.', date: '4 days ago', reach: 6100, engagement: '5.2%' },
    { platform: 'Instagram', type: 'Property', caption: 'NEW LISTING: 12 Ocean Ave, Wollongong — 4 bed · 2 bath · ocean views. Inspection Sat 10am.', date: '5 days ago', reach: 5800, engagement: '9.1%' },
    { platform: 'Facebook', type: 'Vendor', caption: 'JUST SOLD — 12 Ocean Ave, Wollongong. Congratulations to our clients! We have buyers still searching in this area.', date: '1 week ago', reach: 7200, engagement: '11.8%' },
    { platform: 'LinkedIn', type: 'Market', caption: 'Wollongong property values rose 8.3% in the past 12 months. Our team has seen unprecedented buyer demand — a sellers market.', date: '1 week ago', reach: 3100, engagement: '14.2%' },
    { platform: 'Instagram', type: 'Vendor', caption: 'Did you know? Homes listed with professional photography sell 32% faster. Our vendors get a full photography package included.', date: '2 weeks ago', reach: 5400, engagement: '7.6%' },
  ]

  const typeStyle: Record<string, { bg: string; color: string }> = {
    Vendor:   { bg: 'var(--fg)', color: 'var(--bg)' },
    Property: { bg: 'var(--surface3)', color: 'var(--fg3)' },
    Market:   { bg: 'var(--surface2)', color: 'var(--fg2)' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{posts.length} posts published</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Instagram', 'Facebook', 'LinkedIn'].map(f => (
            <button key={f} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {posts.map((p, i) => (
          <div key={i} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 9, background: 'var(--surface)' }} className="row-hover">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, border: '1px solid var(--border)', color: 'var(--fg3)' }}>{p.platform}</span>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 3, ...typeStyle[p.type] }}>{p.type}</span>
              <span style={{ fontSize: 11, color: 'var(--fg4)', marginLeft: 'auto' }}>{p.date}</span>
            </div>
            <div style={{ height: 80, background: 'var(--surface2)', borderRadius: 5, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Image / Graphic</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5, marginBottom: 14 }}>
              {p.caption.slice(0, 110)}{p.caption.length > 110 ? '…' : ''}
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Reach</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg)' }}>{p.reach.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Engagement</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg)' }}>{p.engagement}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialAnalytics() {
  const platforms = [
    { name: 'Instagram', followers: '2.4k', reach: '28.4k', engagement: '7.8%', posts: 14 },
    { name: 'Facebook', followers: '1.8k', reach: '15.2k', engagement: '4.2%', posts: 8 },
    { name: 'LinkedIn', followers: '840', reach: '4.6k', engagement: '9.4%', posts: 6 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {platforms.map((p) => (
          <div key={p.name} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 14 }}>{p.name}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Followers', val: p.followers },
                { label: 'Reach', val: p.reach },
                { label: 'Engagement', val: p.engagement },
                { label: 'Posts', val: String(p.posts) },
              ].map((m) => (
                <div key={m.label}>
                  <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--fg4)', fontSize: 13 }}>
        <div style={{ fontSize: 11, color: 'var(--fg3)', fontWeight: 600, marginBottom: 6 }}>Connect accounts to see live analytics</div>
        <div style={{ fontSize: 11 }}>Real engagement data appears here once your Instagram, Facebook and LinkedIn accounts are linked</div>
      </div>
    </div>
  )
}
