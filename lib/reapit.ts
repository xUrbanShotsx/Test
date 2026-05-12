/**
 * Reapit Foundations API client
 * Handles OAuth 2.0 Client Credentials flow + all REST calls
 * Docs: https://foundations-documentation.reapit.cloud/api/api-documentation
 */

const REAPIT_CONNECT_URL = 'https://connect.reapit.cloud'
const REAPIT_PLATFORM_URL = 'https://platform.reapit.cloud'
const API_VERSION = '2020-01-31'

// ─── Token cache (module-level, server-side only) ────────────────────────────
let _cachedToken: string | null = null
let _tokenExpiresAt = 0

export async function getReapitToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiresAt - 30_000) {
    return _cachedToken
  }

  const clientId = process.env.REAPIT_CLIENT_ID
  const clientSecret = process.env.REAPIT_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('REAPIT_CLIENT_ID and REAPIT_CLIENT_SECRET must be set in environment variables.')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${REAPIT_CONNECT_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Reapit OAuth failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  _cachedToken = data.access_token
  _tokenExpiresAt = Date.now() + data.expires_in * 1000

  return _cachedToken!
}

// ─── Generic authenticated fetch ─────────────────────────────────────────────
export async function reapitFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const token = await getReapitToken()

  const url = new URL(`${REAPIT_PLATFORM_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v))
    })
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'api-version': API_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Reapit API error ${res.status} for ${path}: ${body}`)
  }

  if (res.status === 204) return {} as T
  return res.json() as Promise<T>
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReapitPagedResult<T> {
  pageSize: number
  pageNumber: number
  pageCount: number
  totalPageCount: number
  totalCount: number
  _embedded: T[]
}

export interface ReapitContact {
  id: string
  created: string
  modified: string
  title?: string
  forename?: string
  surname?: string
  dateOfBirth?: string
  homePhone?: string
  mobilePhone?: string
  email?: string
  primaryAddress?: {
    buildingName?: string
    buildingNumber?: string
    line1?: string
    line2?: string
    line3?: string
    line4?: string
    postcode?: string
    countryId?: string
  }
  officeIds?: string[]
  negotiatorIds?: string[]
  source?: { value?: string; type?: string }
  marketingConsent?: string
  identityCheck?: string
  _eTag?: string
  _links?: Record<string, { href: string }>
}

export interface ReapitProperty {
  id: string
  created: string
  modified: string
  marketingMode: string // 'selling' | 'letting' | 'sellingAndLetting'
  currency?: string
  address?: {
    buildingName?: string
    buildingNumber?: string
    line1?: string
    line2?: string
    line3?: string
    line4?: string
    postcode?: string
    countryId?: string
    geolocation?: { latitude: number; longitude: number }
  }
  areaId?: string
  strapline?: string
  description?: string
  summary?: string
  departmentId?: string
  negotiatorId?: string
  bedrooms?: number
  bedroomsMax?: number
  receptions?: number
  receptionsMax?: number
  bathrooms?: number
  bathroomsMax?: number
  parkingSpaces?: number
  councilTax?: string
  internetAdvertising?: boolean
  isExternal?: boolean
  viewingArrangements?: string
  videoUrl?: string
  videoCaption?: string
  video2Url?: string
  video2Caption?: string
  notes?: string
  longDescription?: string
  floorLevel?: string
  internalFloors?: number
  totalFloors?: number
  boardStatus?: string
  boardNotes?: string
  boardUpdated?: string
  valuation?: string
  archivedOn?: string
  fromArchive?: boolean
  rural?: Record<string, unknown>
  externalArea?: Record<string, unknown>
  internalArea?: Record<string, unknown>
  epc?: Record<string, unknown>
  selling?: {
    instructed?: string
    price?: number
    qualifier?: string
    status?: string // 'preAppraisal' | 'valuation' | 'paidValuation' | 'forSale' | 'forSaleUnavailable' | 'underOffer' | 'underOfferUnavailable' | 'reserved' | 'exchanged' | 'completed' | 'soldExternally' | 'withdrawn'
    exchanged?: string
    completed?: string
    exchangedStatus?: string
    exchangedWith?: string
    decorativeCondition?: string
    tenure?: Record<string, unknown>
    vendorId?: string
    agency?: string
    agencyId?: string
    agreementExpiry?: string
    fee?: Record<string, unknown>
    exchangedPrice?: number
    recommendedPrice?: number
    valuationPrice?: number
    brochureId?: string
    publicBrochureUrl?: string
    exchangedPriceDate?: string
    fromPrice?: number
    toPrice?: number
  }
  letting?: Record<string, unknown>
  type?: string[]
  style?: string[]
  situation?: string[]
  parking?: string[]
  age?: string[]
  locality?: string[]
  rooms?: Record<string, unknown>[]
  roomDetailsApproved?: boolean
  officeIds?: string[]
  lostInstructionDate?: string
  lostInstructionNote?: string
  developmentSiteType?: string
  _eTag?: string
}

