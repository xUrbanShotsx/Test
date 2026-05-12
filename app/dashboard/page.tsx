import MetricCard from '@/components/dashboard/MetricCard'
import AIInsightsBanner from '@/components/dashboard/AIInsightsBanner'
import CampaignOverview from '@/components/dashboard/CampaignOverview'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import LeadFunnelChart from '@/components/dashboard/LeadFunnelChart'
import ChannelPerformanceChart from '@/components/dashboard/ChannelPerformanceChart'
import HotLeadsWidget from '@/components/dashboard/HotLeadsWidget'
import GoalTracker from '@/components/dashboard/GoalTracker'

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1400 }}>
      {/* AI Briefing */}
      <AIInsightsBanner />

      {/* Vendor Metrics */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 400, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          Vendor Lead Performance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <MetricCard label="Vendor Leads" value="68" sub="This month" change="+24" positive />
          <MetricCard label="Appraisals Booked" value="16" sub="Conversion: 23.5%" change="+6" positive />
          <MetricCard label="Listings Won" value="9" sub="From appraisals: 56%" change="+3" positive />
          <MetricCard label="Avg Lead → List" value="18d" sub="Days to convert" change="3 days faster" positive />
        </div>
      </div>

      {/* Buyer Metrics */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 400, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          Buyer &amp; Campaign Performance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <MetricCard label="Buyer Leads" value="124" sub="Active buyers" change="+18" positive />
          <MetricCard label="Campaigns Active" value="6" sub="Across all channels" change="+2" positive />
          <MetricCard label="Email Open Rate" value="41%" sub="Industry avg 22%" change="+8%" positive />
          <MetricCard label="SMS Reply Rate" value="27%" sub="Industry avg 8%" change="+5%" positive />
        </div>
      </div>

      {/* Hot leads + Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12 }}>
        <HotLeadsWidget />
        <GoalTracker />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <LeadFunnelChart />
        <ChannelPerformanceChart />
      </div>

      {/* Campaigns */}
      <CampaignOverview />

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>
        <VendorPipelineTable />
        <ActivityFeed />
      </div>
    </div>
  )
}

function VendorPipelineTable() {
  const leads = [
    { name: 'Sarah Mitchell', address: '12 Ocean Ave, Wollongong', status: 'Hot', stage: 'Appraisal Done', source: 'Email', score: 94, days: 3 },
    { name: 'Tom Bradley', address: '15 Cliff Dr, Bulli', status: 'Warm', stage: 'Interested', source: 'SMS', score: 71, days: 8 },
    { name: 'Amanda Ross', address: '23 Corrimal St, Corrimal', status: 'Warm', stage: 'Appraisal Booked', source: 'Social', score: 68, days: 5 },
    { name: 'David Chen', address: '44 Marine Dr, Wollongong', status: 'Cold', stage: 'Contacted', source: 'Campaign', score: 42, days: 14 },
    { name: 'Jenny Liu', address: '8 Beach Rd, Thirroul', status: 'Hot', stage: 'Interested', source: 'Referral', score: 82, days: 2 },
    { name: 'Robert Kim', address: '31 Hill St, Fairy Meadow', status: 'Cold', stage: 'Contacted', source: 'Email', score: 35, days: 21 },
  ]

  const stageColor: Record<string, string> = {
    'Hot': 'var(--fg)',
    'Warm': 'var(--fg2)',
    'Cold': 'var(--fg4)',
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Vendor Pipeline</div>
          <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Potential sellers — ranked by AI score</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 12px' }}>View all →</button>
      </div>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px 50px', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--hairline)', marginBottom: 4 }}>
        {['Vendor', 'Stage', 'Source', 'Score', 'Days'].map(h => (
          <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg4)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
        ))}
      </div>

      {leads.map((l, i) => (
        <div key={i} className="row-hover" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 80px 70px 50px',
          gap: 10, padding: '10px 0',
          borderBottom: i < leads.length - 1 ? '1px solid var(--border2)' : 'none',
          alignItems: 'center', cursor: 'pointer', borderRadius: 4,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.address}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--body-text)', fontFamily: 'var(--font-display)' }}>{l.stage}</div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9, fontWeight: 400,
              color: stageColor[l.status],
              border: '1px solid var(--hairline)',
              padding: '1px 7px', borderRadius: 'var(--radius-pill)',
              display: 'inline-block', marginTop: 3,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>{l.status}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.source}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 3, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${l.score}%`, height: '100%', background: l.score >= 80 ? 'var(--fg)' : l.score >= 60 ? 'var(--fg2)' : 'var(--fg4)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--fg3)', width: 24, flexShrink: 0 }}>{l.score}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.days}d</div>
        </div>
      ))}
    </div>
  )
}
