import ContactTable from '@/components/email/ContactTable'

export default function ContactsPage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>CRM Database</div>
        <div style={{ fontSize: 20, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em' }}>1,284 contacts</div>
        <div style={{ fontSize: 13, color: 'var(--mute)', marginTop: 4 }}>Segment, search and message your database</div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <ContactTable />
      </div>
    </div>
  )
}
