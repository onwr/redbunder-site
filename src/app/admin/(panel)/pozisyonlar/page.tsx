import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge, ButtonLink, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Pozisyonlar" };

export default async function PositionsPage() {
  await requireUser("positions");
  const positions = await prisma.position.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { applications: true } } },
  });

  return (
    <>
      <PageHeader
        title="Pozisyonlar"
        description="Kariyer sitesindeki 'Çalışmak İstediğiniz Alan' seçenekleri. Pasif olanlar formda görünmez."
        actions={<ButtonLink href="/admin/pozisyonlar/yeni">+ Yeni pozisyon</ButtonLink>}
      />
      <Table head={["Sıra", "Pozisyon", "Başvuru", "Durum", ""]} empty={positions.length === 0}>
        {positions.map((p) => (
          <tr key={p.id} className="hover:bg-neutral-50">
            <Td className="w-16 text-neutral-500">{p.sortOrder}</Td>
            <Td><Link href={`/admin/pozisyonlar/${p.id}`} className="font-medium hover:text-brand">{p.title}</Link></Td>
            <Td><Link href={`/admin/basvurular?positionId=${p.id}`} className="hover:text-brand">{p._count.applications}</Link></Td>
            <Td>{p.isActive ? <Badge tone="green">Alımda</Badge> : <Badge>Pasif</Badge>}</Td>
            <Td className="text-right"><Link href={`/admin/pozisyonlar/${p.id}`} className="text-sm text-brand hover:underline">Düzenle</Link></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
