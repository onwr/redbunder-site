"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { deleteImage, saveImage, UploadError } from "@/lib/uploads";
import { branchSchema } from "@/lib/validations/admin";
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
  const { slug, ...data } = parsed.data;

  let savedId = id;
  try {
    const imageUrl = await saveImage(formData.get("image"), "subeler");
    const payload = { ...data, slug: slug || slugify(data.name), ...(imageUrl ? { imageUrl } : {}) };
    if (id) {
      const old = await prisma.branch.findUnique({ where: { id }, select: { imageUrl: true } });
      await prisma.branch.update({ where: { id }, data: payload });
      if (imageUrl) await deleteImage(old?.imageUrl);
    } else {
      savedId = (await prisma.branch.create({ data: payload, select: { id: true } })).id;
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
  // Başvurulardaki şube bilgisi null'a çekilir (onDelete: SetNull)
  const deleted = await prisma.branch.delete({ where: { id } }).catch(() => null);
  await deleteImage(deleted?.imageUrl);
  revalidateBranches();
  redirect("/admin/subeler");
}
