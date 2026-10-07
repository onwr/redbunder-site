import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteAnnouncement, saveAnnouncement } from "@/actions/announcements";
import { dateToISO } from "@/lib/dates";
import { ActionForm, CheckboxField, SelectField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function AnnouncementEditPage({ params }: PageProps<"/admin/duyurular/[id]">) {
  const user = await requireUser("announcements");
  const { id } = await params;
  const isNew = id === "yeni";
  const [announcement, branches] = await Promise.all([
    isNew ? null : prisma.announcement.findUnique({ where: { id: Number(id) || 0 } }),
    prisma.branch.findMany({
      where: user.branchId ? { id: user.branchId } : {},
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, isActive: true },
    }),
  ]);
  // Şubeye bağlı kullanıcı başka şubenin duyurusunu açamaz
  if (!isNew && (!announcement || (user.branchId && announcement.branchId !== user.branchId))) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni duyuru" : announcement!.title}
        actions={<ButtonLink href="/admin/duyurular" variant="secondary">← Duyurular</ButtonLink>}
      />
      <Card className="max-w-3xl">
        <ActionForm action={saveAnnouncement} submitLabel={isNew ? "Paylaş" : "Kaydet"}>
          {announcement && <input type="hidden" name="id" value={announcement.id} />}
          <TextField name="title" label="Başlık" defaultValue={announcement?.title} maxLength={150} required placeholder="Ör. Bayramda 12:00'de açığız" />
          <TextArea name="body" label="Duyuru metni" rows={7} maxLength={5000} defaultValue={announcement?.body} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="branchId"
              label="Şube"
              defaultValue={announcement?.branchId ?? (user.branchId || "")}
              placeholder={user.branchId ? undefined : "Tüm şubeler"}
              options={branches.map((b) => ({ value: b.id, label: b.isActive ? b.name : `${b.name} (pasif)` }))}
              hint={user.branchId ? "Sadece bağlı olduğun şube için duyuru yazabilirsin." : undefined}
            />
            <TextField
              name="endsAt"
              label="Bitiş tarihi"
              type="date"
              defaultValue={announcement?.endsAt ? dateToISO(announcement.endsAt) : ""}
              hint="Boşsa siz kaldırana kadar yayında kalır"
            />
          </div>
          <CheckboxField name="isPublished" label="Sitede yayınla (işaretsizse taslak olarak kaydedilir)" defaultChecked={announcement?.isPublished ?? true} />
        </ActionForm>
      </Card>
      {announcement && (
        <div className="mt-6">
          <DeleteForm action={deleteAnnouncement} id={announcement.id} label="Duyuruyu sil" />
        </div>
      )}
    </>
  );
}
