"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, MapPin, Navigation, Phone, Search, Store, UtensilsCrossed } from "lucide-react";
import { branchDirectionsUrl, cn } from "@/lib/utils";

export type BranchCardData = {
  id: number;
  slug: string;
  name: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  mapUrl: string | null;
  openingHours: string | null;
  imageUrl: string | null;
};

/** Şube arama + ilçe filtresi + kart listesi */
export default function BranchFinder({ branches }: { branches: BranchCardData[] }) {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState<string | null>(null);

  // İlçeler ve şube sayıları
  const districts = useMemo(() => {
    const counts = new Map<string, number>();
    branches.forEach((b) => b.district && counts.set(b.district, (counts.get(b.district) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr"));
  }, [branches]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return branches.filter(
      (b) =>
        (!district || b.district === district) &&
        (!q || [b.name, b.district ?? "", b.address ?? ""].some((t) => t.toLocaleLowerCase("tr-TR").includes(q))),
    );
  }, [branches, query, district]);

  return (
    <>
      {/* Filtre çubuğu */}
      <div className="mb-10 flex flex-col gap-4 rounded-[24px] border border-black/[0.06] bg-white p-4 sm:p-5 lg:flex-row lg:items-center">
        <label className="relative block lg:w-80">
          <span className="sr-only">Şube ara</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Şube, ilçe veya adres ara..."
            className="h-12 w-full rounded-[14px] border border-black/[0.08] bg-[#f7f7f6] pl-11 pr-4 text-sm font-medium text-[#111] outline-none transition placeholder:text-black/35 focus:border-[#ef101b] focus:bg-white focus:ring-4 focus:ring-[#ef101b]/10"
          />
        </label>

        {districts.length > 1 && (
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-wrap lg:px-0">
            <Chip active={!district} onClick={() => setDistrict(null)}>
              Tümü <span className="opacity-60">{branches.length}</span>
            </Chip>
            {districts.map(([name, count]) => (
              <Chip key={name} active={district === name} onClick={() => setDistrict(district === name ? null : name)}>
                {name} <span className="opacity-60">{count}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => (
            <li key={b.id}>
              <BranchCard branch={b} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[24px] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <p className="font-display text-2xl font-black uppercase text-[#111]">Şube bulunamadı</p>
          <p className="mt-2 text-sm text-black/50">Aramanı değiştirmeyi dene.</p>
          <button
            onClick={() => {
              setQuery("");
              setDistrict(null);
            }}
            className="mt-5 text-sm font-bold text-[#ef101b] hover:underline"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition",
        active ? "bg-[#ef101b] text-white shadow-[0_8px_22px_rgba(239,16,27,0.25)]" : "bg-[#f5f4f1] text-[#111] hover:bg-[#ecebe7]",
      )}
    >
      {children}
    </button>
  );
}

function BranchCard({ branch: b }: { branch: BranchCardData }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#ef101b]/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]">
      {/* Görsel / yer tutucu */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#111]">
        {b.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.imageUrl} alt={`Red Bunder ${b.name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e50914]/25 blur-3xl" />
            <span className="absolute -bottom-5 right-3 font-display text-[110px] font-black uppercase leading-none text-white/[0.04]">{b.name}</span>
            <Store className="relative h-12 w-12 text-[#ef101b]/80" strokeWidth={1.8} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        {b.district && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#111]">
            <MapPin className="h-3 w-3 text-[#ef101b]" /> {b.district}
          </span>
        )}
        <h2 className="absolute bottom-4 left-5 right-5 font-display text-3xl font-black uppercase leading-none tracking-[-0.04em] text-white">
          {b.name}
        </h2>
      </div>

      {/* Bilgiler */}
      <div className="flex flex-1 flex-col p-5">
        <ul className="space-y-3 text-sm">
          <InfoRow icon={<MapPin />}>{b.address ?? <span className="text-black/35">Adres yakında eklenecek</span>}</InfoRow>
          {b.openingHours && <InfoRow icon={<Clock3 />}>{b.openingHours}</InfoRow>}
          {b.phone && (
            <InfoRow icon={<Phone />}>
              <a href={`tel:${b.phone}`} className="font-bold text-[#111] hover:text-[#ef101b]">{b.phone}</a>
            </InfoRow>
          )}
        </ul>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <Link
            href="/menu"
            className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ef101b] text-sm font-bold text-white transition hover:bg-[#ff1825]"
          >
            <UtensilsCrossed className="h-4 w-4" /> Menü
          </Link>
          <a
            href={branchDirectionsUrl(b)}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#111] text-sm font-bold text-white transition hover:bg-black"
          >
            <Navigation className="h-4 w-4" /> Yol Tarifi
          </a>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#ef101b]/10 text-[#ef101b] [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
      </span>
      <span className="pt-1 font-medium leading-5 text-black/65">{children}</span>
    </li>
  );
}
