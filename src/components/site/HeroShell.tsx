import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import { cn } from "@/lib/utils";

/**
 * Header'ı içine gömen hero kabuğu (cv.redbunder.com ile aynı konsept):
 * siyah zemin + bg.png + soldan karartma + kırmızı ambiyans ışıkları.
 *   size="full"    → ana sayfa (tam ekran)
 *   size="compact" → iç sayfa başlıkları
 */
export default function HeroShell({
  children,
  size = "full",
  image = "/bg.png",
}: {
  children: ReactNode;
  size?: "full" | "compact";
  image?: string;
}) {
  const full = size === "full";

  return (
    // overflow-hidden sadece dekor katmanlarında: mobil menü paneli hero'nun dışına taşabilsin
    <section className={cn("relative bg-black", full && "min-h-[100svh]")}>
      <Header />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Arka plan görseli */}
        <div
          className="absolute inset-x-0 bottom-0 top-[86px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${image}')` }}
        />

        {/* Sol karartma – burger solda görünür kalır, yazı alanı koyulaşır */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 top-[86px]",
            full
              ? "bg-[linear-gradient(90deg,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.92)_30%,rgba(0,0,0,0.68)_58%,rgba(0,0,0,0.50)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.82)_45%,rgba(0,0,0,0.55)_100%)]",
          )}
        />

        {/* Alt karartma */}
        <div className="absolute inset-x-0 bottom-0 h-[280px] bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* Kırmızı ambiyans ışıkları */}
        <div className="absolute -left-[250px] top-[250px] h-[600px] w-[600px] rounded-full bg-[#e50914]/10 blur-[130px]" />
        <div className="absolute left-[32%] top-[170px] h-[420px] w-[420px] rounded-full bg-[#e50914]/10 blur-[160px]" />
      </div>

      <div className="relative z-20">{children}</div>
    </section>
  );
}

/** Kırmızı çizgili küçük üst etiket */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-[3px] w-10 bg-[#f3131e]" />
      <span className="text-[11px] font-black uppercase tracking-[0.30em] text-[#ff343d] sm:text-xs">{children}</span>
    </div>
  );
}
