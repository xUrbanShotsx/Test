'use client'

import { useState } from 'react'

interface Props { onClose: () => void }

const PROPERTY_CLASSES = ['Residential', 'Commercial', 'Rural', 'Land']
const LISTING_TYPES = ['Sale', 'Rent']
const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT']

export default function PropertyForm({ onClose }: Props) {
  const [activeSection, setActiveSection] = useState('details')
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<{
    headline: string
    fullDescription: string
    keyFeatures: string[]
    socialSnippet: string
    smsBlurb: string
  } | null>(null)

  const [form, setForm] = useState({
    address: '', suburb: '', state: 'NSW', postcode: '',
    propertyClass: 'Residential', listingType: 'Sale',
    bedrooms: '', bathrooms: '', carSpaces: '', landArea: '', buildingArea: '',
    price: '', displayPrice: '', marketingBrief: '',
    features: '', description: '',
  })

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const generateCopy = async () => {
    setIsGeneratingCopy(true)
    try {
      const res = await fetch('/api/ai/property-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: form.address || '12 Ocean Ave',
          suburb: form.suburb || 'Wollongong',
          state: form.state,
          bedrooms: parseInt(form.bedrooms) || null,
          bathrooms: parseInt(form.bathrooms) || null,
          carSpaces: parseInt(form.carSpaces) || null,
          landArea: parseInt(form.landArea) || null,
          buildingArea: parseInt(form.buildingArea) || null,
          price: parseInt(form.price) || null,
          displayPrice: form.displayPrice || null,
          features: form.features.split(',').map(f => f.trim()).filter(Boolean),
          propertyClass: form.propertyClass.toLowerCase(),
          listingType: form.listingType.toLowerCase(),
          marketingBrief: form.marketingBrief || null,
        }),
      })
      const data = await res.json()
      setGeneratedCopy(data)
    } catch {
      const addr = form.address || '12 Ocean Ave, Wollongong'
      setGeneratedCopy({
        headline: `Breathtaking Coastal Living Awaits at ${addr}`,
        fullDescription: `Welcome to ${addr}, where every day feels like a holiday. This exceptional ${form.bedrooms || '3'}-bedroom home has been crafted for those who demand the very best in coastal living.\n\nDesigned for effortless entertaining, the open-plan living and dining area flows seamlessly to a stunning alfresco deck, perfectly capturing sea breezes and natural light. The gourmet kitchen features premium stone benchtops and quality appliances that will delight even the most discerning chef.\n\nRetreating to the master suite, you'll discover a sanctuary of calm, complete with a luxurious ensuite and built-in robes. Additional bedrooms are generously proportioned, serviced by a stylish main bathroom.\n\nSituated moments from pristine beaches, award-winning restaurants, and excellent schools, this is coastal lifestyle at its absolute finest.`,
        keyFeatures: ['Stunning ocean views from multiple rooms', 'Architect-designed open plan living', 'Gourmet kitchen with stone benchtops', 'Expansive alfresco entertaining deck', 'Master suite with luxurious ensuite', 'Double lock-up garage with internal access'],
        socialSnippet: `Coastal perfection at ${addr}! This stunning ${form.bedrooms || 3}-bed home offers breathtaking ocean views and effortless indoor-outdoor living. The lifestyle you've always dreamed of awaits 🌊🏡`,
        smsBlurb: `New: ${addr} - ${form.bedrooms || 3}bed coastal dream. ${form.displayPrice || 'POA'}. Reply for details!`,
      })
    }
    setIsGeneratingCopy(false)
  }

  const sections = [
    { id: 'details', label: 'Property Details' },
    { id: 'ai', label: '✦ AI Marketing Copy' },
    { id: 'launch', label: 'Launch Checklist' },
  ]

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onClose}
          style={{ padding: '7px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground-muted)', fontSize: 13, cursor: 'pointer' }}>
          ← Back
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)' }}>New Listing</h2>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, background: 'var(--surface)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ padding: '8px 16px', borderRadius: 7, border: 'none', background: activeSection === s.id ? 'var(--surface-3)' : 'transparent', color: activeSection === s.id ? 'var(--foreground)' : 'var(--foreground-muted)', fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Details section */}
      {activeSection === 'details' && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Street Address *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="12 Ocean Ave"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suburb *</label>
                  <input value={form.suburb} onChange={e => set('suburb', e.target.value)} placeholder="Wollongong"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Postcode</label>
                  <input value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder="2500"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Class</label>
                  <select value={form.propertyClass} onChange={e => set('propertyClass', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}>
                    {PROPERTY_CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Listing Type</label>
                  <select value={form.listingType} onChange={e => set('listingType', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}>
                    {LISTING_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[['Bedrooms', 'bedrooms', '3'], ['Bathrooms', 'bathrooms', '2'], ['Car Spaces', 'carSpaces', '2']].map(([label, key, ph]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                    <input type="number" value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={ph}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['Land Area (sqm)', 'landArea'], ['Building Area (sqm)', 'buildingArea']].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                    <input type="number" value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder="620"
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price (numeric)</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="875000"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Display Price</label>
                <input value={form.displayPrice} onChange={e => set('displayPrice', e.target.value)} placeholder="$850,000 - $900,000 or Auction"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Features (comma separated)</label>
                <input value={form.features} onChange={e => set('features', e.target.value)} placeholder="Ocean views, Renovated kitchen, Pool, Walk to beach"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent Marketing Notes (for AI)</label>
                <textarea value={form.marketingBrief} onChange={e => set('marketingBrief', e.target.value)} rows={4}
                  placeholder="Tell AI anything special: vendor story, hidden features, target buyer, unique selling points..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photos</label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📷</div>
                  <div style={{ fontSize: 12, color: 'var(--foreground-muted)' }}>Drag & drop photos here</div>
                  <div style={{ fontSize: 11, color: 'var(--foreground-subtle)', marginTop: 4 }}>JPG, PNG up to 10MB each</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground-muted)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => setActiveSection('ai')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#FFD940,#FF9500)', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
              Next: AI Marketing Copy →
            </button>
          </div>
        </div>
      )}

      {/* AI Copy section */}
      {activeSection === 'ai' && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>AI Marketing Copy Generator</h3>
              <p style={{ fontSize: 13, color: 'var(--foreground-muted)' }}>Generate listing descriptions, social captions, SMS blurbs and headlines in one click</p>
            </div>
            <button onClick={generateCopy} disabled={isGeneratingCopy}
              style={{ padding: '11px 22px', background: isGeneratingCopy ? 'var(--surface-3)' : 'linear-gradient(135deg,#FFD940,#FF9500)', border: 'none', borderRadius: 10, color: isGeneratingCopy ? 'var(--foreground-muted)' : '#000', fontSize: 14, fontWeight: 800, cursor: isGeneratingCopy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              {isGeneratingCopy ? <><div className="ai-thinking"><span /><span /><span /></div> Generating all copy...</> : '✦ Generate All Copy with AI'}
            </button>
          </div>

          {!generatedCopy && !isGeneratingCopy && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--foreground-muted)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✦</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>AI will generate 5 pieces of marketing copy</div>
              <div style={{ fontSize: 13, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>Portal headline · Full description · Key feature bullets · Social caption · SMS blurb</div>
            </div>
          )}

          {isGeneratingCopy && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Portal Headline', 'Full Description', 'Key Features', 'Social Caption', 'SMS Blurb'].map(label => (
                <div key={label}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: 6 }}>{label.toUpperCase()}</div>
                  <div className="skeleton" style={{ height: label === 'Full Description' ? 100 : 36 }} />
                </div>
              ))}
            </div>
          )}

          {generatedCopy && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Portal Headline', value: generatedCopy.headline, rows: 2 },
                { label: 'Full Listing Description', value: generatedCopy.fullDescription, rows: 10 },
                { label: 'Social Media Caption', value: generatedCopy.socialSnippet, rows: 4 },
                { label: 'SMS Blurb', value: generatedCopy.smsBlurb, rows: 2 },
              ].map(field => (
                <div key={field.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</label>
                    <button onClick={() => navigator.clipboard.writeText(field.value)}
                      style={{ fontSize: 11, color: 'var(--foreground-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 5, padding: '2px 8px', cursor: 'pointer' }}>
                      Copy
                    </button>
                  </div>
                  <textarea defaultValue={field.value} rows={field.rows}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, lineHeight: 1.7, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Key Features</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {generatedCopy.keyFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--accent)' }}>✓</span>
                      <input defaultValue={f} style={{ flex: 1, background: 'none', border: 'none', color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setActiveSection('details')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground-muted)', fontSize: 13, cursor: 'pointer' }}>← Back</button>
            <button onClick={() => setActiveSection('launch')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#FFD940,#FF9500)', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
              Next: Launch Checklist →
            </button>
          </div>
        </div>
      )}

      {/* Launch Checklist */}
      {activeSection === 'launch' && (
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 6 }}>Launch Readiness Checklist</h3>
          <p style={{ fontSize: 13, color: 'var(--foreground-muted)', marginBottom: 24 }}>Complete these steps before going live</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Property details completed', done: !!(form.address && form.suburb), icon: '🏡' },
              { label: 'Listing description ready', done: !!generatedCopy?.fullDescription, icon: '📝' },
              { label: 'Property photos uploaded', done: false, icon: '📷' },
              { label: 'Social posts created', done: false, icon: '📱' },
              { label: 'Email campaign drafted', done: false, icon: '📧' },
              { label: 'SMS blast prepared', done: false, icon: '💬' },
              { label: 'Inspection times set', done: false, icon: '📅' },
              { label: 'Canva designs created', done: false, icon: '🎨' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: item.done ? 'var(--green-dim)' : 'var(--surface-2)', border: `1px solid ${item.done ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`, borderRadius: 8 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: item.done ? 'var(--green)' : 'var(--foreground)', fontWeight: item.done ? 600 : 400 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 16 }}>{item.done ? '✅' : '⬜'}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setActiveSection('ai')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground-muted)', fontSize: 13, cursor: 'pointer' }}>← Back</button>
            <button onClick={() => { alert('Listing saved! (demo mode)'); onClose() }}
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: 8, color: '#000', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
              🚀 Save & Publish Listing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
