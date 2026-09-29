import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge, ButtonLink, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Yorumlar" };

export default async function ReviewsPage() {
  await requireUser("reviews");
  const reviews = await prisma.review.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "desc" }] });

  return (
    <>
      <PageHeader
        title="Yorumlar"
        description="Ana sayfadaki 'Müşteri Yorumları' bölümü. Sadece gerçek müşteri yorumlarını ekleyin; aktif yorum yoksa bölüm gizlenir."
        actions={<ButtonLink href="/admin/yorumlar/yeni">+ Yeni yorum</ButtonLink>}
      />
      <Table head={["Sıra", "İsim", "Puan", "Yorum", "Kaynak", "Durum", ""]} empty={reviews.length === 0}>
        {reviews.map((r) => (
          <tr key={r.id} className="hover:bg-neutral-50">
            <Td className="w-16 text-neutral-500">{r.sortOrder}</Td>
            <Td className="font-medium">{r.name}</Td>
            <Td className="whitespace-nowrap text-amber-500">{"★".repeat(r.rating)}<span className="text-neutral-300">{"★".repeat(5 - r.rating)}</span></Td>
            <Td className="max-w-md truncate text-neutral-600">{r.text}</Td>
            <Td>{r.source ?? "-"}</Td>
            <Td>{r.isActive ? <Badge tone="green">Yayında</Badge> : <Badge>Pasif</Badge>}</Td>
            <Td className="text-right">
              <Link href={`/admin/yorumlar/${r.id}`} className="text-sm text-brand hover:underline">Düzenle</Link>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
