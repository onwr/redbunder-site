import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Megaphone, MapPin } from "lucide-react";
import { getActiveBranches } from "@/lib/services/menu";
import { getVisibleAnnouncements } from "@/lib/services/announcements";
import { cn } from "@/lib/utils";
import PageHero from "@/components/site/PageHero";

const dateFmt = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", year: "numeric" });

export const metadata: Metadata = {
  title: "Duyurular",
  description: "Red Bunder şubelerinden güncel duyurular: çalışma saatleri, açılışlar ve kampanyalar.",
};

/** ?sube=<slug> → o şubenin + tüm şubelere ait duyurular */
export default async function AnnouncementsPage({ searchParams }: PageProps<"/duyurular">) {
  await connection();
  const { sube } = await searchParams;
  const branches = await getActiveBranches();
  const selected = typeof sube === "string" ? branches.find((b) => b.slug === sube) : undefined;
  const announcements = await getVisibleAnnouncements(selected?.id);

  return (
    <>
      <PageHero eyebrow="Red Bunder'dan" title="Güncel" highlight="Duyurular">
        Şubelerimizden güncel haberler, çalışma saatleri ve duyurular.
      </PageHero>

      <section className="bg-[#f5f4f1] px-5 pb-20 pt-10 lg:px-8 lg:pt-14 xl:px-10">
        <div className="mx-auto max-w-[1100px]">
          {branches.length > 1 && (
            <nav aria-label="Şube filtresi" className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
              <Chip href="/duyurular" active={!selected}>Tüm şubeler</Chip>
              {branches.map((b) => (
                <Chip key={b.id} href={`/duyurular?sube=${b.slug}`} active={selected?.id === b.id}>{b.name}</Chip>
              ))}
            </nav>
          )}

          {announcements.length > 0 ? (
            <ul className="space-y-4">
              {announcements.map((a) => (
                <li key={a.id}>
                  <article className="rounded-[24px] border border-black/[0.06] bg-white p-6 sm:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ef101b]/10 px-3 py-1 uppercase tracking-[0.08em] text-[#ef101b]">
                        {a.branch ? <MapPin className="h-3 w-3" /> : <Megaphone className="h-3 w-3" />}
                        {a.branch?.name ?? "Tüm şubeler"}
                      </span>
                      <time dateTime={a.createdAt.toISOString()} className="text-black/40">{dateFmt.format(a.createdAt)}</time>
                    </div>
                    <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-[#111] sm:text-3xl">{a.title}</h2>
                    <p className="mt-3 whitespace-pre-line text-[15px] font-medium leading-7 text-black/65">{a.body}</p>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[24px] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl font-black uppercase text-[#111]">Şu an duyuru yok</p>
              <p className="mt-2 text-sm text-black/50">
                {selected ? `${selected.name} şubesi için güncel bir duyuru bulunmuyor.` : "Yeni duyurular burada paylaşılacak."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition",
        active ? "bg-[#ef101b] text-white shadow-[0_8px_22px_rgba(239,16,27,0.25)]" : "bg-white text-[#111] hover:bg-[#ecebe7]",
      )}
    >
      {children}
    </Link>
  );
}
