"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { deleteImage, saveImage, UploadError } from "@/lib/uploads";
import { categorySchema, productSchema } from "@/lib/validations/admin";
import { formToObject, isUniqueError, validationFailed, type ActionState } from "@/lib/action-state";

function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/qr");
  revalidatePath("/admin/menu", "layout");
}

/* --------------------------------- Kategoriler -------------------------------- */

/** Oluştur / güncelle: formda "id" varsa günceller */
export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("menu");
  const id = Number(formData.get("id")) || null;
  const parsed = categorySchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  const { slug, ...data } = parsed.data;

  try {
    const imageUrl = await saveImage(formData.get("image"), "kategoriler");
    const payload = { ...data, slug: slug || slugify(data.name), ...(imageUrl ? { imageUrl } : {}) };
    if (id) {
      const old = await prisma.menuCategory.findUnique({ where: { id }, select: { imageUrl: true } });
      await prisma.menuCategory.update({ where: { id }, data: payload });
      if (imageUrl) await deleteImage(old?.imageUrl);
    } else {
      await prisma.menuCategory.create({ data: payload });
    }
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, fieldErrors: { image: [e.message] } };
    if (isUniqueError(e)) return { ok: false, fieldErrors: { slug: ["Bu kısa ad (slug) zaten kullanılıyor."] } };
    throw e;
  }

  revalidateMenu();
  redirect("/admin/menu/kategoriler");
}

export async function deleteCategory(formData: FormData) {
  await requireUser("menu");
  const id = Number(formData.get("id"));
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) redirect(`/admin/menu/kategoriler?hata=${encodeURIComponent("Kategoride ürün var; önce ürünleri taşıyın veya silin.")}`);
  const deleted = await prisma.menuCategory.delete({ where: { id } });
  await deleteImage(deleted.imageUrl);
  revalidateMenu();
  redirect("/admin/menu/kategoriler");
}

/* ----------------------------------- Ürünler ---------------------------------- */

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("menu");
  const id = Number(formData.get("id")) || null;
  const parsed = productSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  const { slug, ...data } = parsed.data;

  try {
    const imageUrl = await saveImage(formData.get("image"), "urunler");
    const removeImage = formData.get("removeImage") === "on";
    const payload = {
      ...data,
      slug: slug || slugify(data.name),
      ...(imageUrl ? { imageUrl } : removeImage ? { imageUrl: null } : {}),
    };
    if (id) {
      const old = await prisma.product.findUnique({ where: { id }, select: { imageUrl: true } });
      await prisma.product.update({ where: { id }, data: payload });
      if (imageUrl || removeImage) await deleteImage(old?.imageUrl);
    } else {
      await prisma.product.create({ data: payload });
    }
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, fieldErrors: { image: [e.message] } };
    if (isUniqueError(e)) return { ok: false, fieldErrors: { slug: ["Bu kısa ad (slug) zaten kullanılıyor."] } };
    throw e;
  }

  revalidateMenu();
  redirect("/admin/menu/urunler");
}

export async function deleteProduct(formData: FormData) {
  await requireUser("menu");
  const id = Number(formData.get("id"));
  const deleted = await prisma.product.delete({ where: { id } }).catch(() => null);
  await deleteImage(deleted?.imageUrl);
  revalidateMenu();
  redirect("/admin/menu/urunler");
}

/** Listeden hızlı aç/kapat */
export async function toggleProduct(formData: FormData) {
  await requireUser("menu");
  const id = Number(formData.get("id"));
  const product = await prisma.product.findUnique({ where: { id }, select: { isActive: true } });
  if (product) await prisma.product.update({ where: { id }, data: { isActive: !product.isActive } });
  revalidateMenu();
}
