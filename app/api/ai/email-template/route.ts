import { anthropic, MODEL, SYSTEM_PROMPTS, buildEmailTemplatePrompt } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPTS.emailTemplate,
      messages: [{
        role: 'user',
        content: buildEmailTemplatePrompt({
          ...body,
          agentName: body.agentName || 'John Demo',
          agencyName: body.agencyName || 'Innovate.AI Realty',
          primaryColor: body.primaryColor || '#FFD940',
        }),
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    const data = JSON.parse(match[0])

    return NextResponse.json(data)
  } catch (error) {
    console.error('Email template AI error:', error)
    return NextResponse.json({ error: 'Failed to generate email template' }, { status: 500 })
  }
}
