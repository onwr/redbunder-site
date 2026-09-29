import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GENDER_LABELS, STATUS_LABELS, STATUS_TONES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getApplicationStatusCounts, listApplications } from "@/lib/services/applications";
import { applicationListQuerySchema } from "@/lib/validations/admin";
import { Badge, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Başvurular" };

export default async function ApplicationsPage({ searchParams }: PageProps<"/admin/basvurular">) {
  await requireUser("applications");
  const query = applicationListQuerySchema.parse(await searchParams);
  const [{ items, total, page, pageCount }, counts, positions, branches] = await Promise.all([
    listApplications(query),
    getApplicationStatusCounts(),
    prisma.position.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
    prisma.branch.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const qs = (extra: Record<string, string | number | undefined>) => {
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...query, ...extra })) if (v !== undefined && v !== "") s.set(k, String(v));
    return s.toString();
  };
  const select = "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm";

  return (
    <>
      <PageHeader
        title={`Başvurular (${total})`}
        description="cv.redbunder.com üzerinden gelen iş başvuruları."
        actions={
          <a href={`/api/admin/applications/export?${qs({ page: undefined })}`} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50">
            CSV / Excel indir
          </a>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/basvurular" className={!query.status ? "font-semibold text-brand" : "text-neutral-600"}>Tümü</Link>
        {Object.entries(STATUS_LABELS).map(([k, l]) => (
          <Link key={k} href={`?${qs({ status: k, page: undefined })}`} className={query.status === k ? "font-semibold text-brand" : "text-neutral-600"}>
            {l} ({counts[k] ?? 0})
          </Link>
        ))}
      </div>

      <form className="mb-4 flex flex-wrap gap-2">
        {query.status && <input type="hidden" name="status" value={query.status} />}
        <input name="q" defaultValue={query.q} placeholder="İsim veya telefon" className={select} />
        <select name="positionId" defaultValue={query.positionId ?? ""} className={select}>
          <option value="">Tüm alanlar</option>
          {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select name="branchId" defaultValue={query.branchId ?? ""} className={select}>
          <option value="">Tüm şubeler</option>
          {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white">Filtrele</button>
      </form>

      <Table head={["Ad Soyad", "Telefon", "Cinsiyet / Yaş", "Alan", "Şube", "Durum", "Tarih"]} empty={items.length === 0}>
        {items.map((a) => (
          <tr key={a.id} className="hover:bg-neutral-50">
            <Td>
              <Link href={`/admin/basvurular/${a.id}`} className="font-medium hover:text-brand">{a.fullName}</Link>
            </Td>
            <Td>{a.phone}</Td>
            <Td>{GENDER_LABELS[a.gender]} · {a.age}</Td>
            <Td>{a.position.title}</Td>
            <Td>{a.branch?.name ?? "-"}</Td>
            <Td><Badge tone={STATUS_TONES[a.status]}>{STATUS_LABELS[a.status]}</Badge></Td>
            <Td className="whitespace-nowrap text-neutral-500">{formatDate(a.createdAt)}</Td>
          </tr>
        ))}
      </Table>

      <nav className="mt-4 flex items-center gap-4 text-sm">
        {page > 1 && <Link href={`?${qs({ page: page - 1 })}`} className="text-brand">← Önceki</Link>}
        <span className="text-neutral-500">Sayfa {page} / {pageCount}</span>
        {page < pageCount && <Link href={`?${qs({ page: page + 1 })}`} className="text-brand">Sonraki →</Link>}
      </nav>
    </>
  );
}
