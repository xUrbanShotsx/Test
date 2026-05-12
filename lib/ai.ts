import Anthropic from '@anthropic-ai/sdk'

// The ?? 'build-placeholder' prevents the Anthropic constructor from throwing
// at build time when ANTHROPIC_API_KEY is not in Vercel's build environment.
// All AI routes have try/catch that return graceful fallback responses if the
// key is missing or invalid at runtime.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
})

export const MODEL = 'claude-sonnet-4-6'

export const SYSTEM_PROMPTS = {
  insights: `You are a real estate marketing analyst. Analyse the provided data and return a concise JSON briefing.
Be specific with numbers. Identify the single most important action the agent should take today.
Return ONLY valid JSON: {"headline": string, "bullets": string[], "recommendedAction": string, "urgencyLevel": "low"|"medium"|"high"}`,

  socialPost: `You are an expert Australian real estate social media copywriter.
Platform rules:
- Instagram: max 2200 chars, MUST include 10-15 relevant hashtags, use emojis strategically
- Facebook: hook in first line, conversational, 1-3 emojis, no hashtags
- LinkedIn: professional tone, no emojis, no hashtags, 500-700 chars, thought-leadership angle
Return ONLY valid JSON: {"facebook": string, "instagram": string, "linkedin": string}`,

  emailTemplate: `You are a real estate email marketing specialist. Generate a complete, mobile-first HTML email.
Rules: inline CSS only (no external stylesheets), responsive using max-width 600px table layout,
use the brand colors provided, professional but warm tone, clear CTA button.
Return ONLY valid JSON: {"subjects": [string, string, string], "previewText": string, "htmlBody": string, "plainText": string}`,

  smsContent: `You are a real estate SMS marketing specialist for the Australian market.
Rules: each variant must be under 160 characters including spaces, always include a clear CTA,
personalisation tags allowed: {firstName}, {suburb}, {price}, {address}.
Return ONLY valid JSON: {"short": string, "standard": string, "detailed": string}`,

  propertyDescription: `You are an award-winning Australian real estate copywriter.
Rules: lead with lifestyle and emotion not just specs, never exaggerate or lie about features,
use active language, create FOMO authentically, adapt tone to price point and property class.
Return ONLY valid JSON: {
  "headline": string,
  "fullDescription": string,
  "keyFeatures": string[],
  "socialSnippet": string,
  "smsBlurb": string
}`,
}

export function buildInsightsPrompt(data: {
  newLeads: number
  activeListings: number
  campaignsSent: number
  avgOpenRate: number
  smsSent: number
  smsReplies: number
  topPerformingCampaign?: string
}): string {
  return `Real estate agent marketing data for the past 7 days:
- New leads generated: ${data.newLeads}
- Active listings: ${data.activeListings}
- Email campaigns sent: ${data.campaignsSent}
- Average email open rate: ${data.avgOpenRate}%
- SMS messages sent: ${data.smsSent}
- SMS replies received: ${data.smsReplies}
${data.topPerformingCampaign ? `- Top performing campaign: ${data.topPerformingCampaign}` : ''}

Generate a daily marketing briefing.`
}

export function buildSocialPostPrompt(data: {
  address: string
  suburb: string
  bedrooms?: number | null
  bathrooms?: number | null
  carSpaces?: number | null
  price?: number | null
  displayPrice?: string | null
  features: string[]
  campaignType: string
  tone: string
  agencyName?: string
}): string {
  const priceStr = data.displayPrice || (data.price ? `$${data.price.toLocaleString()}` : 'Price on application')
  const specs = [
    data.bedrooms ? `${data.bedrooms} bed` : null,
    data.bathrooms ? `${data.bathrooms} bath` : null,
    data.carSpaces ? `${data.carSpaces} car` : null,
  ].filter(Boolean).join(' · ')

  return `Property: ${data.address}, ${data.suburb}
Specs: ${specs}
Price: ${priceStr}
Key features: ${data.features.slice(0, 5).join(', ')}
Campaign type: ${data.campaignType}
Tone: ${data.tone}
Agency: ${data.agencyName || 'Local Real Estate'}

Generate social media posts for all three platforms.`
}

export function buildEmailTemplatePrompt(data: {
  campaignType: string
  property?: {
    address: string
    suburb: string
    bedrooms?: number | null
    bathrooms?: number | null
    price?: number | null
    displayPrice?: string | null
    description?: string | null
  } | null
  audience: string
  tone: string
  agentName: string
  agencyName: string
  primaryColor: string
  callToAction: string
}): string {
  return `Create a real estate email campaign.
Campaign type: ${data.campaignType}
Audience: ${data.audience}
Tone: ${data.tone}
Call to action: ${data.callToAction}
Agent: ${data.agentName}
Agency: ${data.agencyName}
Brand color: ${data.primaryColor}
${data.property ? `
Property:
- Address: ${data.property.address}, ${data.property.suburb}
- Bedrooms: ${data.property.bedrooms || 'N/A'}
- Bathrooms: ${data.property.bathrooms || 'N/A'}
- Price: ${data.property.displayPrice || (data.property.price ? '$' + data.property.price.toLocaleString() : 'POA')}
- Description: ${data.property.description || 'Premium property'}
` : ''}

Generate a complete HTML email campaign.`
}

export function buildSMSPrompt(data: {
  campaignType: string
  suburb?: string
  address?: string
  price?: string
  agentName: string
  callToAction: string
}): string {
  return `SMS campaign for Australian real estate.
Type: ${data.campaignType}
${data.address ? `Property: ${data.address}` : ''}
${data.suburb ? `Suburb: ${data.suburb}` : ''}
${data.price ? `Price: ${data.price}` : ''}
Agent: ${data.agentName}
CTA: ${data.callToAction}

Generate 3 SMS variants (short/standard/detailed).`
}

export function buildPropertyDescriptionPrompt(data: {
  address: string
  suburb: string
  state: string
  bedrooms?: number | null
  bathrooms?: number | null
  carSpaces?: number | null
  landArea?: number | null
  buildingArea?: number | null
  price?: number | null
  displayPrice?: string | null
  features: string[]
  propertyClass: string
  listingType: string
  marketingBrief?: string | null
}): string {
  const priceStr = data.displayPrice || (data.price ? `$${data.price.toLocaleString()}` : 'Price on application')
  return `Property: ${data.address}, ${data.suburb}, ${data.state}
Type: ${data.propertyClass} for ${data.listingType}
Bedrooms: ${data.bedrooms || 'N/A'}
Bathrooms: ${data.bathrooms || 'N/A'}
Car spaces: ${data.carSpaces || 'N/A'}
Land area: ${data.landArea ? data.landArea + 'sqm' : 'N/A'}
Building area: ${data.buildingArea ? data.buildingArea + 'sqm' : 'N/A'}
Price: ${priceStr}
Key features: ${data.features.join(', ')}
${data.marketingBrief ? `Agent notes: ${data.marketingBrief}` : ''}

Generate compelling listing copy for all channels.`
}
