/**
 * In-memory ad budget wallet + campaign store.
 * Production: replace with database persistence.
 */

export interface WalletTransaction {
  id: string
  type: 'deposit' | 'campaign_spend' | 'refund'
  amount: number       // AUD cents
  description: string
  createdAt: string
  stripePaymentId?: string
}

export interface AdCampaign {
  id: string
  name: string
  objective: 'VENDOR_LEADS' | 'PROPERTY_VIEWS' | 'BRAND_AWARENESS' | 'APPRAISAL_BOOKINGS'
  platforms: ('facebook' | 'instagram' | 'linkedin')[]
  status: 'active' | 'paused' | 'completed' | 'draft'
  dailyBudget: number   // AUD cents
  totalBudget: number   // AUD cents
  spent: number         // AUD cents
  startDate: string
  endDate: string
  headline: string
  body: string
  imageUrl?: string
  targetSuburbs: string[]
  ageMin: number
  ageMax: number
  platformCampaignIds: Record<string, string>  // platform → external campaign id
  createdAt: string
  impressions: number
  clicks: number
  leads: number
}

const g = global as typeof global & {
  _adBalance?: number
  _adTransactions?: WalletTransaction[]
  _adCampaigns?: AdCampaign[]
}

// Seed a demo balance so the UI looks meaningful on first load
if (g._adBalance === undefined) g._adBalance = 25000  // $250.00 AUD
if (!g._adTransactions) {
  g._adTransactions = [
    {
      id: 'txn_demo_1',
      type: 'deposit',
      amount: 50000,
      description: 'Initial deposit',
      createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
      stripePaymentId: 'pi_demo',
    },
    {
      id: 'txn_demo_2',
      type: 'campaign_spend',
      amount: -15000,
      description: 'Campaign: Wollongong Vendor Leads',
      createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    },
    {
      id: 'txn_demo_3',
      type: 'campaign_spend',
      amount: -10000,
      description: 'Campaign: Just Sold Brand Awareness',
      createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    },
  ]
}
if (!g._adCampaigns) {
  g._adCampaigns = [
    {
      id: 'camp_demo_1',
      name: 'Wollongong Vendor Leads',
      objective: 'VENDOR_LEADS',
      platforms: ['facebook', 'instagram'],
      status: 'active',
      dailyBudget: 2000,
      totalBudget: 15000,
      spent: 12400,
      startDate: new Date(Date.now() - 7 * 86_400_000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 1 * 86_400_000).toISOString().split('T')[0],
      headline: 'Thinking of Selling in Wollongong?',
      body: 'Get a free market appraisal from Wollongong\'s top-rated real estate team. Find out what your home is worth today.',
      targetSuburbs: ['Wollongong', 'Figtree', 'Fairy Meadow'],
      ageMin: 35,
      ageMax: 65,
      platformCampaignIds: {},
      createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
      impressions: 18400,
      clicks: 312,
      leads: 9,
    },
    {
      id: 'camp_demo_2',
      name: 'Just Sold Brand Awareness',
      objective: 'BRAND_AWARENESS',
      platforms: ['facebook', 'instagram', 'linkedin'],
      status: 'completed',
      dailyBudget: 1500,
      totalBudget: 10000,
      spent: 10000,
      startDate: new Date(Date.now() - 10 * 86_400_000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 3 * 86_400_000).toISOString().split('T')[0],
      headline: 'Just Sold — Record Price in Wollongong',
      body: 'We achieved a record result for our vendors. Now taking appraisal appointments in your street.',
      targetSuburbs: ['Wollongong', 'North Wollongong', 'Gwynneville'],
      ageMin: 30,
      ageMax: 70,
      platformCampaignIds: {},
      createdAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
      impressions: 24600,
      clicks: 208,
      leads: 5,
    },
  ]
}

export const adStore = {
  getBalance: () => g._adBalance!,
  getTransactions: () => g._adTransactions!,
  getCampaigns: () => g._adCampaigns!,

  addFunds: (amountCents: number, stripePaymentId: string, description: string) => {
    g._adBalance! += amountCents
    g._adTransactions!.unshift({
      id: `txn_${Date.now()}`,
      type: 'deposit',
      amount: amountCents,
      description,
      createdAt: new Date().toISOString(),
      stripePaymentId,
    })
  },

  deductBudget: (amountCents: number, description: string) => {
    g._adBalance! -= amountCents
    g._adTransactions!.unshift({
      id: `txn_${Date.now()}`,
      type: 'campaign_spend',
      amount: -amountCents,
      description,
      createdAt: new Date().toISOString(),
    })
  },

  addCampaign: (campaign: AdCampaign) => {
    g._adCampaigns!.unshift(campaign)
  },

  updateCampaign: (id: string, updates: Partial<AdCampaign>) => {
    const idx = g._adCampaigns!.findIndex(c => c.id === id)
    if (idx >= 0) g._adCampaigns![idx] = { ...g._adCampaigns![idx], ...updates }
  },
}
