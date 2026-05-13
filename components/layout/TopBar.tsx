'use client'

import { usePathname } from 'next/navigation'
import NotificationCenter from './NotificationCenter'
import QuickCompose from './QuickCompose'
import { useAgency } from '@/lib/agencyContext'
import { useTheme } from '@/lib/themeContext'

const titles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':             { title: 'Dashboard',       subtitle: 'VENDOR PERFORMANCE' },
  '/dashboard/vendors':     { title: 'Vendor Pipeline', subtitle: 'PIPELINE' },
  '/dashboard/appraisals':  { title: 'Appraisals',      subtitle: 'TRACK & CONVERT' },
  '/dashboard/nurture':     { title: 'Lead Nurture',    subtitle: 'AI SEQUENCES' },
  '/dashboard/social':      { title: 'Social',          subtitle: 'CAMPAIGNS' },
  '/dashboard/email':       { title: 'Email',           subtitle: 'CAMPAIGNS' },
  '/dashboard/sms':         { title: 'SMS',             subtitle: 'OUTREACH' },
  '/dashboard/properties':  { title: 'Properties',      subtitle: 'LISTINGS' },
  '/dashboard/contacts':    { title: 'Contacts',        subtitle: 'CRM DATABASE' },
  '/dashboard/settings':    { title: 'Settings',        subtitle: 'INTEGRATIONS' },
}

export default function TopBar() {
  const pathname = usePathname()
  const { brand } = useAgency()
  const { theme, toggle } = useTheme()
  const match = Object.entries(titles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => pathname.startsWith(k))
  const info = match ? match[1] : { title: brand.agencyName, subtitle: 'MARKETING HUB' }

  const dateStr = new Date().toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short',
  }).toUpperCase()

  return (
    <header style={{
      height: 52,
      background: 'var(--canvas)',
      borderBottom: '1px solid var(--hairline)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>

      {/* Title + eyebrow */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{
          fontSize: 14,
          fontWeight: 400,
          color: 'var(--ink)',
          letterSpacing: '-0.01em',
          fontFamily: 'var(--font-display)',
        }}>
          {info.title}
        </h1>
        <div style={{
          width: 1, height: 14,
          background: 'var(--hairline)',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 400,
          color: 'var(--mute)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {info.subtitle}
        </span>
      </div>

      {/* Date — mono */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 400,
        color: 'var(--fg4)',
        letterSpacing: '0.1em',
        flexShrink: 0,
      }}>
        {dateStr}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Theme toggle — pill outline */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32,
            background: 'transparent',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--mute)',
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
            flexShrink: 0,
          }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Search — pill outline */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 14px',
          background: 'transparent',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-pill)',
          color: 'var(--mute)',
          fontSize: 12,
          fontFamily: 'var(--font-display)',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          Search
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--fg4)',
            letterSpacing: '0.05em',
          }}>⌘K</span>
        </button>

        <NotificationCenter />
        <QuickCompose />
      </div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2"  x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="2"  y1="12" x2="5"  y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
