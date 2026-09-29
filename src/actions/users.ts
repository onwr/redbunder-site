"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { hashPassword } from "@/lib/password";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/admin";
import { formToObject, isUniqueError, validationFailed, type ActionState } from "@/lib/action-state";

export async function saveUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireUser("users");
  const id = Number(formData.get("id")) || null;
  const raw = formToObject(formData);

  const parsed = id ? userUpdateSchema.safeParse(raw) : userCreateSchema.safeParse(raw);
  if (!parsed.success) return validationFailed(parsed.error);
  const { password, ...data } = parsed.data;

  // Kendini kilitleme: kendi rolünü düşüremez / kendini pasife alamaz
  if (id === me.id && (data.role !== "ADMIN" || !data.isActive)) {
    return { ok: false, message: "Kendi yönetici yetkinizi kaldıramaz veya hesabınızı pasife alamazsınız." };
  }

  try {
    const passwordHash = password ? await hashPassword(password) : undefined;
    if (id) {
      await prisma.user.update({ where: { id }, data: { ...data, ...(passwordHash ? { passwordHash } : {}) } });
    } else {
      await prisma.user.create({ data: { ...data, passwordHash: passwordHash! } });
    }
  } catch (e) {
    if (isUniqueError(e)) return { ok: false, fieldErrors: { email: ["Bu e-posta ile bir kullanıcı zaten var."] } };
    throw e;
  }

  revalidatePath("/admin/kullanicilar");
  redirect("/admin/kullanicilar");
}

export async function deleteUser(formData: FormData) {
  const me = await requireUser("users");
  const id = Number(formData.get("id"));
  if (id !== me.id) await prisma.user.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/kullanicilar");
  redirect("/admin/kullanicilar");
}
