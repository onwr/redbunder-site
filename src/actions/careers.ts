"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { applicationUpdateSchema, positionSchema } from "@/lib/validations/admin";
import { formToObject, isUniqueError, validationFailed, type ActionState } from "@/lib/action-state";

/* ---------------------------------- Başvurular --------------------------------- */

export async function updateApplication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("applications");
  const id = Number(formData.get("id"));
  const parsed = applicationUpdateSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  await prisma.application.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/basvurular", "layout");
  revalidatePath("/admin");
  return { ok: true, message: "Kaydedildi." };
}

export async function deleteApplication(formData: FormData) {
  await requireUser("applications");
  await prisma.application.delete({ where: { id: Number(formData.get("id")) } }).catch(() => null);
  revalidatePath("/admin/basvurular", "layout");
  redirect("/admin/basvurular");
}

/* ---------------------------------- Pozisyonlar -------------------------------- */

export async function savePosition(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("positions");
  const id = Number(formData.get("id")) || null;
  const parsed = positionSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  const payload = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };

  try {
    if (id) await prisma.position.update({ where: { id }, data: payload });
    else await prisma.position.create({ data: payload });
  } catch (e) {
    if (isUniqueError(e)) return { ok: false, fieldErrors: { slug: ["Bu kısa ad (slug) zaten kullanılıyor."] } };
    throw e;
  }
  revalidatePath("/admin/pozisyonlar");
  redirect("/admin/pozisyonlar");
}

export async function deletePosition(formData: FormData) {
  await requireUser("positions");
  const id = Number(formData.get("id"));
  const used = await prisma.application.count({ where: { positionId: id } });
  if (used > 0) {
    // Başvurusu olan pozisyon silinmez, pasife alınır
    await prisma.position.update({ where: { id }, data: { isActive: false } });
  } else {
    await prisma.position.delete({ where: { id } });
  }
  revalidatePath("/admin/pozisyonlar");
  redirect("/admin/pozisyonlar");
}
