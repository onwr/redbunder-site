"use client";

import { startTransition, useActionState, useState } from "react";
import { CheckCircle2, ChevronDown, Lock, Mail, MapPin, MessageSquareText, Phone, Send, User, Wallet } from "lucide-react";
import { sendFranchiseApplication } from "@/actions/site";
import { initialActionState } from "@/lib/action-state";
import { FRANCHISE_BUDGETS, FRANCHISE_EXPERIENCE, FRANCHISE_LOCATIONS } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";
import { Field, inputCls } from "@/components/site/form-fields";

/**
 * Franchise başvuru formu → Admin > Mesajlar (konu: Franchise).
 * Alan adları: name, phone, email, city, budget, location, experience, message, kvkkConsent, website(honeypot)
 */
export default function FranchiseForm() {
  // "Yeni başvuru": key değişince form ve action durumu sıfırlanır
  const [round, setRound] = useState(0);
  return <FranchiseFormInner key={round} onReset={() => setRound((r) => r + 1)} />;
}

function FranchiseFormInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(sendFranchiseApplication, initialActionState);
  const [location, setLocation] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const err = (f: string) => state.fieldErrors?.[f]?.[0];

  if (state.ok) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ef101b]/10 text-[#ef101b]">
          <CheckCircle2 className="h-10 w-10" strokeWidth={2.2} />
        </div>
        <h3 className="mt-6 font-display text-4xl font-black uppercase tracking-[-0.05em] text-[#111]">
          Başvurun <span className="text-[#ef101b]">alındı!</span>
        </h3>
        <p className="mt-3 max-w-sm text-base font-medium text-black/55">{state.message}</p>
        <button type="button" onClick={onReset} className="mt-8 text-sm font-bold text-[#ef101b] hover:underline">
          Yeni başvuru yap
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

      <Field label="Ad Soyad" error={err("name")} icon={<User />}>
        <input name="name" autoComplete="name" placeholder="Adınızı ve soyadınızı girin" className={inputCls(!!err("name"))} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Telefon" error={err("phone")} icon={<Phone />}>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" className={inputCls(!!err("phone"))} />
        </Field>
        <Field label="E-posta (opsiyonel)" error={err("email")} icon={<Mail />}>
          <input name="email" type="email" autoComplete="email" placeholder="ornek@mail.com" className={inputCls(!!err("email"))} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Şehir / İlçe" error={err("city")} icon={<MapPin />}>
          <input name="city" placeholder="Örn. Ankara / Etimesgut" className={inputCls(!!err("city"))} />
        </Field>
        <Field label="Yatırım bütçesi" error={err("budget")} icon={<Wallet />}>
          <select name="budget" defaultValue="" className={cn(inputCls(!!err("budget")), "appearance-none pr-10")}>
            <option value="" disabled>Seçiniz</option>
            {Object.entries(FRANCHISE_BUDGETS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
        </Field>
      </div>

      <ChoiceGroup label="Lokasyon" name="location" options={FRANCHISE_LOCATIONS} value={location} onChange={setLocation} error={err("location")} />
      <ChoiceGroup label="Deneyim" name="experience" options={FRANCHISE_EXPERIENCE} value={experience} onChange={setExperience} error={err("experience")} />

      <Field label="Eklemek istedikleriniz (opsiyonel)" error={err("message")} icon={<MessageSquareText />} iconTop>
        <textarea
          name="message"
          rows={4}
          placeholder="Kendinizden, lokasyon fikrinizden veya sorularınızdan bahsedin."
          className={cn(inputCls(!!err("message")), "h-auto resize-none py-3.5")}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm font-medium text-black/60">
        <input type="checkbox" name="kvkkConsent" className="mt-0.5 h-5 w-5 shrink-0 accent-[#ef101b]" />
        <span>
          <a href="/kvkk" target="_blank" className="font-bold text-[#111] underline underline-offset-2 hover:text-[#ef101b]">KVKK Aydınlatma Metni</a>&apos;ni
          okudum; kişisel verilerimin franchise başvurusunun değerlendirilmesi amacıyla işlenmesini kabul ediyorum.
          {err("kvkkConsent") && <span className="mt-1 block text-xs font-semibold text-[#ef101b]">{err("kvkkConsent")}</span>}
        </span>
      </label>

      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <button
        type="submit"
        disabled={pending}
        className="group flex h-[58px] w-full items-center justify-center gap-3 rounded-[14px] bg-[#ef101b] font-display text-xl font-bold uppercase text-white shadow-[0_14px_40px_rgba(239,16,27,0.3)] transition hover:bg-[#ff1825] disabled:opacity-60"
      >
        <Send className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        {pending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>

      <p className="flex items-center justify-center gap-2 text-center text-xs font-medium text-black/45">
        <Lock className="h-3.5 w-3.5" /> Bilgileriniz gizli tutulur, yalnızca franchise ekibimiz tarafından görülür.
      </p>
    </form>
  );
}

function ChoiceGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  options: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold text-[#111]">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(options).map(([v, l]) => (
          <label
            key={v}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-[12px] border px-3 py-3 text-center text-[13px] font-bold transition",
              value === v
                ? "border-[#ef101b] bg-[#ef101b] text-white shadow-[0_10px_24px_rgba(239,16,27,0.25)]"
                : cn("bg-[#f7f7f6] text-[#111] hover:border-black/20", error ? "border-[#ef101b]" : "border-black/[0.08]"),
            )}
          >
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
            {l}
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-[#ef101b]">{error}</p>}
    </fieldset>
  );
}
