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

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:       { bg: 'var(--surface3)', color: 'var(--fg)',  label: 'Active' },
  'under-offer':{ bg: 'var(--surface2)', color: 'var(--fg2)', label: 'Under Offer' },
  sold:         { bg: 'transparent',    color: 'var(--fg4)', label: 'Sold' },
  leased:       { bg: 'transparent',    color: 'var(--fg4)', label: 'Leased' },
  draft:        { bg: 'transparent',    color: 'var(--fg4)', label: 'Draft' },
}

export default function PropertyCard({ property: p }: { property: Property }) {
  const [showMarket, setShowMarket] = useState(false)
  const sc = STATUS_STYLE[p.status] || STATUS_STYLE.draft

  return (
    <>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        {/* Image area */}
        <div style={{ height: 168, background: 'var(--surface2)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--fg4)' }}>Property Photo</div>

          {/* Status */}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span style={{ padding: '3px 9px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid var(--border)', ...sc }}>
              {sc.label}
            </span>
          </div>

          {/* Days listed */}
          {p.daysListed > 0 && (
            <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.7)', fontSize: 10, color: 'var(--fg2)', fontWeight: 600, border: '1px solid var(--border)' }}>
              {p.daysListed}d listed
            </div>
          )}

          {/* AI Market button */}
          <button
            onClick={() => setShowMarket(true)}
            style={{
              position: 'absolute', bottom: 10, right: 10,
              padding: '6px 12px', borderRadius: 5,
              background: 'var(--fg)', color: 'var(--bg)',
              border: 'none', fontSize: 11, fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              letterSpacing: '-0.01em',
            }}>
            ✦ AI Market
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', lineHeight: 1.2 }}>{p.address}</div>
            <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2 }}>{p.suburb}, {p.state} {p.postcode}</div>
          </div>

          {/* Specs */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            {p.bedrooms  && <span style={{ fontSize: 12, color: 'var(--fg3)' }}>{p.bedrooms} bed</span>}
            {p.bathrooms && <span style={{ fontSize: 12, color: 'var(--fg3)' }}>{p.bathrooms} bath</span>}
            {p.carSpaces && <span style={{ fontSize: 12, color: 'var(--fg3)' }}>{p.carSpaces} car</span>}
          </div>

          {/* Price */}
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            {p.displayPrice || (p.price ? formatCurrency(p.price) : 'POA')}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {p.features.slice(0, 3).map(f => (
              <span key={f} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--fg3)' }}>{f}</span>
            ))}
            {p.features.length > 3 && (
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: 'transparent', border: '1px solid var(--border2)', color: 'var(--fg4)' }}>+{p.features.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border2)' }}>
            <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{p.leads} leads</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Edit</button>
              <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setShowMarket(true)}>Market →</button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Market Dashboard overlay */}
      {showMarket && (
        <AIMarketDashboard property={p} onClose={() => setShowMarket(false)} />
      )}
    </>
  )
}
