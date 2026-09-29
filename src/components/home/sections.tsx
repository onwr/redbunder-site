import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Beef, Bike, BriefcaseBusiness, Clock3, Handshake, MapPin, Navigation, Phone, Soup, Star } from "lucide-react";
import { OrderButton, type OrderPlatform } from "@/components/home/OrderProvider";
import { InstagramIcon } from "@/components/site/SocialIcons";
import AnkaraSkyline from "@/components/site/AnkaraSkyline";
import { branchDirectionsUrl, cn } from "@/lib/utils";

/* ================================ Ortak ================================ */

export function SectionTitle({
  eyebrow,
  title,
  highlight,
  dark,
  action,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  dark?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[3px] w-8 bg-[#ef101b]" />
            <span className="text-xs font-black uppercase tracking-[0.22em] text-[#ef101b]">{eyebrow}</span>
          </div>
        )}
        <h2 className={cn("font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl", dark ? "text-white" : "text-[#111]")}>
          {title} {highlight && <span className="text-[#ef101b]">{highlight}</span>}
        </h2>
      </div>
      {action}
    </div>
  );
}

/* ========================= Sipariş platformları ========================= */

export function PlatformBar({ platforms }: { platforms: OrderPlatform[] }) {
  if (platforms.length === 0) return null;
  return (
    <section className="border-y border-white/[0.06] bg-black px-5 py-5">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
        <p className="text-sm font-bold text-white/70">Tüm platformlarda:</p>
        <ul className="flex min-w-0 flex-wrap justify-center gap-2 sm:gap-3">
          {platforms.map((p) => (
            <li key={p.name}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex h-11 items-center rounded-[12px] px-5 font-display text-lg font-black tracking-[-0.02em] transition hover:-translate-y-0.5",
                  p.className,
                )}
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================ Neden Red Bunder ============================ */

export function WhyUs({ branchCount }: { branchCount: number }) {
  const items = [
    { icon: <Beef />, title: "Günlük taze et", text: "Her gün taptaze hazırlanan köfteler." },
    { icon: <Soup />, title: "Özel soslar", text: "Sadece bize özel tarifler." },
    { icon: <Bike />, title: "Hızlı teslimat", text: "Sıcak ve hızlı, her zaman." },
    { icon: <MapPin />, title: `Ankara'da ${branchCount} şube`, text: "Ankara'nın her yanında." },
  ];
  return (
    <section className="relative overflow-hidden bg-black px-5 py-16 lg:px-8 xl:px-10">
      <div className="pointer-events-none absolute -right-40 top-0 h-[400px] w-[600px] rounded-full bg-[#e50914]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <SectionTitle title="Neden" highlight="Red Bunder?" dark action={<span className="text-5xl leading-none text-[#ffba08]">♛</span>} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <li key={i.title} className="group flex items-center gap-4 rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-[#ef101b]/50 hover:bg-white/[0.06]">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[#ef101b]/15 text-[#ff343d] transition group-hover:bg-[#ef101b] group-hover:text-white [&>svg]:h-7 [&>svg]:w-7">
                {i.icon}
              </span>
              <div>
                <h3 className="font-display text-xl font-black uppercase tracking-[-0.02em] text-white">{i.title}</h3>
                <p className="mt-0.5 text-sm font-medium text-white/55">{i.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================== Kampanya ============================== */

export function CampaignBanner({ title, subtitle, text, url }: { title?: string; subtitle?: string; text?: string; url?: string }) {
  if (!title) return null;
  return (
    <section className="bg-[#f5f4f1] px-5 py-12 lg:px-8 xl:px-10">
      <div className="relative mx-auto grid max-w-[1500px] items-center overflow-hidden rounded-[28px] bg-[linear-gradient(110deg,#b20710_0%,#ef101b_45%,#ff3b3b_100%)] text-white shadow-[0_30px_70px_rgba(239,16,27,0.3)] md:grid-cols-[0.8fr_1.2fr]">
        {/* Görsel */}
        <div className="relative h-52 md:h-full md:min-h-[260px]">
          <div className="absolute inset-0 bg-cover bg-[position:15%_center]" style={{ backgroundImage: "url('/bg.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#b20710] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#c00a13]" />
        </div>
        {/* Metin */}
        <div className="relative p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <p className="font-display text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]">{title}</p>
          {subtitle && (
            <p className="mt-2 font-display text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-none tracking-[-0.04em] text-[#ffd166]">{subtitle}</p>
          )}
          {text && <p className="mt-3 max-w-lg font-script text-xl text-white/90">{text}</p>}
          {url && (
            <a
              href={url}
              className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-white px-5 py-3 text-sm font-bold text-[#ef101b] transition hover:-translate-y-0.5 hover:bg-[#111] hover:text-white"
            >
              Kampanyaları İncele <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================== Şubeler ============================== */

type HomeBranch = {
  id: number;
  name: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  mapUrl: string | null;
};

/** Temsili pin konumları (yüzde) – gerçek koordinat değildir */
const PIN_SPOTS = [
  [52, 30], [30, 42], [70, 45], [42, 62], [65, 68], [22, 70], [80, 25], [55, 82], [15, 30], [85, 60], [35, 20], [48, 48],
];

export function BranchesSection({ branches }: { branches: HomeBranch[] }) {
  if (branches.length === 0) return null;
  const shown = branches.slice(0, 6);

  return (
    <section className="bg-white px-5 py-20 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow="Ankara'nın her yanında"
          title="Şubelerimiz"
          action={
            <Link href="/subeler" className="inline-flex items-center gap-2 rounded-[12px] bg-[#ef101b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff1825]">
              <MapPin className="h-4 w-4" /> Tüm Şubeler
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
          {/* Temsili harita */}
          <Link href="/subeler" className="group relative block min-h-[320px] overflow-hidden rounded-[24px] bg-[#1a1a1a]" aria-label="Tüm şubeler">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
              <path d="M0 55 C 25 45, 45 70, 100 40" stroke="#ef101b" strokeWidth="0.8" fill="none" />
              <path d="M40 0 C 45 30, 60 50, 55 100" stroke="#fff" strokeWidth="0.5" fill="none" />
              <path d="M0 20 C 30 30, 70 10, 100 25" stroke="#fff" strokeWidth="0.4" fill="none" />
            </svg>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e50914]/20 blur-3xl" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-4xl font-black tracking-[0.2em] text-white/15">ANKARA</span>
            {branches.slice(0, PIN_SPOTS.length).map((b, i) => (
              <span
                key={b.id}
                className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
                style={{ left: `${PIN_SPOTS[i][0]}%`, top: `${PIN_SPOTS[i][1]}%` }}
              >
                <span className="mb-1 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase text-[#111] shadow">{b.name}</span>
                <MapPin className="h-6 w-6 fill-[#ef101b] text-white drop-shadow" />
              </span>
            ))}
            <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white/50">
              Temsili harita
              <span className="inline-flex items-center gap-1 text-white transition group-hover:text-[#ff343d]">
                Şubeni bul <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </span>
          </Link>

          {/* Şube kartları */}
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((b) => (
              <li key={b.id} className="flex flex-col rounded-[20px] border border-black/[0.06] bg-[#f7f7f6] p-5">
                <h3 className="font-display text-2xl font-black uppercase leading-none tracking-[-0.03em] text-[#111]">{b.name}</h3>
                <ul className="mt-3 space-y-1.5 text-[13px] font-medium text-black/60">
                  <li className="flex gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ef101b]" />
                    {b.address ?? b.district ?? "Adres yakında"}
                  </li>
                  {b.phone && (
                    <li className="flex gap-2">
                      <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ef101b]" />
                      <a href={`tel:${b.phone}`} className="hover:text-[#ef101b]">{b.phone}</a>
                    </li>
                  )}
                  {b.openingHours && (
                    <li className="flex gap-2">
                      <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ef101b]" />
                      {b.openingHours}
                    </li>
                  )}
                </ul>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  <a
                    href={branchDirectionsUrl(b)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-[#111] text-xs font-bold text-white transition hover:bg-black"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Yol Tarifi
                  </a>
                  <OrderButton className="flex h-10 items-center justify-center rounded-[10px] bg-[#ef101b] text-xs font-bold text-white transition hover:bg-[#ff1825]">
                    Sipariş Ver
                  </OrderButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================== Yorumlar ============================== */

type HomeReview = { id: number; name: string; rating: number; text: string; source: string | null };

export function ReviewsSection({ reviews }: { reviews: HomeReview[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((n, r) => n + r.rating, 0) / reviews.length;

  return (
    <section className="bg-[#f5f4f1] px-5 py-20 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
        <SectionTitle
          eyebrow="Gerçek lezzet, gerçek yorumlar"
          title="Müşteri"
          highlight="Yorumları"
          action={
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Star className="h-5 w-5 fill-[#ffba08] text-[#ffba08]" />
              <span className="font-display text-2xl font-black text-[#111]">{avg.toFixed(1)}</span>
              <span className="text-sm font-medium text-black/45">/ 5 · {reviews.length} yorum</span>
            </div>
          }
        />
        <ul className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0 xl:grid-cols-5">
          {reviews.map((r) => (
            <li key={r.id} className="w-[80%] shrink-0 snap-start rounded-[20px] border border-black/[0.06] bg-white p-5 sm:w-[45%] lg:w-auto">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111] font-display text-lg font-black text-white">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="font-bold text-[#111]">{r.name}</p>
                  <p className="text-sm text-[#ffba08]">
                    {"★".repeat(r.rating)}
                    <span className="text-black/15">{"★".repeat(5 - r.rating)}</span>
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-black/60">&ldquo;{r.text}&rdquo;</p>
              {r.source && <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-black/30">{r.source}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================== Instagram ============================== */

/** Görsel kutuları: yüklenmiş ürün fotoğrafları, yoksa marka kareleri */
export function InstagramSection({ url, handle, images }: { url?: string; handle: string; images: string[] }) {
  if (!url) return null;
  const brandTiles = ["bg:15% 60%", "bg:85% 50%", "logo", "sub:60% 50%", "slogan", "sub:90% 40%"];
  const tiles = [...images.map((src) => `img:${src}`), ...brandTiles].slice(0, 6);

  return (
    <section className="bg-white px-5 py-20 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl font-black tracking-[-0.04em] text-[#111] sm:text-5xl">{handle}</h2>
            <p className="mt-1 text-sm font-medium text-black/50">Sahnedeki lezzetler, kamera arkasında da efsane.</p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-[12px] bg-[linear-gradient(45deg,#f58529,#dd2a7b,#8134af)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(221,42,123,0.3)] transition hover:-translate-y-0.5"
          >
            <InstagramIcon className="h-4 w-4" /> Bizi Takip Et
          </a>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {tiles.map((t, i) => (
            <li key={i}>
              <a href={url} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden rounded-[14px] bg-[#111]" aria-label="Instagram">
                <Tile spec={t} />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <InstagramIcon className="h-8 w-8 text-white" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Tile({ spec }: { spec: string }) {
  // "tür:değer" → ör. "img:/uploads/..", "bg:15% 60%", "logo"
  const sep = spec.indexOf(":");
  const kind = sep === -1 ? spec : spec.slice(0, sep);
  const value = sep === -1 ? "" : spec.slice(sep + 1);
  if (kind === "img") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={value} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />;
  }
  if (kind === "bg" || kind === "sub") {
    return (
      <div
        className="h-full w-full bg-[length:auto_140%] bg-no-repeat transition duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url('${kind === "bg" ? "/bg.png" : "/subelerbg.png"}')`, backgroundPosition: value }}
      />
    );
  }
  if (kind === "logo") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="h-3/4 w-3/4 object-contain" />
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#ef101b] p-3 text-center">
      <p className="-rotate-[6deg] font-script text-[clamp(1rem,2vw,1.6rem)] leading-tight text-white">
        Daha fazla <br /> burger!
      </p>
    </div>
  );
}

/* ============================ Ailemize katıl ============================ */

export function JoinBand({ branchCount, careerUrl }: { branchCount: number; careerUrl: string }) {
  return (
    <section className="relative overflow-hidden bg-black px-5 py-16 text-white lg:px-8 xl:px-10">
      <div className="pointer-events-none absolute -left-40 top-0 h-[360px] w-[600px] rounded-full bg-[#e50914]/15 blur-[130px]" />
      <AnkaraSkyline className="pointer-events-none absolute bottom-0 right-0 h-[160px] w-[560px] opacity-40 [mask-image:linear-gradient(90deg,transparent,black_40%)]" />

      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[1fr_auto_auto]">
        <div>
          <h2 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em]">
            <span className="text-[#f10e19]">Red</span> ailesine katıl
          </h2>
          <p className="mt-3 -rotate-[2deg] font-script text-2xl text-white/85">Lezzeti birlikte büyütelim.</p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-4 text-center">
            <p className="font-display text-4xl font-black text-white">{branchCount}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Şube</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-4 text-center">
            <p className="font-display text-4xl font-black text-[#f10e19]">1</p>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Şehir</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/franchise#basvuru"
            className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#ef101b] px-6 py-4 font-display text-lg font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ff1825]"
          >
            <Handshake className="h-5 w-5" /> Franchise Başvurusu
          </Link>
          <a
            href={careerUrl}
            className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/20 px-6 py-4 font-display text-lg font-bold uppercase text-white transition hover:-translate-y-0.5 hover:border-white/60"
          >
            <BriefcaseBusiness className="h-5 w-5" /> Kariyer
          </a>
        </div>
      </div>
    </section>
  );
}
