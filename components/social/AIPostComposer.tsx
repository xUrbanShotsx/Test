'use client'

import { useState } from 'react'

const CAMPAIGN_TYPES = [
  { id: 'just-sold-vendor', label: 'Just Sold — Vendor Outreach', tag: 'Vendor' },
  { id: 'free-appraisal', label: 'Free Appraisal Ad', tag: 'Vendor' },
  { id: 'market-update', label: 'Market Update', tag: 'Vendor' },
  { id: 'new-listing', label: 'New Listing', tag: 'Property' },
  { id: 'just-sold-listing', label: 'Just Sold (Listing)', tag: 'Property' },
  { id: 'open-home', label: 'Open Home', tag: 'Property' },
  { id: 'price-reduction', label: 'Price Reduction', tag: 'Property' },
]

const TONES = ['Professional', 'Conversational', 'Urgent', 'Luxury']
const PLATFORMS = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
]

interface GeneratedPost { facebook: string; instagram: string; linkedin: string }

const DEMO_POSTS: Record<string, GeneratedPost> = {
  'just-sold-vendor': {
    facebook: "We've just sold in your street — and buyers are still searching 👀\n\nIf you've been thinking about selling, this is the moment. The {suburb} market is moving quickly and we have motivated buyers ready to act.\n\nGet a free, no-obligation appraisal from your local specialist. Comment 'APPRAISAL' or click the link below.",
    instagram: "🏡 JUST SOLD in {suburb}\n\nYour neighbours just cashed in on this market — could you be next?\n\nWe have active buyers still looking in the area. DM us for a free appraisal 📲\n\n#justsold #{suburb}property #realestate #sellersmarket #vendorlead #homevalue #illawararealestate",
    linkedin: "We've just achieved an exceptional result in {suburb} — and there's still significant buyer demand in the area.\n\nIf you own property nearby and have been considering your options, now could be an ideal time to understand what the market will pay for your home.\n\nI'm offering complimentary, data-driven appraisals for {suburb} homeowners. Feel free to reach out directly.",
  },
  'free-appraisal': {
    facebook: "🏠 FREE Property Appraisal — {suburb} Homeowners\n\nFind out what your home is worth in today's market. Our team provides detailed, data-driven appraisals with no obligation and no pressure.\n\n✓ Comparable recent sales analysis\n✓ Current buyer demand report\n✓ Recommended price range\n\nBooking now for this week. Comment 'YES' or DM us!",
    instagram: "Do you know what your home is worth in 2025? 🤔\n\nThe {suburb} market has shifted significantly — and your property's value may surprise you.\n\nFree appraisal, zero obligation. DM us 'APPRAISAL' to book yours 🏡\n\n#{suburb} #realestate #propertyvalue #freeappraisal #sellyourhome",
    linkedin: "Complimentary property appraisals available this week for {suburb} homeowners.\n\nWith the local market showing strong growth and buyer demand at record levels, understanding your property's current value is more important than ever.\n\nReach out if you'd like an honest, data-backed assessment of your home's market position — no obligation.",
  },
  'market-update': {
    facebook: "📊 {suburb} Property Market Update — Q2 2025\n\n🔺 Median price up 8.4% year-on-year\n📅 Average days on market: 18 (down from 24)\n✅ Clearance rate: 94%\n\nIf you own property in {suburb}, this is the market to be selling into. DM us for your free appraisal.",
    instagram: "The numbers don't lie 📊\n\n{suburb} median prices are UP 8.4% this year\n\nNow could be the perfect time to see what your home is worth. Free appraisal — DM 'REPORT' 🏡\n\n#{suburb} #marketupdate #realestate #propertymarket #sellyourhome",
    linkedin: "Q2 2025 {suburb} Property Market Summary:\n\n• Median sale price: $1.18M (+8.4% YOY)\n• Average days on market: 18 days\n• Clearance rate: 94%\n• Buyer demand: strongest since 2022\n\nFor homeowners considering their options, the data suggests this is a compelling market to be selling into. Happy to provide a complimentary appraisal.",
  },
  'new-listing': {
    facebook: "🏡 NEW LISTING — {address}\n\nThis exceptional property is now on the market and ready to impress.\n\n{features}\n\nGuide: {price}\n\nInspections this weekend. Contact us to register or book a private viewing. 📲",
    instagram: "✨ NEW TO MARKET ✨\n\n{address}\n{features}\n\n💰 {price}\n📅 Inspection this Saturday\n\nDouble-tap if this is your dream home 🏡\n\n#newlisting #{suburb}realestate #forsale #dreamhome #openinspection",
    linkedin: "New listing — {address}\n\nThis property represents an excellent opportunity in a sought-after location.\n\n{features}\n\nGuide: {price}\n\nInspections available this weekend. Reach out for full property details.",
  },
  'just-sold-listing': {
    facebook: "🎉 JUST SOLD — {address}\n\nCongratulations to our clients on an outstanding result!\n\nWe achieved above-reserve pricing in just {days} days on market — a testament to our proven marketing strategy.\n\nThinking of selling? We'd love to do the same for you. Free appraisal — link in bio 🏡",
    instagram: "SOLD ✅\n\n{address} — what a result! 🎉\n\nOur clients are thrilled and we have buyers still looking in the area 👀\n\nCould your home be next? DM us 'SOLD' for a free appraisal!\n\n#sold #justSold #{suburb}realestate #realestateresults",
    linkedin: "Delighted to have achieved an exceptional result for our clients at {address}.\n\nThis outcome reflects both the strength of the current market and the power of strategic, targeted marketing.\n\nIf you're considering selling, I'd welcome the conversation about how we can achieve a similar result for you.",
  },
  'open-home': {
    facebook: "🚪 OPEN HOME THIS SATURDAY\n\n📍 {address}\n⏰ {time}\n💰 Guide: {price}\n\n{features}\n\nAll welcome — no appointment necessary. See you there! 🏡",
    instagram: "Come say hi this Saturday! 👋\n\n📍 {address}\n⏰ {time}\n{features}\n\n#openHome #openHouse #{suburb} #realestate #forsale #inspection",
    linkedin: "Open inspection this Saturday at {address}.\n\nTime: {time}\nGuide: {price}\n\n{features}\n\nAll welcome — or reach out to arrange a private viewing.",
  },
  'price-reduction': {
    facebook: "📉 PRICE REDUCED — {address}\n\nThe vendors have adjusted their expectations and are motivated to sell.\n\nNew asking price: {price}\n\n{features}\n\nThis won't last — contact us today to arrange an inspection before it's gone! 📲",
    instagram: "PRICE REDUCED ⬇️\n\n{address} is now {price}\n\nThe vendors want it SOLD. Could be the best buy in {suburb} right now 👀\n\nDM us to book 🏡\n\n#pricereduced #{suburb} #realestate #bargain #forsale",
    linkedin: "Price adjustment — {address} is now offered at {price}.\n\nThe vendors are committed to a sale, presenting an opportunity for buyers who may have previously found this property outside their range.\n\n{features}\n\nContact me directly to arrange a viewing.",
  },
}

