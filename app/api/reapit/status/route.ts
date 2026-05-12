/**
 * GET /api/reapit/status
 * Returns whether Reapit credentials are configured and the last sync info.
 */
import { NextResponse } from 'next/server'

// Simple in-memory sync record (survives server restarts in dev)
// In production, store this in your database
export const syncState = {
  lastSynced: null as string | null,
  contacts: 0,
  properties: 0,
  applicants: 0,
}

export async function GET() {
  const configured = !!(
    process.env.REAPIT_CLIENT_ID &&
    process.env.REAPIT_CLIENT_SECRET &&
    process.env.REAPIT_CLIENT_ID !== '' &&
    process.env.REAPIT_CLIENT_SECRET !== ''
  )

  return NextResponse.json({
    configured,
    customerId: process.env.REAPIT_CUSTOMER_ID ?? null,
    lastSynced: syncState.lastSynced,
    counts: {
      contacts: syncState.contacts,
      properties: syncState.properties,
      applicants: syncState.applicants,
    },
  })
}
