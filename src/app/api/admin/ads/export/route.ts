import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { AD_PLATFORM_LABELS, can } from "@/lib/constants";
import { dateToISO, isoToDate } from "@/lib/dates";
import { parseAdRange } from "@/lib/services/ads";

/** GET /api/admin/ads/export?from=&to=&platform= → Excel uyumlu CSV */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "ads")) return NextResponse.json({ ok: false }, { status: 401 });

  const range = parseAdRange(Object.fromEntries(request.nextUrl.searchParams));
  const rows = await prisma.adEntry.findMany({
    where: {
      periodStart: { gte: isoToDate(range.from), lte: isoToDate(range.to) },
      ...(range.platform ? { platform: range.platform } : {}),
    },
    orderBy: [{ periodStart: "asc" }, { platform: "asc" }],
  });

  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  // Excel (TR) için ondalık virgül
  const num = (v: unknown) => (v == null ? "" : String(v).replace(".", ","));
  const header = ["Başlangıç", "Bitiş", "Platform", "Kampanya", "Harcama", "Ciro", "Gösterim", "Tıklama", "Sipariş", "Not"];
  const lines = rows.map((r) =>
    [
      dateToISO(r.periodStart),
      dateToISO(r.periodEnd),
      AD_PLATFORM_LABELS[r.platform],
      r.campaign,
      num(r.spend),
      num(r.revenue),
      r.impressions,
      r.clicks,
      r.orders,
      r.note,
    ]
      .map(esc)
      .join(";"),
  );
  const csv = "﻿" + [header.map(esc).join(";"), ...lines].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reklam-${range.from}_${range.to}.csv"`,
    },
  });
}
