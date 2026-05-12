'use client'

import { useState, useEffect } from 'react'

interface SyncCounts {
  contacts: number
  properties: number
  applicants: number
}

interface StatusData {
  configured: boolean
  customerId: string | null
  lastSynced: string | null
  counts: SyncCounts
}

type ConnectState = 'idle' | 'testing' | 'success' | 'error'
type SyncState = 'idle' | 'syncing' | 'done' | 'error'

export default function ReapitConnect() {
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [customerId, setCustomerId] = useState('reapitsales')
  const [showSecret, setShowSecret] = useState(false)
  const [connectState, setConnectState] = useState<ConnectState>('idle')
  const [connectMsg, setConnectMsg] = useState('')
  const [syncState, setSyncState] = useState<SyncState>('idle')
  const [syncMsg, setSyncMsg] = useState('')
  const [status, setStatus] = useState<StatusData | null>(null)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    fetch('/api/reapit/status')
      .then(r => r.json())
      .then((d: StatusData) => {
        setStatus(d)
        if (d.customerId) setCustomerId(d.customerId)
        if (d.configured) setExpanded(false)
      })
      .catch(() => null)
  }, [])

  async function handleTest() {
    if (!clientId || !clientSecret) {
      setConnectMsg('Enter your Client ID and Client Secret first.')
      setConnectState('error')
      return
    }
    setConnectState('testing')
    setConnectMsg('')
    try {
      const res = await fetch('/api/reapit/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, customerId }),
      })
      const data = await res.json()
      if (data.ok) {
        setConnectState('success')
        setConnectMsg(`Connected — ${data.totalNegotiators} agent${data.totalNegotiators !== 1 ? 's' : ''} found in your account.`)
      } else {
        setConnectState('error')
        setConnectMsg(data.error ?? 'Connection failed')
      }
    } catch {
      setConnectState('error')
      setConnectMsg('Network error — check your connection.')
    }
  }

  async function handleSync() {
    setSyncState('syncing')
    setSyncMsg('')
    try {
      const res = await fetch('/api/reapit/sync', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setSyncState('done')
        const s = data.synced
        setSyncMsg(`Synced ${s.totalContacts.toLocaleString()} contacts · ${s.totalProperties.toLocaleString()} properties · ${s.totalApplicants.toLocaleString()} leads`)
        setStatus(prev => prev ? {
          ...prev,
          lastSynced: data.lastSynced,
          counts: { contacts: s.totalContacts, properties: s.totalProperties, applicants: s.totalApplicants },
        } : prev)
      } else {
        setSyncState('error')
        setSyncMsg(data.error ?? 'Sync failed — check your credentials.')
      }
    } catch {
      setSyncState('error')
      setSyncMsg('Network error during sync.')
    }
  }

  const fmtDate = (iso: string | null) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    return d.toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const configured = status?.configured || connectState === 'success'

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '18px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'pointer',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: 'var(--fg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 900, color: 'var(--bg)', letterSpacing: '-0.03em', flexShrink: 0,
          }}>R</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)' }}>Reapit Sales</span>
              {configured && (
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                  background: 'var(--fg)', color: 'var(--bg)', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>CONNECTED</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>
              {configured
                ? `Customer: ${customerId} · Last synced ${fmtDate(status?.lastSynced ?? null)}`
                : 'Connect your Reapit Sales CRM to sync contacts, properties and leads'}
            </div>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg3)" strokeWidth="2"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: 24 }}>
          {/* Sync stats bar (if connected) */}
          {configured && status?.lastSynced && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24,
            }}>
              {[
                { label: 'Contacts', value: status.counts.contacts },
                { label: 'Properties', value: status.counts.properties },
                { label: 'Leads', value: status.counts.applicants },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '14px 16px', borderRadius: 8,
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--fg)', letterSpacing: '-0.04em' }}>
                    {s.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{s.label} synced</div>
                </div>
              ))}
            </div>
          )}

          {/* Credentials form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: -4 }}>
              API Credentials
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5 }}>
              Get your credentials from the{' '}
              <a href="https://developers.reapit.cloud" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--fg)', textDecoration: 'underline' }}>
                Reapit Developer Portal
              </a>
              . Create an app with <strong>Client Credentials</strong> grant type and grant access to{' '}
              <code style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--surface2)', padding: '1px 5px', borderRadius: 3 }}>
                contacts, properties, applicants, negotiators
              </code>.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="label-upper">Customer ID</label>
                <input
                  className="input"
                  style={{ width: '100%' }}
                  value={customerId}
                  onChange={e => setCustomerId(e.target.value)}
                  placeholder="e.g. reapitsales"
                />
                <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 4 }}>Your Reapit account identifier</div>
              </div>
              <div>
                <label className="label-upper">Client ID</label>
                <input
                  className="input"
                  style={{ width: '100%' }}
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  placeholder="Your app client_id"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="label-upper">Client Secret</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  style={{ width: '100%', paddingRight: 80 }}
                  type={showSecret ? 'text' : 'password'}
                  value={clientSecret}
                  onChange={e => setClientSecret(e.target.value)}
                  placeholder="Your app client_secret"
                  autoComplete="new-password"
                />
                <button
                  onClick={() => setShowSecret(s => !s)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 11, color: 'var(--fg3)', fontWeight: 600,
                  }}>
                  {showSecret ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 4 }}>
                Stored in your .env file — never transmitted to the browser
              </div>
            </div>
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: 12 }}
              onClick={handleTest}
              disabled={connectState === 'testing'}
            >
              {connectState === 'testing' ? 'Testing…' : connectState === 'success' ? '✓ Connected' : 'Test Connection'}
            </button>

            {configured && (
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12 }}
                onClick={handleSync}
                disabled={syncState === 'syncing'}
              >
                {syncState === 'syncing' ? '↻ Syncing…' : '↻ Sync Now'}
              </button>
            )}

            {connectState === 'success' && (
              <div style={{ fontSize: 11, color: 'var(--fg3)' }}>
                Add these credentials to your <code style={{ fontFamily: 'monospace', fontSize: 10, background: 'var(--surface2)', padding: '1px 4px', borderRadius: 3 }}>.env</code> file, then restart the server to persist.
              </div>
            )}
          </div>

          {/* Status messages */}
          {connectMsg && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 7, fontSize: 12,
              background: connectState === 'success' ? 'var(--surface2)' : 'var(--surface2)',
              border: `1px solid ${connectState === 'error' ? 'var(--border)' : 'var(--border)'}`,
              color: connectState === 'error' ? 'var(--fg2)' : 'var(--fg)',
            }}>
              {connectState === 'error' ? '✕ ' : '✓ '}{connectMsg}
            </div>
          )}

          {syncMsg && (
            <div style={{
              marginTop: 8, padding: '10px 14px', borderRadius: 7, fontSize: 12,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              color: syncState === 'error' ? 'var(--fg2)' : 'var(--fg)',
            }}>
              {syncState === 'error' ? '✕ ' : '✓ '}{syncMsg}
            </div>
          )}

          {/* How it works */}
          <div style={{
            marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border2)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          }}>
            {[
              { step: '01', title: 'Contacts synced', body: 'All Reapit contacts appear in your Contacts page, searchable and ready to nurture.' },
              { step: '02', title: 'Properties synced', body: 'Active listings, under offer and sold properties pulled directly from your Reapit database.' },
              { step: '03', title: 'Leads synced', body: 'Buyer applicants from Reapit become leads in your Vendor Pipeline and Lead Nurture tool.' },
            ].map(s => (
              <div key={s.step}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--fg4)', letterSpacing: '0.08em', marginBottom: 4 }}>{s.step}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5 }}>{s.body}</div>
              </div>
            ))}
          </div>

          {/* Env file snippet */}
          {connectState === 'success' && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg3)', marginBottom: 8 }}>
                Add to your .env file and restart:
              </div>
              <pre style={{
                fontFamily: 'monospace', fontSize: 11, padding: '14px 16px',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--fg2)', lineHeight: 1.7, overflowX: 'auto',
                whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
{`REAPIT_CLIENT_ID="${clientId}"
REAPIT_CLIENT_SECRET="${clientSecret}"
REAPIT_CUSTOMER_ID="${customerId}"`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
