import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Heart, MapPin, Phone } from "lucide-react";
import { getMenu } from "@/lib/services/menu";
import { getSettings } from "@/lib/services/settings";
import QrMenu from "@/components/menu/QrMenu";

/**
 * QR MENÜ – tüm şubelerde ve masalarda aynı QR kod bu sayfayı açar: /qr
 * Site header/footer'ı yok; mobil öncelikli, cv.redbunder.com ile aynı konsept.
 */
export const metadata: Metadata = {
  title: "QR Menü",
  description: "Red Bunder menüsü ve fiyatları.",
};

export const viewport: Viewport = { themeColor: "#000000" };

export default async function QrMenuPage() {
  await connection();
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      {/* =========================================================
          HERO
      ========================================================== */}
      <header className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-cover bg-[position:30%_center] bg-no-repeat" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.88)_45%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[380px] w-[380px] rounded-full bg-[#e50914]/15 blur-[110px]" />

        <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-5">
          {/* Üst bar */}
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Red Bunder ana sayfa">
              <Image src="/logo.png" alt="Red Bunder" width={72} height={72} priority className="h-16 w-auto" />
            </Link>
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              QR Menü
            </span>
          </div>

          {/* Başlık */}
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[3px] w-10 bg-[#f3131e]" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff343d]">Hoş geldin</span>
            </div>

            <div className="relative w-fit">
              <span className="absolute -right-8 -top-7 rotate-[38deg] text-[40px] font-black text-[#ffba08]">♛</span>
              <h1 className="font-display uppercase leading-[0.85] tracking-[-0.06em]">
                <span className="block text-[clamp(3.4rem,14vw,5.5rem)] font-black text-white">Red Bunder</span>
                <span className="mt-3 block text-[clamp(3rem,12.5vw,5rem)] font-black text-[#f10e19]">Menü</span>
              </h1>
            </div>

            <p className="mt-5 max-w-md text-lg font-medium italic leading-snug text-white/85">
              Afiyet olsun! Siparişini garsonumuza ya da kasaya iletebilirsin.
            </p>
          </div>

          {settings.phone && (
            <ul className="mt-6 flex flex-wrap gap-2 text-[13px] font-semibold">
              <li className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-white/85 backdrop-blur">
                <Phone className="h-3.5 w-3.5 text-[#f3131e]" />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            </ul>
          )}
        </div>
      </header>

      {/* =========================================================
          MENÜ
      ========================================================== */}
      {menu.length > 0 ? (
        <QrMenu categories={menu} />
      ) : (
        <p className="px-5 py-20 text-center font-display text-2xl font-black uppercase text-black/40">Menü yakında burada.</p>
      )}

      {/* =========================================================
          MİNİ FOOTER
      ========================================================== */}
      <footer className="relative overflow-hidden bg-black px-5 pb-10 pt-12 text-center text-white">
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-[#e50914]/20 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl">
          <Image src="/logo.png" alt="Red Bunder" width={90} height={90} className="mx-auto h-20 w-auto" />
          <p className="mt-4 -rotate-[4deg] font-script text-3xl leading-tight">
            İyi burger <span className="text-[#f10e19]">iyi anlar.</span>
          </p>
          <p className="mt-6 text-xs text-white/40">Fiyatlarımıza KDV dahildir. Alerjen bilgisi için ürüne dokunun.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/iletisim?konu=oneri#form"
              className="inline-flex items-center gap-2 rounded-full bg-[#ef101b] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#ff1825]"
            >
              <Heart className="h-3.5 w-3.5" /> Görüşünü bildir
            </Link>
            <Link
              href="/subeler"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white/80 transition hover:border-[#ef101b] hover:text-white"
            >
              <MapPin className="h-3.5 w-3.5 text-[#f3131e]" /> Şubeler
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white/80 transition hover:border-[#ef101b] hover:text-white"
            >
              redbunder.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
