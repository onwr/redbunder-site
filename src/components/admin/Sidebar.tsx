"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck2,
  ExternalLink,
  FileUser,
  FolderTree,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  QrCode,
  ReceiptText,
  Sandwich,
  Settings,
  Store,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/gorevler": CalendarCheck2,
  "/admin/reklamlar": BarChart3,
  "/admin/reklamlar/kayitlar": ReceiptText,
  "/admin/menu/urunler": Sandwich,
  "/admin/menu/kategoriler": FolderTree,
  "/admin/subeler": Store,
  "/admin/qr": QrCode,
  "/admin/yorumlar": MessageSquareQuote,
  "/admin/mesajlar": Mail,
  "/admin/basvurular": FileUser,
  "/admin/pozisyonlar": BriefcaseBusiness,
  "/admin/kariyer-sitesi": Globe,
  "/admin/kullanicilar": Users,
  "/admin/ayarlar": Settings,
};

type Item = { href: string; label: string; group: string; badge?: number };
type Props = { items: Item[]; user: { name: string; roleLabel: string } };

export default function Sidebar({ items, user }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // En uzun eşleşen link aktif (/admin/reklamlar vs /admin/reklamlar/kayitlar)
  const activeHref = items
    .map((i) => i.href)
    .filter((h) => (h === "/admin" ? pathname === "/admin" : pathname === h || pathname.startsWith(h + "/")))
    .sort((a, b) => b.length - a.length)[0];

  const groups = [...new Set(items.map((i) => i.group))];
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toLocaleUpperCase("tr-TR");

  return (
    <>
      {/* Mobil üst bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0b0b] px-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Red Bunder" width={44} height={44} className="h-10 w-auto" />
          <span className="font-display text-lg font-black uppercase text-white">Panel</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menüyü aç"
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobil karartma */}
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#0b0b0b] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#e50914]/10 blur-[90px]" />

        <div className="relative flex items-center justify-between px-5 pb-4 pt-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Red Bunder" width={52} height={52} priority className="h-12 w-auto" />
            <div className="leading-none">
              <p className="font-display text-xl font-black uppercase tracking-[-0.02em]">Red Bunder</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff343d]">Yönetim</p>
            </div>
          </Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Menüyü kapat" className="text-white/60 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]">
          {groups.map((group) => (
            <div key={group} className="mt-4 first:mt-1">
              <p className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">{group}</p>
              <ul className="space-y-0.5">
                {items
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const Icon = ICONS[item.href] ?? LayoutDashboard;
                    const active = item.href === activeHref;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold transition",
                            active
                              ? "bg-[#ef101b] text-white shadow-[0_10px_28px_rgba(239,16,27,0.35)]"
                              : "text-white/65 hover:bg-white/[0.06] hover:text-white",
                          )}
                        >
                          <Icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-white/45 group-hover:text-white")} />
                          <span className="flex-1">{item.label}</span>
                          {!!item.badge && (
                            <span
                              className={cn(
                                "min-w-5 rounded-full px-1.5 text-center text-[11px] font-black leading-5",
                                active ? "bg-white text-[#ef101b]" : "bg-[#ef101b] text-white",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef101b] font-display text-base font-black">{initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="text-xs text-white/45">{user.roleLabel}</p>
            </div>
            <Link href="/" target="_blank" title="Siteyi aç" className="text-white/40 transition hover:text-white">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <form action={logoutAction} className="mt-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 py-2 text-xs font-bold text-white/70 transition hover:border-[#ef101b] hover:text-white">
              <LogOut className="h-3.5 w-3.5" /> Çıkış yap
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
