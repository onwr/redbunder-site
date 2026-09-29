import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parseAdRange } from "@/lib/services/ads";
import { AD_PLATFORM_LABELS, AD_PLATFORMS } from "@/lib/constants";
import { addMonths, dateToISO, formatDay, isoToDate } from "@/lib/dates";
import { formatMoney, formatNumber } from "@/lib/utils";
import { ButtonLink, Card, FilterChip, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Reklam Kayıtları" };

export default async function AdEntriesPage({ searchParams }: PageProps<"/admin/reklamlar/kayitlar">) {
  await requireUser("ads");
  const range = parseAdRange(await searchParams);
  const entries = await prisma.adEntry.findMany({
    where: {
      periodStart: { gte: isoToDate(range.from), lte: isoToDate(range.to) },
      ...(range.platform ? { platform: range.platform } : {}),
    },
    orderBy: [{ periodStart: "desc" }, { id: "desc" }],
    include: { createdBy: { select: { name: true } } },
  });

  const qs = (p: Record<string, string | undefined>) => {
    const base: Record<string, string | undefined> = range.custom ? { from: range.from, to: range.to } : { ay: range.month };
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...base, platform: range.platform, ...p })) if (v) s.set(k, v);
    return `?${s.toString()}`;
  };
  const exportHref = `/api/admin/ads/export?from=${range.from}&to=${range.to}${range.platform ? `&platform=${range.platform}` : ""}`;

  return (
    <>
      <PageHeader
        eyebrow="Pazarlama"
        title="Reklam Kayıtları"
        description="Meta, Google, Trendyol vb. panellerden aldığınız sonuçları dönem dönem buraya girin."
        actions={
          <>
            <a href={exportHref} className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-black/10 bg-white px-4 text-sm font-bold hover:border-black/25">
              <Download className="h-4 w-4" /> Excel (CSV)
            </a>
            <ButtonLink href="/admin/reklamlar/kayitlar/yeni">
              <Plus className="h-4 w-4" /> Veri Gir
            </ButtonLink>
          </>
        }
      />

      <Card className="mb-5 flex flex-col gap-3 p-4 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 text-sm font-bold">
          <Link href={qs({ ay: addMonths(range.month, -1), from: undefined, to: undefined })} className="text-black/50 hover:text-black">← Önceki</Link>
          <span className="font-display text-lg font-black uppercase">{range.label}</span>
          <Link href={qs({ ay: addMonths(range.month, 1), from: undefined, to: undefined })} className="text-black/50 hover:text-black">Sonraki →</Link>
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

      <Table head={["Dönem", "Platform", "Kampanya", "Harcama", "Ciro", "Gösterim", "Tıklama", "Sipariş", "Giren", ""]} empty={entries.length === 0}>
        {entries.map((e) => (
          <tr key={e.id} className="hover:bg-black/[0.02]">
            <Td className="whitespace-nowrap font-semibold">
              {formatDay(dateToISO(e.periodStart))} – {formatDay(dateToISO(e.periodEnd))}
            </Td>
            <Td className="whitespace-nowrap">
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: AD_PLATFORMS.find((x) => x.value === e.platform)?.dot }} />
              {AD_PLATFORM_LABELS[e.platform]}
            </Td>
            <Td className="max-w-56 truncate text-black/60">{e.campaign ?? "–"}</Td>
            <Td className="tabular-nums font-bold">{formatMoney(Number(e.spend))}</Td>
            <Td className="tabular-nums">{e.revenue == null ? "–" : formatMoney(Number(e.revenue))}</Td>
            <Td className="tabular-nums">{e.impressions == null ? "–" : formatNumber(e.impressions)}</Td>
            <Td className="tabular-nums">{e.clicks == null ? "–" : formatNumber(e.clicks)}</Td>
            <Td className="tabular-nums">{e.orders == null ? "–" : formatNumber(e.orders)}</Td>
            <Td className="text-xs text-black/45">{e.createdBy?.name ?? "–"}</Td>
            <Td className="text-right">
              <Link href={`/admin/reklamlar/kayitlar/${e.id}`} className="text-sm font-bold text-[#ef101b] hover:underline">Düzenle</Link>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
