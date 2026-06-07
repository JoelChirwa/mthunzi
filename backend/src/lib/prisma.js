import { PrismaClient } from '@prisma/client';

/**
 * Single shared PrismaClient instance.
 * Prevents connection pool exhaustion from multiple instances across route files.
 * In development, the global prevents hot-reload from creating new instances.
 */
const globalForPrisma = globalThis;
const prisma = globalForPrisma.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

export default prisma;
