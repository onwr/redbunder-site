"use client";

import { startTransition, useActionState, useState } from "react";
import { CheckCircle2, ChevronDown, Lock, Mail, MapPin, MessageSquareText, Phone, Send, User } from "lucide-react";
import { sendContactMessage } from "@/actions/site";
import { initialActionState } from "@/lib/action-state";
import { CONTACT_TOPICS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Field, inputCls } from "@/components/site/form-fields";
import type { ContactTopic } from "@/generated/prisma/enums";

const PLACEHOLDERS: Record<ContactTopic, string> = {
  GENEL: "Merak ettiğin her şeyi yazabilirsin...",
  ONERI_GORUS: "Menü, lezzet, hizmet... Görüş ve önerilerini bizimle paylaş.",
  SIKAYET: "Yaşadığın sorunu, tarih ve şube bilgisiyle birlikte anlatır mısın?",
  FRANCHISE: "Şehir, deneyim ve iş birliği fikrinden kısaca bahset.",
  DIGER: "Mesajını yaz...",
};

/**
 * İletişim formu → Admin > Mesajlar.
 * Alan adları (name) sözleşmedir: topic, name, phone, email, branchId, message, website(honeypot)
 */
type Props = { branches: { id: number; name: string }[]; defaultTopic?: ContactTopic };

export default function ContactForm(props: Props) {
  // "Yeni mesaj gönder": key değişince form ve action durumu sıfırdan kurulur
  const [round, setRound] = useState(0);
  return <ContactFormInner key={round} {...props} onReset={() => setRound((r) => r + 1)} />;
}

function ContactFormInner({ branches, defaultTopic = "GENEL", onReset }: Props & { onReset: () => void }) {
  const [state, action, pending] = useActionState(sendContactMessage, initialActionState);
  const [topic, setTopic] = useState<ContactTopic>(defaultTopic);
  const err = (f: string) => state.fieldErrors?.[f]?.[0];

  if (state.ok) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ef101b]/10 text-[#ef101b]">
          <CheckCircle2 className="h-10 w-10" strokeWidth={2.2} />
        </div>
        <h3 className="mt-6 font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111]">
          Teşekkürler<span className="text-[#ef101b]">!</span>
        </h3>
        <p className="mt-3 max-w-sm text-base font-medium text-black/55">{state.message}</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-8 text-sm font-bold text-[#ef101b] hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      // action yerine onSubmit: hata durumunda girilen değerler silinmesin
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-5"
    >
      {state.message && !state.ok && (
        <div role="alert" className="rounded-[14px] border border-[#ef101b]/20 bg-[#ef101b]/[0.06] px-4 py-3 text-sm font-medium text-[#c40812]">
          {state.message}
        </div>
      )}

      {/* Konu */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-[#111]">Konu</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CONTACT_TOPICS.map((t) => (
            <label
              key={t.value}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-[12px] border px-3 py-3 text-center text-[13px] font-bold transition",
                topic === t.value
                  ? "border-[#ef101b] bg-[#ef101b] text-white shadow-[0_10px_24px_rgba(239,16,27,0.25)]"
                  : "border-black/[0.08] bg-[#f7f7f6] text-[#111] hover:border-black/20",
              )}
            >
              <input type="radio" name="topic" value={t.value} checked={topic === t.value} onChange={() => setTopic(t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Ad Soyad" error={err("name")} icon={<User />}>
        <input name="name" autoComplete="name" placeholder="Adınızı ve soyadınızı girin" className={inputCls(!!err("name"))} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Telefon" error={err("phone")} icon={<Phone />}>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" className={inputCls(!!err("phone"))} />
        </Field>
        <Field label="E-posta" error={err("email")} icon={<Mail />}>
          <input name="email" type="email" autoComplete="email" placeholder="ornek@mail.com" className={inputCls(!!err("email"))} />
        </Field>
      </div>

      {branches.length > 0 && (
        <Field label="İlgili şube (opsiyonel)" icon={<MapPin />}>
          <select name="branchId" defaultValue="" className={cn(inputCls(false), "appearance-none pr-10")}>
            <option value="">Şube seçmeden devam et</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
        </Field>
      )}

      <Field label="Mesajın" error={err("message")} icon={<MessageSquareText />} iconTop>
        <textarea name="message" rows={5} placeholder={PLACEHOLDERS[topic]} className={cn(inputCls(!!err("message")), "h-auto resize-none py-3.5")} />
      </Field>

      {/* Honeypot – ekranda gizli, botlar doldurur */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <button
        type="submit"
        disabled={pending}
        className="group flex h-[58px] w-full items-center justify-center gap-3 rounded-[14px] bg-[#ef101b] font-display text-xl font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.3)] transition hover:bg-[#ff1825] disabled:opacity-60"
      >
        <Send className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        {pending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>

      <p className="flex items-center justify-center gap-2 text-center text-xs font-medium text-black/45">
        <Lock className="h-3.5 w-3.5" /> Bilgilerin gizli tutulur, sadece sana dönüş yapmak için kullanılır.
      </p>
    </form>
  );
}
