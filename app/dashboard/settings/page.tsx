'use client'

import { useState } from 'react'
import ReapitConnect from '@/components/settings/ReapitConnect'

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

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Reapit */}
      <ReapitConnect />

      {/* Agency */}
      <CardSection title="Agency Settings">
        <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 18, marginTop: -10 }}>Your brand details used across all campaigns</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            ['Agency Name', 'Innovate.AI Realty'],
            ['Agent Name', 'James Spinelli'],
            ['Email', 'james@innovate-ai.com.au'],
            ['Phone', '0412 345 678'],
            ['Website', 'www.innovate-ai.com.au'],
            ['Default Suburb', 'Wollongong NSW'],
          ].map(([label, val]) => (
            <div key={label}>
              <label className="label-upper">{label}</label>
              <input defaultValue={val} className="input" />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <label className="label-upper">Agency Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44,
              border: '1px solid var(--hairline)',
              borderRadius: 8,
              background: 'var(--canvas-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink)',
            }}>I</div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>Upload Logo</button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PNG or SVG · min 200×200px</span>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 12 }}>Preview Brand Card</button>
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
            <input defaultValue="Illawarra / Wollongong region, NSW" className="input" />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 18, fontSize: 12 }}>Save AI Settings</button>
      </CardSection>

      {/* Notifications */}
      <CardSection title="Notification Preferences">
        <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 18, marginTop: -10 }}>Choose what alerts you receive</div>
        {[
          { label: 'Hot lead activity (score 80+)',        on: true },
          { label: 'Appraisal reminders (24h before)',     on: true },
          { label: 'SMS replies received',                 on: true },
          { label: 'Email campaign open milestones',       on: false },
          { label: 'New vendor enquiry via website',       on: true },
          { label: 'Weekly performance digest',            on: false },
        ].map(n => (
          <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--hairline)' }}>
            <span style={{ fontSize: 13, color: 'var(--body-text)' }}>{n.label}</span>
            <div style={{
              width: 36, height: 20,
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              background: n.on ? 'var(--ink)' : 'var(--canvas-mid)',
              border: '1px solid var(--hairline)',
              position: 'relative',
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
