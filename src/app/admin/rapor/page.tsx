import type { Metadata } from "next";
import Image from "next/image";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAdReport, getMonthlyTrend, parseAdRange } from "@/lib/services/ads";
import { AD_PLATFORM_LABELS, AD_PLATFORMS } from "@/lib/constants";
import { dateToISO, formatDay, formatShortMonth, isoToDate } from "@/lib/dates";
import { formatCompact, formatDate, formatMoney, formatNumber, formatPercent, formatRatio } from "@/lib/utils";
import { GroupedColumns, HBarChart } from "@/components/admin/charts";
import PrintButton from "@/components/admin/PrintButton";

export const metadata: Metadata = { title: { absolute: "Reklam Performans Raporu | Red Bunder" }, robots: { index: false } };

/**
 * Sunum / yazdırma görünümü (panel menüsü olmadan). Tarayıcıdan "PDF olarak kaydet" ile paylaşılabilir.
 * /admin/rapor?from=2026-09-01&to=2026-09-30&platform=META
 */
export default async function AdPresentationPage({ searchParams }: PageProps<"/admin/rapor">) {
  const user = await requireUser("ads");
  const range = parseAdRange(await searchParams);
  const [report, trend, notes] = await Promise.all([
    getAdReport(range.from, range.to, range.platform),
    getMonthlyTrend(range.month, 6, range.platform),
    prisma.adEntry.findMany({
      where: {
        periodStart: { gte: isoToDate(range.from), lte: isoToDate(range.to) },
        note: { not: null },
        ...(range.platform ? { platform: range.platform } : {}),
      },
      orderBy: { periodStart: "asc" },
      select: { id: true, platform: true, campaign: true, periodStart: true, note: true },
    }),
  ]);
  const t = report.total;

  return (
    <div className="min-h-screen bg-[#e9e7e2] py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[1000px] justify-end gap-2 px-4 print:hidden">
        <PrintButton />
      </div>

      <article className="mx-auto max-w-[1000px] bg-white px-8 py-10 shadow-xl print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-12">
        {/* Başlık */}
        <header className="flex items-start justify-between gap-6 border-b-4 border-[#ef101b] pb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ef101b]">Red Bunder · Pazarlama</p>
            <h1 className="mt-2 font-display text-5xl font-black uppercase leading-none tracking-[-0.04em]">Reklam Performans Raporu</h1>
            <p className="mt-3 text-lg font-semibold text-black/60">
              {range.label}
              {range.platform && ` · ${AD_PLATFORM_LABELS[range.platform]}`}
            </p>
          </div>
          <Image src="/logo.png" alt="Red Bunder" width={96} height={96} className="h-20 w-auto shrink-0" />
        </header>

        {/* Özet */}
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Kpi label="Harcama" value={formatMoney(t.spend)} strong />
          <Kpi label="Reklam cirosu" value={formatMoney(t.revenue)} />
          <Kpi label="ROAS" value={formatRatio(t.roas)} />
          <Kpi label="Sipariş" value={formatNumber(t.orders)} />
          <Kpi label="Gösterim" value={formatNumber(t.impressions)} />
          <Kpi label="Tıklama" value={formatNumber(t.clicks)} />
          <Kpi label="CTR" value={formatPercent(t.ctr)} />
          <Kpi label="Sipariş başı maliyet" value={t.cpa == null ? "–" : formatMoney(t.cpa)} />
        </section>

        {/* Grafikler */}
        <section className="mt-10 grid gap-8 md:grid-cols-2 print:grid-cols-2">
          <div className="break-inside-avoid">
            <h2 className="mb-4 font-display text-xl font-black uppercase">Platforma göre harcama</h2>
            <HBarChart
              rows={report.platforms.map((p) => ({ key: p.platform, label: AD_PLATFORM_LABELS[p.platform].split(" (")[0], value: p.spend }))}
              format={formatMoney}
            />
          </div>
          <div className="break-inside-avoid">
            <h2 className="mb-4 font-display text-xl font-black uppercase">Son 6 ay</h2>
            <GroupedColumns
              groups={trend.map((m) => ({ key: m.month, label: formatShortMonth(m.month), values: [m.spend, m.revenue] }))}
              series={["Harcama", "Ciro"]}
              format={formatMoney}
              axisFormat={formatCompact}
            />
          </div>
        </section>

        {/* Tablo */}
        <section className="mt-10 break-inside-avoid">
          <h2 className="mb-3 font-display text-xl font-black uppercase">Platform detayı</h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-[#111] text-[11px] uppercase tracking-[0.1em] text-black/50">
              <tr>
                {["Platform", "Harcama", "Ciro", "ROAS", "Tıklama", "CTR", "Sipariş", "Sip. başı"].map((h) => (
                  <th key={h} className="py-2 pr-3 font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {report.platforms.map((p) => (
                <tr key={p.platform}>
                  <td className="py-2.5 pr-3 font-bold">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: AD_PLATFORMS.find((x) => x.value === p.platform)?.dot }} />
                    {AD_PLATFORM_LABELS[p.platform].split(" (")[0]}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">{formatMoney(p.spend)}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{formatMoney(p.revenue)}</td>
                  <td className="py-2.5 pr-3 tabular-nums font-bold">{formatRatio(p.roas)}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{formatNumber(p.clicks)}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{formatPercent(p.ctr)}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{formatNumber(p.orders)}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{p.cpa == null ? "–" : formatMoney(p.cpa)}</td>
                </tr>
              ))}
              {report.platforms.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-black/40">Bu aralıkta kayıt yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Notlar */}
        {notes.length > 0 && (
          <section className="mt-10 break-inside-avoid">
            <h2 className="mb-3 font-display text-xl font-black uppercase">Kampanya notları</h2>
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-[12px] bg-[#f5f4f1] p-4 text-sm print:border print:border-black/10 print:bg-white">
                  <p className="font-bold">
                    {AD_PLATFORM_LABELS[n.platform].split(" (")[0]}
                    {n.campaign && ` · ${n.campaign}`}
                    <span className="ml-2 font-medium text-black/45">{formatDay(dateToISO(n.periodStart))}</span>
                  </p>
                  <p className="mt-1 whitespace-pre-line text-black/70">{n.note}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-12 flex justify-between border-t border-black/10 pt-4 text-xs font-medium text-black/40">
          <span>Veriler platform panellerinden elle girilmiştir.</span>
          <span>
            {user.name} · {formatDate(new Date())}
          </span>
        </footer>
      </article>
    </div>
  );
}

function Kpi({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "rounded-[14px] bg-[#111] p-4 text-white" : "rounded-[14px] border border-black/10 p-4"}>
      <p className={strong ? "text-[10px] font-black uppercase tracking-[0.18em] text-white/55" : "text-[10px] font-black uppercase tracking-[0.18em] text-black/45"}>{label}</p>
      <p className="mt-1.5 font-display text-2xl font-black tracking-[-0.03em]">{value}</p>
    </div>
  );
}
