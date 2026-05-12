'use client'

import { useState } from 'react'

const CONTACTS = [
  { id: 1, firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.m@email.com', mobile: '0412 345 678', type: 'buyer', suburb: 'Wollongong', rating: 5, source: 'web', tags: ['hot', 'beach'], subscribed: true },
  { id: 2, firstName: 'James', lastName: 'Wong', email: 'jwong@gmail.com', mobile: '0423 456 789', type: 'buyer', suburb: 'Thirroul', rating: 4, source: 'social', tags: ['investor'], subscribed: true },
  { id: 3, firstName: 'Emily', lastName: 'Clarke', email: 'emily.c@work.com', mobile: '0434 567 890', type: 'vendor', suburb: 'Bulli', rating: 3, source: 'referral', tags: ['vendor'], subscribed: true },
  { id: 4, firstName: 'Michael', lastName: 'Torres', email: 'm.torres@email.com', mobile: '0445 678 901', type: 'buyer', suburb: 'Corrimal', rating: 2, source: 'portal', tags: ['first-home'], subscribed: true },
  { id: 5, firstName: 'Lisa', lastName: 'Park', email: 'lisa.park@biz.com', mobile: '0456 789 012', type: 'investor', suburb: 'Wollongong', rating: 4, source: 'referral', tags: ['investor', 'multiple'], subscribed: true },
  { id: 6, firstName: 'David', lastName: 'Chen', email: 'dchen@email.com', mobile: '0467 890 123', type: 'buyer', suburb: 'Fairy Meadow', rating: 3, source: 'web', tags: ['beach'], subscribed: false },
  { id: 7, firstName: 'Amanda', lastName: 'Ross', email: 'amanda.r@email.com', mobile: '0478 901 234', type: 'tenant', suburb: 'Port Kembla', rating: 2, source: 'walk-in', tags: [], subscribed: true },
  { id: 8, firstName: 'Tom', lastName: 'Bradley', email: 'tom.b@email.com', mobile: '0489 012 345', type: 'landlord', suburb: 'Austinmer', rating: 4, source: 'referral', tags: ['investor'], subscribed: true },
]

const typeColors: Record<string, string> = {
  buyer: 'var(--blue)',
  vendor: 'var(--accent)',
  investor: 'var(--purple)',
  tenant: 'var(--green)',
  landlord: 'var(--orange)',
}

export default function ContactTable() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selected, setSelected] = useState<number[]>([])

  const filtered = CONTACTS.filter(c => {
    const matchSearch = search === '' || `${c.firstName} ${c.lastName} ${c.email} ${c.suburb}`.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || c.type === filterType
    return matchSearch && matchType
  })

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const starRating = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#FFD940' : 'var(--surface-3)', fontSize: 12 }}>★</span>
    ))

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts..."
          style={{ flex: 1, padding: '9px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          style={{ padding: '9px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground)', fontSize: 13, outline: 'none' }}>
          <option value="all">All types</option>
          <option value="buyer">Buyers</option>
          <option value="vendor">Vendors</option>
          <option value="investor">Investors</option>
          <option value="tenant">Tenants</option>
          <option value="landlord">Landlords</option>
        </select>
        {selected.length > 0 && (
          <button style={{ padding: '9px 16px', background: 'linear-gradient(135deg,#FFD940,#FF9500)', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            📧 Email {selected.length} selected
          </button>
        )}
        <button style={{ padding: '9px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--foreground-muted)', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Import CSV
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 180px 100px 80px 80px 60px', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
        <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(c => c.id) : [])} />
        {['Contact', 'Email / Mobile', 'Type', 'Rating', 'Source', ''].map(h => (
          <span key={h} style={{ fontSize: 11, color: 'var(--foreground-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {filtered.map(c => (
        <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 180px 100px 80px 80px 60px', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center', cursor: 'pointer' }}
          className="card-hover">
          <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} onClick={e => e.stopPropagation()} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${typeColors[c.type]}20`, border: `1px solid ${typeColors[c.type]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: typeColors[c.type], flexShrink: 0 }}>
              {c.firstName[0]}{c.lastName[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{c.firstName} {c.lastName}</div>
              <div style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{c.suburb}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--foreground)' }}>{c.email}</div>
            <div style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{c.mobile}</div>
          </div>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', background: `${typeColors[c.type]}18`, color: typeColors[c.type] }}>
            {c.type}
          </span>
          <div>{starRating(c.rating)}</div>
          <div style={{ fontSize: 11, color: 'var(--foreground-muted)', textTransform: 'capitalize' }}>{c.source}</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span title={c.subscribed ? 'Email subscribed' : 'Unsubscribed'} style={{ fontSize: 14 }}>
              {c.subscribed ? '✅' : '❌'}
            </span>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--foreground-muted)' }}>
        Showing {filtered.length} of {CONTACTS.length} contacts
        {selected.length > 0 && ` · ${selected.length} selected`}
      </div>
    </div>
  )
}
