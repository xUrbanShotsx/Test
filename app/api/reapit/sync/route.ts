/**
 * POST /api/reapit/sync
 * Pulls contacts, properties, and applicants from Reapit and returns summary counts.
 * In a production app you'd persist these to your database; here we return the data
 * so the client can update its in-memory state.
 */
import { NextResponse } from 'next/server'
import { reapitAPI, mapReapitContact, mapReapitProperty, mapReapitApplicant } from '@/lib/reapit'
import { syncState } from '../status/route'

export async function POST() {
  try {
    const [contactsRes, propertiesRes, applicantsRes] = await Promise.all([
      reapitAPI.getContacts({ pageSize: 100 }),
      reapitAPI.getProperties({ pageSize: 50, marketingMode: 'selling' }),
      reapitAPI.getApplicants({ pageSize: 100, isActive: true, embed: 'contacts' }),
    ])

    const contacts = contactsRes._embedded.map(mapReapitContact)
    const properties = propertiesRes._embedded.map(mapReapitProperty)
    const applicants = applicantsRes._embedded.map(mapReapitApplicant)

    // Update module-level sync state
    syncState.lastSynced = new Date().toISOString()
    syncState.contacts = contactsRes.totalCount
    syncState.properties = propertiesRes.totalCount
    syncState.applicants = applicantsRes.totalCount

    return NextResponse.json({
      ok: true,
      synced: {
        contacts: contacts.length,
        properties: properties.length,
        applicants: applicants.length,
        totalContacts: contactsRes.totalCount,
        totalProperties: propertiesRes.totalCount,
        totalApplicants: applicantsRes.totalCount,
      },
      lastSynced: syncState.lastSynced,
      // Return first page of data so the client can display it immediately
      data: { contacts, properties, applicants },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('OAuth') || message.includes('401') ? 401 : 500
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
