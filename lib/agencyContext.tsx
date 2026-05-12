'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface AgencyBrand {
  agencyName: string
  agentName: string
  email: string
  phone: string
  website: string
  suburb: string
}

const DEFAULTS: AgencyBrand = {
  agencyName: 'Innovate.AI',
  agentName:  'James Spinelli',
  email:      'james@innovate-ai.com.au',
  phone:      '0412 345 678',
  website:    'www.innovate-ai.com.au',
  suburb:     'Wollongong NSW',
}

const STORAGE_KEY = 'propulse_agency'

interface AgencyContextValue {
  brand: AgencyBrand
  update: (patch: Partial<AgencyBrand>) => void
  /** Initials derived from agencyName (first 1-2 chars) */
  initials: string
}

const AgencyContext = createContext<AgencyContextValue>({
  brand: DEFAULTS,
  update: () => {},
  initials: 'I',
})

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<AgencyBrand>(DEFAULTS)

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setBrand({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {}
  }, [])

  const update = useCallback((patch: Partial<AgencyBrand>) => {
    setBrand(prev => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const initials = brand.agencyName
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || 'A'

  return (
    <AgencyContext.Provider value={{ brand, update, initials }}>
      {children}
    </AgencyContext.Provider>
  )
}

export function useAgency() {
  return useContext(AgencyContext)
}
