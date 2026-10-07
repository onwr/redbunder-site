import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, UtensilsCrossed } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

/** Tüm bulunamayan adresler (site + panel). (site) layout'u dışında olduğundan Footer burada eklenir */
export default function NotFound() {
  return (
    <>
      <main className="flex-1">
        <PageHero eyebrow="Hata 404" title="Bu sayfa" highlight="Yok">
          Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Ama burgerler hâlâ yerinde.
        </PageHero>

        <section className="bg-[#f5f4f1] px-5 py-16 lg:px-8 xl:px-10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#ef101b] px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.25)] transition hover:-translate-y-[2px] hover:bg-[#ff1825]"
            >
              Ana Sayfaya Dön
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#111] px-6 py-4 font-display text-lg font-bold uppercase text-white transition hover:bg-black"
            >
              <UtensilsCrossed className="h-5 w-5" /> Menü
            </Link>
            <Link
              href="/subeler"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-black/10 bg-white px-6 py-4 font-display text-lg font-bold uppercase text-[#111] transition hover:border-[#ef101b] hover:text-[#ef101b]"
            >
              <MapPin className="h-5 w-5" /> Şubeler
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
