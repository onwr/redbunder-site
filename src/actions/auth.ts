"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { getClientInfo } from "@/lib/request";
import { loginSchema } from "@/lib/validations/admin";
import type { ActionState } from "@/lib/action-state";

function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/admin") && !n.startsWith("//") ? n : "/admin";
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { ip } = getClientInfo(await headers());
  if (!rateLimit(`login:${ip ?? "unknown"}`, 10, 15 * 60 * 1000).ok) {
    return { ok: false, message: "Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin." };
  }

  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "E-posta veya şifre hatalı." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user?.isActive && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!user || !valid) return { ok: false, message: "E-posta veya şifre hatalı." };

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const store = await cookies();
  store.set({ ...sessionCookieOptions, value: await createSessionToken({ uid: user.id, role: user.role }) });
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(sessionCookieOptions.name);
  redirect("/admin/login");
}
