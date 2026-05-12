'use client'

import { useState } from 'react'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyForm from '@/components/properties/PropertyForm'

const TABS = ['Active', 'Under Offer', 'Sold', 'All']

const PROPERTIES = [
  { id: '1', address: '12 Ocean Ave',  suburb: 'Wollongong', state: 'NSW', postcode: '2500', bedrooms: 3, bathrooms: 2, carSpaces: 2, price: 875000,  displayPrice: '$850,000 – $900,000',    status: 'active',      listingType: 'sale', propertyClass: 'residential', description: 'Stunning coastal home with breathtaking ocean views.', features: ['Ocean views', 'Renovated kitchen', 'Deck entertaining', 'Walk to beach'], images: [], leads: 12, daysListed: 8 },
  { id: '2', address: '7 Beach Rd',    suburb: 'Thirroul',   state: 'NSW', postcode: '2515', bedrooms: 4, bathrooms: 3, carSpaces: 2, price: 1150000, displayPrice: '$1,100,000 – $1,200,000', status: 'active',      listingType: 'sale', propertyClass: 'residential', description: 'Architect-designed masterpiece.',                        features: ['Architect design', 'Pool', 'Double garage', 'Sea glimpses'],           images: [], leads: 8,  daysListed: 14 },
  { id: '3', address: '4/88 Crown St', suburb: 'Wollongong', state: 'NSW', postcode: '2500', bedrooms: 2, bathrooms: 1, carSpaces: 1, price: 620000,  displayPrice: 'Offers Over $600,000',    status: 'under-offer', listingType: 'sale', propertyClass: 'residential', description: 'Modern CBD apartment.',                                 features: ['City views', 'Gym', 'Concierge', 'Walk to train'],                    images: [], leads: 5,  daysListed: 21 },
  { id: '4', address: '23 Corrimal St',suburb: 'Corrimal',   state: 'NSW', postcode: '2518', bedrooms: 3, bathrooms: 1, carSpaces: 2, price: 750000,  displayPrice: '$720,000 – $760,000',     status: 'active',      listingType: 'sale', propertyClass: 'residential', description: 'Family home on large block.',                           features: ['Large block 650sqm', 'Granny flat potential', 'North facing'],         images: [], leads: 4,  daysListed: 3 },
  { id: '5', address: '15 Cliff Dr',   suburb: 'Bulli',      state: 'NSW', postcode: '2516', bedrooms: 4, bathrooms: 2, carSpaces: 2, price: 1350000, displayPrice: 'Auction',                 status: 'active',      listingType: 'sale', propertyClass: 'residential', description: 'Clifftop sanctuary with 180° ocean views.',             features: ['180° ocean views', 'Clifftop', 'Heated pool', "Entertainer's deck"],  images: [], leads: 18, daysListed: 5 },
  { id: '6', address: '8 Coal Cliff Rd',suburb:'Coal Cliff', state: 'NSW', postcode: '2508', bedrooms: 3, bathrooms: 2, carSpaces: 1, price: 920000,  displayPrice: '$900,000+',               status: 'sold',        listingType: 'sale', propertyClass: 'residential', description: 'Sold under hammer at auction.',                         features: ['Ocean views', 'Modern reno', 'Deck'],                                 images: [], leads: 0,  daysListed: 0 },
]

const statusFilter: Record<string, string[]> = {
  'Active':      ['active'],
  'Under Offer': ['under-offer'],
  'Sold':        ['sold', 'leased'],
  'All':         ['active', 'under-offer', 'sold', 'leased', 'draft'],
}

export default function PropertiesPage() {
  const [activeTab, setActiveTab] = useState('Active')
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = PROPERTIES.filter(p => {
    const matchTab = statusFilter[activeTab].includes(p.status)
    const matchSearch = search === '' || `${p.address} ${p.suburb}`.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  if (showNew) {
    return <PropertyForm onClose={() => setShowNew(false)} />
  }

  const activeCount = PROPERTIES.filter(p => p.status === 'active').length
  const underOfferCount = PROPERTIES.filter(p => p.status === 'under-offer').length
  const totalLeads = PROPERTIES.reduce((a, p) => a + p.leads, 0)
  const avgDays = Math.round(PROPERTIES.filter(p => p.daysListed > 0).reduce((a, p) => a + p.daysListed, 0) / PROPERTIES.filter(p => p.daysListed > 0).length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>Properties</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Active listings and marketing</div>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary" style={{ fontSize: 12 }}>+ New Listing</button>
      </div>

      {/* Search + filters row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by address or suburb…" className="input" style={{ maxWidth: 340 }} />
        <select className="input" style={{ width: 'auto', flex: 'none' }}>
          <option>All agents</option>
          <option>James Spinelli</option>
        </select>
        <select className="input" style={{ width: 'auto', flex: 'none' }}>
          <option>All types</option>
          <option>For Sale</option>
          <option>For Rent</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Active listings', value: String(activeCount) },
          { label: 'Under offer',     value: String(underOfferCount) },
          { label: 'Total leads',     value: String(totalLeads) },
          { label: 'Avg days listed', value: String(avgDays) },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab card + grid */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--hairline)', padding: '0 20px' }}>
          {TABS.map(tab => (
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
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                padding: '1px 6px', borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--hairline)', color: 'var(--mute)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {statusFilter[tab].flatMap(s => PROPERTIES.filter(p => p.status === s)).length}
              </span>
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--mute)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>No properties</div>
              <div style={{ fontSize: 13 }}>No listings match this filter</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
