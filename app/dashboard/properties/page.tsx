'use client'

import { useState } from 'react'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyForm from '@/components/properties/PropertyForm'

const TABS = ['Active', 'Under Offer', 'Sold', 'All']

const PROPERTIES = [
  { id: '1', address: '12 Ocean Ave', suburb: 'Wollongong', state: 'NSW', postcode: '2500', bedrooms: 3, bathrooms: 2, carSpaces: 2, price: 875000, displayPrice: '$850,000 - $900,000', status: 'active', listingType: 'sale', propertyClass: 'residential', description: 'Stunning coastal home with breathtaking ocean views...', features: ['Ocean views', 'Renovated kitchen', 'Deck entertaining', 'Walk to beach'], images: [], leads: 12, daysListed: 8 },
  { id: '2', address: '7 Beach Rd', suburb: 'Thirroul', state: 'NSW', postcode: '2515', bedrooms: 4, bathrooms: 3, carSpaces: 2, price: 1150000, displayPrice: '$1,100,000 - $1,200,000', status: 'active', listingType: 'sale', propertyClass: 'residential', description: 'Architect-designed masterpiece...', features: ['Architect design', 'Pool', 'Double garage', 'Sea glimpses'], images: [], leads: 8, daysListed: 14 },
  { id: '3', address: '4/88 Crown St', suburb: 'Wollongong', state: 'NSW', postcode: '2500', bedrooms: 2, bathrooms: 1, carSpaces: 1, price: 620000, displayPrice: 'Offers Over $600,000', status: 'under-offer', listingType: 'sale', propertyClass: 'residential', description: 'Modern CBD apartment...', features: ['City views', 'Gym', 'Concierge', 'Walk to train'], images: [], leads: 5, daysListed: 21 },
  { id: '4', address: '23 Corrimal St', suburb: 'Corrimal', state: 'NSW', postcode: '2518', bedrooms: 3, bathrooms: 1, carSpaces: 2, price: 750000, displayPrice: '$720,000 - $760,000', status: 'active', listingType: 'sale', propertyClass: 'residential', description: 'Family home on large block...', features: ['Large block 650sqm', 'Granny flat potential', 'North facing', 'Quiet street'], images: [], leads: 4, daysListed: 3 },
  { id: '5', address: '15 Cliff Dr', suburb: 'Bulli', state: 'NSW', postcode: '2516', bedrooms: 4, bathrooms: 2, carSpaces: 2, price: 1350000, displayPrice: 'Auction', status: 'active', listingType: 'sale', propertyClass: 'residential', description: 'Clifftop sanctuary with 180-degree ocean views...', features: ['180° ocean views', 'Clifftop location', 'Heated pool', 'Entertainer\'s deck'], images: [], leads: 18, daysListed: 5 },
  { id: '6', address: '8 Coal Cliff Rd', suburb: 'Coal Cliff', state: 'NSW', postcode: '2508', bedrooms: 3, bathrooms: 2, carSpaces: 1, price: 920000, displayPrice: '$900,000+', status: 'sold', listingType: 'sale', propertyClass: 'residential', description: 'Sold under hammer at auction...', features: ['Ocean views', 'Modern reno', 'Deck'], images: [], leads: 0, daysListed: 0 },
]

const statusFilter: Record<string, string[]> = {
  'Active': ['active'],
  'Under Offer': ['under-offer'],
  'Sold': ['sold', 'leased'],
  'All': ['active', 'under-offer', 'sold', 'leased', 'draft'],
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by address or suburb..."
          style={{ flex: 1, maxWidth: 360, padding: '9px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }} />
        <select style={{ padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}>
          <option>All agents</option>
          <option>John Demo</option>
        </select>
        <select style={{ padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}>
          <option>All types</option>
          <option>For Sale</option>
          <option>For Rent</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowNew(true)}
          style={{ padding: '10px 18px', background: 'linear-gradient(135deg,#FFD940,#FF9500)', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          + New Listing
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Active listings', value: PROPERTIES.filter(p => p.status === 'active').length, color: 'var(--green)' },
          { label: 'Under offer', value: PROPERTIES.filter(p => p.status === 'under-offer').length, color: 'var(--accent)' },
          { label: 'Total leads', value: PROPERTIES.reduce((a, p) => a + p.leads, 0), color: 'var(--blue)' },
          { label: 'Avg days listed', value: Math.round(PROPERTIES.filter(p => p.daysListed > 0).reduce((a, p) => a + p.daysListed, 0) / PROPERTIES.filter(p => p.daysListed > 0).length), color: 'var(--purple)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 36, borderRadius: 4, background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + grid */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '14px 16px', fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? 'var(--accent)' : 'var(--foreground-muted)', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', marginBottom: -1 }}>
              {tab}
              <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--surface-3)', borderRadius: 99, padding: '1px 6px', color: 'var(--foreground-muted)' }}>
                {statusFilter[tab].flatMap(s => PROPERTIES.filter(p => p.status === s)).length}
              </span>
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--foreground-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏡</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No properties found</div>
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
