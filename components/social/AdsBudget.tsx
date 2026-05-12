'use client'

import { useState, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = 'facebook' | 'instagram' | 'linkedin'
type CampaignObjective = 'VENDOR_LEADS' | 'PROPERTY_VIEWS' | 'BRAND_AWARENESS' | 'APPRAISAL_BOOKINGS'
type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft'

interface Transaction {
  id: string
  type: 'deposit' | 'campaign_spend' | 'refund'
  amount: number
  description: string
  createdAt: string
}

interface Campaign {
  id: string
  name: string
  objective: CampaignObjective
  platforms: Platform[]
  status: CampaignStatus
  dailyBudget: number
  totalBudget: number
  spent: number
  startDate: string
  endDate: string
  headline: string
  body: string
  targetSuburbs: string[]
  ageMin: number
  ageMax: number
  impressions: number
  clicks: number
  leads: number
  createdAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOP_UP_AMOUNTS = [50, 100, 250, 500, 1000]

const OBJECTIVES: { id: CampaignObjective; label: string; desc: string }[] = [
  { id: 'VENDOR_LEADS', label: 'Vendor Leads', desc: 'Target homeowners thinking about selling' },
  { id: 'APPRAISAL_BOOKINGS', label: 'Appraisal Bookings', desc: 'Drive free appraisal appointments' },
  { id: 'PROPERTY_VIEWS', label: 'Property Views', desc: 'Promote a listing to qualified buyers' },
  { id: 'BRAND_AWARENESS', label: 'Brand Awareness', desc: 'Build your profile in target suburbs' },
]

const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

const STATUS_STYLE: Record<CampaignStatus, { label: string; bg: string; color: string }> = {
  active:    { label: 'Active',    bg: 'var(--fg)',      color: 'var(--bg)' },
  paused:    { label: 'Paused',    bg: 'var(--surface3)', color: 'var(--fg2)' },
  completed: { label: 'Done',      bg: 'var(--surface2)', color: 'var(--fg3)' },
  draft:     { label: 'Draft',     bg: 'transparent',   color: 'var(--fg4)' },
}

const AD_COPY: Record<CampaignObjective, { headline: string; body: string }> = {
  VENDOR_LEADS: {
    headline: 'Thinking of Selling in {suburb}?',
    body: 'Get a free, no-obligation market appraisal from {suburb}\'s trusted real estate experts. Find out exactly what your home is worth in today\'s market.',
  },
  APPRAISAL_BOOKINGS: {
    headline: 'Free Home Appraisal — {suburb}',
    body: 'Curious about your home\'s value? Our team has sold over 200 homes across {suburb} and surrounds. Book your free appraisal today — no pressure, just accurate numbers.',
  },
  PROPERTY_VIEWS: {
    headline: 'Just Listed — {suburb}',
    body: 'A stunning new property is now available in {suburb}. Don\'t miss your chance to inspect — limited spots available.',
  },
  BRAND_AWARENESS: {
    headline: 'Wollongong\'s Most Trusted Real Estate Team',
    body: 'James Spinelli and the Innovate.AI Realty team have helped hundreds of families buy and sell across the Illawarra. Local knowledge, exceptional results.',
  },
}

function fmtCents(cents: number, showSign = false) {
  const abs = Math.abs(cents) / 100
  const str = `$${abs.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (showSign && cents > 0) return `+${str}`
  if (showSign && cents < 0) return `-${str}`
  return str
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Campaign Creator ─────────────────────────────────────────────────────────

function CampaignCreator({ balance, onCreated, onClose }: {
  balance: number
  onCreated: (c: Campaign) => void
  onClose: () => void
}) {
  const [step, setStep] = useState(1)
  const [objective, setObjective] = useState<CampaignObjective>('VENDOR_LEADS')
  const [platforms, setPlatforms] = useState<Platform[]>(['facebook', 'instagram'])
  const [suburb, setSuburb] = useState('Wollongong')
  const [ageMin, setAgeMin] = useState(35)
  const [ageMax, setAgeMax] = useState(65)
  const [dailyBudget, setDailyBudget] = useState(20)
  const [days, setDays] = useState(14)
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const totalBudget = dailyBudget * days
  const hasEnough = totalBudget * 100 <= balance

  // Auto-fill copy when objective or suburb changes
  useEffect(() => {
    const tpl = AD_COPY[objective]
    setHeadline(tpl.headline.replace(/\{suburb\}/g, suburb))
    setBody(tpl.body.replace(/\{suburb\}/g, suburb))
  }, [objective, suburb])

  function togglePlatform(p: Platform) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function handleLaunch() {
    if (!platforms.length) { setError('Select at least one platform.'); return }
    if (totalBudget > balance / 100) { setError('Insufficient wallet balance.'); return }
    setSubmitting(true)
    setError('')
    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + days * 86_400_000).toISOString().split('T')[0]

    const res = await fetch('/api/ads/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${OBJECTIVES.find(o => o.id === objective)?.label} — ${suburb}`,
        objective, platforms, dailyBudget, totalBudget,
        startDate, endDate, headline, body,
        targetSuburbs: [suburb], ageMin, ageMax,
      }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.ok) {
      onCreated(data.campaign)
      onClose()
    } else {
      setError(data.error ?? 'Failed to create campaign')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 680, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)' }}>Create Ad Campaign</div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>Step {step} of 3</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg3)', fontSize: 22 }}>×</button>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 0, padding: '0 24px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, background: s <= step ? 'var(--fg)' : 'var(--surface3)', transition: 'background 0.2s' }} />
          ))}
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Step 1: Objective & Platforms ── */}
          {step === 1 && (
            <>
              <div>
                <label className="label-upper">Campaign Objective</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {OBJECTIVES.map(obj => (
                    <div key={obj.id} onClick={() => setObjective(obj.id)} style={{
                      padding: '14px 16px', borderRadius: 9, cursor: 'pointer',
                      border: `1px solid ${objective === obj.id ? 'var(--fg)' : 'var(--border)'}`,
                      background: objective === obj.id ? 'var(--fg)' : 'var(--surface)',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: objective === obj.id ? 'var(--bg)' : 'var(--fg)', marginBottom: 4 }}>{obj.label}</div>
                      <div style={{ fontSize: 11, color: objective === obj.id ? 'rgba(255,255,255,0.7)' : 'var(--fg3)', lineHeight: 1.4 }}>{obj.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-upper">Publish To</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['facebook', 'instagram', 'linkedin'] as Platform[]).map(p => (
                    <button key={p} onClick={() => togglePlatform(p)} style={{
                      padding: '10px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      border: `1px solid ${platforms.includes(p) ? 'var(--fg)' : 'var(--border)'}`,
                      background: platforms.includes(p) ? 'var(--fg)' : 'var(--surface)',
                      color: platforms.includes(p) ? 'var(--bg)' : 'var(--fg2)',
                    }}>{PLATFORM_LABELS[p]}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label-upper">Target Suburb</label>
                  <input className="input" style={{ width: '100%' }} value={suburb} onChange={e => setSuburb(e.target.value)} placeholder="e.g. Wollongong" />
                </div>
                <div>
                  <label className="label-upper">Age Min</label>
                  <input className="input" style={{ width: '100%' }} type="number" value={ageMin} min={18} max={64} onChange={e => setAgeMin(Number(e.target.value))} />
                </div>
                <div>
                  <label className="label-upper">Age Max</label>
                  <input className="input" style={{ width: '100%' }} type="number" value={ageMax} min={19} max={65} onChange={e => setAgeMax(Number(e.target.value))} />
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Budget ── */}
          {step === 2 && (
            <>
              <div style={{ padding: '16px 20px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--fg4)', marginBottom: 4 }}>Wallet Balance</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.03em' }}>{fmtCents(balance)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg4)', marginBottom: 4 }}>This Campaign</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: hasEnough ? 'var(--fg)' : 'var(--fg3)', letterSpacing: '-0.03em' }}>
                    ${totalBudget.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="label-upper">Daily Budget (AUD)</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[10, 20, 30, 50].map(v => (
                      <button key={v} onClick={() => setDailyBudget(v)} style={{
                        padding: '5px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        border: `1px solid ${dailyBudget === v ? 'var(--fg)' : 'var(--border)'}`,
                        background: dailyBudget === v ? 'var(--fg)' : 'var(--surface)',
                        color: dailyBudget === v ? 'var(--bg)' : 'var(--fg2)',
                      }}>${v}</button>
                    ))}
                  </div>
                  <input className="input" style={{ width: '100%' }} type="number" min={5} max={500} value={dailyBudget}
                    onChange={e => setDailyBudget(Number(e.target.value))} />
                </div>
                <div>
                  <label className="label-upper">Duration (Days)</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[7, 14, 21, 30].map(v => (
                      <button key={v} onClick={() => setDays(v)} style={{
                        padding: '5px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        border: `1px solid ${days === v ? 'var(--fg)' : 'var(--border)'}`,
                        background: days === v ? 'var(--fg)' : 'var(--surface)',
                        color: days === v ? 'var(--bg)' : 'var(--fg2)',
                      }}>{v}d</button>
                    ))}
                  </div>
                  <input className="input" style={{ width: '100%' }} type="number" min={1} max={90} value={days}
                    onChange={e => setDays(Number(e.target.value))} />
                </div>
              </div>

              {/* Platform split */}
              <div style={{ padding: '14px 16px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--surface)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg3)', marginBottom: 10 }}>Budget Split</div>
                {platforms.map(p => (
                  <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border2)' }}>
                    <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{PLATFORM_LABELS[p]}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>
                      ${(totalBudget / platforms.length).toFixed(0)}/total · ${(dailyBudget / platforms.length).toFixed(0)}/day
                    </span>
                  </div>
                ))}
              </div>

              {!hasEnough && (
                <div style={{ padding: '10px 14px', borderRadius: 7, background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--fg2)' }}>
                  ⚠ Insufficient balance — top up your wallet to proceed with this budget.
                </div>
              )}
            </>
          )}

          {/* ── Step 3: Ad Copy ── */}
          {step === 3 && (
            <>
              <div style={{ padding: '14px 16px', borderRadius: 9, background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--fg3)' }}>
                ✦ AI-generated copy based on your objective and suburb. Edit freely.
              </div>
              <div>
                <label className="label-upper">Headline</label>
                <input className="input" style={{ width: '100%', fontSize: 14, fontWeight: 700 }} value={headline} onChange={e => setHeadline(e.target.value)} maxLength={90} />
                <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 4, textAlign: 'right' }}>{headline.length}/90</div>
              </div>
              <div>
                <label className="label-upper">Ad Body</label>
                <textarea className="input" style={{ width: '100%', minHeight: 100, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} value={body} onChange={e => setBody(e.target.value)} maxLength={500} />
                <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 4, textAlign: 'right' }}>{body.length}/500</div>
              </div>

              {/* Ad preview */}
              <div>
                <label className="label-upper">Preview</label>
                <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
                  <div style={{ height: 120, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Ad creative image</span>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--fg4)', marginBottom: 4 }}>Innovate.AI Realty · Sponsored</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 6, lineHeight: 1.3 }}>{headline || 'Your headline'}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5, marginBottom: 10 }}>{body.slice(0, 120)}{body.length > 120 ? '…' : ''}</div>
                    <div style={{ padding: '8px 14px', background: 'var(--fg)', color: 'var(--bg)', borderRadius: 5, fontSize: 12, fontWeight: 800, display: 'inline-block' }}>
                      {objective === 'VENDOR_LEADS' || objective === 'APPRAISAL_BOOKINGS' ? 'Get Free Appraisal' : objective === 'PROPERTY_VIEWS' ? 'View Property' : 'Learn More'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ padding: '14px 16px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface2)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Total Budget', value: `$${totalBudget}` },
                  { label: 'Daily Spend', value: `$${dailyBudget}` },
                  { label: 'Duration', value: `${days} days` },
                  { label: 'Platforms', value: platforms.map(p => PLATFORM_LABELS[p]).join(', ') },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 10, color: 'var(--fg4)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 7, background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--fg2)' }}>
                  ✕ {error}
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border2)' }}>
            {step > 1
              ? <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setStep(s => s - 1)}>← Back</button>
              : <div />
            }
            {step < 3
              ? <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setStep(s => s + 1)} disabled={step === 2 && !hasEnough}>
                  Continue →
                </button>
              : <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={handleLaunch} disabled={submitting || !hasEnough}>
                  {submitting ? 'Launching…' : `Launch Campaign — $${totalBudget}`}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Top-Up Modal ─────────────────────────────────────────────────────────────

