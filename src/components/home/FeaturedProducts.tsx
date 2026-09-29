"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { MenuCategoryWithItems, MenuItem } from "@/lib/services/menu";
import { Badges, ProductImage, ProductModal } from "@/components/menu/parts";
import { OrderButton } from "@/components/home/OrderProvider";
import { cn, formatPrice, PRODUCT_NAME_LANG } from "@/lib/utils";

/** Ana sayfa "Öne Çıkanlar": kategori sekmeleri + yatay kaydırılan ürün kartları */
export default function FeaturedProducts({ categories }: { categories: MenuCategoryWithItems[] }) {
  const [active, setActive] = useState(categories[0]?.slug);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const items = categories.find((c) => c.slug === active)?.items ?? [];
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setActive(c.slug);
                trackRef.current?.scrollTo({ left: 0 });
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition",
                active === c.slug ? "bg-[#ef101b] text-white shadow-[0_8px_22px_rgba(239,16,27,0.25)]" : "bg-white text-[#111] hover:bg-[#ecebe7]",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <ArrowButton label="Geri" onClick={() => scroll(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </ArrowButton>
          <ArrowButton label="İleri" onClick={() => scroll(1)}>
            <ChevronRight className="h-5 w-5" />
          </ArrowButton>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
      >
        {items.map((item) => (
          <li key={item.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]">
            <article className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-[#111] text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition hover:-translate-y-1">
              <button type="button" onClick={() => setSelected(item)} className="relative block aspect-[4/3] w-full overflow-hidden text-left" aria-label={`${item.name} detayı`}>
                <ProductImage item={item} className="transition-transform duration-500 group-hover:scale-105" />
                <Badges item={item} className="absolute left-3 top-3" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111] shadow transition group-hover:bg-[#ef101b] group-hover:text-white">
                  <Plus className="h-4 w-4" />
                </span>
              </button>
              <div className="flex flex-1 flex-col p-4">
                <h3 lang={PRODUCT_NAME_LANG} className="font-display text-xl font-black uppercase leading-none tracking-[-0.02em]">{item.name}</h3>
                {item.description && <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-white/55">{item.description}</p>}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="font-display text-2xl font-black tracking-[-0.03em]">{formatPrice(item.price)}</span>
                  <OrderButton className="rounded-[10px] bg-[#ef101b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#ff1825]">
                    Sipariş Ver
                  </OrderButton>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-bold text-[#ef101b] hover:underline">
          Tüm menüyü gör <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {selected && <ProductModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111] transition hover:border-[#ef101b] hover:bg-[#ef101b] hover:text-white"
    >
      {children}
    </button>
  );
}
