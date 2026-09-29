/**
 * Takvim tarihleri (DB'de @db.Date → UTC gece yarısı olarak döner).
 * Tüm "gün" hesapları Europe/Istanbul takvimine göre, "YYYY-MM-DD" stringleriyle yapılır.
 */

const TZ = "Europe/Istanbul";

/** Bugünün tarihi (İstanbul) → "2026-09-29" */
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** DB'den gelen @db.Date değeri → "2026-09-29" */
export function dateToISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** "2026-09-29" → @db.Date alanına yazılacak Date (UTC gece yarısı) */
export function isoToDate(iso: string) {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** "2026-09" → { from: "2026-09-01", to: "2026-09-30" } */
export function monthRange(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${ym}-01`, to: `${ym}-${String(last).padStart(2, "0")}` };
}

/** "2026-09" + n ay → "2026-10" */
export function addMonths(ym: string, n: number) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** "2026-09-29" + n gün */
export function addDays(iso: string, n: number) {
  const d = isoToDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return dateToISO(d);
}

const monthFmt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "UTC" });
const shortMonthFmt = new Intl.DateTimeFormat("tr-TR", { month: "short", timeZone: "UTC" });
const dayFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "UTC" });
const longDayFmt = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** "2026-09" → "Eylül 2026" */
export const formatMonth = (ym: string) => monthFmt.format(isoToDate(`${ym}-01`));
/** "2026-09" → "Eyl" */
export const formatShortMonth = (ym: string) => shortMonthFmt.format(isoToDate(`${ym}-01`));
/** "2026-09-29" → "29 Eyl" */
export const formatDay = (iso: string) => dayFmt.format(isoToDate(iso));
/** "2026-09-29" → "29 Eylül Salı" */
export const formatLongDay = (iso: string) => longDayFmt.format(isoToDate(iso));

/** Basit "YYYY-MM-DD" kontrolü */
export const isISODate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
export const isYearMonth = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}$/.test(v);
