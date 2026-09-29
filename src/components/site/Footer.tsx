import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { getSettings } from "@/lib/services/settings";
import AnkaraSkyline from "@/components/site/AnkaraSkyline";
import { SOCIAL_ICONS } from "@/components/site/SocialIcons";

/** Sosyal medya linkleri ve iletişim bilgileri: Admin > Site Ayarları */
export default async function Footer() {
  await connection(); // ayarlar admin panelinden değişir → her istekte güncel oku
  const settings = await getSettings();
  const socials = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter((k) => settings[k]);
  const links = [...NAV_LINKS, { href: SITE.careerUrl, label: "Kariyer" }];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.06] bg-black text-white">
      {/* Kırmızı ambiyans + Ankara silüeti */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-40 left-1/2 h-[380px] w-[900px] -translate-x-1/2 rounded-full bg-[#e50914]/15 blur-[120px]" />
        <AnkaraSkyline className="absolute bottom-0 left-1/2 h-[150px] w-[560px] -translate-x-[20%] opacity-80 [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] lg:h-[190px] lg:w-[720px]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1580px] px-5 lg:px-8 xl:px-10">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-8 py-12 lg:grid-cols-[auto_auto_1fr_auto] lg:gap-12 lg:py-14">
          {/* Logo */}
          <Link href="/" className="w-fit">
            <Image src="/logo.png" alt="Red Bunder" width={110} height={110} className="h-20 w-auto sm:h-24 lg:h-28" />
          </Link>

          {/* El yazısı slogan */}
          <div className="w-fit -rotate-[6deg]">
            <p className="font-script text-[clamp(1.6rem,2.2vw,2.3rem)] leading-[1.1] text-white">
              Ankara&apos;nın
              <br />
              Burger Markası.
            </p>
            <div className="ml-auto mt-1 h-[4px] w-[70%] -rotate-[2deg] rounded-full bg-[#f3131e]" />
          </div>

          {/* Linkler + sosyal + iletişim */}
          <div className="col-span-2 lg:col-span-1">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/80 sm:gap-x-0">
              {links.map((l, i) => (
                <li key={l.href} className="flex items-center">
                  {i > 0 && <span className="mx-3 hidden h-3.5 w-px bg-white/25 sm:block" />}
                  <Link href={l.href} className="transition hover:text-[#ff343d]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              {socials.length > 0 && (
                <ul className="flex items-center gap-4">
                  {socials.map((k) => {
                    const { label, Icon } = SOCIAL_ICONS[k];
                    return (
                      <li key={k}>
                        <a
                          href={settings[k]}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="block text-white transition hover:-translate-y-0.5 hover:text-[#ff343d]"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
                  <Mail className="h-4 w-4 text-[#f3131e]" /> {settings.email}
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
                  <Phone className="h-4 w-4 text-[#f3131e]" /> {settings.phone}
                </a>
              )}
            </div>
            {settings.address && (
              <p className="mt-3 flex items-start gap-2 text-sm text-white/55">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f3131e]" /> {settings.address}
              </p>
            )}
          </div>

          {/* Sağ slogan + taç */}
          <div className="relative hidden w-fit -rotate-[8deg] justify-self-end lg:block">
            <p className="font-script text-[clamp(1.5rem,2vw,2.1rem)] uppercase leading-[1.05] text-white">
              <span className="relative">
                İyi burger
                <span className="absolute -right-9 -top-6 rotate-[20deg] text-[34px] leading-none text-[#ffba08]">♛</span>
              </span>
              <br />
              <span className="pl-6">iyi anlar.</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] py-5 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Red Bunder. Tüm hakları saklıdır.</p>
          <p>Ankara&apos;da ateşte pişer ♥</p>
        </div>
      </div>
    </footer>
  );
}
