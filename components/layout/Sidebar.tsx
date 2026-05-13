'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAgency } from '@/lib/agencyContext'

const nav = [
  {
    section: 'OVERVIEW',
    items: [
      { href: '/dashboard',            label: 'Dashboard',      icon: <GridIcon /> },
      { href: '/dashboard/vendors',    label: 'Vendor Pipeline', icon: <FunnelIcon />, badge: '8' },
      { href: '/dashboard/appraisals', label: 'Appraisals',     icon: <StarIcon />,   badge: '3' },
    ],
  },
  {
    section: 'MARKETING',
    items: [
      { href: '/dashboard/nurture',    label: 'Lead Nurture',   icon: <NurtureIcon />, badge: 'AI' },
      { href: '/dashboard/social',     label: 'Social',         icon: <SocialIcon /> },
      { href: '/dashboard/email',      label: 'Email',          icon: <EmailIcon /> },
      { href: '/dashboard/sms',        label: 'SMS',            icon: <SmsIcon />,    badge: '5' },
      { href: '/dashboard/properties', label: 'Properties',     icon: <HomeIcon /> },
    ],
  },
  {
    section: 'DATABASE',
    items: [
      { href: '/dashboard/contacts',   label: 'Contacts',       icon: <ContactsIcon /> },
      { href: '/dashboard/settings',   label: 'Settings',       icon: <SettingsIcon /> },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
  const { brand, initials } = useAgency()
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'propulse_auth=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <aside style={{
      width: 220, minWidth: 220,
      background: 'var(--canvas)',
      borderRight: '1px solid var(--hairline)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>

      {/* ── Wordmark ── */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid var(--hairline)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo pill */}
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            border: '1px solid var(--hairline)',
            background: 'var(--canvas-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 400,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display)',
            }}>{brand.agencyName}</div>
            <div style={{
              fontSize: 10,
              color: 'var(--mute)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              marginTop: 1,
            }}>Marketing Hub</div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {nav.map(section => (
          <div key={section.section}>
            {/* Section eyebrow — GeistMono uppercase */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 400,
              color: 'var(--fg4)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0 8px 8px',
            }}>
              {section.section}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-pill)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 400,
                    fontFamily: 'var(--font-display)',
                    color: active ? 'var(--canvas)' : 'var(--body-text)',
                    background: active ? 'var(--ink)' : 'transparent',
                    border: `1px solid ${active ? 'var(--ink)' : 'transparent'}`,
                    transition: 'all 0.12s',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      opacity: active ? 1 : 0.45,
                      color: active ? 'var(--canvas)' : 'var(--ink)',
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        fontWeight: 400,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-pill)',
                        background: active
                          ? 'rgba(0,0,0,0.18)'
                          : 'var(--canvas-soft)',
                        color: active
                          ? 'var(--canvas)'
                          : 'var(--mute)',
                        border: active
                          ? '1px solid rgba(0,0,0,0.12)'
                          : '1px solid var(--hairline)',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Agent card ── */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--hairline)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 'var(--radius)',
          background: 'var(--canvas-soft)',
          border: '1px solid var(--hairline)',
        }}>
          {/* Avatar pill */}
          <div style={{
            width: 28, height: 28,
            borderRadius: '50%',
            border: '1px solid var(--hairline)',
            background: 'var(--canvas-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: 'var(--body-text)',
            flexShrink: 0,
            textTransform: 'uppercase',
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 400,
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{brand.agentName}</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--mute)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: 2,
            }}>Agent · {brand.agencyName}</div>
          </div>
          {/* Online indicator */}
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--ink)',
            opacity: 0.6,
            flexShrink: 0,
          }} />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '7px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--hairline)',
            background: 'transparent',
            color: 'var(--mute)',
            fontSize: 12,
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            transition: 'color 0.12s, border-color 0.12s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--body-text)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--mute)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--hairline)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="7" height="9" x="3" y="3" rx="1"/>
      <rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/>
      <rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  )
}
function FunnelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  )
}
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}
function SocialIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
    </svg>
  )
}
function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}
function SmsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function NurtureIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M8 12s1.5-2 4-2 4 2 4 2"/>
      <path d="M9 9h.01"/><path d="M15 9h.01"/>
    </svg>
  )
}
function ContactsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
