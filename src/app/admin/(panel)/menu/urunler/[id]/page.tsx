import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteProduct, saveProduct } from "@/actions/menu";
import { ActionForm, CheckboxField, ImageField, SelectField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

/** /admin/menu/urunler/yeni → oluştur, /admin/menu/urunler/12 → düzenle */
export default async function ProductEditPage({ params }: PageProps<"/admin/menu/urunler/[id]">) {
  await requireUser("menu");
  const { id } = await params;
  const isNew = id === "yeni";

  const [product, categories] = await Promise.all([
    isNew ? null : prisma.product.findUnique({ where: { id: Number(id) || 0 } }),
    prisma.menuCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, name: true } }),
  ]);
  if (!isNew && !product) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni ürün" : product!.name}
        actions={<ButtonLink href="/admin/menu/urunler" variant="secondary">← Ürünler</ButtonLink>}
      />

      {categories.length === 0 ? (
        <Card>Önce bir kategori oluşturmalısınız.</Card>
      ) : (
        <Card className="max-w-3xl">
          <ActionForm action={saveProduct}>
            {product && <input type="hidden" name="id" value={product.id} />}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="name" label="Ürün adı" defaultValue={product?.name} required />
              <SelectField
                name="categoryId"
                label="Kategori"
                defaultValue={product?.categoryId ?? ""}
                placeholder="Seçin"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
              <TextField name="price" label="Fiyat (₺)" inputMode="decimal" defaultValue={product ? String(product.price) : ""} placeholder="249,90" required />
              <TextField name="slug" label="Kısa ad (URL)" defaultValue={product?.slug} hint="Boş bırakırsan addan üretilir" />
              <TextField name="calories" label="Kalori (kcal)" type="number" min={0} defaultValue={product?.calories ?? ""} />
              <TextField name="sortOrder" label="Sıra" type="number" min={0} defaultValue={product?.sortOrder ?? 0} />
            </div>
            <TextArea name="description" label="Açıklama / içindekiler" defaultValue={product?.description ?? ""} />
            <TextField name="allergens" label="Alerjenler" defaultValue={product?.allergens ?? ""} hint="Virgülle ayırın: gluten, süt, susam" />
            <ImageField current={product?.imageUrl} allowRemove />
            <div className="flex flex-wrap gap-6">
              <CheckboxField name="isActive" label="Yayında" defaultChecked={product?.isActive ?? true} />
              <CheckboxField name="isNew" label="Yeni" defaultChecked={product?.isNew} />
              <CheckboxField name="isPopular" label="Popüler" defaultChecked={product?.isPopular} />
              <CheckboxField name="isSpicy" label="Acı" defaultChecked={product?.isSpicy} />
            </div>
          </ActionForm>
        </Card>
      )}

      {product && (
        <div className="mt-6">
          <DeleteForm action={deleteProduct} id={product.id} label="Ürünü sil" confirm={`"${product.name}" silinsin mi? Bu işlem geri alınamaz.`} />
        </div>
      )}
    </>
  );
}
