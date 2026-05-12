'use client'

import { useState } from 'react'
import ReapitConnect from '@/components/settings/ReapitConnect'

const INTEGRATIONS = [
  { name: 'Canva', desc: 'Design social media posts and marketing materials', status: 'connect', icon: '◈' },
  { name: 'Resend', desc: 'Email delivery for campaigns', status: 'connected', icon: '◉' },
  { name: 'Twilio', desc: 'SMS delivery and inbound messaging', status: 'connect', icon: '◎' },
  { name: 'Facebook / Instagram', desc: 'Publish social posts directly to your pages', status: 'connect', icon: '◇' },
  { name: 'REA Group / Domain', desc: 'Sync your property listings automatically', status: 'connect', icon: '⬡' },
  { name: 'Google Calendar', desc: 'Sync appraisal bookings with your calendar', status: 'connect', icon: '◫' },
  { name: 'Zapier', desc: 'Connect with 5,000+ tools via automations', status: 'connect', icon: '⟳' },
]

// Reapit Connect is handled by <ReapitConnect /> above

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Reapit Database */}
      <ReapitConnect />

      {/* Agency */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>Agency Settings</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 20 }}>Your brand details used across all campaigns</div>
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
              <input defaultValue={val} className="input" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <label className="label-upper">Agency Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, background: 'var(--fg)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: 'var(--bg)', flexShrink: 0 }}>I</div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>Upload Logo</button>
            <span style={{ fontSize: 11, color: 'var(--fg4)' }}>PNG or SVG, min 200×200px</span>
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 12 }}>Preview Brand Card</button>
        </div>
      </div>

      {/* Integrations */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>Integrations</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 20 }}>Connect your marketing and productivity tools</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {INTEGRATIONS.map((intg, i) => (
            <div key={intg.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < INTEGRATIONS.length - 1 ? '1px solid var(--border2)' : 'none' }}>
              <div style={{ width: 36, height: 36, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--fg2)', flexShrink: 0 }}>{intg.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{intg.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{intg.desc}</div>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${intg.status === 'connected' ? 'var(--fg4)' : 'var(--border)'}`,
                background: intg.status === 'connected' ? 'var(--surface2)' : 'transparent',
                color: intg.status === 'connected' ? 'var(--fg)' : 'var(--fg3)',
              }}>
                {intg.status === 'connected' ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>AI Configuration</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 20 }}>Claude powers all AI generation — email, SMS, social, descriptions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label-upper">Anthropic API Key</label>
            <input type="password" defaultValue="sk-ant-api03-••••••••••••••••••••" className="input" style={{ width: '100%', fontFamily: 'monospace' }} />
          </div>
          <div>
            <label className="label-upper">Default Agent Voice / Tone</label>
            <select className="input" style={{ width: '100%' }}>
              {['Professional & Authoritative', 'Warm & Approachable', 'Luxury / Premium', 'Conversational'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-upper">Primary Market / Focus Area</label>
            <input defaultValue="Illawarra / Wollongong region, NSW" className="input" style={{ width: '100%' }} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 18, fontSize: 12 }}>Save AI Settings</button>
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>Notification Preferences</div>
        <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 20 }}>Choose what alerts you receive</div>
        {[
          { label: 'Hot lead activity (score 80+)', on: true },
          { label: 'Appraisal reminders (24h before)', on: true },
          { label: 'SMS replies received', on: true },
          { label: 'Email campaign open milestones', on: false },
          { label: 'New vendor enquiry via website', on: true },
          { label: 'Weekly performance digest', on: false },
        ].map(n => (
          <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border2)' }}>
            <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{n.label}</span>
            <div style={{
              width: 36, height: 20, borderRadius: 99, cursor: 'pointer',
              background: n.on ? 'var(--fg)' : 'var(--surface3)',
              border: '1px solid var(--border)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 2, left: n.on ? 18 : 2,
                width: 14, height: 14, borderRadius: '50%',
                background: n.on ? 'var(--bg)' : 'var(--fg4)',
                transition: 'left 0.15s',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
