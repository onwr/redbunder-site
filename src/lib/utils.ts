const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };

/** "Çıtır Tavuk Burger" → "citir-tavuk-burger" */
export function slugify(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşüâîû]/g, (c) => TR_MAP[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const priceFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 });

/** 245 → "₺245,00" (Prisma Decimal da kabul eder) */
export function formatPrice(value: number | string | { toString(): string }) {
  return priceFormatter.format(Number(value.toString()));
}

export function formatDate(d: Date) {
  return d.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "short" });
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Ürün adları büyük harfle gösterilirken kullanılan dil. Menüde İngilizce adlar
 * (Classic, Crispy Chicken) çoğunlukta olduğundan "en": aksi halde "tr" kuralı
 * "CLASSİC" üretir. Türkçe adlar ağırlıkta olursa "tr" yapın.
 */
export const PRODUCT_NAME_LANG = "en";

/**
 * Yatay kaydırılan bir şeritte öğeyi ortalar. scrollIntoView yerine kullanılır:
 * o, yapışkan (sticky) şeritlerde sayfanın dikey kaydırmasını da oynatabiliyor.
 */
export function centerInStrip(strip: HTMLElement | null, item: Element | null | undefined) {
  if (!strip || !(item instanceof HTMLElement)) return;
  strip.scrollTo({ left: item.offsetLeft - strip.clientWidth / 2 + item.offsetWidth / 2, behavior: "smooth" });
}

/** Şube yol tarifi: admin'de girilen harita linki, yoksa adresle Google Maps araması */
export function branchDirectionsUrl(b: { name: string; address: string | null; district: string | null; mapUrl: string | null }) {
  if (b.mapUrl) return b.mapUrl;
  const q = ["Red Bunder", b.address ?? b.name, b.district, "Ankara"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** "https://instagram.com/redbunder/" → "@redbunder" */
export function instagramHandle(url?: string) {
  if (!url) return "Instagram";
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : "Instagram";
  } catch {
    return url.startsWith("@") ? url : "Instagram";
  }
}

const moneyFmt = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat("tr-TR");
const compactFmt = new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 1 });

/** 12500 → "₺12.500" (kuruşsuz, raporlar için) */
export const formatMoney = (n: number) => moneyFmt.format(n);
/** 12500 → "12.500" */
export const formatNumber = (n: number) => numberFmt.format(n);
/** 1250000 → "1,3 Mn" */
export const formatCompact = (n: number) => compactFmt.format(n);
/** 0.0345 → "%3,45" (null → "–") */
export const formatPercent = (n: number | null, digits = 2) =>
  n == null ? "–" : `%${(n * 100).toLocaleString("tr-TR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
/** 3.456 → "3,46x" (null → "–") */
export const formatRatio = (n: number | null) =>
  n == null ? "–" : `${n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
