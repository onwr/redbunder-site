"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, type CurrentUser } from "@/lib/session";
import { isoToDate } from "@/lib/dates";
import { announcementSchema } from "@/lib/validations/admin";
import { formToObject, validationFailed, type ActionState } from "@/lib/action-state";

function revalidateAnnouncements() {
  revalidatePath("/duyurular");
  revalidatePath("/subeler");
  revalidatePath("/admin/duyurular", "layout");
}

/** Şubeye bağlı Duyuru Editörü sadece kendi şubesinin duyurularına dokunabilir */
async function canEdit(user: CurrentUser, id: number) {
  if (!user.branchId) return true;
  const a = await prisma.announcement.findUnique({ where: { id }, select: { branchId: true } });
  return a?.branchId === user.branchId;
}

export async function saveAnnouncement(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("announcements");
  const id = Number(formData.get("id")) || null;
  const parsed = announcementSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  if (id && !(await canEdit(user, id))) return { ok: false, message: "Bu duyuruyu düzenleme yetkiniz yok." };

  const { endsAt, ...rest } = parsed.data;
  const data = {
    ...rest,
    // Şubeye bağlı kullanıcı başka şubeye / tüm şubelere yazamaz
    branchId: user.branchId ?? rest.branchId,
    endsAt: endsAt ? isoToDate(endsAt) : null,
  };

  if (id) await prisma.announcement.update({ where: { id }, data });
  else await prisma.announcement.create({ data: { ...data, createdById: user.id } });

  revalidateAnnouncements();
  redirect("/admin/duyurular");
}

export async function deleteAnnouncement(formData: FormData) {
  const user = await requireUser("announcements");
  const id = Number(formData.get("id"));
  if (await canEdit(user, id)) await prisma.announcement.delete({ where: { id } }).catch(() => null);
  revalidateAnnouncements();
  redirect("/admin/duyurular");
}

/** Listeden tek tıkla yayına al / kaldır */
export async function toggleAnnouncement(formData: FormData) {
  const user = await requireUser("announcements");
  const id = Number(formData.get("id"));
  if (!(await canEdit(user, id))) return;
  const a = await prisma.announcement.findUnique({ where: { id }, select: { isPublished: true } });
  if (a) await prisma.announcement.update({ where: { id }, data: { isPublished: !a.isPublished } });
  revalidateAnnouncements();
}
