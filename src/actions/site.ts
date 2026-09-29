"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { getClientInfo } from "@/lib/request";
import { CAREER_FIELDS, SETTING_FIELDS } from "@/lib/constants";
import {
  contactSchema,
  FRANCHISE_BUDGETS,
  FRANCHISE_EXPERIENCE,
  FRANCHISE_LOCATIONS,
  franchiseSchema,
} from "@/lib/validations/contact";
import { formToObject, validationFailed, type ActionState } from "@/lib/action-state";

/* ------------------------------- Public: iletişim ------------------------------ */

export async function sendContactMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { ip } = getClientInfo(await headers());
  if (!rateLimit(`contact:${ip ?? "unknown"}`, 3, 10 * 60 * 1000).ok) {
    return { ok: false, message: "Çok fazla mesaj gönderdiniz. Lütfen biraz sonra tekrar deneyin." };
  }
  const parsed = contactSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  const { website, branchId, ...data } = parsed.data;
  if (website) return { ok: true, message: "Mesajınız alındı." }; // honeypot

  // Sadece aktif şube bağlanabilir
  const branch = branchId ? await prisma.branch.findFirst({ where: { id: branchId, isActive: true }, select: { id: true } }) : null;

  await prisma.contactMessage.create({ data: { ...data, branchId: branch?.id ?? null, ip } });
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin", "layout"); // sidebar rozeti
  return {
    ok: true,
    message: data.topic === "ONERI_GORUS" ? "Görüşün için teşekkürler! Ekibimize ilettik." : "Mesajın alındı, en kısa sürede dönüş yapacağız.",
  };
}

/* ------------------------------ Public: franchise ------------------------------ */

/**
 * Franchise başvurusu → Admin > Mesajlar (konu: Franchise). Ek alanlar mesaj metnine
 * okunaklı biçimde yazılır; ayrı tablo gerekmez.
 */
export async function sendFranchiseApplication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { ip } = getClientInfo(await headers());
  if (!rateLimit(`franchise:${ip ?? "unknown"}`, 3, 10 * 60 * 1000).ok) {
    return { ok: false, message: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin." };
  }
  const parsed = franchiseSchema.safeParse(formToObject(formData));
  if (!parsed.success) return validationFailed(parsed.error);
  const d = parsed.data;
  if (d.website) return { ok: true, message: "Başvurunuz alındı." }; // honeypot

  const message = [
    `Şehir / ilçe: ${d.city}`,
    `Yatırım bütçesi: ${FRANCHISE_BUDGETS[d.budget]}`,
    `Lokasyon: ${FRANCHISE_LOCATIONS[d.location]}`,
    `Deneyim: ${FRANCHISE_EXPERIENCE[d.experience]}`,
    ...(d.message ? ["", d.message] : []),
  ].join("\n");

  await prisma.contactMessage.create({
    data: {
      topic: "FRANCHISE",
      name: d.name,
      phone: d.phone,
      email: d.email,
      subject: `Franchise başvurusu – ${d.city}`,
      message,
      ip,
    },
  });
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Başvurunuz bize ulaştı. Franchise ekibimiz en kısa sürede sizinle iletişime geçecek." };
}

/* ------------------------------- Admin: mesajlar ------------------------------- */

export async function toggleMessageRead(formData: FormData) {
  await requireUser("messages");
  const id = Number(formData.get("id"));
  const msg = await prisma.contactMessage.findUnique({ where: { id }, select: { isRead: true } });
  if (msg) await prisma.contactMessage.update({ where: { id }, data: { isRead: !msg.isRead } });
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await requireUser("messages");
  await prisma.contactMessage.delete({ where: { id: Number(formData.get("id")) } }).catch(() => null);
  revalidatePath("/admin/mesajlar");
}

/* ------------------------------- Admin: ayarlar -------------------------------- */

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("settings");
  await prisma.$transaction(
    SETTING_FIELDS.map(({ key }) => {
      const value = String(formData.get(key) ?? "").trim().slice(0, 1000);
      return value
        ? prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } })
        : prisma.setting.deleteMany({ where: { key } });
    }),
  );
  revalidatePath("/", "layout");
  return { ok: true, message: "Ayarlar kaydedildi." };
}

/* ---------------------------- Admin: kariyer sitesi ---------------------------- */

/** cv.redbunder.com içerikleri. Boş alan silinir → CV varsayılanı kullanılır. */
export async function saveCareerSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser("career");

  const values = Object.fromEntries(
    CAREER_FIELDS.map(({ key }) => [key, String(formData.get(key) ?? "").trim().slice(0, 2000)]),
  );

  // Yaş sınırı kontrolü
  const errors: Record<string, string[]> = {};
  const age = (k: string) => (values[k] === "" ? null : Number(values[k]));
  const min = age("cv_age_min");
  const max = age("cv_age_max");
  for (const [k, v] of [["cv_age_min", min], ["cv_age_max", max]] as const) {
    if (v != null && (!Number.isInteger(v) || v < 14 || v > 99)) errors[k] = ["14 ile 99 arasında bir tam sayı girin."];
  }
  if (!errors.cv_age_min && !errors.cv_age_max && min != null && max != null && min > max) {
    errors.cv_age_max = ["En yüksek yaş, en düşükten küçük olamaz."];
  }
  if (Object.keys(errors).length) return { ok: false, message: "Lütfen işaretli alanları düzeltin.", fieldErrors: errors };

  await prisma.$transaction(
    Object.entries(values).map(([key, value]) =>
      value
        ? prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } })
        : prisma.setting.deleteMany({ where: { key } }),
    ),
  );
  // Not: kariyer sitesi ayrı uygulama; sayfaları her istekte güncel veriyi okur.
  revalidatePath("/admin/kariyer-sitesi");
  return { ok: true, message: "Kaydedildi. Değişiklikler kariyer sitesinde hemen görünür." };
}