function TopUpModal({ onClose, onSuccess, stripeConfigured }: {
  onClose: () => void
  onSuccess: (amount: number) => void
  stripeConfigured: boolean
}) {
  const [selected, setSelected] = useState<number>(100)
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const amount = custom ? Number(custom) : selected

  async function handleTopUp() {
    if (amount < 10) { setError('Minimum deposit is $10'); return }
    if (amount > 10000) { setError('Maximum deposit is $10,000'); return }

    if (!stripeConfigured) {
      // Dev mode: credit instantly without Stripe
      onSuccess(amount)
      onClose()
      return
    }

    setLoading(true)
    setError('')
    const res = await fetch('/api/ads/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountAud: amount }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.url) {
      window.location.href = data.url
    } else {
      setError(data.error ?? 'Failed to start checkout')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)' }}>Add Funds to Wallet</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg3)', fontSize: 22 }}>×</button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label-upper">Select Amount (AUD)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {TOP_UP_AMOUNTS.map(v => (
                <button key={v} onClick={() => { setSelected(v); setCustom('') }} style={{
                  padding: '12px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 800,
                  border: `1px solid ${selected === v && !custom ? 'var(--fg)' : 'var(--border)'}`,
                  background: selected === v && !custom ? 'var(--fg)' : 'var(--surface)',
                  color: selected === v && !custom ? 'var(--bg)' : 'var(--fg2)',
                }}>${v}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-upper">Custom Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--fg3)', fontWeight: 600 }}>$</span>
              <input
                className="input"
                style={{ width: '100%', paddingLeft: 26 }}
                type="number"
                min={10}
                max={10000}
                placeholder="Enter amount"
                value={custom}
                onChange={e => { setCustom(e.target.value); setSelected(0) }}
              />
            </div>
          </div>

          {/* What you get */}
          <div style={{ padding: '14px 16px', borderRadius: 9, background: 'var(--surface2)', border: '1px solid var(--border2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg3)', marginBottom: 8 }}>With ${amount} you can run:</div>
            <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.7 }}>
              • <strong>{Math.floor(amount / 20)} days</strong> at $20/day on Facebook + Instagram<br />
              • Reach approx. <strong>{(amount * 180).toLocaleString()}</strong> local homeowners<br />
              • Expected <strong>{Math.floor(amount / 11)}</strong> vendor leads at industry avg
            </div>
          </div>

          {/* Stripe badge */}
          {stripeConfigured ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--fg4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Secure payment via Stripe — we never see your card details
            </div>
          ) : (
            <div style={{ padding: '10px 14px', borderRadius: 7, background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--fg2)' }}>Dev mode:</strong> Stripe not configured — funds will be credited instantly for testing.
              Add <code style={{ fontFamily: 'monospace', background: 'var(--surface3)', padding: '1px 4px', borderRadius: 3 }}>STRIPE_SECRET_KEY</code> to your .env for live payments.
            </div>
          )}

          {error && <div style={{ fontSize: 12, color: 'var(--fg2)', padding: '8px 12px', borderRadius: 6, background: 'var(--surface2)', border: '1px solid var(--border)' }}>✕ {error}</div>}

          <button
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '12px', width: '100%' }}
            onClick={handleTopUp}
            disabled={loading || !amount}
          >
            {loading ? 'Redirecting to Stripe…' : `Add $${amount || '—'} to Wallet`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdsBudget({ topupParam }: { topupParam?: string | null; amountParam?: string | null }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [stripeConfigured, setStripeConfigured] = useState(false)
  const [showTopUp, setShowTopUp] = useState(false)
  const [showCreator, setShowCreator] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'campaigns' | 'history'>('campaigns')

  useEffect(() => {
    fetch('/api/ads/balance')
      .then(r => r.json())
      .then(d => {
        setBalance(d.balance ?? 0)
        setTransactions(d.transactions ?? [])
        setCampaigns(d.campaigns ?? [])
        setStripeConfigured(d.stripeConfigured ?? false)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (topupParam === 'success') {
      setBanner('Payment successful — your wallet has been topped up!')
      setTimeout(() => setBanner(null), 6000)
    } else if (topupParam === 'cancelled') {
      setBanner('Top-up cancelled.')
      setTimeout(() => setBanner(null), 4000)
    }
  }, [topupParam])

  function handleDevTopUp(amount: number) {
    const cents = amount * 100
    setBalance(prev => prev + cents)
    setTransactions(prev => [{
      id: `txn_dev_${Date.now()}`,
      type: 'deposit',
      amount: cents,
      description: `Wallet top-up — $${amount} AUD (dev mode)`,
      createdAt: new Date().toISOString(),
    }, ...prev])
    setBanner(`$${amount} added to your wallet!`)
    setTimeout(() => setBanner(null), 5000)
  }

  function handleCampaignCreated(c: Campaign) {
    setCampaigns(prev => [c, ...prev])
    setBalance(prev => prev - c.totalBudget)
    setTransactions(prev => [{
      id: `txn_${Date.now()}`,
      type: 'campaign_spend',
      amount: -c.totalBudget,
      description: `Campaign: ${c.name}`,
      createdAt: new Date().toISOString(),
    }, ...prev])
    setBanner(`Campaign "${c.name}" launched!`)
    setTimeout(() => setBanner(null), 6000)
  }

  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'active')

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }} />)}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {banner && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--fg)', color: 'var(--bg)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          ✓ {banner}
          <button onClick={() => setBanner(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 18 }}>×</button>
        </div>
      )}

      {/* Wallet + Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
        {/* Wallet card */}
        <div style={{ gridColumn: 'span 1', padding: '20px', borderRadius: 10, background: 'var(--fg)', color: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Ad Wallet</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtCents(balance)}</div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 6, marginBottom: 16 }}>AUD available</div>
          <button
            onClick={() => setShowTopUp(true)}
            style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--bg)', color: 'var(--fg)', border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
          >
            + Add Funds
          </button>
        </div>

        {[
          { label: 'Total Spent', value: fmtCents(totalSpent), sub: 'All campaigns' },
          { label: 'Active Campaigns', value: String(activeCampaigns.length), sub: 'Running now' },
          { label: 'Total Leads', value: String(campaigns.reduce((s, c) => s + c.leads, 0)), sub: 'From ad campaigns' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg4)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--fg4)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Section toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {(['campaigns', 'history'] as const).map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{
              padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: activeSection === s ? 'var(--fg)' : 'var(--surface)',
              color: activeSection === s ? 'var(--bg)' : 'var(--fg3)',
            }}>
              {s === 'campaigns' ? 'Campaigns' : 'Spend History'}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setShowCreator(true)}>
          + New Campaign
        </button>
      </div>

      {/* Campaigns list */}
      {activeSection === 'campaigns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {campaigns.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg3)', marginBottom: 8 }}>No campaigns yet</div>
              <div style={{ fontSize: 12, color: 'var(--fg4)', marginBottom: 16 }}>Create your first ad campaign to reach vendor leads in your target suburbs.</div>
              <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setShowCreator(true)}>Create Campaign →</button>
            </div>
          )}
          {campaigns.map(c => {
            const pct = c.totalBudget > 0 ? Math.min((c.spent / c.totalBudget) * 100, 100) : 0
            const ss = STATUS_STYLE[c.status]
            return (
              <div key={c.id} style={{ padding: 18, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)' }} className="row-hover">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)' }}>{c.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99, ...ss, border: '1px solid var(--border2)' }}>
                        {ss.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {c.platforms.map(p => (
                        <span key={p} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, border: '1px solid var(--border)', color: 'var(--fg3)' }}>
                          {PLATFORM_LABELS[p]}
                        </span>
                      ))}
                      <span style={{ fontSize: 10, color: 'var(--fg4)' }}>{fmtDate(c.startDate)} → {fmtDate(c.endDate)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--fg4)', marginBottom: 2 }}>Budget</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{fmtCents(c.totalBudget)}</div>
                  </div>
                </div>

                {/* Spend bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg4)', marginBottom: 6 }}>
                    <span>Spent {fmtCents(c.spent)}</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--fg)', borderRadius: 99, transition: 'width 0.4s' }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Impressions', value: c.impressions.toLocaleString() },
                    { label: 'Clicks', value: c.clicks.toLocaleString() },
                    { label: 'Leads', value: String(c.leads) },
                    { label: 'Cost/Lead', value: c.leads > 0 ? fmtCents(Math.round(c.spent / c.leads)) : '—' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Transaction history */}
      {activeSection === 'history' && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: 12 }}>
            {['Description', 'Date', 'Amount'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>
          {transactions.length === 0 && (
            <div style={{ padding: '24px 18px', textAlign: 'center', fontSize: 12, color: 'var(--fg4)' }}>No transactions yet</div>
          )}
          {transactions.map(t => (
            <div key={t.id} style={{ padding: '13px 18px', borderBottom: '1px solid var(--border2)', display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: 12, alignItems: 'center' }} className="row-hover">
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', marginBottom: 2 }}>{t.description}</div>
                <div style={{ fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t.type === 'deposit' ? 'Deposit' : t.type === 'campaign_spend' ? 'Campaign' : 'Refund'}
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{fmtDate(t.createdAt)}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.amount > 0 ? 'var(--fg)' : 'var(--fg3)' }}>
                {fmtCents(t.amount, true)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showTopUp && (
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onSuccess={handleDevTopUp}
          stripeConfigured={stripeConfigured}
        />
      )}
      {showCreator && (
        <CampaignCreator
          balance={balance}
          onCreated={handleCampaignCreated}
          onClose={() => setShowCreator(false)}
        />
      )}
    </div>
  )
}
