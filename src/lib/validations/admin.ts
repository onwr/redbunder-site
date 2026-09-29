import { z } from "zod";

/* --------------------------------- Yardımcılar -------------------------------- */

/** Checkbox: işaretliyse "on", değilse hiç gönderilmez */
export const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

export const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.string().trim().max(max, `En fazla ${max} karakter.`).nullable());

const optionalUrl = z.preprocess(emptyToNull, z.url("Geçerli bir URL girin.").max(500).nullable());

export const slugField = z
  .string()
  .trim()
  .max(90)
  .regex(/^[a-z0-9-]*$/, "Sadece küçük harf, rakam ve tire kullanın.")
  .optional();

const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);

/** "249,90" veya "249.90" → 249.9 */
const price = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(/\s|₺/g, "").replace(",", ".") : v),
  z.coerce.number({ error: "Geçerli bir fiyat girin." }).min(0, "Fiyat negatif olamaz.").max(99999999),
);

/* ------------------------------------ Menü ------------------------------------ */

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Kategori adı en az 2 karakter.").max(100),
  slug: slugField,
  description: optionalText(255),
  isActive: checkbox,
  sortOrder,
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Ürün adı en az 2 karakter.").max(120),
  slug: slugField,
  categoryId: z.coerce.number({ error: "Kategori seçin." }).int().positive("Kategori seçin."),
  description: optionalText(2000),
  price,
  calories: z.preprocess(emptyToNull, z.coerce.number().int().min(0).max(9999).nullable()),
  allergens: optionalText(255),
  isNew: checkbox,
  isPopular: checkbox,
  isSpicy: checkbox,
  isActive: checkbox,
  sortOrder,
});

/* ----------------------------------- Şubeler ---------------------------------- */

export const branchSchema = z.object({
  name: z.string().trim().min(2, "Şube adı en az 2 karakter.").max(120),
  slug: slugField,
  district: optionalText(80),
  address: optionalText(255),
  phone: optionalText(20),
  mapUrl: optionalUrl,
  openingHours: optionalText(120),
  isActive: checkbox,
  sortOrder,
});

/* ---------------------------------- Kariyer ---------------------------------- */

export const positionSchema = z.object({
  title: z.string().trim().min(2).max(100),
  slug: slugField,
  description: optionalText(2000),
  isActive: checkbox,
  sortOrder,
});

const statusEnum = z.enum(["YENI", "INCELENIYOR", "GORUSME", "KABUL", "RED"]);

export const applicationUpdateSchema = z.object({
  status: statusEnum,
  note: optionalText(5000),
});

const optionalId = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().int().positive().optional(),
);

export const applicationListQuerySchema = z.object({
  status: statusEnum.optional().catch(undefined),
  positionId: optionalId.catch(undefined),
  branchId: optionalId.catch(undefined),
  q: z.string().trim().max(100).optional().catch(undefined),
  page: z.coerce.number().int().min(1).default(1).catch(1),
});

export type ApplicationListQuery = z.output<typeof applicationListQuerySchema>;

/* --------------------------------- Kullanıcılar -------------------------------- */

const role = z.enum(["ADMIN", "EDITOR", "HR"], { error: "Rol seçin." });

export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email("Geçerli bir e-posta girin.").trim().toLowerCase(),
  role,
  password: z.string().min(8, "Şifre en az 8 karakter olmalı.").max(72),
  isActive: checkbox,
});

/** Düzenlemede şifre boş bırakılırsa değişmez */
export const userUpdateSchema = userCreateSchema.extend({
  password: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(8, "Şifre en az 8 karakter olmalı.").max(72).optional(),
  ),
});

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta girin.").trim().toLowerCase(),
  password: z.string().min(1, "Şifre girin."),
});

/* ---------------------------------- Yorumlar --------------------------------- */

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter.").max(80),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(5, "Yorum en az 5 karakter.").max(500, "Yorum en fazla 500 karakter."),
  source: optionalText(40),
  isActive: checkbox,
  sortOrder,
});

/* --------------------------------- Reklamlar --------------------------------- */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih seçin.");
/** "12.500,50" / "1.250" (TR) → "12500.50" / "1250" · "12500.50" olduğu gibi · boş → undefined */
const parseMoney = (v: unknown) => {
  if (typeof v !== "string") return v;
  const s = v.replace(/\s|₺|TL/gi, "");
  if (s === "") return undefined;
  if (s.includes(",")) return s.replace(/\./g, "").replace(",", ".");
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) return s.replace(/\./g, ""); // binlik ayraçlı tam sayı
  return s;
};
const moneyRequired = z.preprocess(parseMoney, z.coerce.number({ error: "Tutar girin." }).min(0, "Negatif olamaz.").max(9_999_999_999));
const moneyOptional = z.preprocess(parseMoney, z.coerce.number().min(0, "Negatif olamaz.").max(9_999_999_999).optional());
const count = z.preprocess(
  (v) => (typeof v === "string" ? (v.trim() === "" ? undefined : v.replace(/\D/g, "")) : v),
  z.coerce.number().int().min(0).max(4_000_000_000).optional(),
);

export const adEntrySchema = z
  .object({
    platform: z.enum(["META", "GOOGLE", "TIKTOK", "TRENDYOL", "YEMEKSEPETI", "GETIR", "MIGROS", "DIGER"], { error: "Platform seçin." }),
    campaign: optionalText(150),
    periodStart: isoDate,
    periodEnd: isoDate,
    spend: moneyRequired,
    impressions: count,
    clicks: count,
    orders: count,
    revenue: moneyOptional,
    note: optionalText(2000),
  })
  .refine((v) => v.periodEnd >= v.periodStart, { message: "Bitiş, başlangıçtan önce olamaz.", path: ["periodEnd"] })
  .refine((v) => v.clicks == null || v.impressions == null || v.clicks <= v.impressions, {
    message: "Tıklama, gösterimden fazla olamaz.",
    path: ["clicks"],
  });

/* ---------------------------------- Görevler --------------------------------- */

export const taskSchema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter.").max(150),
  description: optionalText(5000),
  status: z.enum(["YAPILACAK", "DEVAM", "TAMAM"]),
  priority: z.enum(["DUSUK", "NORMAL", "YUKSEK"]),
  category: z.enum(["REKLAM", "SOSYAL_MEDYA", "KAMPANYA", "OPERASYON", "MENU", "IK", "DIGER"]),
  platform: z.preprocess(
    (v) => (v === "" ? null : v),
    z.enum(["META", "GOOGLE", "TIKTOK", "TRENDYOL", "YEMEKSEPETI", "GETIR", "MIGROS", "DIGER"]).nullable(),
  ),
  dueDate: isoDate,
  assigneeId: z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().int().positive().nullable()),
});
