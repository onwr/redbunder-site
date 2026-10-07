import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { isoToDate, todayISO } from "@/lib/dates";

/**
 * Sitede görünen duyurular: yayında, süresi geçmemiş, şubesi (varsa) aktif.
 * branchId verilirse: o şubenin + tüm şubeler için yazılmış duyurular.
 */
export function getVisibleAnnouncements(branchId?: number) {
  const where: Prisma.AnnouncementWhereInput = {
    isPublished: true,
    AND: [
      { OR: [{ endsAt: null }, { endsAt: { gte: isoToDate(todayISO()) } }] },
      { OR: [{ branchId: null }, { branch: { isActive: true } }] },
      ...(branchId ? [{ OR: [{ branchId: null }, { branchId }] }] : []),
    ],
  };
  return prisma.announcement.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, body: true, createdAt: true, branch: { select: { id: true, name: true, slug: true } } },
  });
}
