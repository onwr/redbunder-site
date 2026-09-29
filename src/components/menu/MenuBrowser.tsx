"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Badges, ProductImage, ProductModal } from "@/components/menu/parts";
import { useActiveSection } from "@/components/menu/useActiveSection";
import type { MenuCategoryWithItems, MenuItem } from "@/lib/services/menu";
import { cn, formatPrice, PRODUCT_NAME_LANG, centerInStrip } from "@/lib/utils";

/**
 * Ana sitenin menü gezgini (/menu):
 * arama, yapışkan kategori menüsü (masaüstü: sol panel, mobil: üst şerit), ürün kartları ve detay penceresi.
 * QR menü (/menu/[sube]) mobil öncelikli QrMenu'yü kullanır; ortak parçalar parts.tsx'te.
 */
export default function MenuBrowser({ categories }: { categories: MenuCategoryWithItems[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  // Arama: ürün adı, açıklama ve alerjenlerde (Türkçe küçük harf duyarlı)
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return categories;
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) =>
          [i.name, i.description ?? "", ...i.allergens].some((t) => t.toLocaleLowerCase("tr-TR").includes(q)),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, query]);

  // Kaydırdıkça aktif kategoriyi işaretle (mobil üst şerit ~140px)
  const active = useActiveSection(filtered.map((c) => c.slug), 170);

  // Mobil şeritte aktif çipi görünür tut
  useEffect(() => {
    centerInStrip(chipsRef.current, chipsRef.current?.querySelector(`[data-slug="${active}"]`));
  }, [active]);

  const total = categories.reduce((n, c) => n + c.items.length, 0);

  const searchBox = (
    <label className="relative block">
      <span className="sr-only">Menüde ara</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Menüde ara..."
        className="h-12 w-full rounded-[14px] border border-black/[0.08] bg-white pl-11 pr-4 text-sm font-medium text-[#111] outline-none transition placeholder:text-black/35 focus:border-[#ef101b] focus:ring-4 focus:ring-[#ef101b]/10"
      />
    </label>
  );

  return (
    <div className="lg:grid lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
      {/* ---------------- Masaüstü: sol panel ---------------- */}
      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4">
          {searchBox}
          <nav className="rounded-[24px] border border-black/[0.06] bg-white p-3">
            <p className="px-3 pb-2 pt-1 text-[11px] font-black uppercase tracking-[0.22em] text-black/35">Kategoriler</p>
            <ul className="space-y-1">
              {filtered.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`#kat-${c.slug}`}
                    className={cn(
                      "flex items-center justify-between rounded-[14px] px-4 py-3 font-display text-lg font-bold uppercase tracking-[-0.01em] transition",
                      active === c.slug ? "bg-[#ef101b] text-white shadow-[0_10px_28px_rgba(239,16,27,0.25)]" : "text-[#111] hover:bg-[#f5f4f1]",
                    )}
                  >
                    {c.name}
                    <span className={cn("text-xs font-semibold", active === c.slug ? "text-white/70" : "text-black/35")}>{c.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="px-2 text-xs font-medium text-black/40">{total} ürün · Fiyatlara KDV dahildir.</p>
        </div>
      </aside>

      {/* ---------------- Mobil: üst şerit ---------------- */}
      <div className="sticky top-0 z-30 -mx-5 mb-8 space-y-3 border-b border-black/[0.06] bg-[#f5f4f1]/95 px-5 py-3 backdrop-blur lg:hidden">
        {searchBox}
        <div ref={chipsRef} className="relative -mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          {filtered.map((c) => (
            <a
              key={c.slug}
              data-slug={c.slug}
              href={`#kat-${c.slug}`}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                active === c.slug ? "bg-[#ef101b] text-white" : "bg-white text-[#111]",
              )}
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      {/* ---------------- Ürünler ---------------- */}
      <div className="space-y-16">
        {filtered.map((c, ci) => (
          <section key={c.slug} id={`kat-${c.slug}`} className="scroll-mt-40 lg:scroll-mt-8">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[3px] w-8 bg-[#ef101b]" />
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#ef101b]">
                  {String(ci + 1).padStart(2, "0")} · {c.items.length} ürün
                </span>
              </div>
              <h2 className="font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111] sm:text-5xl">{c.name}</h2>
              {c.description && <p className="mt-2 max-w-[600px] text-sm font-medium leading-6 text-black/50">{c.description}</p>}
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {c.items.map((item) => (
                <li key={item.id}>
                  <ProductCard item={item} onOpen={() => setSelected(item)} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
            <p className="font-display text-2xl font-black uppercase text-[#111]">Sonuç bulunamadı</p>
            <p className="mt-2 text-sm text-black/50">&ldquo;{query}&rdquo; için ürün yok.</p>
            <button onClick={() => setQuery("")} className="mt-5 text-sm font-bold text-[#ef101b] hover:underline">
              Aramayı temizle
            </button>
          </div>
        )}
      </div>

      {selected && <ProductModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ================================ Parçalar ================================ */

function ProductCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ef101b]/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ProductImage item={item} className="transition-transform duration-500 group-hover:scale-105" />
        <Badges item={item} className="absolute left-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 lang={PRODUCT_NAME_LANG} className="font-display text-2xl font-black uppercase leading-none tracking-[-0.03em] text-[#111]">{item.name}</h3>
        {item.description && <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-black/50">{item.description}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <span className="font-display text-[28px] font-black leading-none tracking-[-0.03em] text-[#ef101b]">{formatPrice(item.price)}</span>
            {item.calories ? <p className="mt-1 text-xs font-semibold text-black/35">{item.calories} kcal</p> : null}
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all duration-300 group-hover:rotate-90 group-hover:bg-[#ef101b]">
            <Plus className="h-5 w-5" />
          </span>
        </div>
      </div>
    </button>
  );
}
