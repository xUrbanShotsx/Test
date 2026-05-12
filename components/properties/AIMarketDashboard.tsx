'use client'

import { useState, useEffect } from 'react'

interface Property {
  id: string
  address: string
  suburb: string
  state: string
  postcode: string
  bedrooms?: number
  bathrooms?: number
  carSpaces?: number
  price?: number
  displayPrice?: string
  status: string
  features: string[]
  leads: number
  daysListed: number
}

// Generate suburb-specific market data
function getMarketData(suburb: string, price: number) {
  const base = {
    'Wollongong': { median: 1180000, growth: 8.4, dom: 18, clearance: 94, buyerDemand: 88, trend: 'rising' },
    'Thirroul':   { median: 1340000, growth: 11.2, dom: 14, clearance: 97, buyerDemand: 94, trend: 'rising' },
    'Bulli':      { median: 1290000, growth: 9.8, dom: 16, clearance: 95, buyerDemand: 91, trend: 'rising' },
    'Corrimal':   { median: 890000, growth: 7.2, dom: 22, clearance: 88, buyerDemand: 76, trend: 'stable' },
    'Coal Cliff': { median: 1450000, growth: 13.1, dom: 28, clearance: 82, buyerDemand: 71, trend: 'stable' },
  }
  return base[suburb as keyof typeof base] || { median: 1050000, growth: 8.0, dom: 20, clearance: 90, buyerDemand: 82, trend: 'rising' }
}

function getComparables(suburb: string, beds: number) {
  const comps: Record<string, Array<{ address: string; price: string; beds: number; date: string; dom: number; sqm: string }>> = {
    'Wollongong': [
      { address: '14 Cliff Drive', price: '$1,340,000', beds: 4, date: '12 May', dom: 12, sqm: '640m²' },
      { address: '7 Ocean Terrace', price: '$1,125,000', beds: 3, date: '8 May', dom: 8, sqm: '520m²' },
      { address: '22 Headland Rd', price: '$1,490,000', beds: 4, date: '2 May', dom: 21, sqm: '710m²' },
      { address: '5 Beach Parade', price: '$985,000', beds: 3, date: '28 Apr', dom: 16, sqm: '480m²' },
    ],
    'Thirroul': [
      { address: '3 Lawrence Ave', price: '$1,420,000', beds: 4, date: '10 May', dom: 9, sqm: '650m²' },
      { address: '18 Station St', price: '$1,285,000', beds: 3, date: '5 May', dom: 14, sqm: '580m²' },
      { address: '9 Nicholson Rd', price: '$1,580,000', beds: 4, date: '1 May', dom: 18, sqm: '720m²' },
      { address: '24 Railway Pde', price: '$1,190,000', beds: 3, date: '25 Apr', dom: 22, sqm: '490m²' },
    ],
    'Bulli': [
      { address: '8 Pass Rd', price: '$1,350,000', beds: 4, date: '11 May', dom: 11, sqm: '580m²' },
      { address: '12 Farrell Rd', price: '$1,195,000', beds: 3, date: '4 May', dom: 19, sqm: '510m²' },
      { address: '3 Martins Lane', price: '$1,480,000', beds: 5, date: '29 Apr', dom: 7, sqm: '760m²' },
      { address: '21 Congradine Rd', price: '$1,080,000', beds: 3, date: '22 Apr', dom: 25, sqm: '460m²' },
    ],
  }
  return (comps[suburb] || comps['Wollongong'])
}

function getRecommendedPrice(displayPrice: string | undefined, market: ReturnType<typeof getMarketData>, price: number) {
  const low = Math.round(price * 0.96 / 1000) * 1000
  const high = Math.round(price * 1.06 / 1000) * 1000
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  return { range: `${fmt(low)} – ${fmt(high)}`, low, high, midpoint: Math.round((low + high) / 2) }
}

const STRATEGY_ITEMS = [
  { week: 'W1', actions: ['Professional photography + drone footage', 'List on realestate.com.au + domain.com.au', 'Launch email campaign to 800+ buyer database', 'Boost Facebook/Instagram ads targeting suburb buyers'] },
  { week: 'W2', actions: ['Open home Saturday 10–10:30am', 'SMS blast to matched buyer database', 'Just Listed neighbour drop (200 homes)', 'Follow up all inspection attendees'] },
  { week: 'W3', actions: ['Review buyer feedback + adjust price if needed', 'Mid-campaign email update to interested parties', 'Social media story sequence', 'Private viewings for serious buyers'] },
  { week: 'W4', actions: ['Final open home or auction', 'Last-chance SMS to shortlisted buyers', 'Vendor update meeting', 'Contract review and offers'] },
]

interface Props {
  property: Property
  onClose: () => void
}

