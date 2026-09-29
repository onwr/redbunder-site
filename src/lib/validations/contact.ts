import { z } from "zod";

const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

const optional = (max: number) => z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

export const contactSchema = z
  .object({
    topic: z.enum(["GENEL", "ONERI_GORUS", "SIKAYET", "FRANCHISE", "DIGER"], { error: "Bir konu seçin." }),
    name: z.string({ error: "Adınızı girin." }).trim().min(2, "Adınızı girin.").max(100),
    email: z.preprocess(emptyToUndefined, z.email("Geçerli bir e-posta girin.").max(191).optional()),
    phone: optional(20),
    /** Mesaj belirli bir şubeyle ilgiliyse (opsiyonel) */
    branchId: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
    message: z.string({ error: "Mesajınızı yazın." }).trim().min(10, "Mesaj en az 10 karakter olmalı.").max(5000),
    /** Honeypot */
    website: z.string().optional(),
  })
  .refine((v) => v.email || v.phone, { message: "Size dönebilmemiz için e-posta veya telefon girin.", path: ["email"] });

/* --------------------------------- Franchise --------------------------------- */

export const FRANCHISE_BUDGETS = {
  BELIRTILMEDI: "Belirtmek istemiyorum",
  "0_1M": "1 milyon TL'ye kadar",
  "1_3M": "1 – 3 milyon TL",
  "3_5M": "3 – 5 milyon TL",
  "5M_PLUS": "5 milyon TL ve üzeri",
} as const;

export const FRANCHISE_LOCATIONS = { VAR: "Hazır lokasyonum var", ARIYOR: "Lokasyon arıyorum" } as const;
export const FRANCHISE_EXPERIENCE = { VAR: "Yiyecek-içecek deneyimim var", YOK: "Sektörde yeniyim" } as const;

const keysOf = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

export const franchiseSchema = z.object({
  name: z.string({ error: "Adınızı girin." }).trim().min(2, "Adınızı girin.").max(100),
  phone: z
    .string({ error: "Telefon numaranızı girin." })
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Geçerli bir telefon numarası girin.")
    .pipe(z.string().max(20)),
  email: z.preprocess(emptyToUndefined, z.email("Geçerli bir e-posta girin.").max(191).optional()),
  city: z.string({ error: "Şehir / ilçe girin." }).trim().min(2, "Şehir / ilçe girin.").max(80),
  budget: z.enum(keysOf(FRANCHISE_BUDGETS), { error: "Bir seçenek seçin." }),
  location: z.enum(keysOf(FRANCHISE_LOCATIONS), { error: "Bir seçenek seçin." }),
  experience: z.enum(keysOf(FRANCHISE_EXPERIENCE), { error: "Bir seçenek seçin." }),
  message: optional(2000),
  kvkkConsent: z.preprocess((v) => v === "on" || v === "true", z.literal(true, { error: "Onay vermeniz gerekir." })),
  /** Honeypot */
  website: z.string().optional(),
});
