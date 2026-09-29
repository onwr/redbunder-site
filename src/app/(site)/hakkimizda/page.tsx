import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { ArrowRight, Beef, BriefcaseBusiness, Flame, HeartHandshake, Timer, UtensilsCrossed } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Red Bunder: Ankara'nın burger markası. Hikayemiz, değerlerimiz ve ekibimiz.",
};

/**
 * Hakkımızda. Metinler genel marka anlatımıdır – TODO(içerik): kuruluş hikayesi,
 * yıl ve kurucu bilgisi gibi gerçek detaylarla güncelleyin.
 */
export default async function AboutPage() {
  await connection();
  const [branchCount, productCount] = await Promise.all([
    prisma.branch.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  return (
    <>
      <PageHero eyebrow="Hikayemiz" title="Biz" highlight="Kimiz?">
        Ankara&apos;nın sokaklarından doğan, ateşte pişen lezzetin peşindeki burger markası.
      </PageHero>

      {/* =========================================================
          HİKAYE
      ========================================================== */}
      <section className="overflow-hidden bg-[#f5f4f1] px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 xl:gap-20">
          <div>
            <SectionEyebrow>Red Bunder</SectionEyebrow>
            <h2 className="font-display text-[clamp(2.6rem,4.5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#111]">
              Ankara&apos;nın <span className="text-[#ef101b]">Burger</span> Markası
            </h2>
            <div className="mt-7 space-y-5 text-[17px] font-medium leading-8 text-black/60">
              <p>
                Red Bunder, iyi bir burgerin sadece bir yemek değil, bir an olduğuna inanan bir ekibin fikriyle doğdu. Amacımız
                basit: taze malzemeyi ateşle buluşturmak ve her ısırıkta aynı lezzeti sunmak.
              </p>
              <p>
                Ekmeğinden sosuna, köftesinden çıtır patatesine kadar her detayı özenle hazırlıyoruz. Bugün Ankara&apos;nın farklı
                noktalarındaki şubelerimizde aynı tutku ve aynı lezzetle misafirlerimizi ağırlıyoruz.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-[14px] bg-[#ef101b] px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.3)] transition hover:-translate-y-[2px] hover:bg-[#ff1825]"
              >
                <UtensilsCrossed className="h-5 w-5" /> Menüyü Keşfet
              </Link>
              <Link
                href="/subeler"
                className="inline-flex items-center gap-2 rounded-[14px] border border-black/15 bg-white px-6 py-4 font-display text-lg font-bold uppercase text-[#111] transition hover:-translate-y-[2px] hover:border-[#111]"
              >
                Şubelerimiz
              </Link>
            </div>
          </div>

          {/* Görsel */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[48px] bg-[#e50914]/10 blur-3xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-black shadow-[0_35px_90px_rgba(0,0,0,0.25)]">
              <div className="absolute inset-0 bg-cover bg-[position:20%_center]" style={{ backgroundImage: "url('/bg.png')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <p className="-rotate-[4deg] font-script text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-white">
                  Ateşte pişer,
                  <br />
                  <span className="text-[#ff343d]">kalpte kalır.</span>
                </p>
                <span className="text-[44px] leading-none text-[#ffba08]">♛</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RAKAMLAR
      ========================================================== */}
      <section className="relative overflow-hidden bg-black px-5 py-16 text-white lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e50914]/15 blur-[120px]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-10 sm:grid-cols-3">
          <Stat value={`${branchCount}+`} label="Şube" text="Ankara'nın dört bir yanında" />
          <Stat value={`${productCount}+`} label="Lezzet" text="Burgerden içeceğe, menümüzde" />
          <Stat value="1" label="Tutku" text="Her şubede aynı lezzet, aynı özen" />
        </div>
      </section>

      {/* =========================================================
          DEĞERLER
      ========================================================== */}
      <section className="bg-white px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-11 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionEyebrow>Neye İnanıyoruz</SectionEyebrow>
              <h2 className="font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111] sm:text-5xl">Değerlerimiz</h2>
            </div>
            <p className="max-w-[470px] text-sm font-medium leading-6 text-black/50">
              Lezzetin sırrı tarifte değil, her gün aynı özeni göstermekte. Bizi Red Bunder yapan dört şey:
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ValueCard icon={<Beef />} number="01" title="Taze Malzeme" text="Günlük hazırlanan köfteler ve özenle seçilmiş malzemeler." />
            <ValueCard icon={<Flame />} number="02" title="Ateşte Pişer" text="Her burger siparişle birlikte, ızgarada taze pişirilir." />
            <ValueCard icon={<Timer />} number="03" title="Hızlı Servis" text="Lezzetten ödün vermeden, sıcak sıcak ve hızlıca." />
            <ValueCard icon={<HeartHandshake />} number="04" title="Samimi Ekip" text="Genç, dinamik ve misafirini güler yüzle karşılayan bir ekip." />
          </div>
        </div>
      </section>

      {/* =========================================================
          SLOGAN
      ========================================================== */}
      <section className="relative overflow-hidden bg-[#ef101b] px-5 py-16 text-center text-white lg:px-8">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
        <p className="relative mx-auto max-w-3xl -rotate-[2deg] font-script text-[clamp(2.2rem,5vw,4rem)] leading-tight">
          &ldquo;İyi burger, iyi anlar demektir.&rdquo;
        </p>
        <p className="relative mt-4 text-xs font-black uppercase tracking-[0.3em] text-white/70">Red Bunder</p>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="bg-[#f5f4f1] px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-2">
          <CtaCard
            href="/menu"
            icon={<UtensilsCrossed />}
            eyebrow="Acıktın mı?"
            title={
              <>
                Menüye <span className="text-[#f10e19]">Göz At</span>
              </>
            }
            text="Burgerler, yan ürünler ve içecekler – hepsi tek sayfada."
          />
          <CtaCard
            href={SITE.careerUrl}
            icon={<BriefcaseBusiness />}
            eyebrow="Kariyer"
            title={
              <>
                Ailemize <span className="text-[#f10e19]">Katıl</span>
              </>
            }
            text="Red Bunder ekibinde yerini al, kariyerine lezzetli bir başlangıç yap."
            external
          />
        </div>
      </section>
    </>
  );
}

/* ================================ Parçalar ================================ */

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-[3px] w-8 bg-[#ef101b]" />
      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#ef101b]">{children}</span>
    </div>
  );
}

function Stat({ value, label, text }: { value: string; label: string; text: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-[clamp(3.5rem,6vw,5.5rem)] font-black leading-none tracking-[-0.05em] text-white">
        {value} <span className="text-[#f10e19]">{label}</span>
      </p>
      <p className="mt-3 text-sm font-medium text-white/55">{text}</p>
    </div>
  );
}

function ValueCard({ icon, number, title, text }: { icon: ReactNode; number: string; title: string; text: string }) {
  return (
    <div className="group relative min-h-[245px] overflow-hidden rounded-[25px] border border-black/[0.06] bg-[#f7f7f6] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_55px_rgba(0,0,0,0.08)]">
      <span className="absolute right-5 top-4 font-display text-5xl font-black text-black/[0.04]">{number}</span>
      <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#ef101b]/10 text-[#ef101b] transition-all duration-300 group-hover:bg-[#ef101b] group-hover:text-white [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </div>
      <h3 className="font-display text-[24px] font-black uppercase tracking-[-0.03em] text-[#111]">{title}</h3>
      <p className="mt-3 max-w-[290px] text-sm font-medium leading-6 text-black/45">{text}</p>
    </div>
  );
}

function CtaCard({
  href,
  icon,
  eyebrow,
  title,
  text,
  external,
}: {
  href: string;
  icon: ReactNode;
  eyebrow: string;
  title: ReactNode;
  text: string;
  external?: boolean;
}) {
  const className =
    "group relative flex flex-col overflow-hidden rounded-[28px] bg-[#111] p-8 text-white transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)] sm:p-10";
  const content = (
    <>
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[#e50914]/25 blur-[80px] transition group-hover:bg-[#e50914]/40" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#ef101b] shadow-[0_12px_30px_rgba(239,16,27,0.35)] [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </div>
      <p className="relative mt-8 text-xs font-black uppercase tracking-[0.25em] text-[#ff343d]">{eyebrow}</p>
      <h3 className="relative mt-2 font-display text-[clamp(2.4rem,4vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]">{title}</h3>
      <p className="relative mt-3 max-w-md text-sm font-medium leading-6 text-white/60">{text}</p>
      <span className="relative mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111] transition group-hover:translate-x-1 group-hover:bg-[#ef101b] group-hover:text-white">
        <ArrowRight className="h-5 w-5" />
      </span>
    </>
  );
  return external ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
