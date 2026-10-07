import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteBranch, saveBranch } from "@/actions/branches";
import { ActionForm, CheckboxField, ImageField, PhoneListField, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function BranchEditPage({ params }: PageProps<"/admin/subeler/[id]">) {
  await requireUser("branches");
  const { id } = await params;
  const isNew = id === "yeni";
  const branch = isNew
    ? null
    : await prisma.branch.findUnique({ where: { id: Number(id) || 0 }, include: { phones: { orderBy: { sortOrder: "asc" } } } });
  if (!isNew && !branch) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni şube" : branch!.name}
        actions={<ButtonLink href="/admin/subeler" variant="secondary">← Şubeler</ButtonLink>}
      />

      <Card className="max-w-3xl">
        <ActionForm action={saveBranch}>
          {branch && <input type="hidden" name="id" value={branch.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="name" label="Şube adı" defaultValue={branch?.name} required />
            <TextField name="slug" label="Kısa ad" defaultValue={branch?.slug} hint="Boş bırakırsan addan üretilir" />
            <TextField name="district" label="İlçe" defaultValue={branch?.district ?? ""} />
            <TextField name="phone" label="Ana telefon" type="tel" defaultValue={branch?.phone ?? ""} placeholder="0312 123 45 67" />
            <TextField name="openingHours" label="Çalışma saatleri" defaultValue={branch?.openingHours ?? ""} placeholder="Her gün 11:00 – 02:00" />
            <TextField name="sortOrder" label="Sıra" type="number" min={0} defaultValue={branch?.sortOrder ?? 0} />
          </div>
          <TextField name="address" label="Adres" defaultValue={branch?.address ?? ""} />
          <PhoneListField
            label="Ek iletişim numaraları"
            hint="Paket servis, WhatsApp hattı vb. WhatsApp işaretli numaralar sitede WhatsApp linkiyle de gösterilir."
            initial={branch?.phones}
          />
          <TextField name="mapUrl" label="Google Maps linki" type="url" defaultValue={branch?.mapUrl ?? ""} hint="Boşsa 'Yol Tarifi' adresle Google Maps'te arama yapar" />
          <ImageField current={branch?.imageUrl} />
          <CheckboxField name="isActive" label="Şube aktif (sitede ve kariyer formunda görünür)" defaultChecked={branch?.isActive ?? true} />
        </ActionForm>
      </Card>

      {branch && (
        <div className="mt-6">
          <DeleteForm action={deleteBranch} id={branch.id} label="Şubeyi sil" confirm={`"${branch.name}" şubesi silinsin mi? Başvurulardaki şube bilgisi boşaltılır, şubenin duyuruları silinir ve şubeye bağlı Duyuru Editörleri pasife alınır.`} />
        </div>
      )}
    </>
  );
}
