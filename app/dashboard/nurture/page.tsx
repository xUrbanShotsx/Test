'use client'

import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const ALL_LEADS = [
  { id: 1,  name: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong',        score: 94, status: 'Hot',  stage: 'Appraisal Done',    source: 'Email',    phone: '0412 345 678', suburb: 'Wollongong', daysInPipeline: 3  },
  { id: 2,  name: 'Lisa Park',      address: '18 Panorama Dr, Bulli',           score: 89, status: 'Hot',  stage: 'Appraisal Booked',  source: 'Referral', phone: '0478 234 567', suburb: 'Bulli',      daysInPipeline: 1  },
  { id: 3,  name: 'Jenny Liu',      address: '8 Beach Rd, Thirroul',            score: 82, status: 'Hot',  stage: 'Interested',        source: 'Referral', phone: '0456 789 012', suburb: 'Thirroul',   daysInPipeline: 2  },
  { id: 4,  name: 'Mark Evans',     address: '5 Summit Rd, Wollongong',         score: 74, status: 'Warm', stage: 'Appraisal Done',    source: 'SMS',      phone: '0489 345 678', suburb: 'Wollongong', daysInPipeline: 6  },
  { id: 5,  name: 'Tom Bradley',    address: '15 Cliff Dr, Bulli',              score: 71, status: 'Warm', stage: 'Interested',        source: 'SMS',      phone: '0423 456 789', suburb: 'Bulli',      daysInPipeline: 8  },
  { id: 6,  name: 'Amanda Ross',    address: '23 Corrimal St, Corrimal',        score: 68, status: 'Warm', stage: 'Appraisal Booked',  source: 'Social',   phone: '0434 567 890', suburb: 'Corrimal',   daysInPipeline: 5  },
  { id: 7,  name: 'Helen Carter',   address: '9 Harbour View, Thirroul',        score: 51, status: 'Warm', stage: 'Contacted',         source: 'Email',    phone: '0401 111 222', suburb: 'Thirroul',   daysInPipeline: 11 },
  { id: 8,  name: 'James Wu',       address: '33 Railway St, Fairy Meadow',     score: 48, status: 'Warm', stage: 'Contacted',         source: 'Campaign', phone: '0412 777 888', suburb: 'Fairy Meadow', daysInPipeline: 9 },
  { id: 9,  name: 'David Chen',     address: '44 Marine Dr, Wollongong',        score: 42, status: 'Cold', stage: 'Contacted',         source: 'Campaign', phone: '0445 678 901', suburb: 'Wollongong', daysInPipeline: 14 },
  { id: 10, name: 'Robert Kim',     address: '31 Hill St, Fairy Meadow',        score: 35, status: 'Cold', stage: 'Contacted',         source: 'Email',    phone: '0467 890 123', suburb: 'Fairy Meadow', daysInPipeline: 21 },
  { id: 11, name: 'Nancy Chen',     address: '17 Bong Bong St, Corrimal',       score: 29, status: 'Cold', stage: 'Contacted',         source: 'Email',    phone: '0499 321 654', suburb: 'Corrimal',   daysInPipeline: 18 },
  { id: 12, name: 'Peter Walsh',    address: '6 Prospect Rd, Bulli',            score: 22, status: 'Cold', stage: 'Contacted',         source: 'Campaign', phone: '0488 654 321', suburb: 'Bulli',      daysInPipeline: 25 },
]

const NURTURE_GOALS = [
  { id: 'book-appraisal', label: 'Book an Appraisal', desc: 'Drive leads toward booking a free property appraisal', icon: '◈' },
  { id: 'warm-up',        label: 'Warm Up Cold Lead', desc: 'Build awareness and trust with unresponsive leads', icon: '◎' },
  { id: 'market-update',  label: 'Share Market Insights', desc: 'Send suburb data to re-engage and educate', icon: '◇' },
  { id: 'just-sold',      label: 'Just Sold Follow-up', desc: 'Leverage a nearby sale to generate urgency', icon: '⬡' },
  { id: 'convert',        label: 'Convert to Listing', desc: 'Push warm/done-appraisal leads to list with you', icon: '◉' },
]

const INTENSITIES = [
  { id: 'single',   label: 'Single Touch',   desc: '1 personalised message — non-intrusive', touches: 1 },
  { id: 'standard', label: '3-Step Sequence', desc: 'Email → SMS → Follow-up (7 days)', touches: 3 },
  { id: 'full',     label: 'Full Nurture',    desc: 'Email + SMS + Social Ad — 14 days', touches: 6 },
]

// ── AI content generators ─────────────────────────────────────────────────────

function generateEmail(lead: typeof ALL_LEADS[0], goal: string) {
  const templates: Record<string, { subject: string; body: string }> = {
    'book-appraisal': {
      subject: `${lead.name.split(' ')[0]}, find out what your ${lead.suburb} home is worth`,
      body: `Hi ${lead.name.split(' ')[0]},\n\nI hope this finds you well. The ${lead.suburb} property market has been moving quickly — median prices are up 8.4% this year and homes are selling in just 18 days on average.\n\nGiven your property at ${lead.address}, I'd love to provide you with a complimentary, no-obligation market appraisal so you can see exactly what you could achieve in today's market.\n\nIt takes less than an hour and comes with:\n• A detailed comparable sales analysis\n• Current buyer demand data for your street\n• A recommended price range based on live market conditions\n\nWould you be available for a quick call this week to arrange a time that suits you?\n\nWarm regards,\nJames Spinelli\nInnovate.AI Realty\n0412 345 678`,
    },
    'warm-up': {
      subject: `${lead.suburb} property market update — May 2025`,
      body: `Hi ${lead.name.split(' ')[0]},\n\nI wanted to share some interesting data on the ${lead.suburb} market that I thought you'd find useful.\n\nThis month: the suburb median is sitting at $1.18M, up 8.4% on last year. More importantly, buyer demand is at its highest since 2022 — with multiple offers becoming common on well-positioned homes.\n\nFor homeowners in your area, this represents a compelling window.\n\nNo obligation — I simply thought you'd appreciate knowing the landscape. If you ever want to chat through what this means for ${lead.address}, I'm always happy to grab a coffee.\n\nJames Spinelli\nInnovate.AI Realty`,
    },
    'just-sold': {
      subject: `We just sold nearby — here's what it means for you`,
      body: `Hi ${lead.name.split(' ')[0]},\n\nExciting news — we recently achieved an outstanding result for a vendor close to ${lead.suburb}, selling in just 12 days with multiple offers.\n\nThis result gives us clear evidence of what buyers are willing to pay in your area right now — and we still have buyers who missed out actively searching.\n\nIf you've ever thought about selling ${lead.address}, the timing genuinely couldn't be better. I'd love to show you exactly what we could achieve for your home.\n\nFree appraisal, zero pressure.\n\nJames Spinelli\nInnovate.AI Realty\n0412 345 678`,
    },
    'convert': {
      subject: `${lead.name.split(' ')[0]} — following up on your appraisal`,
      body: `Hi ${lead.name.split(' ')[0]},\n\nI wanted to follow up on the appraisal we completed for ${lead.address}.\n\nSince we last spoke, we've seen two similar properties go under offer in ${lead.suburb} — both achieving close to the top of our estimated range. Buyer competition remains strong.\n\nI know making the decision to sell is a big one, and I want you to feel completely comfortable. I'd love to catch up for 20 minutes to answer any remaining questions and walk you through our marketing plan.\n\nCould we arrange a time this week?\n\nJames Spinelli\nInnovate.AI Realty`,
    },
    'market-update': {
      subject: `${lead.suburb} market snapshot — what's changed this month`,
      body: `Hi ${lead.name.split(' ')[0]},\n\nHere's a quick snapshot of what's happening in the ${lead.suburb} property market:\n\n📊 Median price: $1.18M (+8.4% year-on-year)\n⏱️ Average days on market: 18 days\n✅ Clearance rate: 94% (highest since 2021)\n👥 Active buyers searching right now: 47\n\nWhat this means for you: if you own property in ${lead.suburb}, you're sitting on significant equity and there's a deep pool of motivated buyers ready to act.\n\nHappy to talk through what this means for ${lead.address} anytime.\n\nJames Spinelli\nInnovate.AI Realty`,
    },
  }
  return templates[goal] || templates['book-appraisal']
}

function generateSMS(lead: typeof ALL_LEADS[0], goal: string) {
  const msgs: Record<string, string> = {
    'book-appraisal': `Hi ${lead.name.split(' ')[0]}, it's James from Innovate.AI. The ${lead.suburb} market is moving fast — up 8% this year. Would love to give you a free appraisal for ${lead.address}. No obligation. Reply YES to book a time 🏡`,
    'warm-up':        `Hi ${lead.name.split(' ')[0]}, James here. ${lead.suburb} median prices up 8.4% this year and buyers are competing hard. Your home at ${lead.address} could be worth more than you think. Happy to chat anytime — James 0412 345 678`,
    'just-sold':      `Hi ${lead.name.split(' ')[0]}, James from Innovate.AI. We just sold near ${lead.suburb} with multiple offers. Still have buyers searching — your property at ${lead.address} could be perfect. Want to chat? Reply YES`,
    'convert':        `Hi ${lead.name.split(' ')[0]}, James here — just checking in on ${lead.address}. Two similar homes went under offer this week. The market is strongly in your favour right now. Would love to catch up — free this week?`,
    'market-update':  `Hi ${lead.name.split(' ')[0]}, ${lead.suburb} update: median up 8.4%, clearance 94%, 47 active buyers. Your property at ${lead.address} is well positioned. Happy to share full report — just reply and I'll send it through. — James`,
  }
  return msgs[goal] || msgs['book-appraisal']
}

function generateAd(lead: typeof ALL_LEADS[0], goal: string) {
  const ads: Record<string, { headline: string; body: string; cta: string; targeting: string }> = {
    'book-appraisal': {
      headline: `What's your ${lead.suburb} home worth in 2025?`,
      body: `Property values in ${lead.suburb} are up 8.4% — find out what your home could achieve with a free, no-obligation appraisal from local specialists.`,
      cta: 'Book Free Appraisal',
      targeting: `${lead.suburb} homeowners · Age 35–65 · Property owners · Interests: home ownership, real estate`,
    },
    'warm-up': {
      headline: `${lead.suburb} property market is booming`,
      body: `Median prices up 8.4% this year. Homes selling in 18 days. If you own in ${lead.suburb}, now is the time to understand your property's value.`,
      cta: 'Get Market Report',
      targeting: `${lead.suburb} residents · Age 40–65 · Homeowners · Interests: property investment`,
    },
    'just-sold': {
      headline: `Just sold near you in ${lead.suburb} — buyers still searching`,
      body: `We achieved an outstanding result nearby and still have motivated buyers looking in ${lead.suburb}. Could your home be next?`,
      cta: 'Find Out Now',
      targeting: `${lead.suburb} · 3km radius · Homeowners · Age 35–65`,
    },
    'convert': {
      headline: `${lead.suburb} sellers are achieving premium results`,
      body: `Two similar properties went under offer this week. Motivated buyers are competing. If you've been thinking about selling, now is the moment.`,
      cta: 'Talk to an Expert',
      targeting: `${lead.suburb} property owners · Age 40–65 · Recent real estate searches`,
    },
    'market-update': {
      headline: `${lead.suburb} property market update — May 2025`,
      body: `+8.4% median growth. 94% clearance rate. 47 active buyers searching now. Get your free suburb report from local specialists.`,
      cta: 'Download Report',
      targeting: `${lead.suburb} residents · Homeowners · Age 35–70 · Property interests`,
    },
  }
  return ads[goal] || ads['book-appraisal']
}

const STATUS_DOT: Record<string, string> = { Hot: '#ffffff', Warm: '#888888', Cold: '#333333' }

// ── Component ─────────────────────────────────────────────────────────────────

export default function NurturePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [filterStatus, setFilterStatus] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All')
  const [goalId, setGoalId] = useState('book-appraisal')
  const [intensityId, setIntensityId] = useState('standard')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [previewLeadId, setPreviewLeadId] = useState<number | null>(null)
  const [launched, setLaunched] = useState(false)

  const filtered = ALL_LEADS.filter(l => filterStatus === 'All' || l.status === filterStatus)
  const selected = ALL_LEADS.filter(l => selectedIds.includes(l.id))
  const toggle = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const selectAll = () => setSelectedIds(filtered.map(l => l.id))
  const clearAll = () => setSelectedIds([])

  const intensity = INTENSITIES.find(i => i.id === intensityId)!
  const goal = NURTURE_GOALS.find(g => g.id === goalId)!
  const previewLead = previewLeadId ? ALL_LEADS.find(l => l.id === previewLeadId) || selected[0] : selected[0]

  const runGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => { setIsGenerating(false); setGenerated(true); setPreviewLeadId(selected[0]?.id || null) }, 1200)
  }

  const totalTouches = selected.length * intensity.touches
  const estResponses = Math.round(totalTouches * 0.18)

  if (launched) {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>✦</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em', marginBottom: 10 }}>Nurture Campaign Launched</div>
        <div style={{ fontSize: 14, color: 'var(--fg3)', marginBottom: 32, lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--fg)' }}>{selected.length} leads</strong> enrolled in the <strong style={{ color: 'var(--fg)' }}>{goal.label}</strong> sequence.<br />
          <strong style={{ color: 'var(--fg)' }}>{totalTouches}</strong> personalised touches will be sent over the next {intensityId === 'single' ? '1 day' : intensityId === 'standard' ? '7 days' : '14 days'}.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Leads enrolled', value: selected.length },
            { label: 'Total touches', value: totalTouches },
            { label: 'Est. responses', value: estResponses },
          ].map(s => (
            <div key={s.label} style={{ padding: '20px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--fg)', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => { setLaunched(false); setStep(1); setSelectedIds([]); setGenerated(false) }}>Start New Campaign</button>
          <a href="/dashboard/vendors" style={{ textDecoration: 'none' }}><button className="btn btn-ghost" style={{ fontSize: 13 }}>View Pipeline →</button></a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em' }}>AI Lead Nurture</div>
          <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 3 }}>Select leads · choose a goal · launch personalised email, SMS and social campaigns</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {selectedIds.length > 0 && <span style={{ fontSize: 12, color: 'var(--fg3)' }}>{selectedIds.length} selected</span>}
          {step === 1 && selectedIds.length > 0 && <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setStep(2)}>Configure Nurture →</button>}
          {step === 2 && (
            <>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => { setStep(3); runGenerate() }}>Generate Campaign →</button>
            </>
          )}
          {step === 3 && generated && (
            <>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 20px' }} onClick={() => setLaunched(true)}>
                🚀 Launch Campaign — {selected.length} leads
              </button>
            </>
          )}
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, alignItems: 'center' }}>
        {[{ n: 1, label: 'Select Leads' }, { n: 2, label: 'Configure' }, { n: 3, label: 'Review & Launch' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => { if (s.n < step || (s.n === 2 && selectedIds.length > 0)) setStep(s.n as 1|2|3) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 6,
                background: step === s.n ? 'var(--surface2)' : 'transparent',
                border: `1px solid ${step === s.n ? 'var(--fg4)' : 'transparent'}`,
                cursor: 'pointer',
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800,
                background: step > s.n ? 'var(--fg)' : step === s.n ? 'var(--fg)' : 'var(--surface3)',
                color: step >= s.n ? 'var(--bg)' : 'var(--fg4)',
              }}>{step > s.n ? '✓' : s.n}</div>
              <span style={{ fontSize: 12, fontWeight: step === s.n ? 700 : 400, color: step === s.n ? 'var(--fg)' : 'var(--fg4)' }}>{s.label}</span>
            </button>
            {i < 2 && <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '0 4px' }} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: SELECT LEADS ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['All', 'Hot', 'Warm', 'Cold'] as const).map(f => (
                <button key={f} onClick={() => setFilterStatus(f)} className="btn btn-ghost"
                  style={{ fontSize: 11, padding: '5px 10px', background: filterStatus === f ? 'var(--surface2)' : 'transparent', color: filterStatus === f ? 'var(--fg)' : 'var(--fg3)', borderColor: filterStatus === f ? 'var(--fg4)' : 'var(--border)' }}>
                  {f} ({f === 'All' ? ALL_LEADS.length : ALL_LEADS.filter(l => l.status === f).length})
                </button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {selectedIds.length > 0 && <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{selectedIds.length} selected</span>}
              <button onClick={selectAll} className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}>Select all</button>
              {selectedIds.length > 0 && <button onClick={clearAll} className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}>Clear</button>}
            </div>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 80px 80px 80px 60px', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
            <div />
            {['Vendor Lead', 'Stage', 'Source', 'Status', 'Score', 'Days'].map(h => (
              <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {/* Lead rows */}
          {filtered.map((l, i) => {
            const sel = selectedIds.includes(l.id)
            return (
              <div key={l.id} onClick={() => toggle(l.id)}
                className="row-hover"
                style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr 1fr 80px 80px 80px 60px',
                  gap: 12, padding: '11px 20px', cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border2)' : 'none',
                  background: sel ? 'var(--surface2)' : 'transparent',
                  alignItems: 'center',
                }}>
                {/* Checkbox */}
                <div style={{ width: 16, height: 16, border: `1.5px solid ${sel ? 'var(--fg)' : 'var(--border)'}`, borderRadius: 3, background: sel ? 'var(--fg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {sel && <span style={{ fontSize: 9, color: 'var(--bg)', fontWeight: 900 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 1 }}>{l.address}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg2)' }}>{l.stage}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.source}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[l.status], flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg2)' }}>{l.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${l.score}%`, height: '100%', background: l.score >= 80 ? 'var(--fg)' : 'var(--fg3)', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--fg3)', width: 22, flexShrink: 0 }}>{l.score}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.daysInPipeline}d</div>
              </div>
            )
          })}

          {selectedIds.length > 0 && (
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--fg2)' }}><strong style={{ color: 'var(--fg)' }}>{selectedIds.length}</strong> leads selected — ready to configure</span>
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setStep(2)}>Configure Nurture Campaign →</button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: CONFIGURE ────────────────────────────────────────────── */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Goal */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>Nurture Goal</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 18 }}>What outcome are you trying to achieve with these leads?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {NURTURE_GOALS.map(g => (
                  <button key={g.id} onClick={() => setGoalId(g.id)}
                    style={{
                      padding: '14px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      border: `1px solid ${goalId === g.id ? 'var(--fg3)' : 'var(--border)'}`,
                      background: goalId === g.id ? 'var(--surface2)' : 'var(--surface)',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{g.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: goalId === g.id ? 'var(--fg)' : 'var(--fg2)' }}>{g.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg4)', lineHeight: 1.5 }}>{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>Campaign Intensity</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 18 }}>How many touches per lead?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {INTENSITIES.map(int => (
                  <button key={int.id} onClick={() => setIntensityId(int.id)}
                    style={{
                      padding: '16px 18px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      border: `1px solid ${intensityId === int.id ? 'var(--fg3)' : 'var(--border)'}`,
                      background: intensityId === int.id ? 'var(--surface2)' : 'var(--surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: intensityId === int.id ? 'var(--fg)' : 'var(--fg2)', marginBottom: 3 }}>{int.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg4)' }}>{int.desc}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--fg)' }}>{int.touches}</div>
                      <div style={{ fontSize: 10, color: 'var(--fg4)' }}>touches</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Channels included */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 16 }}>Channels Included</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { label: 'Personalised Email', active: true, desc: 'AI-written per lead' },
                  { label: 'SMS Message', active: intensityId !== 'single' || true, desc: 'Personalised per lead' },
                  { label: 'Facebook/Instagram Ad', active: intensityId === 'full', desc: `Targeting ${selected.map(l => l.suburb).filter((v,i,a)=>a.indexOf(v)===i).join(', ')} homeowners` },
                ].map(ch => (
                  <div key={ch.label} style={{ flex: 1, padding: '14px 16px', border: `1px solid ${ch.active ? 'var(--fg4)' : 'var(--border2)'}`, borderRadius: 8, background: ch.active ? 'var(--surface2)' : 'transparent', opacity: ch.active ? 1 : 0.4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ch.active ? 'var(--fg)' : 'var(--fg4)', marginBottom: 4 }}>
                      {ch.active ? '✓ ' : ''}{ch.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--fg4)' }}>{ch.desc}</div>
                  </div>
                ))}
              </div>
              {intensityId !== 'full' && (
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--fg4)' }}>
                  ↑ Switch to "Full Nurture" to add Facebook/Instagram ads targeting each lead's suburb
                </div>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Campaign Summary</div>
              {[
                ['Selected leads', selected.length],
                ['Goal', goal.label],
                ['Intensity', intensity.label],
                ['Total touches', totalTouches],
                ['Est. responses', `~${estResponses}`],
                ['Duration', intensityId === 'single' ? '1 day' : intensityId === 'standard' ? '7 days' : '14 days'],
              ].map(([label, val]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--fg4)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg)' }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 9 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>Selected Leads</div>
              {selected.map(l => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border2)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[l.status], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg4)' }}>{l.suburb} · Score {l.score}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', fontSize: 13, padding: '12px' }}
              onClick={() => { setStep(3); runGenerate() }}>
              Generate AI Campaign →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW & LAUNCH ──────────────────────────────────────── */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0 }}>
          {/* Lead selector */}
          <div style={{ borderRight: '1px solid var(--border)', paddingRight: 0 }}>
            <div style={{ padding: '14px 16px 10px', fontSize: 11, fontWeight: 700, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>
              {selected.length} Leads
            </div>
            {selected.map(l => (
              <button key={l.id} onClick={() => setPreviewLeadId(l.id)}
                style={{
                  width: '100%', padding: '11px 16px', textAlign: 'left', background: previewLeadId === l.id ? 'var(--surface2)' : 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border2)', cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[l.status], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--fg4)', paddingLeft: 14 }}>{l.suburb} · {l.score}</div>
              </button>
            ))}
          </div>

          {/* Preview panel */}
          <div style={{ padding: '0 0 0 24px' }}>
            {isGenerating ? (
              <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 3 }}><span className="dot" /><span className="dot" /><span className="dot" /></div>
                  <span style={{ fontSize: 12, color: 'var(--fg3)' }}>AI generating personalised content for {selected.length} leads...</span>
                </div>
                {[100, 80, 60, 90, 70].map((w, i) => <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, borderRadius: 4 }} />)}
              </div>
            ) : generated && previewLead ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Lead info bar */}
                <div style={{ padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_DOT[previewLead.status] }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{previewLead.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg4)', marginLeft: 12 }}>{previewLead.address}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--fg3)' }}>Score: {previewLead.score} · {previewLead.stage}</span>
                </div>

                {/* Email preview */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 3, background: 'var(--fg)', color: 'var(--bg)' }}>EMAIL</span>
                    <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Touch 1 · Sent immediately</span>
                  </div>
                  {(() => {
                    const email = generateEmail(previewLead, goalId)
                    return (
                      <>
                        <div style={{ marginBottom: 10, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 5 }}>
                          <span style={{ fontSize: 10, color: 'var(--fg4)' }}>Subject: </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{email.subject}</span>
                        </div>
                        <textarea defaultValue={email.body} rows={10} className="input" style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, fontSize: 12 }} />
                      </>
                    )
                  })()}
                </div>

                {/* SMS preview */}
                {intensityId !== 'single' && (
                  <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 3, background: 'var(--surface3)', color: 'var(--fg2)' }}>SMS</span>
                      <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Touch 2 · Day 2 (if no email reply)</span>
                    </div>
                    <div style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.6 }}>{generateSMS(previewLead, goalId)}</div>
                      <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 8 }}>
                        {generateSMS(previewLead, goalId).length}/160 chars
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Ad preview */}
                {intensityId === 'full' && (() => {
                  const ad = generateAd(previewLead, goalId)
                  return (
                    <div className="card" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 3, background: 'var(--surface2)', color: 'var(--fg3)', border: '1px solid var(--border)' }}>SOCIAL AD</span>
                        <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Touch 3–6 · Retargeting over 14 days</span>
                      </div>
                      {/* Ad mockup */}
                      <div style={{ border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden', marginBottom: 14 }}>
                        <div style={{ height: 140, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Property image · 1200×628px</span>
                        </div>
                        <div style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>{ad.headline}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5, marginBottom: 10 }}>{ad.body}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 10, color: 'var(--fg4)' }}>innovate-ai.com.au</span>
                            <div style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', background: 'var(--fg)', color: 'var(--bg)', borderRadius: 3 }}>{ad.cta}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--fg4)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--fg3)' }}>Targeting:</strong> {ad.targeting}
                      </div>
                    </div>
                  )
                })()}

                {/* Launch bar */}
                <div style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12, color: 'var(--fg2)' }}>
                    Preview for <strong style={{ color: 'var(--fg)' }}>{previewLead.name}</strong> — all {selected.length} leads will receive personalised versions
                  </div>
                  <button className="btn btn-primary" style={{ fontSize: 13, padding: '10px 22px' }} onClick={() => setLaunched(true)}>
                    🚀 Launch Now
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
