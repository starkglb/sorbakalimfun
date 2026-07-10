import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const url = process.env.DATABASE_URL;
const isPooler = url?.includes('pooler.supabase.com') || url?.includes('?pgbouncer=true');

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: isPooler && !url!.includes('connection_limit') && !url!.includes('pgbouncer')
          ? url + (url!.includes('?') ? '&' : '?') + 'pgbouncer=true&connection_limit=1'
          : url,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
