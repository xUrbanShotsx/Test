'use client'

import { useState } from 'react'

const SEQUENCE_TEMPLATES = [
  {
    id: 'vendor-nurture',
    name: 'Vendor Nurture — Cold to Warm',
    tag: 'Vendor',
    desc: 'Convert cold homeowners into appraisal bookings over 3 weeks',
    steps: [
      { day: 0,  channel: 'Email', action: "Send: What's Your Home Worth? email", status: 'active' },
      { day: 2,  channel: 'SMS',   action: 'Send: Short follow-up SMS if no open', status: 'active' },
      { day: 5,  channel: 'Email', action: 'Send: Suburb Market Report', status: 'active' },
      { day: 8,  channel: 'SMS',   action: 'Send: Just Sold neighbour alert if applicable', status: 'active' },
      { day: 12, channel: 'Email', action: 'Send: Free Appraisal urgency offer', status: 'active' },
      { day: 18, channel: 'SMS',   action: 'Final: Personal follow-up from agent', status: 'active' },
    ],
  },
  {
    id: 'just-sold',
    name: 'Just Sold Neighbour Campaign',
    tag: 'Vendor',
    desc: 'Strike while iron is hot — neighbours who see your sold sign',
    steps: [
      { day: 0,  channel: 'Email', action: 'Send: Just Sold neighbour announcement', status: 'active' },
      { day: 1,  channel: 'SMS',   action: 'Send: Short SMS with sold price', status: 'active' },
      { day: 3,  channel: 'Email', action: 'Send: Active buyer demand email', status: 'active' },
      { day: 7,  channel: 'SMS',   action: 'Follow-up: Book free appraisal', status: 'active' },
    ],
  },
  {
    id: 'buyer-journey',
    name: 'Buyer Journey — Enquiry to Offer',
    tag: 'Buyer',
    desc: 'Nurture buyer enquiries through to inspection and offer',
    steps: [
      { day: 0,  channel: 'Email', action: 'Send: Property details + inspection times', status: 'active' },
      { day: 1,  channel: 'SMS',   action: 'Send: Inspection reminder', status: 'active' },
      { day: 3,  channel: 'Email', action: 'Send: Post-inspection follow-up', status: 'active' },
      { day: 5,  channel: 'SMS',   action: 'Send: Any questions? Personal check-in', status: 'active' },
      { day: 8,  channel: 'Email', action: 'Send: Comparable sales to justify price', status: 'active' },
      { day: 12, channel: 'Email', action: 'Send: Final call — offer deadline reminder', status: 'active' },
    ],
  },
  {
    id: 'appraisal-followup',
    name: 'Post-Appraisal Follow-up',
    tag: 'Vendor',
    desc: 'Stay top of mind with vendors considering listing',
    steps: [
      { day: 0,  channel: 'Email', action: 'Send: Appraisal summary report', status: 'active' },
      { day: 2,  channel: 'SMS',   action: 'Personal check-in from agent', status: 'active' },
      { day: 5,  channel: 'Email', action: 'Send: Recent comparable sales update', status: 'active' },
      { day: 10, channel: 'SMS',   action: 'Follow-up: Any questions or decisions?', status: 'active' },
      { day: 21, channel: 'Email', action: 'Monthly market update newsletter', status: 'active' },
    ],
  },
]

const ACTIVE_SEQUENCES = [
  { name: 'Vendor Nurture — Cold to Warm', audience: 'Corrimal homeowners', enrolled: 84, opened: 42, replied: 9, status: 'live' },
  { name: 'Just Sold Neighbour Campaign', audience: 'Ocean Ave neighbours', enrolled: 28, opened: 19, replied: 4, status: 'live' },
  { name: 'Post-Appraisal Follow-up', audience: 'Recent appraisal leads', enrolled: 12, opened: 10, replied: 7, status: 'live' },
]

const CHANNEL_COLORS: Record<string, { bg: string; color: string }> = {
  Email: { bg: 'var(--surface3)', color: 'var(--fg2)' },
  SMS:   { bg: 'var(--surface2)', color: 'var(--fg3)' },
}

