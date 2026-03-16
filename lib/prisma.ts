import { PrismaClient } from '@prisma/client';
import { encodeDatabaseUrl } from './utils/db';

const globalForPrisma = globalThis as unknown as {
  prisma2: PrismaClient | undefined;
};

// Use the hardcoded URL as requested by the user, and encode the password
const rawDbUrl = 'postgresql://postgres:Jay20007@12345@db.reqaomsidwfuxqebxgql.supabase.co:5432/postgres';
const dbUrl = encodeDatabaseUrl(rawDbUrl);

export const prisma =
  globalForPrisma.prisma2 ??
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: {
              url: dbUrl,
            },
          },
        }
      : undefined
  );

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma2 = prisma;
