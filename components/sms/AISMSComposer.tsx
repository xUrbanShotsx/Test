'use client'

import { useState } from 'react'

const CAMPAIGN_TYPES = [
  { id: 'appraisal', label: "What's Your Home Worth?", tag: 'Vendor' },
  { id: 'just-sold', label: 'Just Sold — Neighbour Alert', tag: 'Vendor' },
  { id: 'market-update', label: 'Suburb Market Update', tag: 'Vendor' },
  { id: 'follow-up', label: 'Vendor Follow-Up', tag: 'Vendor' },
  { id: 'new-listing', label: 'New Listing Alert', tag: 'Buyer' },
  { id: 'open-home', label: 'Open Home Reminder', tag: 'Buyer' },
  { id: 'price-reduction', label: 'Price Reduction', tag: 'Buyer' },
]

const AUDIENCES = [
  'Suburb Homeowners',
  'Cold Vendor Database',
  'Warm Vendor Leads',
  'Past Appraisal Enquiries',
  'Active Buyers',
  'Buyer Database',
]

const DEMO_CONTACTS = [
  { id: 1, name: 'Sarah Mitchell', mobile: '0412 345 678', suburb: 'Wollongong', type: 'vendor' },
  { id: 2, name: 'Tom Bradley', mobile: '0423 456 789', suburb: 'Bulli', type: 'vendor' },
  { id: 3, name: 'Amanda Ross', mobile: '0434 567 890', suburb: 'Corrimal', type: 'vendor' },
  { id: 4, name: 'David Chen', mobile: '0445 678 901', suburb: 'Wollongong', type: 'vendor' },
  { id: 5, name: 'Jenny Liu', mobile: '0456 789 012', suburb: 'Thirroul', type: 'buyer' },
  { id: 6, name: 'Robert Kim', mobile: '0467 890 123', suburb: 'Fairy Meadow', type: 'buyer' },
]

interface SMSVariants { short: string; standard: string; detailed: string }

const SMS_TEMPLATES: Record<string, (suburb: string, address: string, price: string) => SMSVariants> = {
  'appraisal': (suburb, _addr, _price) => ({
    short: `Hi {firstName}! Curious what your ${suburb} home is worth? Free appraisal, no obligation. Reply YES or call us.`,
    standard: `Hi {firstName}, the ${suburb} market is moving fast — values up 8% this year. Want a free, no-obligation appraisal of your home? Reply YES to book.`,
    detailed: `Hi {firstName}! ${suburb} property values have shifted significantly. As local specialists, we offer a detailed, data-driven appraisal at no cost. Reply YES to book a time that suits you, or call 0412 000 000.`,
  }),
  'just-sold': (suburb, address, price) => ({
    short: `Just sold near you! ${address || `A ${suburb} home`} sold for ${price || '$1.2M'}. Your home could be next. Free appraisal — reply YES.`,
    standard: `Hi {firstName}, great news for ${suburb} homeowners — a property near you just sold for ${price || '$1,250,000'}! This means strong buyer demand in your area. Want to know what your home is worth? Reply YES.`,
    detailed: `Hi {firstName}! ${address || `A property in ${suburb}`} just sold for ${price || '$1,250,000'} — setting a new benchmark for the area. We have 3 buyers who missed out and are still searching. Reply YES if you'd like a free appraisal to see what your home could achieve.`,
  }),
  'market-update': (suburb, _addr, _price) => ({
    short: `${suburb} market update: median up 8%, days on market down 20%. Great time to sell — free appraisal? Reply YES.`,
    standard: `Hi {firstName}, our ${suburb} Q2 market report is out! Key stats: +8.4% median growth, 18 days on market, 94% clearance. Thinking of selling? Reply YES for a free appraisal.`,
    detailed: `Hi {firstName}, we've just released our ${suburb} market report for Q2 2025. Median sale price: $1.18M (+8.4% YOY). Avg days on market: 18. Buyer demand remains high. Want to see what your home is worth in this market? Reply YES for a free, no-obligation appraisal.`,
  }),
  'follow-up': (suburb, _addr, _price) => ({
    short: `Hi {firstName}, just checking in — still thinking about selling in ${suburb}? Happy to answer any questions. Call or reply anytime.`,
    standard: `Hi {firstName}, it was great chatting recently about your ${suburb} property. I wanted to follow up — the market is moving well and we have active buyers. Any questions? Reply or call 0412 000 000.`,
    detailed: `Hi {firstName}, following up from our earlier conversation. The ${suburb} market has continued to strengthen and I'd love to update you on current comparable sales. If you're still considering your options, I'm happy to chat without any pressure. Reply or call 0412 000 000.`,
  }),
  'new-listing': (suburb, address, price) => ({
    short: `New listing: ${address || suburb} — ${price || 'POA'}. 3bed/2bath. Reply YES to book inspection.`,
    standard: `Hi {firstName}! New listing matching your search: ${address || `${suburb} property`} — ${price || 'Contact for price'}. 3 bed, 2 bath, 650m². Reply YES to book.`,
    detailed: `Hi {firstName}, a new property matching your search has just listed in ${suburb}: ${address || 'see link'}, ${price || 'price on application'}. Features 3 bed, 2 bath, double garage & ocean views. Open home Sat 10am. Reply YES to book a private inspection.`,
  }),
  'open-home': (_suburb, address, _price) => ({
    short: `Reminder: Open home ${address || 'upcoming property'} — Sat 10-10:30am. See you there! Reply SKIP to cancel.`,
    standard: `Hi {firstName}, reminder: open home for ${address || 'the property you enquired about'} is this Saturday 10–10:30am. We look forward to seeing you! Reply SKIP if you can't make it.`,
    detailed: `Hi {firstName}, just a friendly reminder that the open home for ${address || 'the property you are interested in'} is this Saturday 10-10:30am. Parking available on street. Reply SKIP if you cannot attend and we will arrange a private viewing.`,
  }),
  'price-reduction': (_suburb, address, price) => ({
    short: `Price reduced! ${address || 'Property'} now ${price || '$995k'}. Vendors are motivated — reply YES to book.`,
    standard: `Hi {firstName}, good news — the vendors of ${address || 'the property you enquired about'} have reduced their price to ${price || '$995,000'}. This is a genuine opportunity. Reply YES to book an inspection.`,
    detailed: `Hi {firstName}, the vendors of ${address || 'the property you viewed'} have adjusted their price to ${price || '$995,000'} — a reduction of over $150,000. They're motivated and want a fast sale. Reply YES to book an inspection before someone else does.`,
  }),
}

