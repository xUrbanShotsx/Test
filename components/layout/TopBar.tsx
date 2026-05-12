'use client'

import { usePathname } from 'next/navigation'
import NotificationCenter from './NotificationCenter'
import QuickCompose from './QuickCompose'

const titles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':             { title: 'Dashboard',        subtitle: 'Vendor lead performance overview' },
  '/dashboard/vendors':    { title: 'Vendor Pipeline',   subtitle: 'Track every potential seller' },
  '/dashboard/appraisals': { title: 'Appraisals',        subtitle: 'Book, track and convert appraisals' },
  '/dashboard/social':     { title: 'Social Marketing',  subtitle: 'AI-generated campaigns for vendor & buyer leads' },
  '/dashboard/email':      { title: 'Email Marketing',   subtitle: 'Send campaigns to vendors and buyers' },
  '/dashboard/sms':        { title: 'SMS Marketing',     subtitle: 'Direct outreach to your database' },
  '/dashboard/properties': { title: 'Properties',        subtitle: 'Active listings and marketing' },
  '/dashboard/contacts':   { title: 'Contacts',          subtitle: 'Your full CRM database' },
  '/dashboard/settings':   { title: 'Settings',          subtitle: 'Account and integrations' },
}

export default function TopBar() {
  const pathname = usePathname()
  const match = Object.entries(titles).sort((a, b) => b[0].length - a[0].length).find(([k]) => pathname.startsWith(k))
  const info = match ? match[1] : { title: 'Innovate.AI', subtitle: '' }
  const dateStr = new Date().toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <header style={{
      height: 56,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h1 style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{info.title}</h1>
          <span style={{ fontSize: 12, color: 'var(--fg4)' }}>—</span>
          <span style={{ fontSize: 12, color: 'var(--fg3)' }}>{info.subtitle}</span>
        </div>
      </div>

      <span style={{ fontSize: 11, color: 'var(--fg4)', flexShrink: 0 }}>{dateStr}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Search */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 12px',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 6, color: 'var(--fg3)', fontSize: 12, cursor: 'pointer',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          Search
          <span style={{ fontSize: 10, color: 'var(--fg4)' }}>⌘K</span>
        </button>

        <NotificationCenter />
        <QuickCompose />
      </div>
    </header>
  )
}
