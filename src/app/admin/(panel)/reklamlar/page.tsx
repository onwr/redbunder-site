import Link from "next/link";
import { ChevronLeft, ChevronRight, Coins, MousePointerClick, Plus, Presentation, ShoppingBag, TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getAdReport, getMonthlyTrend, parseAdRange } from "@/lib/services/ads";
import { AD_PLATFORM_LABELS, AD_PLATFORMS } from "@/lib/constants";
import { addMonths, formatShortMonth } from "@/lib/dates";
import { formatCompact, formatMoney, formatNumber, formatPercent, formatRatio } from "@/lib/utils";
import { ButtonLink, Card, FilterChip, PageHeader, Panel, StatCard, Table, Td } from "@/components/admin/ui";
import { GroupedColumns, HBarChart } from "@/components/admin/charts";
import AdRangeForm from "@/components/admin/AdRangeForm";

export const metadata = { title: "Reklam Raporları" };

export default async function AdsReportPage({ searchParams }: PageProps<"/admin/reklamlar">) {
  await requireUser("ads");
  const range = parseAdRange(await searchParams);
  const [report, trend] = await Promise.all([
    getAdReport(range.from, range.to, range.platform),
    getMonthlyTrend(range.month, 6, range.platform),
  ]);
  const t = report.total;

  const qs = (p: Record<string, string | undefined>) => {
    const base: Record<string, string | undefined> = range.custom ? { from: range.from, to: range.to } : { ay: range.month };
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...base, platform: range.platform, ...p })) if (v) s.set(k, v);
    return `?${s.toString()}`;
  };
  const presentHref = `/admin/rapor?from=${range.from}&to=${range.to}${range.platform ? `&platform=${range.platform}` : ""}`;

  return (
    <>
      <PageHeader
        eyebrow="Pazarlama"
        title="Reklam Raporları"
        description="Platform panellerinden girilen verilerin özeti. Bir kayıt, dönem başlangıcı seçili aralıktaysa bu rapora dahil edilir."
        actions={
          <>
            <ButtonLink href={presentHref} variant="dark" target="_blank">
              <Presentation className="h-4 w-4" /> Sunum / Yazdır
            </ButtonLink>
            <ButtonLink href="/admin/reklamlar/kayitlar/yeni">
              <Plus className="h-4 w-4" /> Veri Gir
            </ButtonLink>
          </>
        }
      />

      {/* Filtreler – tek satır */}
      <Card className="mb-6 flex flex-col gap-4 p-4 sm:p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`?ay=${addMonths(range.month, -1)}${range.platform ? `&platform=${range.platform}` : ""}`}
            aria-label="Önceki ay"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10 hover:border-black/30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <p className="min-w-44 text-center font-display text-xl font-black uppercase tracking-[-0.02em]">{range.label}</p>
          <Link
            href={`?ay=${addMonths(range.month, 1)}${range.platform ? `&platform=${range.platform}` : ""}`}
            aria-label="Sonraki ay"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10 hover:border-black/30"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
          <AdRangeForm from={range.from} to={range.to} platform={range.platform} />
        </div>
        <div className="-mx-1 flex min-w-0 max-w-full gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]">
          <FilterChip href={qs({ platform: undefined })} active={!range.platform}>Tümü</FilterChip>
          {AD_PLATFORMS.map((p) => (
            <FilterChip key={p.value} href={qs({ platform: p.value })} active={range.platform === p.value}>
              {p.label.split(" (")[0]}
            </FilterChip>
          ))}
        </div>
      </Card>

      {/* KPI'lar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard dark label="Toplam harcama" value={formatMoney(t.spend)} hint={`${t.entries} kayıt`} icon={<Coins />} />
        <StatCard label="Reklam cirosu" value={formatMoney(t.revenue)} hint={`ROAS ${formatRatio(t.roas)}`} icon={<TrendingUp />} />
        <StatCard label="Sipariş" value={formatNumber(t.orders)} hint={`Sipariş başı maliyet ${t.cpa == null ? "–" : formatMoney(t.cpa)}`} icon={<ShoppingBag />} />
        <StatCard
          label="Tıklama"
          value={formatNumber(t.clicks)}
          hint={`CTR ${formatPercent(t.ctr)} · TBM ${t.cpc == null ? "–" : formatMoney(t.cpc)}`}
          icon={<MousePointerClick />}
        />
      </div>

      {/* Grafikler */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Platforma göre harcama">
          <HBarChart
            rows={report.platforms.map((p) => ({ key: p.platform, label: AD_PLATFORM_LABELS[p.platform], value: p.spend }))}
            format={formatMoney}
            tooltip={(key) => {
              const p = report.platforms.find((x) => x.platform === key)!;
              return `Ciro ${formatMoney(p.revenue)} · ROAS ${formatRatio(p.roas)} · ${formatNumber(p.orders)} sipariş`;
            }}
          />
        </Panel>
        <Panel title="Son 6 ay: harcama ve ciro">
          <GroupedColumns
            groups={trend.map((m) => ({ key: m.month, label: formatShortMonth(m.month), values: [m.spend, m.revenue] }))}
            series={["Harcama", "Ciro"]}
            format={formatMoney}
            axisFormat={(n) => formatCompact(n)}
          />
        </Panel>
      </div>

      {/* Platform tablosu */}
      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg font-black uppercase tracking-[-0.02em]">Platform detayı</h2>
        <Table head={["Platform", "Harcama", "Ciro", "ROAS", "Gösterim", "Tıklama", "CTR", "TBM", "Sipariş", "Sipariş başı"]} empty={report.platforms.length === 0}>
          {report.platforms.map((p) => (
            <tr key={p.platform} className="hover:bg-black/[0.02]">
              <Td className="whitespace-nowrap font-bold">
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: AD_PLATFORMS.find((x) => x.value === p.platform)?.dot }} />
                {AD_PLATFORM_LABELS[p.platform]}
              </Td>
              <Td className="tabular-nums">{formatMoney(p.spend)}</Td>
              <Td className="tabular-nums">{formatMoney(p.revenue)}</Td>
              <Td className="tabular-nums font-bold">{formatRatio(p.roas)}</Td>
              <Td className="tabular-nums">{formatNumber(p.impressions)}</Td>
              <Td className="tabular-nums">{formatNumber(p.clicks)}</Td>
              <Td className="tabular-nums">{formatPercent(p.ctr)}</Td>
              <Td className="tabular-nums">{p.cpc == null ? "–" : formatMoney(p.cpc)}</Td>
              <Td className="tabular-nums">{formatNumber(p.orders)}</Td>
              <Td className="tabular-nums">{p.cpa == null ? "–" : formatMoney(p.cpa)}</Td>
            </tr>
          ))}
          {report.platforms.length > 1 && (
            <tr className="bg-black/[0.03] font-black">
              <Td>Toplam</Td>
              <Td className="tabular-nums">{formatMoney(t.spend)}</Td>
              <Td className="tabular-nums">{formatMoney(t.revenue)}</Td>
              <Td className="tabular-nums">{formatRatio(t.roas)}</Td>
              <Td className="tabular-nums">{formatNumber(t.impressions)}</Td>
              <Td className="tabular-nums">{formatNumber(t.clicks)}</Td>
              <Td className="tabular-nums">{formatPercent(t.ctr)}</Td>
              <Td className="tabular-nums">{t.cpc == null ? "–" : formatMoney(t.cpc)}</Td>
              <Td className="tabular-nums">{formatNumber(t.orders)}</Td>
              <Td className="tabular-nums">{t.cpa == null ? "–" : formatMoney(t.cpa)}</Td>
            </tr>
          )}
        </Table>
        <p className="mt-3 text-xs font-medium text-black/40">
          ROAS = ciro ÷ harcama · CTR = tıklama ÷ gösterim · TBM = tıklama başı maliyet · Boş bırakılan alanlar hesaplara 0 olarak girmez, ilgili oran “–” gösterilir.
        </p>
      </div>
    </>
  );
}
