import { anthropic, MODEL, SYSTEM_PROMPTS, buildSocialPostPrompt } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPTS.socialPost,
      messages: [{ role: 'user', content: buildSocialPostPrompt(body) }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    const data = JSON.parse(match[0])

    return NextResponse.json(data)
  } catch (error) {
    console.error('Social post AI error:', error)
    return NextResponse.json({ error: 'Failed to generate social post' }, { status: 500 })
  }
}
