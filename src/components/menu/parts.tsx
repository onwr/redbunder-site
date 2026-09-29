"use client";

import { useEffect } from "react";
import { Flame, Sparkles, Star, UtensilsCrossed, X } from "lucide-react";
import type { MenuItem } from "@/lib/services/menu";
import { cn, formatPrice, PRODUCT_NAME_LANG } from "@/lib/utils";

/** Menü sayfası (/menu) ve QR menünün (/menu/[sube]) ortak parçaları */

/** compact: açık zemin üzerinde küçük etiketler (QR menü kartı) */
export function Badges({ item, className, compact }: { item: MenuItem; className?: string; compact?: boolean }) {
  if (!item.isNew && !item.isPopular && !item.isSpicy) return null;
  const base = cn("inline-flex items-center gap-1 rounded-full font-black uppercase", compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]");
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {item.isPopular && (
        <span className={cn(base, "bg-[#ffba08] text-[#111]")}>
          <Star className="h-3 w-3" fill="currentColor" /> Popüler
        </span>
      )}
      {item.isNew && (
        <span className={cn(base, compact ? "bg-[#f5f4f1] text-[#111]" : "bg-white text-[#111]")}>
          <Sparkles className="h-3 w-3 text-[#ef101b]" /> Yeni
        </span>
      )}
      {item.isSpicy && (
        <span className={cn(base, "bg-[#ef101b] text-white")}>
          <Flame className="h-3 w-3" /> Acı
        </span>
      )}
    </div>
  );
}

/** Görsel yoksa marka tonlarında yer tutucu */
export function ProductImage({ item, className }: { item: MenuItem; className?: string }) {
  if (item.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.imageUrl} alt={item.name} loading="lazy" className={cn("h-full w-full object-cover", className)} />
    );
  }
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111]", className)}>
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e50914]/25 blur-3xl" />
      <span className="absolute -bottom-6 -right-2 font-display text-[120px] font-black uppercase leading-none text-white/[0.04]">
        {item.name.charAt(0)}
      </span>
      <UtensilsCrossed className="relative h-12 w-12 text-[#ef101b]/80" strokeWidth={1.8} />
    </div>
  );
}

export function ProductModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  // Esc ile kapat + arka plan kaydırmasını kilitle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white shadow-[0_35px_100px_rgba(0,0,0,0.5)] sm:rounded-[28px] md:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111] shadow transition hover:bg-[#ef101b] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-square md:aspect-auto md:min-h-[420px]">
          <ProductImage item={item} />
          <Badges item={item} className="absolute left-4 top-4" />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <h3 lang={PRODUCT_NAME_LANG} className="pr-10 font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#111]">{item.name}</h3>
          {item.description && <p className="mt-4 text-[15px] font-medium leading-7 text-black/60">{item.description}</p>}

          {(item.calories || item.allergens.length > 0) && (
            <dl className="mt-6 space-y-3 border-t border-black/[0.06] pt-5 text-sm">
              {item.calories ? (
                <div className="flex justify-between">
                  <dt className="font-semibold text-black/45">Enerji</dt>
                  <dd className="font-bold text-[#111]">{item.calories} kcal</dd>
                </div>
              ) : null}
              {item.allergens.length > 0 && (
                <div>
                  <dt className="mb-2 font-semibold text-black/45">Alerjenler</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {item.allergens.map((a) => (
                      <span key={a} className="rounded-full bg-[#f5f4f1] px-3 py-1 text-xs font-bold capitalize text-[#111]">{a}</span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-auto flex items-end justify-between pt-8">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-black/35">Fiyat</span>
            <span className="font-display text-5xl font-black leading-none tracking-[-0.04em] text-[#ef101b]">{formatPrice(item.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
