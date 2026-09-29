import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge, ButtonLink, ErrorNotice, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Kategoriler" };

export default async function CategoriesPage({ searchParams }: PageProps<"/admin/menu/kategoriler">) {
  await requireUser("menu");
  const { hata } = await searchParams;
  const categories = await prisma.menuCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <PageHeader
        title="Kategoriler"
        description="Menüdeki bölümler (Burgerler, Yan Ürünler, İçecekler...). Sıra numarasına göre listelenir."
        actions={<ButtonLink href="/admin/menu/kategoriler/yeni">+ Yeni kategori</ButtonLink>}
      />
      <ErrorNotice message={hata} />
      <Table head={["Sıra", "Kategori", "Ürün sayısı", "Durum", ""]} empty={categories.length === 0}>
        {categories.map((c) => (
          <tr key={c.id} className="hover:bg-neutral-50">
            <Td className="w-16 text-neutral-500">{c.sortOrder}</Td>
            <Td>
              <Link href={`/admin/menu/kategoriler/${c.id}`} className="font-medium hover:text-brand">{c.name}</Link>
            </Td>
            <Td>
              <Link href={`/admin/menu/urunler?kategori=${c.id}`} className="hover:text-brand">{c._count.products}</Link>
            </Td>
            <Td>{c.isActive ? <Badge tone="green">Yayında</Badge> : <Badge>Pasif</Badge>}</Td>
            <Td className="text-right">
              <Link href={`/admin/menu/kategoriler/${c.id}`} className="text-sm text-brand hover:underline">Düzenle</Link>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
