import "server-only";
import { prisma } from "@/lib/prisma";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import type { ApplicationListQuery } from "@/lib/validations/admin";
import type { Prisma } from "@/generated/prisma/client";

/** Başvurular cv.redbunder.com'dan ortak veritabanına düşer; burada sadece okunur/yönetilir. */

function buildWhere(q: Omit<ApplicationListQuery, "page">): Prisma.ApplicationWhereInput {
  const where: Prisma.ApplicationWhereInput = {};
  if (q.status) where.status = q.status;
  if (q.positionId) where.positionId = q.positionId;
  if (q.branchId) where.branchId = q.branchId;
  if (q.q) {
    const digits = q.q.replace(/\D/g, "");
    where.OR = [{ fullName: { contains: q.q } }, ...(digits.length >= 3 ? [{ phone: { contains: digits } }] : [])];
  }
  return where;
}

const include = {
  position: { select: { id: true, title: true } },
  branch: { select: { id: true, name: true } },
} satisfies Prisma.ApplicationInclude;

export async function listApplications(query: ApplicationListQuery) {
  const where = buildWhere(query);
  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.application.count({ where }),
  ]);
  return { items, total, page: query.page, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)) };
}

export function listAllApplications(query: Omit<ApplicationListQuery, "page">) {
  return prisma.application.findMany({ where: buildWhere(query), include, orderBy: { createdAt: "desc" } });
}

export function getApplication(id: number) {
  return prisma.application.findUnique({ where: { id }, include });
}

export async function getApplicationStatusCounts() {
  const grouped = await prisma.application.groupBy({ by: ["status"], _count: { _all: true } });
  return Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Partial<Record<string, number>>;
}
