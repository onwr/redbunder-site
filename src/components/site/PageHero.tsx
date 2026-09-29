import type { ReactNode } from "react";
import HeroShell, { Eyebrow } from "@/components/site/HeroShell";

/** İç sayfaların başlık alanı – ana sayfa hero'sunun kompakt hali */
export default function PageHero({
  title,
  highlight,
  eyebrow,
  image,
  children,
}: {
  title: string;
  highlight?: string;
  eyebrow?: string;
  /** Arka plan görseli (varsayılan /bg.png) */
  image?: string;
  children?: ReactNode;
}) {
  return (
    <HeroShell size="compact" image={image}>
      <div className="mx-auto max-w-[1580px] px-5 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-20 xl:px-10">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.85] tracking-[-0.06em] text-white">
          {title} {highlight && <span className="text-[#f10e19]">{highlight}</span>}
        </h1>
        {children && (
          <div className="mt-6 max-w-[640px] text-[clamp(1.05rem,1.4vw,1.4rem)] font-medium italic leading-[1.3] text-white/85">
            {children}
          </div>
        )}
      </div>
    </HeroShell>
  );
}
