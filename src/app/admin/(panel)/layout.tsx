import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ADMIN_NAV, can, ROLE_LABELS } from "@/lib/constants";
import { isoToDate, todayISO } from "@/lib/dates";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s | Red Bunder Yönetim" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();

  // Sidebar rozetleri: bugün/gecikmiş açık görevler, yeni başvurular, okunmamış mesajlar
  const [dueTasks, newApplications, unreadMessages] = await Promise.all([
    can(user.role, "tasks")
      ? prisma.task.count({ where: { status: { not: "TAMAM" }, dueDate: { lte: isoToDate(todayISO()) } } })
      : 0,
    can(user.role, "applications") ? prisma.application.count({ where: { status: "YENI" } }) : 0,
    can(user.role, "messages") ? prisma.contactMessage.count({ where: { isRead: false } }) : 0,
  ]);
  const badges: Record<string, number> = {
    "/admin/gorevler": dueTasks,
    "/admin/basvurular": newApplications,
    "/admin/mesajlar": unreadMessages,
  };

  const items = ADMIN_NAV.filter((i) => can(user.role, i.area)).map((i) => ({
    href: i.href,
    label: i.label,
    group: i.group,
    badge: badges[i.href],
  }));

  return (
    <div className="min-h-screen bg-[#f5f4f1] text-[#111] lg:flex">
      <Sidebar items={items} user={{ name: user.name, roleLabel: ROLE_LABELS[user.role] }} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
