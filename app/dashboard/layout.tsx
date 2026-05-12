import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import AIAssistant from '@/components/layout/AIAssistant'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {children}
        </main>
      </div>
      <AIAssistant />
    </div>
  )
}
