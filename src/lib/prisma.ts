import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pgPool: Pool | undefined
}

function getPgPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is missing. Add it to your environment (e.g. .env) using the Supabase Postgres connection string.'
    )
  }

  // Supabase Session Pooler has a small pool_size; keep client count to 1.
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({
      connectionString,
      max: 1, // keep a single client per lambda/process
      idleTimeoutMillis: 10_000,
    })
  }

  return globalForPrisma.pgPool
}

function createPrismaClient() {
  const pool = getPgPool()
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma