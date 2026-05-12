import { PrismaClient } from '@prisma/client'

/**
 * Lazy Prisma singleton.
 * Returns null when DATABASE_URL is absent or is the build-time dummy,
 * so every API route falls through to its mock-data fallback gracefully.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const DUMMY_HOSTS = ['dummy.dummy.com', 'localhost']

function isDummy(url: string | undefined): boolean {
  if (!url) return true
  try {
    const host = new URL(url).hostname
    return DUMMY_HOSTS.some(d => host.includes(d))
  } catch {
    return true
  }
}

function createClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (isDummy(url)) return null
  try {
    return new PrismaClient({ log: [] })
  } catch {
    return null
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

export function hasDatabase(): boolean {
  return !!prisma
}
