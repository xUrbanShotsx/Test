import { anthropic, MODEL, SYSTEM_PROMPTS, buildInsightsPrompt } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPTS.insights,
      messages: [{
        role: 'user',
        content: buildInsightsPrompt({
          newLeads: 23,
          activeListings: 14,
          campaignsSent: 5,
          avgOpenRate: 41,
          smsSent: 284,
          smsReplies: 78,
          topPerformingCampaign: '12 Ocean Ave Launch — 42% open rate',
        }),
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    const data = JSON.parse(match[0])

    return NextResponse.json(data)
  } catch (error) {
    console.error('Insights AI error:', error)
    return NextResponse.json({
      headline: 'Your marketing is performing above industry average this week',
      bullets: ['Email open rate 41% vs 22% industry average', '78 SMS replies received today', '23 new leads this week'],
      recommendedAction: 'Follow up with hot leads before end of day',
      urgencyLevel: 'medium',
    })
  }
}
