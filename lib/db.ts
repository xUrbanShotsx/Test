import { PrismaClient } from '@prisma/client'

/**
 * Lazy Prisma singleton — never crashes at module initialisation.
 * On Vercel without a DATABASE_URL the first actual query will throw,
 * which every API route catches and handles by returning mock data.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  // If no DATABASE_URL is set, return a stub that throws on use
  if (!process.env.DATABASE_URL) {
    return null
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    })
  } catch {
    return null
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

/** Returns true if a real database connection is configured */
export function hasDatabase(): boolean {
  return !!prisma && !!process.env.DATABASE_URL
}
