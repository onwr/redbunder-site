"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Plus, Search, X } from "lucide-react";
import { Badges, ProductImage, ProductModal } from "@/components/menu/parts";
import { useActiveSection } from "@/components/menu/useActiveSection";
import type { MenuCategoryWithItems, MenuItem } from "@/lib/services/menu";
import { cn, formatPrice, PRODUCT_NAME_LANG, centerInStrip } from "@/lib/utils";

/**
 * QR menü gövdesi: koyu yapışkan kategori şeridi + arama, yatay ürün kartları, detay penceresi.
 * Masadan telefonla açıldığı için mobil önceliklidir.
 */
export default function QrMenu({ categories }: { categories: MenuCategoryWithItems[] }) {
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return categories;
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => [i.name, i.description ?? ""].some((t) => t.toLocaleLowerCase("tr-TR").includes(q))),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, query]);

  // Aktif kategori takibi (şerit yüksekliği ~70px + pay)
  const active = useActiveSection(filtered.map((c) => c.slug), 110);

  useEffect(() => {
    centerInStrip(chipsRef.current, chipsRef.current?.querySelector(`[data-slug="${active}"]`));
  }, [active]);

  // "Yukarı çık" butonu
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      {/* ---------------- Yapışkan kategori şeridi ---------------- */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/95 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4">
          {searchOpen ? (
            <div className="flex items-center gap-2 py-3">
              <label className="relative flex-1">
                <span className="sr-only">Menüde ara</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ne yemek istersin?"
                  className="h-11 w-full rounded-full border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/35 focus:border-[#ef101b]"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
                aria-label="Aramayı kapat"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-3">
              <div ref={chipsRef} className="relative -ml-4 flex flex-1 gap-2 overflow-x-auto pl-4 [scrollbar-width:none]">
                {filtered.map((c) => (
                  <a
                    key={c.slug}
                    data-slug={c.slug}
                    href={`#kat-${c.slug}`}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-2.5 font-display text-[15px] font-bold uppercase tracking-[-0.01em] transition",
                      active === c.slug
                        ? "bg-[#ef101b] text-white shadow-[0_8px_22px_rgba(239,16,27,0.35)]"
                        : "bg-white/[0.06] text-white/75",
                    )}
                  >
                    {c.name}
                  </a>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Menüde ara"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white transition hover:bg-[#ef101b]"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Ürünler ---------------- */}
      <div className="mx-auto max-w-3xl space-y-12 px-4 pb-16 pt-8">
        {filtered.map((c, ci) => (
          <section key={c.slug} id={`kat-${c.slug}`} className="scroll-mt-24">
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[3px] w-8 bg-[#ef101b]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ef101b]">
                  {String(ci + 1).padStart(2, "0")} · {c.items.length} ürün
                </span>
              </div>
              <h2 className="font-display text-[40px] font-black uppercase leading-none tracking-[-0.05em] text-[#111]">{c.name}</h2>
              {c.description && <p className="mt-2 text-sm font-medium leading-6 text-black/50">{c.description}</p>}
            </div>

            <ul className="space-y-3">
              {c.items.map((item) => (
                <li key={item.id}>
                  <QrItem item={item} onOpen={() => setSelected(item)} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-black/15 bg-white px-6 py-14 text-center">
            <p className="font-display text-2xl font-black uppercase text-[#111]">Sonuç yok</p>
            <p className="mt-2 text-sm text-black/50">&ldquo;{query}&rdquo; için ürün bulunamadı.</p>
          </div>
        )}
      </div>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Başa dön"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#ef101b] text-white shadow-[0_12px_30px_rgba(239,16,27,0.45)]"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {selected && <ProductModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/** Mobilde hızlı taranan yatay ürün kartı */
function QrItem({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-stretch gap-4 rounded-[22px] border border-black/[0.06] bg-white p-3 text-left transition active:scale-[0.99] sm:hover:border-[#ef101b]/40 sm:hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-[108px] w-[108px] shrink-0 overflow-hidden rounded-[16px]">
        <ProductImage item={item} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <Badges item={item} compact className="mb-1.5" />
        <h3 lang={PRODUCT_NAME_LANG} className="font-display text-[21px] font-black uppercase leading-[1.05] tracking-[-0.03em] text-[#111]">{item.name}</h3>
        {item.description && <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-5 text-black/50">{item.description}</p>}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-display text-2xl font-black leading-none tracking-[-0.03em] text-[#ef101b]">{formatPrice(item.price)}</span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-[#ef101b]">
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
