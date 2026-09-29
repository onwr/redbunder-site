import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { toggleProduct } from "@/actions/menu";
import { Badge, ButtonLink, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Ürünler" };

export default async function ProductsPage({ searchParams }: PageProps<"/admin/menu/urunler">) {
  await requireUser("menu");
  const { kategori } = await searchParams;
  const categoryId = Number(kategori) || undefined;

  const [categories, products] = await Promise.all([
    prisma.menuCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, name: true } }),
    prisma.product.findMany({
      where: { categoryId },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { id: "asc" }],
      include: { category: { select: { name: true } } },
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Ürünler"
        description="Menüdeki tüm ürünler. Şube bazlı fiyat / stok için Şubeler > şube detayı."
        actions={<ButtonLink href="/admin/menu/urunler/yeni">+ Yeni ürün</ButtonLink>}
      />

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/menu/urunler" className={!categoryId ? "font-semibold text-brand" : "text-neutral-600"}>Tümü</Link>
        {categories.map((c) => (
          <Link key={c.id} href={`?kategori=${c.id}`} className={categoryId === c.id ? "font-semibold text-brand" : "text-neutral-600"}>
            {c.name}
          </Link>
        ))}
      </div>

      <Table head={["", "Ürün", "Kategori", "Fiyat", "Etiketler", "Durum", ""]} empty={products.length === 0}>
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-neutral-50">
            <Td className="w-16">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="size-12 rounded-lg object-cover" />
              ) : (
                <div className="size-12 rounded-lg bg-neutral-100" />
              )}
            </Td>
            <Td>
              <Link href={`/admin/menu/urunler/${p.id}`} className="font-medium hover:text-brand">{p.name}</Link>
            </Td>
            <Td>{p.category.name}</Td>
            <Td>{formatPrice(p.price)}</Td>
            <Td className="space-x-1">
              {p.isNew && <Badge tone="blue">Yeni</Badge>}
              {p.isPopular && <Badge tone="amber">Popüler</Badge>}
              {p.isSpicy && <Badge tone="red">Acı</Badge>}
            </Td>
            <Td>
              <form action={toggleProduct}>
                <input type="hidden" name="id" value={p.id} />
                <button title="Aktif/pasif değiştir">
                  {p.isActive ? <Badge tone="green">Yayında</Badge> : <Badge>Pasif</Badge>}
                </button>
              </form>
            </Td>
            <Td className="text-right">
              <Link href={`/admin/menu/urunler/${p.id}`} className="text-sm text-brand hover:underline">Düzenle</Link>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
