'use client'

import { useState } from 'react'

const CAMPAIGN_TYPES = [
  { id: 'appraisal', label: "What's Your Home Worth?", tag: 'Vendor' },
  { id: 'just-sold', label: 'Just Sold — Neighbour Drop', tag: 'Vendor' },
  { id: 'market-report', label: 'Suburb Market Report', tag: 'Vendor' },
  { id: 'free-appraisal', label: 'Free Appraisal Offer', tag: 'Vendor' },
  { id: 'new-listing', label: 'New Listing Alert', tag: 'Buyer' },
  { id: 'buyer-alert', label: 'Property Match Alert', tag: 'Buyer' },
  { id: 'price-reduction', label: 'Price Reduction', tag: 'Buyer' },
]

const AUDIENCES: Record<string, string[]> = {
  vendor: ['Suburb Homeowners', 'Past Appraisal Leads', 'Cold Vendor Database', 'Previous Enquiries'],
  buyer: ['Active Buyers', 'Buyer Database', 'First Home Buyers', 'Investors'],
}

export default function AIEmailComposer() {
  const [campaignId, setCampaignId] = useState('appraisal')
  const [audience, setAudience] = useState('Suburb Homeowners')
  const [suburb, setSuburb] = useState('')
  const [agentName, setAgentName] = useState('James Spinelli')
  const [agentPhone, setAgentPhone] = useState('0412 345 678')
  const [soldAddress, setSoldAddress] = useState('')
  const [soldPrice, setSoldPrice] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState<{
    subjects: string[]
    previewText: string
    htmlBody: string
  } | null>(null)
  const [selectedSubject, setSelectedSubject] = useState(0)
  const [activePreview, setActivePreview] = useState<'desktop' | 'mobile'>('desktop')

  const campaign = CAMPAIGN_TYPES.find(c => c.id === campaignId)!
  const isVendor = campaign.tag === 'Vendor'
  const audienceOptions = AUDIENCES[isVendor ? 'vendor' : 'buyer']

  const generate = () => {
    setIsGenerating(true)
    // Instant generation — no API call needed
    setTimeout(() => {
      const result = buildTemplate(campaignId, {
        suburb: suburb || 'Wollongong',
        agentName,
        agentPhone,
        soldAddress: soldAddress || '12 Ocean Ave, Wollongong',
        soldPrice: soldPrice || '$1,250,000',
      })
      setGenerated(result)
      setSelectedSubject(0)
      setIsGenerating(false)
    }, 600)
  }

  // Reset audience when campaign type changes category
  const handleCampaignChange = (id: string) => {
    setCampaignId(id)
    const isV = CAMPAIGN_TYPES.find(c => c.id === id)?.tag === 'Vendor'
    setAudience(isV ? 'Suburb Homeowners' : 'Active Buyers')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minHeight: 600 }}>
      {/* Config panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div>
          <label className="label-upper">Campaign Type</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {CAMPAIGN_TYPES.map(c => (
              <button key={c.id} onClick={() => handleCampaignChange(c.id)}
                style={{
                  padding: '8px 12px', borderRadius: 7, border: `1px solid ${campaignId === c.id ? 'var(--fg3)' : 'var(--border)'}`,
                  background: campaignId === c.id ? 'var(--surface2)' : 'transparent',
                  color: campaignId === c.id ? 'var(--fg)' : 'var(--fg3)',
                  fontSize: 12, fontWeight: campaignId === c.id ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                <span>{c.label}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                  background: c.tag === 'Vendor' ? 'var(--fg)' : 'var(--surface3)',
                  color: c.tag === 'Vendor' ? 'var(--bg)' : 'var(--fg3)',
                }}>{c.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div>
          <label className="label-upper">Send To</label>
          <select value={audience} onChange={e => setAudience(e.target.value)} className="input" style={{ width: '100%' }}>
            {audienceOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="label-upper">Suburb / Area</label>
          <input value={suburb} onChange={e => setSuburb(e.target.value)} placeholder="e.g. Wollongong" className="input" style={{ width: '100%' }} />
        </div>

        {(campaignId === 'just-sold' || campaignId === 'free-appraisal') && (
          <div>
            <label className="label-upper">Sold Address</label>
            <input value={soldAddress} onChange={e => setSoldAddress(e.target.value)} placeholder="12 Ocean Ave, Wollongong" className="input" style={{ width: '100%' }} />
          </div>
        )}

        {campaignId === 'just-sold' && (
          <div>
            <label className="label-upper">Sale Price (optional)</label>
            <input value={soldPrice} onChange={e => setSoldPrice(e.target.value)} placeholder="$1,250,000" className="input" style={{ width: '100%' }} />
          </div>
        )}

        <div>
          <label className="label-upper">Agent Name</label>
          <input value={agentName} onChange={e => setAgentName(e.target.value)} className="input" style={{ width: '100%' }} />
        </div>

        <div>
          <label className="label-upper">Agent Phone</label>
          <input value={agentPhone} onChange={e => setAgentPhone(e.target.value)} className="input" style={{ width: '100%' }} />
        </div>

        <button onClick={generate} disabled={isGenerating} className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: 13, fontWeight: 800, marginTop: 4 }}>
          {isGenerating ? 'Generating...' : '✦ Generate Email'}
        </button>

        {generated && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label className="label-upper">Subject Lines</label>
              {generated.subjects.map((s, i) => (
                <div key={i} onClick={() => setSelectedSubject(i)}
                  style={{
                    padding: '9px 11px', borderRadius: 6, cursor: 'pointer',
                    border: `1px solid ${selectedSubject === i ? 'var(--fg3)' : 'var(--border2)'}`,
                    background: selectedSubject === i ? 'var(--surface2)' : 'transparent',
                  }}>
                  <div style={{ fontSize: 11, color: selectedSubject === i ? 'var(--fg)' : 'var(--fg3)', lineHeight: 1.4 }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }}>Send Campaign →</button>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 12px' }}>Schedule</button>
            </div>
          </>
        )}
      </div>

      {/* Preview panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {generated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: 'var(--fg2)', maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--fg3)' }}>Subject: </span>{generated.subjects[selectedSubject]}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['desktop', 'mobile'] as const).map(v => (
                  <button key={v} onClick={() => setActivePreview(v)} className="btn btn-ghost"
                    style={{
                      fontSize: 11, padding: '5px 10px',
                      background: activePreview === v ? 'var(--surface2)' : 'transparent',
                      borderColor: activePreview === v ? 'var(--fg4)' : 'var(--border2)',
                      color: activePreview === v ? 'var(--fg)' : 'var(--fg3)',
                    }}>
                    {v === 'desktop' ? '⬛ Desktop' : '▬ Mobile'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: '#e8e8e8', borderRadius: 10, padding: '20px', flex: 1, overflowY: 'auto', minHeight: 520 }}>
              <div style={{ maxWidth: activePreview === 'mobile' ? 390 : 620, margin: '0 auto' }}>
                <iframe
                  srcDoc={generated.htmlBody}
                  style={{ width: '100%', minHeight: 600, border: 'none', borderRadius: 6 }}
                  title="Email preview"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--fg4)' }}>
              <span>Preview text: {generated.previewText}</span>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: 520,
            border: '1px dashed var(--border)', borderRadius: 10,
            color: 'var(--fg4)', gap: 14,
          }}>
            <div style={{ fontSize: 32 }}>◻</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg3)', marginBottom: 6 }}>Email preview appears here</div>
              <div style={{ fontSize: 11, color: 'var(--fg4)' }}>Select a campaign type and click Generate</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template engine ─────────────────────────────────────────────────────────

interface TemplateData {
  suburb: string
  agentName: string
  agentPhone: string
  soldAddress: string
  soldPrice: string
}

function buildTemplate(campaignId: string, d: TemplateData) {
  switch (campaignId) {
    case 'appraisal':    return vendorAppraisalTemplate(d)
    case 'just-sold':    return justSoldTemplate(d)
    case 'market-report': return marketReportTemplate(d)
    case 'free-appraisal': return freeAppraisalTemplate(d)
    case 'new-listing':  return newListingTemplate(d)
    case 'buyer-alert':  return buyerAlertTemplate(d)
    case 'price-reduction': return priceReductionTemplate(d)
    default:             return vendorAppraisalTemplate(d)
  }
}

const base = (content: string, d: TemplateData) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Email</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;">

  <!-- Logo bar -->
  <tr><td style="background:#0a0a0a;padding:20px 32px;text-align:left;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><span style="font-size:16px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;">PROPULSE<span style="color:#888888;">AI</span></span></td>
      <td align="right" style="font-size:11px;color:#555555;letter-spacing:0.05em;">REAL ESTATE INTELLIGENCE</td>
    </tr></table>
  </td></tr>

  ${content}

  <!-- Footer -->
  <tr><td style="background:#f7f7f7;padding:24px 32px;border-top:1px solid #e8e8e8;">
    <p style="color:#999999;font-size:12px;margin:0 0 6px;line-height:1.6;">
      <strong style="color:#555555;">${d.agentName}</strong> · Innovate.AI Realty<br>
      ${d.agentPhone} · agent@innovate-ai.com.au
    </p>
    <p style="color:#bbbbbb;font-size:11px;margin:12px 0 0;">
      <a href="#" style="color:#bbbbbb;text-decoration:none;">Unsubscribe</a> &nbsp;·&nbsp;
      <a href="#" style="color:#bbbbbb;text-decoration:none;">Privacy Policy</a> &nbsp;·&nbsp;
      <a href="#" style="color:#bbbbbb;text-decoration:none;">View in browser</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`

// ── Template 1: Vendor Appraisal ─────────────────────────────────────────────
function vendorAppraisalTemplate(d: TemplateData) {
  const subjects = [
    `What's your ${d.suburb} home worth in today's market?`,
    `${d.suburb} property values are up — get your free appraisal`,
    `Thinking of selling in ${d.suburb}? Here's what you need to know`,
  ]
  const previewText = `Property values in ${d.suburb} have shifted significantly. Find out what your home is worth today.`

  const content = `
  <!-- Hero -->
  <tr><td style="background:#0a0a0a;padding:48px 32px 40px;text-align:center;">
    <div style="font-size:11px;letter-spacing:0.15em;color:#555555;text-transform:uppercase;margin-bottom:16px;">Free Property Appraisal</div>
    <h1 style="color:#ffffff;font-size:32px;font-weight:900;margin:0 0 16px;line-height:1.15;letter-spacing:-0.03em;">What's Your ${d.suburb} Home<br>Worth Right Now?</h1>
    <p style="color:#888888;font-size:15px;line-height:1.6;margin:0 auto;max-width:420px;">Property values in ${d.suburb} have moved significantly. Get an accurate, obligation-free appraisal from a local expert.</p>
  </td></tr>

  <!-- Stats row -->
  <tr><td style="background:#111111;padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td align="center" style="padding:24px 16px;border-right:1px solid #222222;">
        <div style="font-size:28px;font-weight:900;color:#ffffff;">+8.4%</div>
        <div style="font-size:11px;color:#666666;margin-top:4px;letter-spacing:0.05em;">MEDIAN GROWTH</div>
      </td>
      <td align="center" style="padding:24px 16px;border-right:1px solid #222222;">
        <div style="font-size:28px;font-weight:900;color:#ffffff;">18d</div>
        <div style="font-size:11px;color:#666666;margin-top:4px;letter-spacing:0.05em;">AVG DAYS ON MARKET</div>
      </td>
      <td align="center" style="padding:24px 16px;">
        <div style="font-size:28px;font-weight:900;color:#ffffff;">94%</div>
        <div style="font-size:11px;color:#666666;margin-top:4px;letter-spacing:0.05em;">CLEARANCE RATE</div>
      </td>
    </tr></table>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 32px;">
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">Hi <strong>{firstName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 20px;">
      The ${d.suburb} market has been moving fast — and with buyer demand at record levels,
      now could be the perfect time to understand your property's true market value.
    </p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 32px;">
      As local specialists, we provide a detailed, data-driven appraisal that goes beyond automated estimates.
      We'll walk you through recent comparable sales, current buyer demand, and a realistic price range — at no cost and with zero obligation.
    </p>

    <!-- CTA button -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 32px;">
      <a href="#" style="display:inline-block;background:#000000;color:#ffffff;font-size:14px;font-weight:800;padding:16px 44px;border-radius:3px;text-decoration:none;letter-spacing:-0.01em;">
        Book My Free Appraisal →
      </a>
    </td></tr></table>

    <!-- What to expect -->
    <div style="background:#f7f7f7;border-left:3px solid #000000;padding:20px 24px;border-radius:0 4px 4px 0;margin-bottom:8px;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.08em;color:#000000;text-transform:uppercase;margin-bottom:12px;">What's included</div>
      ${['Detailed analysis of comparable recent sales', 'Current buyer demand report for your street', 'Recommended listing price range', 'Selling timeline & strategy overview', 'No obligation — completely free'].map(item => `
      <div style="display:flex;align-items:flex-start;margin-bottom:8px;">
        <span style="color:#000000;font-size:14px;margin-right:10px;margin-top:1px;">✓</span>
        <span style="color:#444444;font-size:14px;line-height:1.5;">${item}</span>
      </div>`).join('')}
    </div>
  </td></tr>

  <!-- Agent card -->
  <tr><td style="padding:0 32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:4px;overflow:hidden;">
      <tr>
        <td style="width:60px;background:#000000;padding:20px;" align="center">
          <div style="width:40px;height:40px;background:#333333;border-radius:50%;line-height:40px;text-align:center;font-size:16px;font-weight:900;color:#ffffff;">${d.agentName.charAt(0)}</div>
        </td>
        <td style="padding:16px 20px;">
          <div style="font-size:13px;font-weight:700;color:#000000;">${d.agentName}</div>
          <div style="font-size:12px;color:#888888;margin-top:2px;">Senior Property Consultant · ${d.suburb} Specialist</div>
          <div style="font-size:12px;color:#000000;margin-top:6px;font-weight:600;">${d.agentPhone}</div>
        </td>
        <td align="right" style="padding:16px 20px;">
          <a href="#" style="display:inline-block;border:1.5px solid #000000;color:#000000;font-size:12px;font-weight:700;padding:8px 18px;border-radius:3px;text-decoration:none;">Call Now</a>
        </td>
      </tr>
    </table>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}

// ── Template 2: Just Sold Neighbour Drop ─────────────────────────────────────
function justSoldTemplate(d: TemplateData) {
  const subjects = [
    `Just sold nearby — here's what this means for your home`,
    `Your neighbour's home just sold for ${d.soldPrice} in ${d.suburb}`,
    `Recent sale in your street — your home could be next`,
  ]
  const previewText = `A property near you just sold. Discover what it means for your home's value.`

  const content = `
  <!-- Hero -->
  <tr><td style="background:#000000;padding:40px 32px;text-align:center;">
    <div style="display:inline-block;background:#ffffff;color:#000000;font-size:10px;font-weight:900;letter-spacing:0.15em;padding:6px 14px;border-radius:2px;margin-bottom:20px;text-transform:uppercase;">Just Sold</div>
    <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 8px;line-height:1.2;letter-spacing:-0.02em;">${d.soldAddress}</h1>
    <div style="font-size:36px;font-weight:900;color:#ffffff;margin:16px 0;">${d.soldPrice}</div>
    <p style="color:#888888;font-size:13px;margin:0;">Sold ${Math.floor(Math.random() * 7) + 2} days on market · ${d.suburb}</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 32px;">
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">Hi <strong>{firstName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 20px;">
      A property near you — <strong>${d.soldAddress}</strong> — has just sold for <strong>${d.soldPrice}</strong>.
      This result gives us a clear picture of what buyers are willing to pay in your area right now.
    </p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 32px;">
      If you've ever wondered what your home might sell for, there's no better time to find out.
      We have <strong>3 active buyers</strong> right now who missed out on this property and are looking for something similar in ${d.suburb}.
    </p>

    <!-- Urgency block -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;border-radius:4px;margin-bottom:32px;">
      <tr><td style="padding:24px;">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.12em;color:#888888;text-transform:uppercase;margin-bottom:12px;">Active Buyer Demand</div>
        <div style="font-size:22px;font-weight:900;color:#ffffff;margin-bottom:4px;">3 buyers looking in ${d.suburb}</div>
        <div style="font-size:13px;color:#666666;margin-bottom:20px;">Budget range: $900k–$1.4m · Ready to move quickly</div>
        <a href="#" style="display:inline-block;background:#ffffff;color:#000000;font-size:13px;font-weight:800;padding:12px 28px;border-radius:3px;text-decoration:none;">
          Get Your Free Appraisal →
        </a>
      </td></tr>
    </table>

    <!-- What we offer -->
    <div style="font-size:13px;color:#999999;line-height:1.7;">
      We'll give you a detailed market appraisal, introduce you to our ready buyers,
      and outline exactly how we'd achieve a premium result for your property — obligation-free.
    </div>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}

// ── Template 3: Suburb Market Report ─────────────────────────────────────────
function marketReportTemplate(d: TemplateData) {
  const subjects = [
    `${d.suburb} Property Market — Q2 2025 Report`,
    `Your ${d.suburb} market update is ready`,
    `What's happening in ${d.suburb} real estate right now`,
  ]
  const previewText = `${d.suburb} market snapshot: median prices, days on market, and what's driving demand.`

  const content = `
  <!-- Hero -->
  <tr><td style="background:#0a0a0a;padding:40px 32px 32px;">
    <div style="font-size:11px;letter-spacing:0.15em;color:#555555;text-transform:uppercase;margin-bottom:16px;">Market Intelligence</div>
    <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 8px;line-height:1.2;letter-spacing:-0.02em;">${d.suburb} Property Market<br>Q2 2025 Snapshot</h1>
    <p style="color:#666666;font-size:13px;margin:8px 0 0;">Prepared by ${d.agentName} · Innovate.AI Realty</p>
  </td></tr>

  <!-- Key metrics -->
  <tr><td style="background:#111111;padding:24px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:0 16px 0 0;">
          <div style="font-size:11px;letter-spacing:0.08em;color:#555555;text-transform:uppercase;margin-bottom:6px;">Median Sale Price</div>
          <div style="font-size:26px;font-weight:900;color:#ffffff;">$1.18M</div>
          <div style="font-size:12px;color:#22c55e;margin-top:4px;">↑ 8.4% vs last year</div>
        </td>
        <td style="padding:0 16px;border-left:1px solid #222222;">
          <div style="font-size:11px;letter-spacing:0.08em;color:#555555;text-transform:uppercase;margin-bottom:6px;">Days on Market</div>
          <div style="font-size:26px;font-weight:900;color:#ffffff;">18</div>
          <div style="font-size:12px;color:#22c55e;margin-top:4px;">↓ 6 days faster</div>
        </td>
        <td style="padding:0 0 0 16px;border-left:1px solid #222222;">
          <div style="font-size:11px;letter-spacing:0.08em;color:#555555;text-transform:uppercase;margin-bottom:6px;">Clearance Rate</div>
          <div style="font-size:26px;font-weight:900;color:#ffffff;">94%</div>
          <div style="font-size:12px;color:#22c55e;margin-top:4px;">↑ 12% vs last qtr</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:36px 32px;">
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">Hi <strong>{firstName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 20px;">
      The ${d.suburb} market has been particularly strong this quarter. Demand from buyers — especially
      upsizers and sea-changers — is outpacing supply, pushing prices up and days on market down.
    </p>

    <!-- Recent sales table -->
    <div style="margin-bottom:28px;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.08em;color:#000000;text-transform:uppercase;margin-bottom:12px;">Recent Sales in ${d.suburb}</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:4px;overflow:hidden;">
        ${[
          { addr: '14 Cliff Drive', result: '$1,340,000', days: '12 days', beds: '4 bed' },
          { addr: '7 Ocean Terrace', result: '$1,125,000', days: '8 days', beds: '3 bed' },
          { addr: '22 Headland Rd', result: '$1,490,000', days: '21 days', beds: '4 bed' },
        ].map((row, i) => `
        <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#000000;">${row.addr}</td>
          <td style="padding:12px 16px;font-size:13px;color:#555555;">${row.beds}</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#000000;">${row.result}</td>
          <td style="padding:12px 16px;font-size:12px;color:#999999;">${row.days}</td>
        </tr>`).join('')}
      </table>
    </div>

    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 28px;">
      If you own property in ${d.suburb}, this is a compelling market to be selling into.
      We'd love to give you a personalised appraisal so you can see exactly where your home sits in today's market.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 0 8px;">
      <a href="#" style="display:inline-block;background:#000000;color:#ffffff;font-size:14px;font-weight:800;padding:15px 40px;border-radius:3px;text-decoration:none;">
        Get My Free Property Appraisal →
      </a>
    </td></tr></table>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}

// ── Template 4: Free Appraisal Offer ─────────────────────────────────────────
function freeAppraisalTemplate(d: TemplateData) {
  const subjects = [
    `Limited spots: Free ${d.suburb} property appraisals this week`,
    `Your free home appraisal is ready — ${d.suburb}`,
    `Find out what your home is worth — no strings attached`,
  ]
  const previewText = `We're offering free, no-obligation property appraisals in ${d.suburb} this week only.`

  const content = `
  <!-- Hero -->
  <tr><td style="background:#000000;padding:48px 32px;text-align:center;">
    <div style="display:inline-block;border:1px solid #333333;color:#888888;font-size:10px;font-weight:700;letter-spacing:0.15em;padding:5px 14px;border-radius:2px;margin-bottom:24px;text-transform:uppercase;">Limited Offer</div>
    <h1 style="color:#ffffff;font-size:30px;font-weight:900;margin:0 0 16px;line-height:1.15;letter-spacing:-0.03em;">Free Property Appraisal<br><span style="color:#888888;">No Obligation. This Week Only.</span></h1>
    <p style="color:#666666;font-size:15px;max-width:400px;margin:0 auto;line-height:1.6;">We're running complimentary appraisals across ${d.suburb} — book yours before spots fill up.</p>
  </td></tr>

  <!-- Spots remaining -->
  <tr><td style="background:#111111;padding:16px 32px;text-align:center;">
    <span style="font-size:13px;color:#ffffff;font-weight:600;">Only <strong>3 spots remaining</strong> this week in ${d.suburb}</span>
    <div style="margin-top:10px;background:#222222;border-radius:2px;height:6px;overflow:hidden;">
      <div style="width:75%;height:100%;background:#ffffff;"></div>
    </div>
    <div style="font-size:11px;color:#555555;margin-top:6px;">75% booked</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 32px;">
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">Hi <strong>{firstName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 20px;">
      This week, we're offering complimentary property appraisals for homeowners in ${d.suburb}.
      Whether you're thinking of selling now or just curious about your home's value — this is for you.
    </p>

    <!-- Steps -->
    <div style="margin-bottom:32px;">
      ${[
        { n: '01', title: 'Book your time', desc: 'Select a time that suits you — in-person or virtual.' },
        { n: '02', title: 'We do the research', desc: 'We analyse comparable sales, buyer demand and local market data.' },
        { n: '03', title: 'Get your report', desc: 'Receive a detailed written appraisal with no obligation whatsoever.' },
      ].map(step => `
      <div style="display:flex;gap:16px;margin-bottom:20px;align-items:flex-start;">
        <div style="min-width:36px;height:36px;background:#000000;border-radius:50%;line-height:36px;text-align:center;font-size:11px;font-weight:900;color:#ffffff;">${step.n}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:#000000;margin-bottom:4px;">${step.title}</div>
          <div style="font-size:13px;color:#666666;line-height:1.5;">${step.desc}</div>
        </div>
      </div>`).join('')}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="#" style="display:inline-block;background:#000000;color:#ffffff;font-size:14px;font-weight:800;padding:16px 44px;border-radius:3px;text-decoration:none;">
        Reserve My Free Appraisal →
      </a>
    </td></tr></table>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}

// ── Template 5: New Listing Alert ─────────────────────────────────────────────
function newListingTemplate(d: TemplateData) {
  const subjects = [
    `New to market: ${d.soldAddress || `Premium property in ${d.suburb}`}`,
    `Just listed in ${d.suburb} — this one won't last`,
    `New listing alert matching your search`,
  ]
  const previewText = `A new property just hit the market in ${d.suburb}. Schedule your inspection today.`

  const content = `
  <!-- Hero image -->
  <tr><td style="background:#111111;padding:40px 32px;text-align:center;">
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:40px;margin-bottom:24px;">
      <div style="font-size:64px;margin-bottom:8px;">⬛</div>
      <div style="font-size:13px;color:#555555;">Property Hero Image</div>
    </div>
    <div style="display:inline-block;background:#ffffff;color:#000000;font-size:10px;font-weight:900;letter-spacing:0.15em;padding:5px 12px;border-radius:2px;margin-bottom:16px;">NEW LISTING</div>
    <h1 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;">${d.soldAddress || `12 Ocean Ave, ${d.suburb}`}</h1>
    <div style="font-size:26px;font-weight:900;color:#ffffff;margin:12px 0 8px;">$1,150,000 – $1,250,000</div>
    <div style="font-size:13px;color:#666666;">4 bed · 2 bath · 2 car · 650m²</div>
  </td></tr>

  <tr><td style="padding:36px 32px;">
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">Hi <strong>{firstName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 32px;">
      A new property matching your search has just been listed in ${d.suburb}. Based on your buyer profile,
      we think this could be a strong match — and we wanted to reach you before the wider market hears about it.
    </p>

    <!-- Features grid -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;border-radius:4px;margin-bottom:32px;">
      <tr>
        ${['4 Bedrooms', '2 Bathrooms', '2 Car Garage', '650m² Block'].map(f => `
        <td align="center" style="padding:20px 12px;border-right:1px solid #eeeeee;">
          <div style="font-size:13px;font-weight:700;color:#000000;">${f}</div>
        </td>`).join('')}
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="#" style="display:inline-block;background:#000000;color:#ffffff;font-size:14px;font-weight:800;padding:15px 40px;border-radius:3px;text-decoration:none;">
        Book an Inspection →
      </a>
    </td></tr></table>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}

// ── Template 6: Buyer Alert ────────────────────────────────────────────────────
function buyerAlertTemplate(d: TemplateData) {
  const subjects = [
    `3 new properties match your search in ${d.suburb}`,
    `New buyer alert — properties matching your criteria`,
    `We found new matches for you in ${d.suburb}`,
  ]
  const previewText = `New properties matching your buyer profile have just hit the market.`

  const content = `
  <!-- Header -->
  <tr><td style="background:#000000;padding:36px 32px;">
    <div style="font-size:11px;letter-spacing:0.15em;color:#555555;text-transform:uppercase;margin-bottom:12px;">Property Match Alert</div>
    <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0;line-height:1.2;letter-spacing:-0.02em;">3 New Properties<br>Match Your Search</h1>
  </td></tr>

  <tr><td style="padding:36px 32px;">
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 28px;">Hi <strong>{firstName}</strong>, we've found new listings in ${d.suburb} matching your search criteria.</p>

    <!-- Property listings -->
    ${[
      { addr: '7 Headland Rd', price: '$1,195,000', beds: '3 bed · 2 bath', tag: 'NEW' },
      { addr: '23 Beach Parade', price: '$985,000', beds: '3 bed · 1 bath', tag: 'OPEN HOME SAT' },
      { addr: '41 Cliff Drive', price: '$1,380,000', beds: '4 bed · 2 bath', tag: 'PRICE REDUCED' },
    ].map(p => `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:4px;margin-bottom:12px;overflow:hidden;">
      <tr>
        <td style="background:#f7f7f7;width:80px;padding:20px;" align="center">
          <div style="font-size:28px;">⬛</div>
        </td>
        <td style="padding:16px 20px;">
          <div style="display:inline-block;background:#000000;color:#ffffff;font-size:9px;font-weight:800;letter-spacing:0.1em;padding:3px 8px;border-radius:2px;margin-bottom:8px;">${p.tag}</div>
          <div style="font-size:14px;font-weight:700;color:#000000;margin-bottom:4px;">${p.addr}, ${d.suburb}</div>
          <div style="font-size:13px;color:#666666;">${p.beds}</div>
          <div style="font-size:16px;font-weight:900;color:#000000;margin-top:8px;">${p.price}</div>
        </td>
        <td align="right" style="padding:16px 20px;">
          <a href="#" style="display:inline-block;border:1.5px solid #000000;color:#000000;font-size:12px;font-weight:700;padding:8px 16px;border-radius:3px;text-decoration:none;white-space:nowrap;">View →</a>
        </td>
      </tr>
    </table>`).join('')}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr><td align="center">
      <a href="#" style="display:inline-block;background:#000000;color:#ffffff;font-size:13px;font-weight:800;padding:14px 36px;border-radius:3px;text-decoration:none;">
        See All Matching Properties →
      </a>
    </td></tr></table>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}

// ── Template 7: Price Reduction ───────────────────────────────────────────────
function priceReductionTemplate(d: TemplateData) {
  const subjects = [
    `Price reduced — ${d.soldAddress || `prime property in ${d.suburb}`}`,
    `New price: sellers are motivated to move quickly`,
    `Just reduced: act fast on this ${d.suburb} opportunity`,
  ]
  const previewText = `The price has been reduced on a property we think you'll love.`

  const content = `
  <!-- Hero -->
  <tr><td style="background:#000000;padding:40px 32px;text-align:center;">
    <div style="display:inline-block;border:1.5px solid #ffffff;color:#ffffff;font-size:10px;font-weight:900;letter-spacing:0.15em;padding:5px 14px;border-radius:2px;margin-bottom:20px;text-transform:uppercase;">Price Reduced</div>
    <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0 0 24px;line-height:1.2;">${d.soldAddress || `12 Ocean Ave, ${d.suburb}`}</h1>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td align="center" style="padding:0 20px;">
          <div style="font-size:13px;color:#555555;margin-bottom:4px;text-decoration:line-through;">Was $1,350,000</div>
          <div style="font-size:32px;font-weight:900;color:#ffffff;">$1,195,000</div>
          <div style="font-size:12px;color:#888888;margin-top:6px;">↓ Reduced by $155,000</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:36px 32px;">
    <p style="color:#333333;font-size:15px;line-height:1.7;margin:0 0 20px;">Hi <strong>{firstName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 20px;">
      The vendors of ${d.soldAddress || `this ${d.suburb} property`} have adjusted their price and are motivated to sell.
      This represents genuine value in today's market — and at this price, we expect strong interest.
    </p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 32px;">
      The property features 4 bedrooms, 2 bathrooms, and a north-facing rear yard in a sought-after street.
      If you've been watching this one, now is the time to act.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="#" style="display:inline-block;background:#000000;color:#ffffff;font-size:14px;font-weight:800;padding:15px 40px;border-radius:3px;text-decoration:none;">
        Book an Inspection →
      </a>
    </td></tr></table>
  </td></tr>`

  return { subjects, previewText, htmlBody: base(content, d) }
}