export default function AIMarketDashboard({ property: p, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparables' | 'strategy' | 'ads'>('overview')
  const [isAnalysing, setIsAnalysing] = useState(true)

  const market = getMarketData(p.suburb, p.price || 1000000)
  const comps = getComparables(p.suburb, p.bedrooms || 3)
  const recPrice = getRecommendedPrice(p.displayPrice, market, p.price || 1000000)

  useEffect(() => {
    const t = setTimeout(() => setIsAnalysing(false), 900)
    return () => clearTimeout(t)
  }, [p.id])

  const priceVsMarket = p.price ? ((p.price - market.median) / market.median * 100).toFixed(1) : '0'
  const priceAbove = parseFloat(priceVsMarket) > 0

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(2px)' }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(860px, 90vw)',
        background: 'var(--bg)', borderLeft: '1px solid var(--border)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.22s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <style>{`@keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

        {/* Header */}
        <div style={{ padding: '18px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--fg4)', textTransform: 'uppercase' }}>✦ AI Market Analysis</div>
              {isAnalysing && <div style={{ display: 'flex', gap: 3 }}><span className="dot" /><span className="dot" /><span className="dot" /></div>}
              {!isAnalysing && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: 'var(--fg)', color: 'var(--bg)' }}>Live</span>}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{p.address}</div>
            <div style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>
              {p.suburb}, {p.state} · {p.bedrooms}bd {p.bathrooms}ba {p.carSpaces}car · {p.displayPrice}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px', flexShrink: 0 }}>✕ Close</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px', flexShrink: 0 }}>
          {(['overview', 'comparables', 'strategy', 'ads'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 14px', fontSize: 12, fontWeight: activeTab === tab ? 700 : 400,
                color: activeTab === tab ? 'var(--fg)' : 'var(--fg3)',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--fg)' : '2px solid transparent',
                cursor: 'pointer', marginBottom: -1, textTransform: 'capitalize',
              }}>
              {tab === 'overview' ? 'Market Overview' : tab === 'comparables' ? 'Comparable Sales' : tab === 'strategy' ? 'Marketing Strategy' : 'Ad Copy & Targeting'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {isAnalysing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[100, 60, 80, 45].map((w, i) => <div key={i} className="skeleton" style={{ height: 72, width: `${w}%`, borderRadius: 8 }} />)}
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* AI Summary banner */}
                  <div style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>✦</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>AI Market Summary</div>
                        <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.7 }}>
                          {p.suburb} is currently a <strong>strong seller's market</strong> with {market.clearance}% clearance rate and homes selling in {market.dom} days on average — {20 - market.dom > 0 ? `${20 - market.dom} days faster` : `${market.dom - 20} days slower`} than the broader Illawarra region.
                          Your property is priced <strong>{Math.abs(parseFloat(priceVsMarket))}% {priceAbove ? 'above' : 'below'} the suburb median</strong>, which
                          {priceAbove ? ' positions it as a premium listing — ensure marketing emphasises unique features.' : ' positions it as exceptional value — expect strong early buyer interest.'}{' '}
                          Based on comparable sales and current buyer demand score of <strong>{market.buyerDemand}/100</strong>, we recommend targeting the <strong>{recPrice.range}</strong> price guide.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {[
                      { label: 'Suburb Median', value: `$${(market.median / 1000).toFixed(0)}k`, sub: `+${market.growth}% YOY` },
                      { label: 'Avg Days on Market', value: `${market.dom}d`, sub: 'Illawarra avg: 20d' },
                      { label: 'Clearance Rate', value: `${market.clearance}%`, sub: 'Last 30 days' },
                      { label: 'Buyer Demand', value: `${market.buyerDemand}/100`, sub: market.trend === 'rising' ? '↑ Rising' : '→ Stable' },
                    ].map(m => (
                      <div key={m.label} style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
                        <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{m.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{m.value}</div>
                        <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 4 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Price recommendation */}
                  <div style={{ padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>AI Price Recommendation</div>
                        <div style={{ fontSize: 11, color: 'var(--fg3)' }}>Based on {comps.length} comparable sales in {p.suburb}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{recPrice.range}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>Recommended guide price</div>
                      </div>
                    </div>

                    {/* Price range bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg4)', marginBottom: 4 }}>
                        <span>Market floor</span><span>Your listing</span><span>Premium ceiling</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 99, position: 'relative', overflow: 'visible' }}>
                        <div style={{ position: 'absolute', left: '15%', right: '15%', top: 0, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
                        <div style={{ position: 'absolute', left: `${Math.max(20, Math.min(75, 45 + parseFloat(priceVsMarket)))}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 14, height: 14, background: 'var(--fg)', borderRadius: '50%', border: '2px solid var(--bg)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Market trend visual */}
                  <div style={{ padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 14 }}>{p.suburb} Price Trend — Last 6 Months</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                      {[72, 76, 79, 82, 87, 100].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', height: `${h * 0.8}%`, background: i === 5 ? 'var(--fg)' : `rgba(255,255,255,${0.1 + i * 0.07})`, borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                          <div style={{ fontSize: 9, color: 'var(--fg4)' }}>{['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg3)' }}>Median sale price up <strong style={{ color: 'var(--fg)' }}>{market.growth}%</strong> year-on-year · {market.trend === 'rising' ? 'Upward trajectory continuing' : 'Market stabilising'}</div>
                  </div>

                  {/* Buyer profile */}
                  <div style={{ padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 14 }}>Likely Buyer Profile</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        { label: 'Primary buyer type', value: 'Families upsizing (32%)' },
                        { label: 'Secondary buyer type', value: 'Sea-changers from Sydney (28%)' },
                        { label: 'Typical budget', value: `${recPrice.range}` },
                        { label: 'Key motivators', value: 'Lifestyle, schools, space' },
                        { label: 'Search behaviour', value: 'Active on REA, inspecting quickly' },
                        { label: 'Decision timeline', value: '2–5 weeks from first inspection' },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border2)' }}>
                          <span style={{ fontSize: 11, color: 'var(--fg4)' }}>{item.label}</span>
                          <span style={{ fontSize: 11, color: 'var(--fg)', fontWeight: 600, textAlign: 'right' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COMPARABLES */}
              {activeTab === 'comparables' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.7 }}>
                      ✦ <strong>AI analysis:</strong> Based on {comps.length} comparable sales within 1km of {p.address} in the last 60 days, the market is supporting prices of <strong>{recPrice.range}</strong>. Comparable properties with {p.bedrooms} bedrooms averaged <strong>${(comps.reduce((a, c) => a + parseInt(c.price.replace(/[$,]/g, '')), 0) / comps.length / 1000).toFixed(0)}k</strong> and sold in <strong>{market.dom} days</strong>.
                    </div>
                  </div>

                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px 90px 80px', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    {['Address', 'Sale Price', 'Beds', 'Date Sold', 'Days on Mkt'].map(h => (
                      <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                    ))}
                  </div>

                  {comps.map((c, i) => {
                    const saleAmt = parseInt(c.price.replace(/[$,]/g, ''))
                    const diff = p.price ? ((saleAmt - p.price) / p.price * 100).toFixed(1) : '0'
                    return (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px 90px 80px', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border2)', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{c.address}</div>
                          <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 2 }}>{p.suburb} · {c.sqm}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{c.price}</div>
                          <div style={{ fontSize: 10, marginTop: 2, color: parseFloat(diff) >= 0 ? 'var(--fg3)' : 'var(--fg3)' }}>
                            {parseFloat(diff) > 0 ? `+${diff}%` : `${diff}%`} vs yours
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--fg3)' }}>{c.beds} bed</div>
                        <div style={{ fontSize: 12, color: 'var(--fg3)' }}>{c.date}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 3, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min((c.dom / 35) * 100, 100)}%`, height: '100%', background: c.dom <= 14 ? 'var(--fg)' : 'var(--fg3)', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--fg3)', flexShrink: 0 }}>{c.dom}d</span>
                        </div>
                      </div>
                    )
                  })}

                  <div style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, marginTop: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 10 }}>Price Adjustment Factors</div>
                    {[
                      { factor: 'Ocean / water views', impact: '+8–15%', present: p.features.some(f => f.toLowerCase().includes('view')) },
                      { factor: 'Pool / outdoor entertaining', impact: '+5–10%', present: p.features.some(f => f.toLowerCase().includes('pool') || f.toLowerCase().includes('deck')) },
                      { factor: 'Renovated / modern kitchen', impact: '+4–8%', present: p.features.some(f => f.toLowerCase().includes('renovat') || f.toLowerCase().includes('kitchen')) },
                      { factor: 'Large block (600m²+)', impact: '+6–12%', present: p.features.some(f => f.toLowerCase().includes('m²') || f.toLowerCase().includes('block')) },
                      { factor: 'Dual income / granny flat', impact: '+10–18%', present: p.features.some(f => f.toLowerCase().includes('granny') || f.toLowerCase().includes('dual')) },
                    ].map(f => (
                      <div key={f.factor} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: f.present ? 'var(--fg)' : 'var(--fg4)', fontWeight: f.present ? 600 : 400 }}>{f.factor}</span>
                          {f.present && <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 2, background: 'var(--fg)', color: 'var(--bg)' }}>Present</span>}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.present ? 'var(--fg)' : 'var(--fg4)' }}>{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STRATEGY */}
              {activeTab === 'strategy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.7 }}>
                      ✦ <strong>AI recommendation:</strong> For {p.address}, we recommend a <strong>4-week structured campaign</strong> targeting families and sea-changers from Sydney. Lead with {p.features[0]?.toLowerCase() || 'key features'} in all marketing. Target launch: <strong>Saturday 17 May</strong> to capture weekend inspection traffic.
                    </div>
                  </div>

                  {STRATEGY_ITEMS.map((week, wi) => (
                    <div key={wi} style={{ display: 'flex', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: wi === 0 ? 'var(--fg)' : 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: wi === 0 ? 'var(--bg)' : 'var(--fg3)' }}>{week.week}</div>
                        {wi < STRATEGY_ITEMS.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', margin: '6px 0' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: wi < STRATEGY_ITEMS.length - 1 ? 16 : 0 }}>
                        <div style={{ padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                          {week.actions.map((action, ai) => (
                            <div key={ai} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: ai < week.actions.length - 1 ? 10 : 0 }}>
                              <span style={{ fontSize: 12, color: 'var(--fg4)', flexShrink: 0, marginTop: 1 }}>◦</span>
                              <span style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5 }}>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button className="btn btn-primary" style={{ fontSize: 13 }}>Launch This Strategy</button>
                    <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setActiveTab('ads')}>Generate Ad Copy →</button>
                  </div>
                </div>
              )}

              {/* AD COPY & TARGETING */}
              {activeTab === 'ads' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Facebook ad mockup */}
                  <div>
                    <label className="label-upper" style={{ marginBottom: 10 }}>Facebook / Instagram Ad</label>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden', background: 'var(--surface)' }}>
                      {/* Ad image placeholder */}
                      <div style={{ height: 200, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ textAlign: 'center', color: 'var(--fg4)' }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>◻</div>
                          <div style={{ fontSize: 11 }}>Property photo goes here</div>
                          <div style={{ fontSize: 10, marginTop: 4 }}>1200 × 628px recommended</div>
                        </div>
                        <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--fg)', color: 'var(--bg)', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 3 }}>Sponsored</div>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>{p.address}, {p.suburb} — {p.displayPrice}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5, marginBottom: 12 }}>
                          {p.bedrooms} bed · {p.bathrooms} bath · {p.features[0]}. {p.features.length > 1 ? p.features[1] + '. ' : ''} Don't miss this outstanding opportunity in {p.suburb}. Inspection this Saturday.
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 10, color: 'var(--fg4)' }}>innovate-ai.com.au</span>
                          <div style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: 'var(--fg)', color: 'var(--bg)', borderRadius: 4 }}>Learn More</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ad copy variants */}
                  <div>
                    <label className="label-upper" style={{ marginBottom: 10 }}>Ad Copy Variants</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Headline A — Feature-led', copy: `${p.features[0]} in ${p.suburb} — ${p.displayPrice}` },
                        { label: 'Headline B — Urgency', copy: `New to market: ${p.address} — Inspect this Saturday` },
                        { label: 'Headline C — Value', copy: `Exceptional ${p.suburb} opportunity — ${p.bedrooms} bed from ${p.displayPrice}` },
                      ].map((v, i) => (
                        <div key={i} style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 7 }}>
                          <div style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{v.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{v.copy}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Targeting brief */}
                  <div style={{ padding: '20px 22px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 14 }}>AI Targeting Brief</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Platform', value: 'Facebook + Instagram' },
                        { label: 'Primary audience', value: `Homeowners 35–55 in Sydney + ${p.suburb} area` },
                        { label: 'Secondary audience', value: 'People who follow real estate / lifestyle pages' },
                        { label: 'Retargeting', value: 'Website visitors + video viewers (3-day window)' },
                        { label: 'Budget recommendation', value: '$400–600 over 3 weeks' },
                        { label: 'Bid strategy', value: 'Lowest cost — optimise for link clicks' },
                        { label: 'Geographic radius', value: `${p.suburb} + 25km (target Sydney commuters)` },
                        { label: 'Interests to target', value: 'Real estate, home buying, lifestyle, renovation' },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border2)' }}>
                          <span style={{ fontSize: 11, color: 'var(--fg4)', flexShrink: 0 }}>{item.label}</span>
                          <span style={{ fontSize: 11, color: 'var(--fg)', fontWeight: 600, textAlign: 'right' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" style={{ fontSize: 13 }}>Export Ad Brief</button>
                    <button className="btn btn-ghost" style={{ fontSize: 13 }}>Open in Canva</button>
                    <button className="btn btn-ghost" style={{ fontSize: 13 }}>Boost on Facebook →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
