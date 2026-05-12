'use client'

import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'assistant'; text: string }

const QUICK_PROMPTS = [
  "Who are my hottest leads right now?",
  "Draft a follow-up SMS for Sarah Mitchell",
  "What should I do to convert Amanda Ross?",
  "Write a Just Sold Facebook post for 12 Ocean Ave",
  "Which suburb should I target next?",
]

const DEMO_RESPONSES: Record<string, string> = {
  "Who are my hottest leads right now?": `Based on your current pipeline, your top 3 leads are:\n\n**1. Sarah Mitchell** (Score: 94) — She's opened your appraisal email 6 times and clicked the CTA. This is very high intent. Call her today.\n\n**2. Lisa Park** (Score: 89) — New referral, wants to sell before end of quarter. Her appraisal is booked Monday. Prepare comparable sales for Bulli.\n\n**3. Jenny Liu** (Score: 82) — Referred by a past client. She replied positively to your SMS. Follow up with a personal call.`,

  "Draft a follow-up SMS for Sarah Mitchell": `Here's a follow-up SMS for Sarah:\n\n*"Hi Sarah, just following up on the appraisal information I sent through. The Wollongong market is moving quickly — we have 3 active buyers looking for properties just like yours. Would love to catch up for a quick chat. Are you free this week? — James"*\n\n160 characters. Want me to create a shorter or more detailed version?`,

  "What should I do to convert Amanda Ross?": `Amanda Ross is at **Appraisal Booked** stage with a score of 68. Here's your conversion strategy:\n\n1. **Send comparable sales** for Corrimal before her Friday appraisal — show her the $1.18M median.\n2. **Prepare a CMA** (Comparative Market Analysis) with 3 recent sales within 500m.\n3. **Mention your Just Sold result** nearby to build confidence.\n4. **Follow up same day** after the appraisal while motivation is high.\n\nShe mentioned wanting to sell in 3 months — that's a live timeline. Don't let this one slip.`,

  "Write a Just Sold Facebook post for 12 Ocean Ave": `Here's a vendor-targeted Facebook post:\n\n*"🏡 JUST SOLD — 12 Ocean Ave, Wollongong\n\nCongratulations to our clients on an outstanding result! This property sold in just 14 days with multiple offers — and we still have buyers looking in the area who missed out.\n\nIf you own a home in Wollongong or nearby suburbs and have been thinking about selling, now could be the perfect time. DM us for a free, no-obligation appraisal. 📲"*\n\nWant me to write versions for Instagram and LinkedIn too?`,

  "Which suburb should I target next?": `Based on your current data and market trends, I recommend **Corrimal** as your next priority suburb:\n\n• You have 2 warm leads there already (Amanda Ross, David Chen)\n• Median price up 7.2% — strong seller's market\n• Lower competition than Wollongong CBD\n• Your Just Sold campaign nearby gives you social proof\n\n**Recommended actions:**\n1. Launch a "What's Your Home Worth? — Corrimal" email campaign\n2. Run a Facebook ad targeting Corrimal homeowners 40–65\n3. Drop Just Sold letterbox flyers in streets near Amanda Ross's address`,
}

function getResponse(msg: string): string {
  const key = Object.keys(DEMO_RESPONSES).find(k => msg.toLowerCase().includes(k.split(' ')[0].toLowerCase()) || msg === k)
  if (key) return DEMO_RESPONSES[key]
  return `Great question. Based on your current pipeline data:\n\nI can help you with lead prioritisation, drafting messages, campaign strategy, and market analysis. Try asking me something specific like "Who should I call today?" or "Write a follow-up for [lead name]".`
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm your AI marketing assistant. Ask me anything — from lead strategy to drafting messages and market insights." }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setThinking(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: getResponse(msg) }])
      setThinking(false)
    }, 800 + Math.random() * 600)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 48, height: 48,
          background: open ? 'var(--surface3)' : 'var(--fg)',
          color: open ? 'var(--fg)' : 'var(--bg)',
          border: open ? '1px solid var(--border)' : 'none',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 900, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          zIndex: 100,
          letterSpacing: '-0.04em',
          transition: 'all 0.15s',
        }}
        title="AI Assistant"
      >
        {open ? '✕' : '✦'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 84, right: 24,
          width: 400, height: 560,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
          zIndex: 99, display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, background: 'var(--fg)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: 'var(--bg)', flexShrink: 0 }}>✦</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--fg)' }}>AI Assistant</div>
                <div style={{ fontSize: 10, color: 'var(--fg4)' }}>Powered by Claude · Innovate.AI</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '88%', padding: '10px 13px', borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  background: m.role === 'user' ? 'var(--fg)' : 'var(--surface2)',
                  color: m.role === 'user' ? 'var(--bg)' : 'var(--fg)',
                  fontSize: 12, lineHeight: 1.6,
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}>
                  {m.text.split('\n').map((line, j) => {
                    const bold = line.replace(/\*\*(.*?)\*\*/g, (_, t) => `<strong>${t}</strong>`)
                    return <div key={j} style={{ marginBottom: j < m.text.split('\n').length - 1 ? 4 : 0 }} dangerouslySetInnerHTML={{ __html: bold }} />
                  })}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px 10px 10px 2px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)}
                  style={{ padding: '5px 9px', borderRadius: 5, fontSize: 10, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--fg3)', cursor: 'pointer', lineHeight: 1.4, textAlign: 'left' }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 14px 14px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Ask anything — lead strategy, draft messages, market insights..."
                rows={2} className="input"
                style={{ flex: 1, resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, fontSize: 12 }}
              />
              <button onClick={() => send()} disabled={!input.trim() || thinking}
                className="btn btn-primary"
                style={{ padding: '8px 12px', fontSize: 13, flexShrink: 0, alignSelf: 'flex-end' }}>
                ↑
              </button>
            </div>
            <div style={{ fontSize: 10, color: 'var(--fg4)', marginTop: 5 }}>Enter to send · Shift+Enter for new line</div>
          </div>
        </div>
      )}
    </>
  )
}
