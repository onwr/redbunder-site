import type { Metadata } from "next";
import { connection } from "next/server";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { getActiveBranches } from "@/lib/services/menu";
import { SITE } from "@/lib/constants";
import PageHero from "@/components/site/PageHero";
import BranchFinder from "@/components/site/BranchFinder";

export const metadata: Metadata = {
  title: "Şubeler",
  description: "Red Bunder şubeleri: adresler, çalışma saatleri, telefonlar ve yol tarifi.",
};

export default async function BranchesPage() {
  await connection();
  const branches = await getActiveBranches();
  const districtCount = new Set(branches.map((b) => b.district).filter(Boolean)).size;

  return (
    <>
      <PageHero eyebrow="Şubelerimiz" title="Şubeni" highlight="Bul" image="/subelerbg.png">
        {branches.length} şube{districtCount > 1 ? `, ${districtCount} ilçe` : ""}. Sana en yakın Red Bunder&apos;ı bul, menüsüne göz at.
      </PageHero>

      <section className="bg-[#f5f4f1] px-5 pb-20 pt-10 lg:px-8 lg:pt-14 xl:px-10">
        <div className="mx-auto max-w-[1500px]">
          {branches.length > 0 ? (
            <BranchFinder
              branches={branches.map((b) => ({
                id: b.id,
                slug: b.slug,
                name: b.name,
                district: b.district,
                address: b.address,
                phone: b.phone,
                mapUrl: b.mapUrl,
                openingHours: b.openingHours,
                imageUrl: b.imageUrl,
              }))}
            />
          ) : (
            <p className="py-20 text-center font-display text-2xl font-black uppercase text-black/40">Şubelerimiz yakında burada.</p>
          )}
        </div>
      </section>

      {/* Kariyer bandı */}
      <section className="bg-white px-5 py-16 lg:px-8 xl:px-10">
        <div className="relative mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-[#111] p-8 sm:p-10 md:flex-row md:items-center">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#e50914]/25 blur-[90px]" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[3px] w-8 bg-[#ef101b]" />
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#ff343d]">Kariyer</span>
            </div>
            <h2 className="font-display text-4xl font-black uppercase leading-none tracking-[-0.05em] text-white sm:text-5xl">
              Şubende <span className="text-[#f10e19]">çalışmak</span> ister misin?
            </h2>
            <p className="mt-3 max-w-[520px] text-sm font-medium leading-6 text-white/60">
              Sana en yakın Red Bunder şubesinde, genç ve dinamik ekibimize katıl.
            </p>
          </div>
          <a
            href={SITE.careerUrl}
            className="group relative inline-flex shrink-0 items-center gap-2 rounded-[14px] bg-[#ef101b] px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.35)] transition hover:-translate-y-[2px] hover:bg-[#ff1825]"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            Hemen Başvur
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </>
  );
}
