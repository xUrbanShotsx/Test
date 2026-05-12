'use client'

import { useState, useEffect } from 'react'

interface SyncCounts { contacts: number; properties: number; applicants: number }
interface StatusData  { configured: boolean; customerId: string | null; lastSynced: string | null; counts: SyncCounts }
type ConnectState = 'idle' | 'testing' | 'success' | 'error'
type SyncState    = 'idle' | 'syncing' | 'done'   | 'error'
type View         = 'connected' | 'form' | 'guide'

export default function ReapitConnect() {
  const [view, setView]               = useState<View>('form')
  const [clientId, setClientId]       = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [customerId, setCustomerId]   = useState('reapitsales')
  const [showSecret, setShowSecret]   = useState(false)
  const [connectState, setConnectState] = useState<ConnectState>('idle')
  const [connectMsg, setConnectMsg]   = useState('')
  const [syncState, setSyncState]     = useState<SyncState>('idle')
  const [syncMsg, setSyncMsg]         = useState('')
  const [status, setStatus]           = useState<StatusData | null>(null)

  useEffect(() => {
    fetch('/api/reapit/status')
      .then(r => r.json())
      .then((d: StatusData) => {
        setStatus(d)
        if (d.customerId) setCustomerId(d.customerId)
        if (d.configured) setView('connected')
      })
      .catch(() => null)
  }, [])

  async function handleConnect() {
    if (!clientId || !clientSecret) {
      setConnectMsg('Enter your Client ID and Client Secret.')
      setConnectState('error')
      return
    }
    setConnectState('testing')
    setConnectMsg('')
    try {
      const res  = await fetch('/api/reapit/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, customerId }),
      })
      const data = await res.json()
      if (data.ok) {
        setConnectState('success')
        setConnectMsg(`${data.totalNegotiators} agent${data.totalNegotiators !== 1 ? 's' : ''} found`)
        setView('connected')
      } else {
        setConnectState('error')
        setConnectMsg(data.error ?? 'Connection failed — check your credentials.')
      }
    } catch {
      setConnectState('error')
      setConnectMsg('Network error.')
    }
  }

  async function handleSync() {
    setSyncState('syncing')
    setSyncMsg('')
    try {
      const res  = await fetch('/api/reapit/sync', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setSyncState('done')
        const s = data.synced
        setSyncMsg(`${s.totalContacts.toLocaleString()} contacts · ${s.totalProperties.toLocaleString()} properties · ${s.totalApplicants.toLocaleString()} leads`)
        setStatus(prev => prev ? { ...prev, lastSynced: data.lastSynced, counts: { contacts: s.totalContacts, properties: s.totalProperties, applicants: s.totalApplicants } } : prev)
      } else {
        setSyncState('error')
        setSyncMsg(data.error ?? 'Sync failed.')
      }
    } catch {
      setSyncState('error')
      setSyncMsg('Network error during sync.')
    }
  }

  const fmtDate = (iso: string | null) => {
    if (!iso) return null
    return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  // ── Connected state ────────────────────────────────────────────────────────
  if (view === 'connected') {
    return (
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--canvas-soft)', border: '1px solid var(--hairline)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)',
            }}>R</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink)' }}>Reapit Sales</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--hairline)',
                  background: 'rgba(255,255,255,0.07)',
                  color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>Connected</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {customerId}
                {status?.lastSynced ? ` · Synced ${fmtDate(status.lastSynced)}` : ''}
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 11, padding: '5px 12px' }}
            onClick={() => { setView('form'); setConnectState('idle'); setConnectMsg('') }}
          >Edit credentials</button>
        </div>

        {/* Sync stats */}
        {status?.counts && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Contacts', value: status.counts.contacts },
              { label: 'Properties', value: status.counts.properties },
              { label: 'Leads', value: status.counts.applicants },
            ].map(s => (
              <div key={s.label} style={{ padding: '14px 16px', borderRadius: 8, background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.03em' }}>{s.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {/* Sync button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: 12 }}
            onClick={handleSync}
            disabled={syncState === 'syncing'}
          >
            {syncState === 'syncing' ? '↻ Syncing…' : '↻ Sync Now'}
          </button>
          {syncMsg && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: syncState === 'error' ? 'var(--mute)' : 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {syncState === 'error' ? '✕ ' : '✓ '}{syncMsg}
            </span>
          )}
        </div>
      </div>
    )
  }

  // ── How to get credentials guide ───────────────────────────────────────────
  if (view === 'guide') {
    return (
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>How to get your Reapit API credentials</div>
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 12px' }} onClick={() => setView('form')}>← Back</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { n: '01', title: 'Go to Reapit Foundations', body: 'Visit developers.reapit.cloud and sign in with your Reapit account (same login as your Reapit software).', link: 'https://developers.reapit.cloud', linkLabel: 'Open Reapit Foundations →' },
            { n: '02', title: 'Create a new app', body: 'Click "Create App" → choose "Client Credentials" grant type. Name it anything (e.g. "Innovate.AI Integration").' },
            { n: '03', title: 'Set scopes', body: 'In app settings, tick: Contacts, Properties, Applicants, Negotiators. Save the app.' },
            { n: '04', title: 'Copy your credentials', body: 'From the app detail page, copy the Client ID and Client Secret. Your Customer ID is "reapitsales" (already filled in).' },
            { n: '05', title: 'Paste and connect', body: 'Come back here, paste both values and click Connect. Done — your database syncs automatically.' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, marginTop: 2, width: 20 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--body-text)', lineHeight: 1.6, marginBottom: s.link ? 8 : 0 }}>{s.body}</div>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink)',
                    textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--hairline)', display: 'inline-block',
                  }}>{s.linkLabel}</a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
          <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setView('form')}>
            I have my credentials →
          </button>
        </div>
      </div>
    )
  }

  // ── Connect form ───────────────────────────────────────────────────────────
  return (
    <div className="card" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--canvas-soft)', border: '1px solid var(--hairline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)',
          }}>R</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink)' }}>Connect Reapit Sales</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sync your CRM database</div>
          </div>
        </div>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 11, padding: '5px 12px' }}
          onClick={() => setView('guide')}
        >
          How to get credentials
        </button>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="label-upper">Customer ID</label>
            <input
              className="input"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              placeholder="reapitsales"
              autoComplete="off"
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pre-filled for reapitsales</div>
          </div>
          <div>
            <label className="label-upper">Client ID</label>
            <input
              className="input"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              placeholder="From Reapit Foundations"
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <label className="label-upper">Client Secret</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showSecret ? 'text' : 'password'}
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              placeholder="From Reapit Foundations"
              autoComplete="new-password"
              style={{ paddingRight: 70 }}
            />
            <button
              onClick={() => setShowSecret(s => !s)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
              {showSecret ? 'Hide' : 'Show'}
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Stored in your .env — never sent to any third party
          </div>
        </div>
      </div>

      {/* Connect button */}
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: 13, padding: '10px 24px' }}
          onClick={handleConnect}
          disabled={connectState === 'testing'}
        >
          {connectState === 'testing' ? 'Connecting…' : 'Connect Reapit →'}
        </button>
        {connectMsg && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: connectState === 'error' ? 'var(--mute)' : 'var(--ink)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {connectState === 'error' ? '✕ ' : '✓ '}{connectMsg}
          </span>
        )}
      </div>

      {/* .env snippet on success */}
      {connectState === 'success' && (
        <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 8, background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Add to your .env file and restart to persist
          </div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--body-text)', lineHeight: 1.8, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`REAPIT_CLIENT_ID="${clientId}"
REAPIT_CLIENT_SECRET="${clientSecret}"
REAPIT_CUSTOMER_ID="${customerId}"`}
          </pre>
        </div>
      )}

      {/* What syncs */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--hairline)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { n: '01', title: 'Contacts',   body: 'All Reapit contacts appear in your database, ready to nurture.' },
          { n: '02', title: 'Properties', body: 'Active, under offer and sold listings pulled automatically.' },
          { n: '03', title: 'Leads',      body: 'Buyer applicants become vendor pipeline entries.' },
        ].map(s => (
          <div key={s.n}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{s.n}</div>
            <div style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: 'var(--mute)', lineHeight: 1.6 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
