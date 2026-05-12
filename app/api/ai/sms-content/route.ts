import { anthropic, MODEL, SYSTEM_PROMPTS, buildSMSPrompt } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPTS.smsContent,
      messages: [{
        role: 'user',
        content: buildSMSPrompt({
          ...body,
          agentName: body.agentName || 'John Demo',
        }),
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    const data = JSON.parse(match[0])

    return NextResponse.json(data)
  } catch (error) {
    console.error('SMS AI error:', error)
    return NextResponse.json({ error: 'Failed to generate SMS' }, { status: 500 })
  }
}
