import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { createDbAdapter } from "@/lib/db-adapter";

// Geliştirmede hot-reload sırasında birden fazla bağlantı havuzu açılmasını engeller.
// Tip bilerek gevşek: saklanan örnek, eski (yeniden üretilmeden önceki) bir client olabilir.
const globalForPrisma = globalThis as unknown as { prisma?: { $disconnect(): Promise<void> } };

function getClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  // `prisma generate` sonrası (yeni model/alan) PrismaClient sınıfı değişir; saklanan eski
  // örnek yeni modelleri tanımaz ("prisma.review is undefined"). O durumda yenisini kur.
  if (cached instanceof PrismaClient) return cached;
  void cached?.$disconnect().catch(() => undefined);
  return new PrismaClient({ adapter: createDbAdapter() });
}

export const prisma = getClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
