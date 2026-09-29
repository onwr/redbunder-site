import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";
import {
  ArrowDown,
  BadgeCheck,
  Check,
  ChefHat,
  ChevronDown,
  GraduationCap,
  Handshake,
  Mail,
  Megaphone,
  Phone,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/services/settings";
import PageHero from "@/components/site/PageHero";
import FranchiseForm from "@/components/site/FranchiseForm";

export const metadata: Metadata = {
  title: "Franchise",
  description: "Red Bunder franchise fırsatı: başvuru süreci, aradığımız iş ortağı ve başvuru formu.",
};

/**
 * Franchise sayfası. Başvurular Admin > Mesajlar'a "Franchise" konusuyla düşer.
 * TODO(içerik): Destek kapsamı, süreç ve SSS cevaplarını franchise modelinize göre güncelleyin.
 * Yatırım tutarı / kâr oranı gibi rakamlar bilerek yazılmadı.
 */
export default async function FranchisePage() {
  await connection();
  const [branchCount, productCount, settings] = await Promise.all([
    prisma.branch.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
    getSettings(),
  ]);

  return (
    <>
      <PageHero eyebrow="Franchise" title="Lezzeti Birlikte" highlight="Büyütelim">
        Red Bunder ailesine iş ortağı olarak katıl, Ankara&apos;nın burger markasını kendi şehrine taşı.
      </PageHero>

      {/* =========================================================
          GİRİŞ + RAKAMLAR
      ========================================================== */}
      <section className="overflow-hidden bg-[#f5f4f1] px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Neden Red Bunder?</Eyebrow>
            <h2 className="font-display text-[clamp(2.6rem,4.5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#111]">
              Güçlü bir marka, <span className="text-[#ef101b]">hazır bir sistem</span>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] font-medium leading-8 text-black/60">
              Red Bunder&apos;ın menüsü, marka kimliği ve işletme deneyimi ile kendi şubeni aç. Doğru lokasyon ve doğru iş
              ortağıyla, aynı lezzeti yeni şehirlere birlikte taşıyalım.
            </p>
            <a
              href="#basvuru"
              className="group mt-8 inline-flex items-center gap-2 rounded-[14px] bg-[#ef101b] px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.3)] transition hover:-translate-y-[2px] hover:bg-[#ff1825]"
            >
              <Handshake className="h-5 w-5" /> Hemen Başvur
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard value={`${branchCount}`} label="Aktif şube" dark />
            <StatCard value={`${productCount}+`} label="Menüde ürün" />
            <StatCard value="1" label="Aynı lezzet, her şubede" />
            <StatCard value="♛" label="Ankara'nın burger markası" dark />
          </div>
        </div>
      </section>

      {/* =========================================================
          SAĞLADIKLARIMIZ
      ========================================================== */}
      <section className="bg-white px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-11 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>İş ortaklarımıza</Eyebrow>
              <h2 className="font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111] sm:text-5xl">
                Neler <span className="text-[#ef101b]">Sağlıyoruz?</span>
              </h2>
            </div>
            <p className="max-w-[470px] text-sm font-medium leading-6 text-black/50">
              Açılıştan sonra da yanındayız. Destek kapsamının detayları ön görüşmede paylaşılır.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Feature icon={<BadgeCheck />} n="01" title="Marka Kimliği" text="Logo, iç mekan konsepti ve tüm görsel kimlik standartları." />
            <Feature icon={<UtensilsCrossed />} n="02" title="Denenmiş Menü" text="Misafirlerin sevdiği reçeteler ve standart hazırlık süreçleri." />
            <Feature icon={<GraduationCap />} n="03" title="Eğitim" text="Açılış öncesi ekip ve operasyon eğitimi." />
            <Feature icon={<ChefHat />} n="04" title="Operasyon Desteği" text="Mutfak düzeni, kalite kontrol ve işletme rehberliği." />
            <Feature icon={<Megaphone />} n="05" title="Pazarlama" text="Sosyal medya, kampanya ve açılış iletişiminde destek." />
            <Feature icon={<Truck />} n="06" title="Tedarik" text="Ürün standardı için belirlenmiş tedarik düzeni." />
          </div>
        </div>
      </section>

      {/* =========================================================
          SÜREÇ
      ========================================================== */}
      <section className="relative overflow-hidden bg-black px-5 py-20 text-white lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute -left-40 top-10 h-[380px] w-[600px] rounded-full bg-[#e50914]/15 blur-[130px]" />
        <div className="relative mx-auto max-w-[1400px]">
          <Eyebrow>Adım adım</Eyebrow>
          <h2 className="mb-12 font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
            Başvurudan <span className="text-[#f10e19]">Açılışa</span>
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              ["Başvuru", "Formu doldur, bilgilerini bize ilet."],
              ["Ön görüşme", "Seni ve hedeflerini tanıyalım."],
              ["Lokasyon", "Önerilen lokasyonu birlikte değerlendirelim."],
              ["Sözleşme", "Koşulları netleştirip anlaşmayı imzalayalım."],
              ["Kurulum & eğitim", "Şube kurulumu ve ekip eğitimi."],
              ["Açılış", "Kapılar açılıyor, ilk burgerler ateşte!"],
            ].map(([title, text], i) => (
              <li key={title} className="relative rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5">
                <span className="font-display text-5xl font-black leading-none text-[#ef101b]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-xl font-black uppercase tracking-[-0.02em]">{title}</h3>
                <p className="mt-1.5 text-sm font-medium leading-6 text-white/55">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =========================================================
          ARADIĞIMIZ İŞ ORTAĞI + SSS
      ========================================================== */}
      <section className="bg-[#f5f4f1] px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Kimi arıyoruz?</Eyebrow>
            <h2 className="font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111] sm:text-5xl">
              Aradığımız <span className="text-[#ef101b]">İş Ortağı</span>
            </h2>
            <ul className="mt-8 space-y-3">
              {[
                "Girişimci ruhlu ve işin başında olmayı seven",
                "Misafir memnuniyetini ön planda tutan",
                "Marka standartlarına özen gösteren",
                "Uygun bir lokasyona sahip ya da lokasyon arayışında olan",
                "Yatırım ve işletme sürecine kaynak ayırabilecek",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-[16px] border border-black/[0.06] bg-white p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ef101b] text-white">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="pt-0.5 text-[15px] font-semibold text-[#111]">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-black/45">Sektör deneyimi avantajdır ama şart değildir.</p>
          </div>

          <div>
            <Eyebrow>Merak edilenler</Eyebrow>
            <h2 className="font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111] sm:text-5xl">
              Sık Sorulan <span className="text-[#ef101b]">Sorular</span>
            </h2>
            <div className="mt-8 space-y-3">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group rounded-[16px] border border-black/[0.06] bg-white p-5 open:shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-black uppercase tracking-[-0.02em] text-[#111] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#ef101b] transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-6 text-black/60">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BAŞVURU
      ========================================================== */}
      <section id="basvuru" className="scroll-mt-4 bg-white px-5 py-20 lg:px-8 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Franchise başvurusu</Eyebrow>
            <h2 className="font-display text-[clamp(2.6rem,4.5vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#111]">
              Red ailesine <span className="text-[#ef101b]">katıl</span>
            </h2>
            <p className="mt-5 max-w-md text-[16px] font-medium leading-7 text-black/60">
              Formu doldur, franchise ekibimiz başvurunu değerlendirip seninle iletişime geçsin. Başvuru ücretsizdir ve herhangi bir
              yükümlülük doğurmaz.
            </p>
            <p className="mt-6 -rotate-[3deg] font-script text-3xl text-[#111]">
              Lezzeti birlikte <span className="text-[#ef101b]">büyütelim.</span>
            </p>

            {(settings.phone || settings.email) && (
              <div className="mt-10 space-y-3 rounded-[20px] bg-[#111] p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">Doğrudan ulaş</p>
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 font-display text-xl font-bold hover:text-[#ff343d]">
                    <Phone className="h-5 w-5 text-[#ef101b]" /> {settings.phone}
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}?subject=${encodeURIComponent("Franchise")}`} className="flex items-center gap-3 font-display text-xl font-bold hover:text-[#ff343d]">
                    <Mail className="h-5 w-5 text-[#ef101b]" /> {settings.email}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-7 xl:p-9">
            <FranchiseForm />
          </div>
        </div>
      </section>
    </>
  );
}

const FAQ: [string, string][] = [
  ["Yatırım tutarı ne kadar?", "Yatırım tutarı lokasyonun büyüklüğüne ve şube tipine göre değişir. Detaylar ön görüşmede paylaşılır."],
  ["Sektör deneyimi şart mı?", "Hayır. Deneyim avantaj sağlar ancak eğitim ve operasyon desteğiyle sektöre yeni başlayanlar da değerlendirilir."],
  ["Hangi şehirlerde franchise veriyorsunuz?", "Öncelikli olarak Ankara ve çevresi değerlendirilir; diğer şehirlerden gelen başvurular da incelenir."],
  ["Başvurudan sonra süreç nasıl işliyor?", "Başvurunu inceledikten sonra seninle iletişime geçer, ön görüşme planlarız."],
];

/* ================================ Parçalar ================================ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-[3px] w-8 bg-[#ef101b]" />
      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#ef101b]">{children}</span>
    </div>
  );
}

function StatCard({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className={dark ? "rounded-[24px] bg-[#111] p-6 text-white" : "rounded-[24px] border border-black/[0.06] bg-white p-6"}>
      <p className={dark ? "font-display text-6xl font-black leading-none text-[#f10e19]" : "font-display text-6xl font-black leading-none text-[#111]"}>
        {value}
      </p>
      <p className={dark ? "mt-3 text-sm font-semibold text-white/60" : "mt-3 text-sm font-semibold text-black/50"}>{label}</p>
    </div>
  );
}

function Feature({ icon, n, title, text }: { icon: ReactNode; n: string; title: string; text: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[25px] border border-black/[0.06] bg-[#f7f7f6] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_55px_rgba(0,0,0,0.08)]">
      <span className="absolute right-5 top-4 font-display text-5xl font-black text-black/[0.04]">{n}</span>
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#ef101b]/10 text-[#ef101b] transition-all duration-300 group-hover:bg-[#ef101b] group-hover:text-white [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </div>
      <h3 className="font-display text-[24px] font-black uppercase tracking-[-0.03em] text-[#111]">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-black/45">{text}</p>
    </div>
  );
}
