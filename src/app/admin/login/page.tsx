import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3, CalendarCheck2, ShieldCheck, Sandwich } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: { absolute: "Giriş | Red Bunder Yönetim" }, robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;

  return (
    <div className="relative grid min-h-screen bg-black lg:grid-cols-[1.1fr_0.9fr]">
      {/* ---------------- Sol: marka alanı ---------------- */}
      <section className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.75)_55%,rgba(0,0,0,0.95)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-[#e50914]/15 blur-[130px]" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Siteye dön
          </Link>

          <div className="max-w-lg">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[3px] w-10 bg-[#f3131e]" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#ff343d]">Red Bunder</span>
            </div>
            <div className="relative w-fit">
              <span className="absolute -right-10 -top-8 rotate-[30deg] text-[48px] leading-none text-[#ffba08]">♛</span>
              <h1 className="font-display uppercase leading-[0.85] tracking-[-0.06em] text-white">
                <span className="block text-[clamp(3.5rem,5.5vw,6rem)] font-black">Yönetim</span>
                <span className="mt-2 block text-[clamp(3.5rem,5.5vw,6rem)] font-black text-[#f10e19]">Paneli</span>
              </h1>
            </div>
            <p className="mt-6 text-xl font-medium italic leading-snug text-white/80">Menü, şubeler, reklamlar ve ekip işleri tek yerde.</p>

            <ul className="mt-10 grid grid-cols-2 gap-3">
              {[
                { icon: <CalendarCheck2 />, t: "Görev takvimi" },
                { icon: <BarChart3 />, t: "Reklam raporları" },
                { icon: <Sandwich />, t: "Menü & QR" },
                { icon: <ShieldCheck />, t: "Rol bazlı erişim" },
              ].map((f) => (
                <li
                  key={f.t}
                  className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/85 backdrop-blur [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-[#ff343d]"
                >
                  {f.icon}
                  {f.t}
                </li>
              ))}
            </ul>
          </div>

          <p className="-rotate-[3deg] font-script text-2xl text-white/70">İyi burger, iyi anlar.</p>
        </div>
      </section>

      {/* ---------------- Sağ: giriş kartı ---------------- */}
      <section className="relative flex items-center justify-center overflow-hidden px-5 py-12 lg:bg-[#f5f4f1]">
        {/* Mobilde arka plan */}
        <div className="absolute inset-0 bg-cover bg-[position:20%_center] lg:hidden" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-black/75 lg:hidden" />

        <div className="relative w-full max-w-[420px]">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image src="/logo.png" alt="Red Bunder" width={120} height={120} priority className="h-24 w-auto drop-shadow-[0_10px_30px_rgba(239,16,27,0.35)]" />
          </div>

          <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.15)] sm:p-9">
            <h2 className="font-display text-4xl font-black uppercase leading-none tracking-[-0.05em] text-[#111]">
              Hoş <span className="text-[#ef101b]">geldin</span>
            </h2>
            <p className="mb-7 mt-2 text-sm font-medium text-black/50">Devam etmek için hesabınla giriş yap.</p>
            <LoginForm next={typeof next === "string" ? next : "/admin"} />
          </div>

          <p className="mt-6 text-center text-xs font-medium text-white/50 lg:text-black/40">
            Şifreni mi unuttun? Bir yöneticiden <b>Kullanıcılar</b> sayfasında sıfırlamasını iste.
          </p>
          <Link href="/" className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-white/60 hover:text-white lg:hidden">
            <ArrowLeft className="h-3.5 w-3.5" /> Siteye dön
          </Link>
        </div>
      </section>
    </div>
  );
}
