'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import AIMarketDashboard from './AIMarketDashboard'

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
  listingType: string
  features: string[]
  leads: number
  daysListed: number
}

const STATUS_LABELS: Record<string, string> = {
  active:        'Active',
  'under-offer': 'Under Offer',
  sold:          'Sold',
  leased:        'Leased',
  draft:         'Draft',
}

export default function PropertyCard({ property: p }: { property: Property }) {
  const [showMarket, setShowMarket] = useState(false)
  const label = STATUS_LABELS[p.status] || 'Draft'
  const isActive = p.status === 'active'

  return (
    <>
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Image area */}
        <div style={{ height: 160, background: 'var(--canvas-soft)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--hairline)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Property Photo</span>

          {/* Status pill */}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '3px 10px', borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--hairline)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: isActive ? 'var(--ink)' : 'var(--mute)',
            }}>{label}</span>
          </div>

          {/* Days listed */}
          {p.daysListed > 0 && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              fontFamily: 'var(--font-mono)', fontSize: 9,
              padding: '3px 8px', borderRadius: 'var(--radius-pill)',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid var(--hairline)',
              color: 'var(--mute)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>{p.daysListed}d listed</div>
          )}

          {/* AI Market button */}
          <button onClick={() => setShowMarket(true)} style={{
            position: 'absolute', bottom: 10, right: 10,
            padding: '5px 12px', borderRadius: 'var(--radius-pill)',
            background: 'var(--ink)', color: 'var(--canvas)',
            border: 'none', fontFamily: 'var(--font-mono)',
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          }}>✦ AI Market</button>
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.3 }}>{p.address}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.suburb}, {p.state} {p.postcode}</div>
          </div>

          {/* Specs — mono */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {p.bedrooms  && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.bedrooms}bd</span>}
            {p.bathrooms && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.bathrooms}ba</span>}
            {p.carSpaces && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.carSpaces}cr</span>}
          </div>

          {/* Price */}
          <div style={{ fontSize: 18, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 12 }}>
            {p.displayPrice || (p.price ? formatCurrency(p.price) : 'POA')}
          </div>

          {/* Feature tags — pill outline */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {p.features.slice(0, 3).map(f => (
              <span key={f} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--hairline)', color: 'var(--mute)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{f}</span>
            ))}
            {p.features.length > 3 && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--hairline)', color: 'var(--fg4)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>+{p.features.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.leads} leads</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Edit</button>
              <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setShowMarket(true)}>Market →</button>
            </div>
          </div>
        </div>
      </div>

      {showMarket && (
        <AIMarketDashboard property={p} onClose={() => setShowMarket(false)} />
      )}
    </>
  )
}
