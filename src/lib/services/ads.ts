import "server-only";
import { prisma } from "@/lib/prisma";
import { addMonths, formatDay, formatMonth, isISODate, isoToDate, isYearMonth, monthRange, todayISO } from "@/lib/dates";
import type { AdPlatform } from "@/generated/prisma/enums";

/**
 * Reklam raporu hesaplamaları. Kayıtlar dönem bazlıdır; bir kayıt, dönem BAŞLANGICI
 * seçili aralığa düşüyorsa o aralığa sayılır (dönemler bölünmez).
 */

export type Metrics = {
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  orders: number;
  entries: number;
};

export type Derived = Metrics & {
  /** Ciro / harcama */
  roas: number | null;
  /** Tıklama / gösterim */
  ctr: number | null;
  /** Harcama / tıklama */
  cpc: number | null;
  /** Harcama / sipariş */
  cpa: number | null;
};

const empty = (): Metrics => ({ spend: 0, revenue: 0, impressions: 0, clicks: 0, orders: 0, entries: 0 });

export function derive(m: Metrics): Derived {
  return {
    ...m,
    roas: m.spend > 0 && m.revenue > 0 ? m.revenue / m.spend : null,
    ctr: m.impressions > 0 ? m.clicks / m.impressions : null,
    cpc: m.clicks > 0 ? m.spend / m.clicks : null,
    cpa: m.orders > 0 ? m.spend / m.orders : null,
  };
}

type Row = {
  platform: AdPlatform;
  periodStart: Date;
  spend: unknown;
  revenue: unknown;
  impressions: number | null;
  clicks: number | null;
  orders: number | null;
};

function add(m: Metrics, r: Row) {
  m.spend += Number(String(r.spend));
  m.revenue += r.revenue == null ? 0 : Number(String(r.revenue));
  m.impressions += r.impressions ?? 0;
  m.clicks += r.clicks ?? 0;
  m.orders += r.orders ?? 0;
  m.entries += 1;
}

const select = { platform: true, periodStart: true, spend: true, revenue: true, impressions: true, clicks: true, orders: true } as const;

/** Seçili aralığın özeti + platform kırılımı */
export async function getAdReport(from: string, to: string, platform?: AdPlatform) {
  const rows = await prisma.adEntry.findMany({
    where: { periodStart: { gte: isoToDate(from), lte: isoToDate(to) }, ...(platform ? { platform } : {}) },
    select,
  });

  const total = empty();
  const byPlatform = new Map<AdPlatform, Metrics>();
  for (const r of rows) {
    add(total, r);
    if (!byPlatform.has(r.platform)) byPlatform.set(r.platform, empty());
    add(byPlatform.get(r.platform)!, r);
  }

  return {
    total: derive(total),
    platforms: [...byPlatform.entries()]
      .map(([p, m]) => ({ platform: p, ...derive(m) }))
      .sort((a, b) => b.spend - a.spend),
  };
}

/** Son `months` ayın aylık harcama/ciro trendi (bitiş ayı dahil) */
export async function getMonthlyTrend(endMonth: string, months = 6, platform?: AdPlatform) {
  const startMonth = addMonths(endMonth, -(months - 1));
  const rows = await prisma.adEntry.findMany({
    where: {
      periodStart: { gte: isoToDate(monthRange(startMonth).from), lte: isoToDate(monthRange(endMonth).to) },
      ...(platform ? { platform } : {}),
    },
    select,
  });

  const buckets = Array.from({ length: months }, (_, i) => ({ month: addMonths(startMonth, i), ...empty() }));
  for (const r of rows) {
    const ym = r.periodStart.toISOString().slice(0, 7);
    const b = buckets.find((x) => x.month === ym);
    if (b) add(b, r);
  }
  return buckets;
}

/** URL parametrelerinden rapor aralığı: ?ay=2026-09 | ?from=..&to=.. (varsayılan: bu ay) */
export function parseAdRange(sp: Record<string, string | string[] | undefined>) {
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const from = one("from");
  const to = one("to");
  const platformParam = one("platform");
  const platform = AD_PLATFORM_VALUES.includes(platformParam as AdPlatform) ? (platformParam as AdPlatform) : undefined;

  if (isISODate(from) && isISODate(to) && from <= to) {
    return { from, to, month: to.slice(0, 7), custom: true, platform, label: `${formatDay(from)} – ${formatDay(to)} ${to.slice(0, 4)}` };
  }
  const ay = one("ay");
  const month = isYearMonth(ay) ? ay : todayISO().slice(0, 7);
  return { ...monthRange(month), month, custom: false, platform, label: formatMonth(month) };
}

const AD_PLATFORM_VALUES: AdPlatform[] = ["META", "GOOGLE", "TIKTOK", "TRENDYOL", "YEMEKSEPETI", "GETIR", "MIGROS", "DIGER"];