export default function AISMSComposer() {
  const [campaignId, setCampaignId] = useState('appraisal')
  const [audience, setAudience] = useState('Suburb Homeowners')
  const [suburb, setSuburb] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [variants, setVariants] = useState<SMSVariants | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<keyof SMSVariants>('standard')
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const campaign = CAMPAIGN_TYPES.find(c => c.id === campaignId)!
  const maxChars = 160
  const msg = customMessage || (variants ? variants[selectedVariant] : '')

  const generate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const templateFn = SMS_TEMPLATES[campaignId] || SMS_TEMPLATES['appraisal']
      setVariants(templateFn(suburb || 'Wollongong', address, price))
      setCustomMessage('')
      setSelectedVariant('standard')
      setIsGenerating(false)
    }, 500)
  }

  const toggleContact = (id: number) =>
    setSelectedContacts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () =>
    setSelectedContacts(selectedContacts.length === DEMO_CONTACTS.length ? [] : DEMO_CONTACTS.map(c => c.id))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
      {/* Left: Compose */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label className="label-upper">Campaign Type</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {CAMPAIGN_TYPES.map(c => (
              <button key={c.id} onClick={() => { setCampaignId(c.id); setVariants(null) }}
                style={{
                  padding: '5px 10px', borderRadius: 5,
                  border: `1px solid ${campaignId === c.id ? 'var(--fg3)' : 'var(--border)'}`,
                  background: campaignId === c.id ? 'var(--surface2)' : 'transparent',
                  color: campaignId === c.id ? 'var(--fg)' : 'var(--fg3)',
                  fontSize: 11, fontWeight: campaignId === c.id ? 700 : 400, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                {c.label}
                <span style={{
                  fontSize: 9, fontWeight: 800,
                  background: c.tag === 'Vendor' ? 'var(--fg)' : 'var(--surface3)',
                  color: c.tag === 'Vendor' ? 'var(--bg)' : 'var(--fg4)',
                  padding: '1px 4px', borderRadius: 2,
                }}>{c.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="label-upper">Suburb / Area</label>
            <input value={suburb} onChange={e => setSuburb(e.target.value)} placeholder="e.g. Wollongong" className="input" />
          </div>
          {(campaignId === 'just-sold' || campaignId === 'new-listing' || campaignId === 'open-home' || campaignId === 'price-reduction') && (
            <div>
              <label className="label-upper">Address (optional)</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="12 Ocean Ave" className="input" />
            </div>
          )}
          {(campaignId === 'just-sold' || campaignId === 'price-reduction' || campaignId === 'new-listing') && (
            <div>
              <label className="label-upper">Price</label>
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="$1,250,000" className="input" />
            </div>
          )}
        </div>

        <button onClick={generate} disabled={isGenerating} className="btn btn-primary"
          style={{ alignSelf: 'flex-start', padding: '10px 22px', fontSize: 13 }}>
          {isGenerating ? 'Generating...' : '✦ Generate 3 Variants'}
        </button>

        {/* Variants */}
        {variants && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="label-upper">Choose a variant</label>
            {(Object.entries(variants) as [keyof SMSVariants, string][]).map(([key, text]) => (
              <div key={key} onClick={() => { setSelectedVariant(key); setCustomMessage('') }}
                style={{
                  padding: 14, cursor: 'pointer', borderRadius: 7, transition: 'all 0.12s',
                  border: `1px solid ${selectedVariant === key && !customMessage ? 'var(--fg3)' : 'var(--border)'}`,
                  background: selectedVariant === key && !customMessage ? 'var(--surface2)' : 'transparent',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'capitalize', color: 'var(--fg3)', letterSpacing: '0.06em' }}>{key}</span>
                  <span style={{ fontSize: 10, color: text.length > 140 ? '#ef4444' : text.length > 110 ? 'var(--fg2)' : 'var(--fg3)' }}>
                    {text.length}/160 · {Math.ceil(text.length / 160)} seg
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Edit box */}
        <div>
          <label className="label-upper">
            Message {customMessage ? '(custom)' : variants ? '(edit below)' : '(or write manually)'}
          </label>
          <textarea
            value={customMessage || (variants ? variants[selectedVariant] : '')}
            onChange={e => setCustomMessage(e.target.value)}
            rows={4}
            placeholder="Or write your SMS manually..."
            className="input"
            style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--fg4)' }}>Use {'{'+'firstName}'}, {'{'+'suburb}'}, {'{'+'price}'} for personalisation</span>
            <span style={{ fontSize: 10, color: msg.length > 160 ? '#ef4444' : 'var(--fg4)' }}>
              {msg.length}/{maxChars}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Audience & Send */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="label-upper">Send To</label>
          <select value={audience} onChange={e => setAudience(e.target.value)} className="input">
            {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>Select contacts</span>
            <button onClick={selectAll} style={{ fontSize: 11, color: 'var(--fg3)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              {selectedContacts.length === DEMO_CONTACTS.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          {DEMO_CONTACTS.map((c, i) => (
            <label key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', cursor: 'pointer',
              borderBottom: i < DEMO_CONTACTS.length - 1 ? '1px solid var(--border2)' : 'none',
            }}>
              <input type="checkbox" checked={selectedContacts.includes(c.id)} onChange={() => toggleContact(c.id)}
                style={{ accentColor: 'var(--fg)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'var(--fg3)' }}>{c.mobile} · {c.suburb}</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 2,
                background: c.type === 'vendor' ? 'var(--fg)' : 'var(--surface3)',
                color: c.type === 'vendor' ? 'var(--bg)' : 'var(--fg3)',
              }}>{c.type.toUpperCase()}</span>
            </label>
          ))}
        </div>

        {/* Summary */}
        <div style={{ padding: 14, background: 'var(--surface2)', borderRadius: 7, border: '1px solid var(--border)' }}>
          <label className="label-upper" style={{ marginBottom: 10 }}>Send Summary</label>
          {[
            ['Recipients', selectedContacts.length || 0],
            ['Segments/msg', Math.ceil((msg.length || 1) / 160)],
            ['Est. cost', `~$${((selectedContacts.length || 0) * 0.08 * Math.ceil((msg.length || 1) / 160)).toFixed(2)}`],
          ].map(([label, val]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--fg3)' }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{val}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={selectedContacts.length === 0 || !msg}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: 13 }}>
          Send to {selectedContacts.length > 0 ? `${selectedContacts.length} contacts` : '...'}
        </button>

        {showConfirm && (
          <div style={{ padding: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>Confirm Send</div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 12 }}>
              Sending to {selectedContacts.length} contacts. This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowConfirm(false)} className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }}>Cancel</button>
              <button onClick={() => { setShowConfirm(false) }} className="btn btn-primary" style={{ flex: 1, fontSize: 12 }}>Confirm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