export default function SequenceBuilder() {
  const [view, setView] = useState<'active' | 'templates' | 'builder'>('active')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof SEQUENCE_TEMPLATES[0] | null>(null)

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['active', 'templates', 'builder'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className="btn btn-ghost"
            style={{
              fontSize: 12, padding: '6px 14px', textTransform: 'capitalize',
              background: view === v ? 'var(--surface2)' : 'transparent',
              color: view === v ? 'var(--fg)' : 'var(--fg3)',
              borderColor: view === v ? 'var(--fg4)' : 'var(--border)',
            }}>
            {v === 'active' ? `Active (${ACTIVE_SEQUENCES.length})` : v === 'templates' ? 'Templates' : 'Build New'}
          </button>
        ))}
      </div>

      {/* Active sequences */}
      {view === 'active' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 70px 70px 70px', gap: 12, padding: '5px 0', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
            {['Sequence', 'Audience', 'Enrolled', 'Opened', 'Replied', 'Status'].map(h => (
              <span key={h} style={{ fontSize: 10, color: 'var(--fg4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {ACTIVE_SEQUENCES.map((s, i) => (
            <div key={i} className="row-hover" style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 70px 70px 70px', gap: 12, padding: '12px 0', borderBottom: i < ACTIVE_SEQUENCES.length - 1 ? '1px solid var(--border2)' : 'none', alignItems: 'center', cursor: 'pointer', borderRadius: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{s.audience}</div>
              <div style={{ fontSize: 12, color: 'var(--fg2)' }}>{s.enrolled}</div>
              <div style={{ fontSize: 12, color: 'var(--fg2)' }}>{s.opened}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{s.replied}</div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--fg2)' }}>Live</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setView('templates')}>+ New sequence</button>
          </div>
        </div>
      )}

      {/* Templates */}
      {view === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {SEQUENCE_TEMPLATES.map(t => (
            <div key={t.id} onClick={() => { setSelectedTemplate(t); setView('builder') }}
              style={{ padding: 18, border: '1px solid var(--border)', borderRadius: 9, cursor: 'pointer', background: 'var(--surface)' }}
              className="row-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 3, background: t.tag === 'Vendor' ? 'var(--fg)' : 'var(--surface3)', color: t.tag === 'Vendor' ? 'var(--bg)' : 'var(--fg3)' }}>{t.tag}</span>
                <span style={{ fontSize: 11, color: 'var(--fg4)' }}>{t.steps.length} steps</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 5 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', marginBottom: 14, lineHeight: 1.5 }}>{t.desc}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {t.steps.slice(0, 6).map((s, i) => (
                  <div key={i} style={{ width: 24, height: 24, borderRadius: 5, background: CHANNEL_COLORS[s.channel].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: CHANNEL_COLORS[s.channel].color }}>
                    {s.channel === 'Email' ? 'E' : 'S'}
                  </div>
                ))}
                {t.steps.length > 6 && <div style={{ fontSize: 10, color: 'var(--fg4)', alignSelf: 'center', marginLeft: 4 }}>+{t.steps.length - 6}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Builder */}
      {view === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <label className="label-upper">Sequence Name</label>
              <input defaultValue={selectedTemplate?.name || ''} className="input" style={{ width: '100%', marginBottom: 12 }} />
              <label className="label-upper">Send To</label>
              <select className="input" style={{ width: '100%' }}>
                {['Suburb Homeowners', 'Cold Vendor Database', 'Warm Vendor Leads', 'Recent Appraisal Enquiries', 'Active Buyers', 'Custom Segment'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <label className="label-upper" style={{ marginBottom: 12 }}>Sequence Steps</label>
              {(selectedTemplate?.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--fg)' }}>{i + 1}</div>
                    {i < (selectedTemplate?.steps || []).length - 1 && <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '4px 0' }} />}
                  </div>
                  {/* Step card */}
                  <div style={{ flex: 1, padding: '12px 14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 3, ...CHANNEL_COLORS[step.channel] }}>{step.channel}</span>
                      <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Day {step.day}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg2)' }}>{step.action}</div>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost" style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: 4 }}>+ Add Step</button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }}>Launch Sequence</button>
              <button className="btn btn-ghost" style={{ fontSize: 13 }}>Save as Draft</button>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setView('active')}>Cancel</button>
            </div>
          </div>

          {/* Preview panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 14 }}>Sequence Summary</div>
              {[
                ['Total steps', selectedTemplate?.steps.length || 0],
                ['Duration', `${selectedTemplate?.steps[selectedTemplate.steps.length - 1]?.day || 0} days`],
                ['Email steps', selectedTemplate?.steps.filter(s => s.channel === 'Email').length || 0],
                ['SMS steps', selectedTemplate?.steps.filter(s => s.channel === 'SMS').length || 0],
              ].map(([label, val]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg)' }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 9, background: 'var(--surface)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>AI Tips</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.6 }}>
                Best performing sequences send the first touch within 24h of opt-in, alternate channels (email → SMS → email), and include a personal SMS from the agent by day 7.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