export interface ReapitApplicant {
  id: string
  created: string
  modified: string
  isActive?: boolean
  isChild?: boolean
  statusId?: string
  lastCall?: string
  nextCall?: string
  departmentId?: string
  solicitorId?: string
  potentialClient?: boolean
  currency?: string
  buying?: {
    reasonId?: string
    positionId?: string
    priceFrom?: number
    priceTo?: number
    decorativeCondition?: string[]
    tenure?: string[]
    mortgage?: Record<string, unknown>
  }
  renting?: Record<string, unknown>
  externalArea?: Record<string, unknown>
  internalArea?: Record<string, unknown>
  source?: { value?: string; type?: string }
  officeIds?: string[]
  negotiatorIds?: string[]
  type?: string[]
  style?: string[]
  situation?: string[]
  parking?: string[]
  age?: string[]
  locality?: string[]
  bedroomsMin?: number
  bedroomsMax?: number
  receptionsMin?: number
  receptionsMax?: number
  bathroomsMin?: number
  bathroomsMax?: number
  _embedded?: {
    contacts?: ReapitContact[]
  }
  _eTag?: string
}

export interface ReapitNegotiator {
  id: string
  created: string
  modified: string
  name?: string
  jobTitle?: string
  active?: boolean
  officeId?: string
  workPhone?: string
  mobilePhone?: string
  email?: string
  profileImageUrl?: string
  _eTag?: string
}

// ─── API methods ──────────────────────────────────────────────────────────────

export const reapitAPI = {
  /** List contacts — optionally filter by name, email, etc. */
  async getContacts(opts?: {
    pageSize?: number
    pageNumber?: number
    name?: string
    email?: string
    negotiatorId?: string[]
  }) {
    return reapitFetch<ReapitPagedResult<ReapitContact>>('/contacts', {}, {
      pageSize: opts?.pageSize ?? 100,
      pageNumber: opts?.pageNumber ?? 1,
      name: opts?.name,
      email: opts?.email,
    })
  },

  /** Get a single contact by ID */
  async getContact(id: string) {
    return reapitFetch<ReapitContact>(`/contacts/${id}`)
  },

  /** List properties */
  async getProperties(opts?: {
    pageSize?: number
    pageNumber?: number
    marketingMode?: string
    status?: string
    address?: string
    negotiatorId?: string
  }) {
    return reapitFetch<ReapitPagedResult<ReapitProperty>>('/properties', {}, {
      pageSize: opts?.pageSize ?? 50,
      pageNumber: opts?.pageNumber ?? 1,
      marketingMode: opts?.marketingMode,
      status: opts?.status,
      address: opts?.address,
      negotiatorId: opts?.negotiatorId,
    })
  },

  /** Get a single property by ID */
  async getProperty(id: string) {
    return reapitFetch<ReapitProperty>(`/properties/${id}`)
  },

  /** List applicants (buyers/renters = leads) */
  async getApplicants(opts?: {
    pageSize?: number
    pageNumber?: number
    isActive?: boolean
    embed?: string
  }) {
    return reapitFetch<ReapitPagedResult<ReapitApplicant>>('/applicants', {}, {
      pageSize: opts?.pageSize ?? 100,
      pageNumber: opts?.pageNumber ?? 1,
      isActive: opts?.isActive !== undefined ? String(opts.isActive) as unknown as number : undefined,
      embed: opts?.embed ?? 'contacts',
    })
  },

  /** List negotiators (agents in the office) */
  async getNegotiators(opts?: { pageSize?: number; officeId?: string }) {
    return reapitFetch<ReapitPagedResult<ReapitNegotiator>>('/negotiators', {}, {
      pageSize: opts?.pageSize ?? 50,
      officeId: opts?.officeId,
    })
  },

  /** Test connection — fetches 1 negotiator to verify credentials */
  async testConnection() {
    const data = await reapitFetch<ReapitPagedResult<ReapitNegotiator>>('/negotiators', {}, {
      pageSize: 1,
    })
    return { ok: true, totalCount: data.totalCount }
  },
}

