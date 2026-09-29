import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, Heart, Mail, MapPin, PencilLine, Phone, Store } from "lucide-react";
import { getSettings } from "@/lib/services/settings";
import { instagramHandle } from "@/lib/utils";
import { getActiveBranches } from "@/lib/services/menu";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";
import { InstagramIcon } from "@/components/site/SocialIcons";
import type { ContactTopic } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Red Bunder ile iletişime geç: soru, öneri, görüş ve iş birliği talepleri.",
};

/** ?konu=oneri gibi linklerle konu ön seçilir (ör. QR menüden "Görüşünü bildir") */
const TOPIC_SLUGS: Record<string, ContactTopic> = {
  genel: "GENEL",
  oneri: "ONERI_GORUS",
  gorus: "ONERI_GORUS",
  sikayet: "SIKAYET",
  franchise: "FRANCHISE",
};

export default async function ContactPage({ searchParams }: PageProps<"/iletisim">) {
  await connection();
  const [settings, branches, { konu }] = await Promise.all([getSettings(), getActiveBranches(), searchParams]);
  const defaultTopic = typeof konu === "string" ? TOPIC_SLUGS[konu] : undefined;

  return (
    <>
      <PageHero eyebrow="İletişim" title="Bize" highlight="Ulaş">
        Soruların, önerilerin ve görüşlerin bizim için çok değerli. Yaz, en kısa sürede dönelim.
      </PageHero>

      <section className="bg-[#f5f4f1] px-5 pb-24 pt-10 lg:px-8 lg:pt-14 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.85fr_1.15fr] xl:gap-12">
          {/* ---------------- SOL: bilgiler ---------------- */}
          <div className="order-2 space-y-5 lg:order-1">
            {/* Instagram */}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden rounded-[28px] bg-[#111] p-7 text-white transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,#f58529_0%,#dd2a7b_45%,#8134af_75%,transparent_100%)] opacity-40 blur-2xl transition group-hover:opacity-60" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#e50914]/25 blur-[70px]" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(45deg,#f58529,#dd2a7b,#8134af)] shadow-[0_12px_30px_rgba(221,42,123,0.35)]">
                    <InstagramIcon className="h-7 w-7" />
                  </div>
                  <p className="mt-6 text-[11px] font-black uppercase tracking-[0.25em] text-white/50">Bizi takip et</p>
                  <p className="mt-1 font-display text-4xl font-black tracking-[-0.04em]">{instagramHandle(settings.instagram)}</p>
                  <p className="mt-2 text-sm font-medium text-white/60">Yeni lezzetler, kampanyalar ve Red Bunder&apos;dan kareler.</p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#111] transition group-hover:bg-[#ef101b] group-hover:text-white">
                    Takip Et <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            )}

            {/* İletişim bilgileri */}
            {(settings.phone || settings.email || settings.address) && (
              <div className="rounded-[24px] border border-black/[0.06] bg-white p-6">
                <ul className="space-y-5">
                  {settings.phone && (
                    <InfoItem icon={<Phone />} label="Telefon">
                      <a href={`tel:${settings.phone}`} className="hover:text-[#ef101b]">{settings.phone}</a>
                    </InfoItem>
                  )}
                  {settings.email && (
                    <InfoItem icon={<Mail />} label="E-posta">
                      <a href={`mailto:${settings.email}`} className="hover:text-[#ef101b]">{settings.email}</a>
                    </InfoItem>
                  )}
                  {settings.address && (
                    <InfoItem icon={<MapPin />} label="Merkez">
                      {settings.address}
                    </InfoItem>
                  )}
                </ul>
              </div>
            )}

            {/* Öneri & görüş vurgusu + şubeler */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Link
                href="?konu=oneri#form"
                scroll={false}
                className="group rounded-[24px] border border-black/[0.06] bg-white p-6 transition hover:-translate-y-1 hover:border-[#ef101b]/40 hover:shadow-[0_22px_45px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#ef101b]/10 text-[#ef101b] transition group-hover:bg-[#ef101b] group-hover:text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-black uppercase leading-none tracking-[-0.03em] text-[#111]">Öneri ve Görüşler</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-black/50">Lezzetimizi ve hizmetimizi senin fikirlerinle geliştiriyoruz.</p>
              </Link>

              <Link
                href="/subeler"
                className="group rounded-[24px] border border-black/[0.06] bg-white p-6 transition hover:-translate-y-1 hover:border-[#ef101b]/40 hover:shadow-[0_22px_45px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#ef101b]/10 text-[#ef101b] transition group-hover:bg-[#ef101b] group-hover:text-white">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-black uppercase leading-none tracking-[-0.03em] text-[#111]">Şubeni Bul</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-black/50">Adres, çalışma saatleri ve şube telefonları.</p>
              </Link>
            </div>
          </div>

          {/* ---------------- SAĞ: form ---------------- */}
          <div id="form" className="relative order-1 scroll-mt-8 lg:order-2">
            <div className="relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-7 xl:p-9">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[14px] bg-[#ef101b] text-white shadow-[0_12px_30px_rgba(239,16,27,0.25)]">
                  <PencilLine className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display text-[clamp(2rem,3vw,3.25rem)] font-black uppercase leading-none tracking-[-0.05em] text-[#111]">
                    Bize <span className="text-[#ef101b]">Yaz</span>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#666] sm:text-base">Konunu seç, mesajını bırak; ekibimiz sana dönsün.</p>
                </div>
              </div>

              {/* key: ?konu değişince ön seçim uygulansın */}
              <ContactForm key={defaultTopic ?? "GENEL"} branches={branches.map((b) => ({ id: b.id, name: b.name }))} defaultTopic={defaultTopic} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#ef101b]/10 text-[#ef101b] [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/35">{label}</p>
        <p className="mt-0.5 font-display text-xl font-bold tracking-[-0.02em] text-[#111]">{children}</p>
      </div>
    </li>
  );
}
