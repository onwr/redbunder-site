import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteReview, saveReview } from "@/actions/reviews";
import { ActionForm, CheckboxField, SelectField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function ReviewEditPage({ params }: PageProps<"/admin/yorumlar/[id]">) {
  await requireUser("reviews");
  const { id } = await params;
  const isNew = id === "yeni";
  const review = isNew ? null : await prisma.review.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !review) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni yorum" : review!.name}
        actions={<ButtonLink href="/admin/yorumlar" variant="secondary">← Yorumlar</ButtonLink>}
      />
      <Card className="max-w-2xl">
        <ActionForm action={saveReview}>
          {review && <input type="hidden" name="id" value={review.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="name" label="Müşteri adı" defaultValue={review?.name} placeholder="Ahmet K." hint="Gizlilik için soyadın baş harfi yeterli" required />
            <SelectField
              name="rating"
              label="Puan"
              defaultValue={review?.rating ?? 5}
              options={[5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${"★".repeat(n)} (${n})` }))}
            />
            <TextField name="source" label="Kaynak" defaultValue={review?.source ?? ""} placeholder="Google, Instagram..." />
            <TextField name="sortOrder" label="Sıra" type="number" min={0} defaultValue={review?.sortOrder ?? 0} />
          </div>
          <TextArea name="text" label="Yorum" rows={4} maxLength={500} defaultValue={review?.text} />
          <CheckboxField name="isActive" label="Ana sayfada göster" defaultChecked={review?.isActive ?? true} />
        </ActionForm>
      </Card>
      {review && (
        <div className="mt-6">
          <DeleteForm action={deleteReview} id={review.id} label="Yorumu sil" />
        </div>
      )}
    </>
  );
}
