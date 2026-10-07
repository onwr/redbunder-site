"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, UtensilsCrossed, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Hero'nun içine gömülü header (HeroShell içinde render edilir) */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="relative z-50 border-b border-white/[0.06] bg-black/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[86px] max-w-[1580px] items-center justify-between gap-6 px-5 lg:px-8 xl:px-10">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Red Bunder" width={80} height={80} priority className="h-14 w-auto object-contain lg:h-[74px]" />
        </Link>

        {/* Masaüstü menü */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-6 2xl:gap-9">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href} active={isActive(l.href)}>{l.label}</NavLink>
              </li>
            ))}
            <li>
              <NavLink href={SITE.careerUrl} external>Kariyer</NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/menu"
            // lg–xl arası gizli: 8 menü bağlantısına yer açar (Menü zaten menüde)
            className="group inline-flex lg:hidden xl:inline-flex items-center gap-2 rounded-[12px] bg-[#ef101b] px-4 py-3 text-[12px] font-black uppercase text-white shadow-[0_10px_32px_rgba(239,16,27,0.28)] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#ff1825] hover:shadow-[0_14px_40px_rgba(239,16,27,0.4)] sm:px-5 sm:text-[13px]"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menüyü Gör
          </Link>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/10 text-white transition hover:border-white/30 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      <div
        className={cn(
          "absolute inset-x-0 top-full h-[calc(100svh-86px)] origin-top overflow-y-auto bg-black shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-300 lg:hidden",
          open ? "visible scale-y-100 opacity-100" : "invisible scale-y-95 opacity-0",
        )}
      >
        <ul className="mx-auto max-w-[1580px] px-5 py-4">
          {[...NAV_LINKS, { href: SITE.careerUrl, label: "Kariyer" }].map((l) => {
            const external = l.href.startsWith("http");
            const active = !external && isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-white/[0.08] py-4 font-display text-2xl font-bold uppercase tracking-[-0.02em]",
                    active ? "text-[#ff343d]" : "text-white/85",
                  )}
                >
                  {l.label}
                  {active && <span className="h-[3px] w-8 bg-[#f3131e]" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

function NavLink({ href, active, external, children }: { href: string; active?: boolean; external?: boolean; children: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative whitespace-nowrap py-2 font-display text-[15px] font-bold xl:text-[17px] uppercase tracking-[-0.01em] transition-colors",
        active ? "text-[#ff343d]" : "text-white/85 hover:text-white",
      )}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-[3px] rounded-full bg-[#f3131e] transition-all duration-300",
          active ? "w-full" : "w-0",
        )}
      />
    </Link>
  );
}
