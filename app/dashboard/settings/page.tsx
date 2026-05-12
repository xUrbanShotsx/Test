'use client'

import { useState, useRef } from 'react'
import ReapitConnect from '@/components/settings/ReapitConnect'
import { useAgency, AgencyBrand } from '@/lib/agencyContext'

const INTEGRATIONS = [
  { name: 'Canva',                desc: 'Design social media posts and marketing materials', status: 'connect',   icon: '◈' },
  { name: 'Resend',               desc: 'Email delivery for campaigns',                      status: 'connected', icon: '◉' },
  { name: 'Twilio',               desc: 'SMS delivery and inbound messaging',                status: 'connect',   icon: '◎' },
  { name: 'Facebook / Instagram', desc: 'Publish social posts directly to your pages',       status: 'connect',   icon: '◇' },
  { name: 'REA Group / Domain',   desc: 'Sync your property listings automatically',         status: 'connect',   icon: '⬡' },
  { name: 'Google Calendar',      desc: 'Sync appraisal bookings with your calendar',        status: 'connect',   icon: '◫' },
  { name: 'Zapier',               desc: 'Connect with 5,000+ tools via automations',        status: 'connect',   icon: '⟳' },
]

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 18 }}>{title}</div>
      {children}
    </div>
  )
}

const FIELDS: { key: keyof AgencyBrand; label: string }[] = [
  { key: 'agencyName', label: 'Agency Name' },
  { key: 'agentName',  label: 'Agent Name' },
  { key: 'email',      label: 'Email' },
  { key: 'phone',      label: 'Phone' },
  { key: 'website',    label: 'Website' },
  { key: 'suburb',     label: 'Default Suburb' },
]

export default function SettingsPage() {
  const { brand, update, initials } = useAgency()

  // Local draft — buffered until Save
  const [draft, setDraft] = useState<AgencyBrand>({ ...brand })
  const [saved, setSaved] = useState(false)
  const [aiSaved, setAiSaved] = useState(false)
  const [notifications, setNotifications] = useState([
    { label: 'Hot lead activity (score 80+)',        on: true },
    { label: 'Appraisal reminders (24h before)',     on: true },
    { label: 'SMS replies received',                 on: true },
    { label: 'Email campaign open milestones',       on: false },
    { label: 'New vendor enquiry via website',       on: true },
    { label: 'Weekly performance digest',            on: false },
  ])

  const logoRef = useRef<HTMLInputElement>(null)
  const [logoSrc, setLogoSrc] = useState<string | null>(null)

  function handleSave() {
    update(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogoSrc(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Reapit */}
      <ReapitConnect />

      {/* Agency */}
      <CardSection title="Agency Settings">
        <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 18, marginTop: -10 }}>
          Your brand details — applied across all campaigns and the entire app
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="label-upper">{label}</label>
              <input
                value={draft[key]}
                onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                className="input"
              />
            </div>
          ))}
        </div>

        {/* Logo */}
        <div style={{ marginTop: 18 }}>
          <label className="label-upper">Agency Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44,
              border: '1px solid var(--hairline)',
              borderRadius: 8,
              background: 'var(--canvas-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {logoSrc
                ? <img src={logoSrc} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink)' }}>{initials[0]}</span>
              }
            </div>
            <input ref={logoRef} type="file" accept="image/png,image/svg+xml" style={{ display: 'none' }} onChange={handleLogoChange} />
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => logoRef.current?.click()}>
              Upload Logo
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PNG or SVG · min 200×200px
            </span>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
          {saved && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Applied across app
            </span>
          )}
        </div>
      </CardSection>

      {/* Integrations */}
      <CardSection title="Integrations">
        <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 18, marginTop: -10 }}>Connect your marketing and productivity tools</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {INTEGRATIONS.map((intg, i) => (
            <div key={intg.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < INTEGRATIONS.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
              <div style={{
                width: 34, height: 34,
                background: 'var(--canvas-soft)',
                border: '1px solid var(--hairline)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'var(--mute)', flexShrink: 0,
              }}>{intg.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>{intg.name}</div>
                <div style={{ fontSize: 11, color: 'var(--mute)' }}>{intg.desc}</div>
              </div>
              <button style={{
                padding: '5px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 11, cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '1px solid var(--hairline)',
                background: intg.status === 'connected' ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: intg.status === 'connected' ? 'var(--ink)' : 'var(--mute)',
              }}>
                {intg.status === 'connected' ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </CardSection>

      {/* AI */}
      <CardSection title="AI Configuration">
        <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 18, marginTop: -10 }}>Claude powers all AI generation — email, SMS, social, descriptions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label-upper">Anthropic API Key</label>
            <input type="password" defaultValue="sk-ant-api03-••••••••••••••••••••" className="input" style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div>
            <label className="label-upper">Default Agent Voice / Tone</label>
            <select className="input">
              {['Professional & Authoritative', 'Warm & Approachable', 'Luxury / Premium', 'Conversational'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-upper">Primary Market / Focus Area</label>
            <input defaultValue={brand.suburb} className="input" />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 18, fontSize: 12 }}
          onClick={() => { setAiSaved(true); setTimeout(() => setAiSaved(false), 2200) }}>
          {aiSaved ? '✓ Saved' : 'Save AI Settings'}
        </button>
      </CardSection>

      {/* Notifications */}
      <CardSection title="Notification Preferences">
        <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 18, marginTop: -10 }}>Choose what alerts you receive</div>
        {notifications.map((n, i) => (
          <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--hairline)' }}>
            <span style={{ fontSize: 13, color: 'var(--body-text)' }}>{n.label}</span>
            <div
              onClick={() => setNotifications(prev => prev.map((x, j) => j === i ? { ...x, on: !x.on } : x))}
              style={{
                width: 36, height: 20,
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                background: n.on ? 'var(--ink)' : 'var(--canvas-mid)',
                border: '1px solid var(--hairline)',
                position: 'relative',
                transition: 'background 0.15s',
              }}>
              <div style={{
                position: 'absolute', top: 2,
                left: n.on ? 18 : 2,
                width: 14, height: 14,
                borderRadius: '50%',
                background: n.on ? 'var(--canvas)' : 'var(--mute)',
                transition: 'left 0.15s',
              }} />
            </div>
          </div>
        ))}
      </CardSection>
    </div>
  )
}
