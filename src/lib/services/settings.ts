import "server-only";
import { prisma } from "@/lib/prisma";
import type { SettingKey } from "@/lib/constants";

/** Tüm site ayarlarını { phone: "...", instagram: "..." } şeklinde döner */
export async function getSettings(): Promise<Partial<Record<SettingKey, string>>> {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
