"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { deleteImage, saveImage, UploadError } from "@/lib/uploads";
import { branchPhonesSchema, branchSchema, phonesFromForm } from "@/lib/validations/admin";
import { formToObject, isUniqueError, validationFailed, type ActionState } from "@/lib/action-state";

function revalidateBranches() {
  revalidatePath("/subeler");
  revalidatePath("/admin/subeler", "layout");
}

export async function saveBranch(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("branches");
  const id = Number(formData.get("id")) || null;
  const parsed = branchSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  const phonesParsed = branchPhonesSchema.safeParse(phonesFromForm(formData));
  if (!phonesParsed.success) {
    return { ok: false, message: "Lütfen formdaki hataları düzeltin.", fieldErrors: { phones: [phonesParsed.error.issues[0].message] } };
  }
  const { slug, ...data } = parsed.data;
  // Ek numaralar her kayıtta baştan yazılır (formdaki sıra korunur)
  const phones = { create: phonesParsed.data.map((p, i) => ({ ...p, sortOrder: i })) };

  let savedId = id;
  try {
    const imageUrl = await saveImage(formData.get("image"), "subeler");
    const payload = { ...data, slug: slug || slugify(data.name), ...(imageUrl ? { imageUrl } : {}) };
    if (id) {
      const old = await prisma.branch.findUnique({ where: { id }, select: { imageUrl: true } });
      await prisma.branch.update({ where: { id }, data: { ...payload, phones: { deleteMany: {}, ...phones } } });
      if (imageUrl) await deleteImage(old?.imageUrl);
    } else {
      savedId = (await prisma.branch.create({ data: { ...payload, phones }, select: { id: true } })).id;
    }
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, fieldErrors: { image: [e.message] } };
    if (isUniqueError(e)) return { ok: false, fieldErrors: { slug: ["Bu kısa ad (slug) zaten kullanılıyor."] } };
    throw e;
  }

  revalidateBranches();
  redirect(id ? "/admin/subeler" : `/admin/subeler/${savedId}`);
}

export async function deleteBranch(formData: FormData) {
  await requireUser("branches");
  const id = Number(formData.get("id"));
  // Şubeye bağlı Duyuru Editörleri pasife alınır: bağ boşalınca "tüm şubeler" yetkisi kazanmasınlar
  await prisma.user.updateMany({ where: { branchId: id, role: "ANNOUNCER" }, data: { isActive: false } });
  // Başvurulardaki şube bilgisi null'a çekilir (onDelete: SetNull), duyuruları silinir (Cascade)
  const deleted = await prisma.branch.delete({ where: { id } }).catch(() => null);
  await deleteImage(deleted?.imageUrl);
  revalidateBranches();
  redirect("/admin/subeler");
}
