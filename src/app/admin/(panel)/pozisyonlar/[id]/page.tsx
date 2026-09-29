import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deletePosition, savePosition } from "@/actions/careers";
import { ActionForm, CheckboxField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function PositionEditPage({ params }: PageProps<"/admin/pozisyonlar/[id]">) {
  await requireUser("positions");
  const { id } = await params;
  const isNew = id === "yeni";
  const position = isNew ? null : await prisma.position.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !position) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni pozisyon" : position!.title}
        actions={<ButtonLink href="/admin/pozisyonlar" variant="secondary">← Pozisyonlar</ButtonLink>}
      />
      <Card className="max-w-2xl">
        <ActionForm action={savePosition}>
          {position && <input type="hidden" name="id" value={position.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="title" label="Pozisyon adı" defaultValue={position?.title} required />
            <TextField name="slug" label="Kısa ad" defaultValue={position?.slug} hint="Kariyer sitesinde ?alan=<kısa-ad> ile ön seçim" />
            <TextField name="sortOrder" label="Sıra" type="number" min={0} defaultValue={position?.sortOrder ?? 0} />
          </div>
          <TextArea name="description" label="Açıklama" defaultValue={position?.description ?? ""} />
          <CheckboxField name="isActive" label="Alım yapılıyor (formda göster)" defaultChecked={position?.isActive ?? true} />
        </ActionForm>
      </Card>
      {position && (
        <div className="mt-6">
          <DeleteForm action={deletePosition} id={position.id} label="Pozisyonu sil" confirm="Başvurusu olan pozisyonlar silinmez, pasife alınır. Devam edilsin mi?" />
        </div>
      )}
    </>
  );
}
