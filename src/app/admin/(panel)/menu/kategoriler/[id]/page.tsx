import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteCategory, saveCategory } from "@/actions/menu";
import { ActionForm, CheckboxField, ImageField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function CategoryEditPage({ params }: PageProps<"/admin/menu/kategoriler/[id]">) {
  await requireUser("menu");
  const { id } = await params;
  const isNew = id === "yeni";
  const category = isNew ? null : await prisma.menuCategory.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !category) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni kategori" : category!.name}
        actions={<ButtonLink href="/admin/menu/kategoriler" variant="secondary">← Kategoriler</ButtonLink>}
      />
      <Card className="max-w-2xl">
        <ActionForm action={saveCategory}>
          {category && <input type="hidden" name="id" value={category.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="name" label="Kategori adı" defaultValue={category?.name} required />
            <TextField name="slug" label="Kısa ad (URL)" defaultValue={category?.slug} hint="Boş bırakırsan addan üretilir" />
            <TextField name="sortOrder" label="Sıra" type="number" min={0} defaultValue={category?.sortOrder ?? 0} />
          </div>
          <TextArea name="description" label="Açıklama" rows={2} defaultValue={category?.description ?? ""} />
          <ImageField current={category?.imageUrl} />
          <CheckboxField name="isActive" label="Yayında" defaultChecked={category?.isActive ?? true} />
        </ActionForm>
      </Card>
      {category && (
        <div className="mt-6">
          <DeleteForm action={deleteCategory} id={category.id} label="Kategoriyi sil" />
        </div>
      )}
    </>
  );
}