export default function AIPostComposer() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram'])
  const [campaignId, setCampaignId] = useState('just-sold-vendor')
  const [tone, setTone] = useState('Professional')
  const [suburb, setSuburb] = useState('')
  const [address, setAddress] = useState('')
  const [features, setFeatures] = useState('')
  const [price, setPrice] = useState('')
  const [generated, setGenerated] = useState<GeneratedPost | null>(null)
  const [editedPosts, setEditedPosts] = useState<GeneratedPost>({ facebook: '', instagram: '', linkedin: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')

  const togglePlatform = (id: string) =>
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])

  const fill = (text: string) => text
    .replace(/{suburb}/g, suburb || 'Wollongong')
    .replace(/{address}/g, address || '12 Ocean Ave, Wollongong')
    .replace(/{features}/g, features || '4 bed · 2 bath · ocean views · 650m²')
    .replace(/{price}/g, price || '$1,150,000 – $1,250,000')
    .replace(/{days}/g, '14')
    .replace(/{time}/g, '10:00 – 10:30am')

  const generate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const template = DEMO_POSTS[campaignId] || DEMO_POSTS['just-sold-vendor']
      const filled: GeneratedPost = {
        facebook: fill(template.facebook),
        instagram: fill(template.instagram),
        linkedin: fill(template.linkedin),
      }
      setGenerated(filled)
      setEditedPosts(filled)
      setIsGenerating(false)
    }, 500)
  }

  const campaign = CAMPAIGN_TYPES.find(c => c.id === campaignId)!
  const activePlatforms = PLATFORMS.filter(p => selectedPlatforms.includes(p.id))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
      {/* Config */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label className="label-upper">Platforms</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)} className="btn btn-ghost"
                style={{
                  flex: 1, fontSize: 11, padding: '7px 4px',
                  background: selectedPlatforms.includes(p.id) ? 'var(--surface2)' : 'transparent',
                  color: selectedPlatforms.includes(p.id) ? 'var(--fg)' : 'var(--fg3)',
                  borderColor: selectedPlatforms.includes(p.id) ? 'var(--fg4)' : 'var(--border)',
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-upper">Campaign Type</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {CAMPAIGN_TYPES.map(c => (
              <button key={c.id} onClick={() => setCampaignId(c.id)}
                style={{
                  padding: '7px 10px', borderRadius: 5, cursor: 'pointer', textAlign: 'left',
                  border: `1px solid ${campaignId === c.id ? 'var(--fg3)' : 'var(--border)'}`,
                  background: campaignId === c.id ? 'var(--surface2)' : 'transparent',
                  color: campaignId === c.id ? 'var(--fg)' : 'var(--fg3)',
                  fontSize: 11, fontWeight: campaignId === c.id ? 600 : 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                <span>{c.label}</span>
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 2,
                  background: c.tag === 'Vendor' ? 'var(--fg)' : 'var(--surface3)',
                  color: c.tag === 'Vendor' ? 'var(--bg)' : 'var(--fg4)',
                }}>{c.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div>
          <label className="label-upper">Suburb / Area</label>
          <input value={suburb} onChange={e => setSuburb(e.target.value)} placeholder="e.g. Wollongong" className="input" />
        </div>

        <div>
          <label className="label-upper">Property Address {campaign.tag !== 'Vendor' ? '' : '(optional)'}</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="12 Ocean Ave, Wollongong" className="input" />
        </div>

        {campaign.tag !== 'Vendor' && (
          <>
            <div>
              <label className="label-upper">Key Features</label>
              <input value={features} onChange={e => setFeatures(e.target.value)} placeholder="4 bed · 2 bath · ocean views" className="input" />
            </div>
            <div>
              <label className="label-upper">Price / Guide</label>
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="$1,150,000 – $1,250,000" className="input" />
            </div>
          </>
        )}

        <button onClick={generate} disabled={isGenerating} className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: 13, fontWeight: 800 }}>
          {isGenerating ? 'Generating...' : '✦ Generate Posts'}
        </button>

        {/* Canva */}
        <div style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 7, background: 'var(--surface2)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>Design with Canva</div>
          <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 10, lineHeight: 1.5 }}>
            Create property graphics with AI-generated copy pre-filled
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}>Open in Canva →</button>
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!generated && !isGenerating && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 400, border: '1px dashed var(--border)', borderRadius: 10, color: 'var(--fg4)', gap: 12 }}>
            <div style={{ fontSize: 28 }}>◻</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg3)', marginBottom: 5 }}>Posts appear here</div>
              <div style={{ fontSize: 11 }}>Select a campaign type and click Generate</div>
            </div>
          </div>
        )}

        {isGenerating && activePlatforms.map(p => (
          <div key={p.id} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg2)', marginBottom: 12 }}>{p.label}</div>
            {[14, 14, 14].map((_, i) => <div key={i} className="skeleton" style={{ height: 12, marginBottom: 8, width: `${85 - i * 10}%` }} />)}
          </div>
        ))}

        {generated && activePlatforms.map(p => {
          const key = p.id as keyof GeneratedPost
          return (
            <div key={p.id} className="card fade-in" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{p.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--fg4)' }}>{editedPosts[key]?.length} chars</span>
                </div>
                <button onClick={() => navigator.clipboard.writeText(editedPosts[key] || '')}
                  className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 9px' }}>
                  Copy
                </button>
              </div>
              <textarea value={editedPosts[key] || ''}
                onChange={e => setEditedPosts(prev => ({ ...prev, [key]: e.target.value }))}
                rows={7} className="input"
                style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
            </div>
          )
        })}

        {generated && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
              className="input" style={{ flex: 1 }} />
            <button className="btn btn-ghost" style={{ fontSize: 13 }}>Save Draft</button>
            <button className="btn btn-primary" style={{ fontSize: 13, fontWeight: 800 }}>
              {scheduledDate ? 'Schedule' : 'Publish Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
