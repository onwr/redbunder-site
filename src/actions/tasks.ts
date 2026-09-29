"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isoToDate } from "@/lib/dates";
import { taskSchema } from "@/lib/validations/admin";
import { formToObject, validationFailed, type ActionState } from "@/lib/action-state";
import type { TaskStatus } from "@/generated/prisma/enums";

function revalidateTasks() {
  revalidatePath("/admin", "layout"); // sidebar rozeti + genel bakış
}

/** Formdan dönülecek yer (takvim ayı / liste) – sadece panel içi yollar */
function backTo(formData: FormData) {
  const back = String(formData.get("_back") ?? "");
  return back.startsWith("/admin/gorevler") ? back : "/admin/gorevler";
}

export async function saveTask(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("tasks");
  const id = Number(formData.get("id")) || null;
  const parsed = taskSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  const { dueDate, ...rest } = parsed.data;
  const prev = id ? await prisma.task.findUnique({ where: { id }, select: { status: true, completedAt: true } }) : null;
  const completedAt = rest.status === "TAMAM" ? (prev?.status === "TAMAM" ? prev.completedAt : new Date()) : null;
  const data = { ...rest, dueDate: isoToDate(dueDate), completedAt };

  if (id) await prisma.task.update({ where: { id }, data });
  else await prisma.task.create({ data: { ...data, createdById: user.id } });

  revalidateTasks();
  redirect(backTo(formData));
}

/** Takvim/listeden hızlı durum değişikliği: formData { id, status } */
export async function setTaskStatus(formData: FormData) {
  await requireUser("tasks");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as TaskStatus;
  if (!["YAPILACAK", "DEVAM", "TAMAM"].includes(status)) return;
  await prisma.task.update({
    where: { id },
    data: { status, completedAt: status === "TAMAM" ? new Date() : null },
  });
  revalidateTasks();
}

export async function deleteTask(formData: FormData) {
  await requireUser("tasks");
  await prisma.task.delete({ where: { id: Number(formData.get("id")) } }).catch(() => null);
  revalidateTasks();
  redirect(backTo(formData));
}
