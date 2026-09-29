import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, Beef, Flame, MapPin, Store, UtensilsCrossed } from "lucide-react";
import HeroShell, { Eyebrow } from "@/components/site/HeroShell";
import { getActiveBranches, getMenu } from "@/lib/services/menu";
import { getSettings } from "@/lib/services/settings";
import { prisma } from "@/lib/prisma";
import { formatPrice, instagramHandle, PRODUCT_NAME_LANG } from "@/lib/utils";
import { ORDER_PLATFORMS, SITE } from "@/lib/constants";
import { OrderProvider } from "@/components/home/OrderProvider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import {
  BranchesSection,
  CampaignBanner,
  InstagramSection,
  JoinBand,
  PlatformBar,
  ReviewsSection,
  SectionTitle,
  WhyUs,
} from "@/components/home/sections";

export default async function HomePage() {
  await connection(); // veritabanından okuduğu için her istekte render
  const [menu, branches, settings, reviews] = await Promise.all([
    getMenu(),
    getActiveBranches(),
    getSettings(),
    prisma.review.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      take: 10,
      select: { id: true, name: true, rating: true, text: true, source: true },
    }),
  ]);

  // Sadece linki girilmiş platformlar
  const platforms = ORDER_PLATFORMS.flatMap((p) => {
    const url = settings[p.key];
    return url ? [{ name: p.name, url, className: p.className }] : [];
  });

  const items = menu.flatMap((c) => c.items);
  const productImages = items.flatMap((i) => (i.imageUrl ? [i.imageUrl] : [])).slice(0, 6);
  const popular = [...items.filter((i) => i.isPopular), ...items.filter((i) => !i.isPopular)].slice(0, 3);

  return (
    <>
      {/* =========================================================
          HERO (header içine gömülü)
      ========================================================== */}
      <HeroShell>
        <div className="mx-auto grid min-h-[calc(100svh-86px)] max-w-[1580px] grid-cols-1 items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_0.72fr] lg:px-8 xl:grid-cols-[1.1fr_0.7fr] xl:gap-14 xl:px-10">
          {/* ---------------- SOL ALAN ---------------- */}
          <div className="relative flex flex-col justify-center lg:py-8">
            <Eyebrow>Ankara&apos;nın Burger Markası</Eyebrow>

            {/* BAŞLIK */}
            <div className="relative w-fit">
              <div className="absolute -right-6 -top-10 hidden rotate-[38deg] text-[52px] font-black text-[#ffba08] xl:block">♛</div>

              <h1 className="font-display uppercase leading-[0.82] tracking-[-0.065em] text-white">
                <span className="block text-[clamp(4rem,6.2vw,7.8rem)] font-black">RED BUNDER</span>
                <span className="mt-4 block text-[clamp(3.7rem,5.7vw,7rem)] font-black text-[#f10e19]">BURGERİN</span>
                <span className="mt-1 block text-[clamp(3.7rem,5.7vw,7rem)] font-black text-[#fff8e8]">KRALI</span>
              </h1>
            </div>

            {/* AÇIKLAMA */}
            <p className="mt-7 max-w-[680px] text-[clamp(1.2rem,1.75vw,1.85rem)] font-medium italic leading-[1.2] tracking-[-0.02em] text-white/90">
              Günlük taze et, çıtır patates ve bol lezzet.{" "}
              <br className="hidden sm:block" />
              Ankara&apos;nın burgeri seni bekliyor.
            </p>

            {/* BUTONLAR */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-[14px] bg-[#ef101b] px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.35)] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#ff1825]"
              >
                <UtensilsCrossed className="h-5 w-5" />
                Menüyü Keşfet
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/subeler"
                className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/[0.04] px-6 py-4 font-display text-lg font-bold uppercase text-white backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-white/50"
              >
                <MapPin className="h-5 w-5 text-[#f3131e]" />
                Şubeni Bul
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-10 grid max-w-[750px] grid-cols-3 items-center gap-3 sm:flex sm:flex-wrap sm:gap-0 sm:gap-y-6">
              <Stat icon={<Store className="h-9 w-9" strokeWidth={2.4} />} className="sm:min-w-[150px] sm:pr-5">
                <div className="text-[22px] font-black leading-none text-white">{branches.length}+</div>
                <div className="mt-1 text-sm font-semibold text-white/70">Şube</div>
              </Stat>

              <div className="hidden h-12 w-px bg-white/15 sm:block" />

              <Stat icon={<Beef className="h-9 w-9" strokeWidth={2.4} />} className="sm:min-w-[210px] sm:px-6">
                <div className="text-[15px] font-black leading-tight text-white">Günlük</div>
                <div className="text-sm font-semibold leading-tight text-white/70">Taze Et</div>
              </Stat>

              <div className="hidden h-12 w-px bg-white/15 xl:block" />

              <Stat icon={<Flame className="h-9 w-9" strokeWidth={2.4} />} className="sm:min-w-[210px] xl:pl-6">
                <div className="text-[15px] font-black leading-tight text-white">Ateşte</div>
                <div className="text-sm font-semibold leading-tight text-white/70">Pişen Lezzet</div>
              </Stat>
            </div>

            {/* ALT SLOGAN */}
            <div className="mt-10 hidden max-w-[710px] justify-end md:flex">
              <div className="relative mr-7 -rotate-[5deg] text-right">
                <div className="text-[clamp(1.2rem,1.6vw,1.75rem)] font-black italic uppercase leading-[1.05] text-white">
                  İyi burger
                  <br />
                  iyi anlar
                  <br />
                  demektir.
                </div>
                <div className="ml-auto mt-3 h-[5px] w-[105px] -rotate-[5deg] bg-[#f3131e]" />
                <div className="ml-auto mt-1 h-[3px] w-[70px] -rotate-[2deg] bg-[#f3131e]" />
              </div>
            </div>
          </div>

          {/* ---------------- SAĞ KART ---------------- */}
          <div className="relative z-30 w-full lg:justify-self-end">
            <div className="pointer-events-none absolute inset-8 rounded-[40px] bg-white/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-white p-5 shadow-[0_35px_100px_rgba(0,0,0,0.50)] sm:p-7 xl:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[14px] bg-[#ef101b] text-white shadow-[0_12px_30px_rgba(239,16,27,0.25)]">
                  <Flame className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display text-[clamp(2rem,2.6vw,3rem)] font-black uppercase leading-none tracking-[-0.05em] text-[#111]">
                    En Çok <span className="text-[#ef101b]">Sevilenler</span>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#666] sm:text-base">Misafirlerimizin favori lezzetleri.</p>
                </div>
              </div>

              <ul className="space-y-3">
                {popular.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href="/menu"
                      className="group flex items-center gap-4 rounded-[18px] border border-black/[0.06] bg-[#f7f7f6] p-3 transition-all duration-300 hover:border-[#ef101b] hover:bg-white hover:shadow-[0_14px_35px_rgba(0,0,0,0.08)]"
                    >
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={p.name} className="h-16 w-16 shrink-0 rounded-[14px] object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-[#ef101b]/10 font-display text-2xl font-black text-[#ef101b]">
                          0{i + 1}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 lang={PRODUCT_NAME_LANG} className="truncate font-display text-xl font-black uppercase leading-none tracking-[-0.03em] text-[#111]">{p.name}</h3>
                        {p.description && <p className="mt-1 line-clamp-1 text-xs font-medium text-black/45">{p.description}</p>}
                      </div>
                      <span className="shrink-0 font-display text-xl font-black text-[#ef101b]">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
                {popular.length === 0 && <li className="py-6 text-center text-sm text-black/45">Menü yakında burada.</li>}
              </ul>

              <Link
                href="/menu"
                className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-[14px] bg-[#ef101b] font-display text-lg font-bold uppercase text-white transition hover:bg-[#ff1825]"
              >
                Tüm Menüyü Gör
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </HeroShell>

      {/* =========================================================
          ANA SAYFA BÖLÜMLERİ
          Veriler: menü, şubeler, Site Ayarları (platform linkleri, kampanya,
          Instagram) ve Admin > Yorumlar. Verisi olmayan bölüm gizlenir.
      ========================================================== */}
      <OrderProvider platforms={platforms}>
        <PlatformBar platforms={platforms} />

        {menu.length > 0 && (
          <section className="bg-[#f5f4f1] px-5 py-20 lg:px-8 xl:px-10">
            <div className="mx-auto max-w-[1500px]">
              <SectionTitle eyebrow="Menüden seçtiklerimiz" title="Öne" highlight="Çıkanlar" />
              <FeaturedProducts categories={menu} />
            </div>
          </section>
        )}

        <WhyUs branchCount={branches.length} />

        <CampaignBanner
          title={settings.campaign_title}
          subtitle={settings.campaign_subtitle}
          text={settings.campaign_text}
          url={settings.campaign_url}
        />

        <BranchesSection branches={branches} />

        <ReviewsSection reviews={reviews} />

        <InstagramSection url={settings.instagram} handle={instagramHandle(settings.instagram)} images={productImages} />

        <JoinBand branchCount={branches.length} careerUrl={SITE.careerUrl} />
      </OrderProvider>
    </>
  );
}


function Stat({ icon, className, children }: { icon: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 ${className ?? ""}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#f3131e] sm:h-12 sm:w-12 [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-9 sm:[&>svg]:w-9">{icon}</div>
      <div>{children}</div>
    </div>
  );
}
