import "server-only";
import { prisma } from "@/lib/prisma";

export type MenuItem = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  /** TL */
  price: number;
  imageUrl: string | null;
  calories: number | null;
  allergens: string[];
  isNew: boolean;
  isPopular: boolean;
  isSpicy: boolean;
};

export type MenuCategoryWithItems = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  items: MenuItem[];
};

/**
 * Menüyü döner – tüm şubelerde aynıdır. Sadece aktif kategori ve ürünler, boş kategoriler hariç.
 * Sonuç düz JSON'dur (client component'e geçirilebilir).
 */
export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  const categories = await prisma.menuCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
  });

  return categories
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      imageUrl: c.imageUrl,
      items: c.products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: Number(String(p.price)),
        imageUrl: p.imageUrl,
        calories: p.calories,
        allergens: p.allergens ? p.allergens.split(",").map((a) => a.trim()).filter(Boolean) : [],
        isNew: p.isNew,
        isPopular: p.isPopular,
        isSpicy: p.isSpicy,
      })),
    }))
    .filter((c) => c.items.length > 0);
}

export function getActiveBranches() {
  return prisma.branch.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { phones: { orderBy: { sortOrder: "asc" }, select: { id: true, label: true, number: true, isWhatsapp: true } } },
  });
}
