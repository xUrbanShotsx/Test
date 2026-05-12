import ContactTable from '@/components/email/ContactTable'

export default function ContactsPage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Contact Database</h2>
          <p style={{ fontSize: 13, color: 'var(--foreground-muted)', marginTop: 4 }}>1,284 contacts · Segment, search and message your database</p>
        </div>
        <ContactTable />
      </div>
    </div>
  )
}
