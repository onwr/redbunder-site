"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderPlatform = { name: string; url: string; className: string };

const OrderContext = createContext<() => void>(() => {});

/**
 * "Siparişini nereden vermek istersin?" penceresi. Sayfadaki her OrderButton bunu açar.
 * Platform linkleri Admin > Site Ayarları > Sipariş Platformları'ndan gelir.
 */
export function OrderProvider({ platforms, children }: { platforms: OrderPlatform[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <OrderContext.Provider value={() => setOpen(true)}>
      {children}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sipariş platformu seç"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-t-[28px] bg-white p-6 shadow-[0_35px_100px_rgba(0,0,0,0.5)] sm:rounded-[28px] sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f4f1] text-[#111] transition hover:bg-[#ef101b] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#ef101b] text-white shadow-[0_12px_30px_rgba(239,16,27,0.3)]">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="mt-5 pr-10 font-display text-3xl font-black uppercase leading-none tracking-[-0.04em] text-[#111]">
              Siparişini nereden <span className="text-[#ef101b]">vermek istersin?</span>
            </h2>
            <p className="mt-2 text-sm font-medium text-black/50">Red Bunder lezzeti seni bekliyor!</p>

            {platforms.length > 0 ? (
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "flex h-16 items-center justify-between gap-2 rounded-[14px] border border-black/[0.08] px-4 font-display text-lg font-black tracking-[-0.02em] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                        p.className,
                      )}
                    >
                      {p.name}
                      <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-[14px] bg-[#f5f4f1] p-4 text-sm font-medium text-black/60">
                Online sipariş kanallarımız çok yakında burada. Şimdilik şubelerimizde seni bekliyoruz!
              </p>
            )}

            <Link
              href="/subeler"
              onClick={() => setOpen(false)}
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#111] text-sm font-bold text-white transition hover:bg-[#ef101b]"
            >
              <MapPin className="h-4 w-4" /> Şubeye gelmek istiyorum
            </Link>
          </div>
        </div>
      )}
    </OrderContext.Provider>
  );
}

/** Sipariş penceresini açan buton */
export function OrderButton({ className, children }: { className?: string; children: ReactNode }) {
  const open = useContext(OrderContext);
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