// ─── Data mappers (Reapit → our app schema) ───────────────────────────────────

export function mapReapitContact(c: ReapitContact) {
  return {
    id: c.id,
    name: [c.title, c.forename, c.surname].filter(Boolean).join(' '),
    email: c.email ?? '',
    phone: c.mobilePhone ?? c.homePhone ?? '',
    suburb: [c.primaryAddress?.line3, c.primaryAddress?.line4].filter(Boolean).join(', '),
    postcode: c.primaryAddress?.postcode ?? '',
    source: c.source?.value ?? 'Unknown',
    status: 'active',
    createdAt: c.created,
  }
}

export function mapReapitProperty(p: ReapitProperty) {
  const addr = p.address
  const street = [addr?.buildingNumber, addr?.buildingName, addr?.line1].filter(Boolean).join(' ')
  const selling = p.selling

  const statusMap: Record<string, string> = {
    forSale: 'active',
    underOffer: 'under-offer',
    exchanged: 'sold',
    completed: 'sold',
    withdrawn: 'draft',
    preAppraisal: 'draft',
    valuation: 'draft',
  }

  return {
    id: p.id,
    address: street || addr?.line1 || 'Unknown address',
    suburb: addr?.line3 ?? addr?.line2 ?? '',
    state: addr?.line4 ?? '',
    postcode: addr?.postcode ?? '',
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    carSpaces: p.parkingSpaces,
    price: selling?.price,
    displayPrice: selling?.price ? `$${selling.price.toLocaleString()}` : undefined,
    status: statusMap[selling?.status ?? ''] ?? 'active',
    listingType: p.marketingMode === 'letting' ? 'rent' : 'sale',
    features: [...(p.type ?? []), ...(p.style ?? [])].slice(0, 6),
    leads: 0,
    daysListed: selling?.instructed
      ? Math.floor((Date.now() - new Date(selling.instructed).getTime()) / 86_400_000)
      : 0,
  }
}

export function mapReapitApplicant(a: ReapitApplicant) {
  const contact = a._embedded?.contacts?.[0]
  const name = contact
    ? [contact.title, contact.forename, contact.surname].filter(Boolean).join(' ')
    : 'Unknown'

  return {
    id: a.id,
    name,
    email: contact?.email ?? '',
    phone: contact?.mobilePhone ?? contact?.homePhone ?? '',
    status: a.isActive ? 'warm' : 'cold',
    source: a.source?.value ?? 'Reapit',
    budget: a.buying ? `$${(a.buying.priceFrom ?? 0).toLocaleString()} – $${(a.buying.priceTo ?? 0).toLocaleString()}` : 'N/A',
    beds: `${a.bedroomsMin ?? 0}–${a.bedroomsMax ?? 0}`,
    createdAt: a.created,
    lastContact: a.lastCall ?? a.modified,
    score: a.isActive ? 72 : 45,
    stage: 'buyer',
  }
}
