import { PrismaClient } from '@prisma/client'

/**
 * Lazy Prisma singleton.
 * Returns null if DATABASE_URL is missing or is the build-time dummy,
 * so every API route falls through to its mock-data fallback.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const DUMMY_URLS = [
  'postgresql://dummy:dummy@dummy.dummy.com:5432/dummy',
  'postgresql://user:password@localhost:5432/innovate_ai',
]

function isDummyUrl(url: string) {
  return DUMMY_URLS.some(d => url.startsWith(d))
}

function createClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url || isDummyUrl(url)) return null
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
