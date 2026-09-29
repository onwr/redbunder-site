"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isoToDate } from "@/lib/dates";
import { adEntrySchema } from "@/lib/validations/admin";
import { formToObject, validationFailed, type ActionState } from "@/lib/action-state";

function revalidateAds() {
  revalidatePath("/admin/reklamlar", "layout");
  revalidatePath("/admin");
}

export async function saveAdEntry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("ads");
  const id = Number(formData.get("id")) || null;
  const parsed = adEntrySchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  const { periodStart, periodEnd, revenue, impressions, clicks, orders, ...rest } = parsed.data;
  const data = {
    ...rest,
    periodStart: isoToDate(periodStart),
    periodEnd: isoToDate(periodEnd),
    revenue: revenue ?? null,
    impressions: impressions ?? null,
    clicks: clicks ?? null,
    orders: orders ?? null,
  };

  if (id) await prisma.adEntry.update({ where: { id }, data });
  else await prisma.adEntry.create({ data: { ...data, createdById: user.id } });

  revalidateAds();
  // "Kaydet ve yeni ekle" → aynı platform/dönemle yeni form
  if (!id && formData.get("_next") === "new") {
    redirect(`/admin/reklamlar/kayitlar/yeni?platform=${data.platform}&from=${periodStart}&to=${periodEnd}`);
  }
  redirect("/admin/reklamlar/kayitlar");
}

export async function deleteAdEntry(formData: FormData) {
  await requireUser("ads");
  await prisma.adEntry.delete({ where: { id: Number(formData.get("id")) } }).catch(() => null);
  revalidateAds();
  redirect("/admin/reklamlar/kayitlar");
}
