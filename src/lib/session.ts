import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { can, SESSION_COOKIE, type AdminArea } from "@/lib/constants";

/** Oturumdaki kullanıcı (pasif / silinmişse null). İstek başına bir kez sorgulanır. */
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  return user?.isActive ? user : null;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/**
 * Admin sayfalarında ve server action'larda kullan: oturum yoksa login'e,
 * bölüme yetkisi yoksa panel ana sayfasına yönlendirir.
 * (proxy.ts sadece iyimser kontrol yapar; asıl yetki kontrolü burasıdır.)
 */
export async function requireUser(area?: AdminArea): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (area && !can(user.role, area)) redirect("/admin?hata=yetki");
  return user;
}
