"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { reviewSchema } from "@/lib/validations/admin";
import { formToObject, validationFailed, type ActionState } from "@/lib/action-state";

function revalidateReviews() {
  revalidatePath("/");
  revalidatePath("/admin/yorumlar", "layout");
}

export async function saveReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("reviews");
  const id = Number(formData.get("id")) || null;
  const parsed = reviewSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);

  if (id) await prisma.review.update({ where: { id }, data: parsed.data });
  else await prisma.review.create({ data: parsed.data });

  revalidateReviews();
  redirect("/admin/yorumlar");
}

export async function deleteReview(formData: FormData) {
  await requireUser("reviews");
  await prisma.review.delete({ where: { id: Number(formData.get("id")) } }).catch(() => null);
  revalidateReviews();
  redirect("/admin/yorumlar");
}
