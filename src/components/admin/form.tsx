"use client";

import { createContext, startTransition, useActionState, useContext, useState, type ReactNode } from "react";
import { initialActionState, type ActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

/**
 * Admin formları için ortak altyapı.
 *   <ActionForm action={saveProduct} submitLabel="Kaydet">
 *     <TextField name="name" label="Ürün adı" defaultValue={p?.name} required />
 *   </ActionForm>
 * Alanlar hata mesajlarını context'ten otomatik alır.
 */
const FormStateContext = createContext<ActionState>(initialActionState);

type ActionFn = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function ActionForm({
  action,
  children,
  submitLabel = "Kaydet",
  className,
}: {
  action: ActionFn;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  return (
    <FormStateContext.Provider value={state}>
      <form
        // `action` yerine onSubmit: React 19 action sonrası formu sıfırlar; hata durumunda girilen değerler kaybolmasın
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(() => formAction(formData));
        }}
        className={cn("space-y-4", className)}
      >
        {state.message && (
          <div
            role={state.ok ? "status" : "alert"}
            className={cn(
              "rounded-[12px] border px-4 py-3 text-sm font-semibold",
              state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-[#ef101b]/20 bg-[#ef101b]/[0.06] text-[#c40812]",
            )}
          >
            {state.message}
          </div>
        )}
        {children}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center rounded-[12px] bg-[#ef101b] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(239,16,27,0.25)] transition hover:bg-[#ff1825] disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : submitLabel}
        </button>
      </form>
    </FormStateContext.Provider>
  );
}

function useFieldError(name: string) {
  return useContext(FormStateContext).fieldErrors?.[name]?.[0];
}

const inputClass =
  "w-full rounded-[12px] border border-black/10 bg-white px-3.5 py-2.5 text-sm font-medium outline-none transition placeholder:text-black/30 focus:border-[#ef101b] focus:ring-4 focus:ring-[#ef101b]/10";

function FieldShell({ name, label, hint, children }: { name: string; label: string; hint?: string; children: ReactNode }) {
  const error = useFieldError(name);
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-bold text-[#111]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs font-medium text-black/40">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-bold text-[#c40812]">{error}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; hint?: string };

export function TextField({ name, label, hint, className, ...props }: InputProps) {
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <input id={name} name={name} className={cn(inputClass, className)} {...props} />
    </FieldShell>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string; label: string; hint?: string };

export function TextArea({ name, label, hint, className, rows = 4, ...props }: TextAreaProps) {
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <textarea id={name} name={name} rows={rows} className={cn(inputClass, className)} {...props} />
    </FieldShell>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  hint?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
};

export function SelectField({ name, label, hint, options, placeholder, className, ...props }: SelectProps) {
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <select id={name} name={name} className={cn(inputClass, className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-[18px] accent-[#ef101b]" />
      {label}
    </label>
  );
}

type PhoneRow = { key: number; label: string; number: string; isWhatsapp: boolean };

/**
 * Etiketli telefon listesi (satır ekle/sil). Her satır phoneLabel / phoneNumber / phoneWhatsapp
 * olarak gönderilir; checkbox yerine gizli "1"/"0" alanı kullanılır ki satır sıraları kaymasın.
 */
export function PhoneListField({
  name = "phones",
  label,
  hint,
  initial = [],
}: {
  name?: string;
  label: string;
  hint?: string;
  initial?: { label: string | null; number: string; isWhatsapp: boolean }[];
}) {
  const [rows, setRows] = useState<PhoneRow[]>(() => initial.map((p, i) => ({ key: i, label: p.label ?? "", number: p.number, isWhatsapp: p.isWhatsapp })));
  const [nextKey, setNextKey] = useState(initial.length);
  const update = (key: number, patch: Partial<PhoneRow>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <FieldShell name={name} label={label} hint={hint}>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <input
              name="phoneLabel"
              value={r.label}
              onChange={(e) => update(r.key, { label: e.target.value })}
              placeholder="Etiket (ör. Paket servis)"
              maxLength={40}
              list="branch-phone-labels"
              className={cn(inputClass, "sm:w-48")}
            />
            <input
              name="phoneNumber"
              type="tel"
              value={r.number}
              onChange={(e) => update(r.key, { number: e.target.value })}
              placeholder="0312 123 45 67"
              maxLength={20}
              className={cn(inputClass, "flex-1")}
            />
            <input type="hidden" name="phoneWhatsapp" value={r.isWhatsapp ? "1" : "0"} />
            <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-semibold">
              <input type="checkbox" checked={r.isWhatsapp} onChange={(e) => update(r.key, { isWhatsapp: e.target.checked })} className="size-4 accent-[#ef101b]" />
              WhatsApp
            </label>
            <button
              type="button"
              onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
              className="shrink-0 rounded-[10px] px-2.5 py-2 text-xs font-bold text-[#c40812] hover:bg-[#ef101b]/[0.06]"
              aria-label="Numarayı kaldır"
            >
              Kaldır
            </button>
          </div>
        ))}
        <datalist id="branch-phone-labels">
          <option value="Paket servis" />
          <option value="Sabit hat" />
          <option value="Cep" />
          <option value="WhatsApp sipariş" />
        </datalist>
        {rows.length < 10 && (
          <button
            type="button"
            onClick={() => {
              setRows((rs) => [...rs, { key: nextKey, label: "", number: "", isWhatsapp: false }]);
              setNextKey((k) => k + 1);
            }}
            className="rounded-[10px] border border-dashed border-black/20 px-3.5 py-2 text-xs font-bold text-[#111] hover:border-[#ef101b] hover:text-[#ef101b]"
          >
            + Numara ekle
          </button>
        )}
      </div>
    </FieldShell>
  );
}

/** Görsel yükleme: mevcut görseli gösterir, yenisi seçilirse değiştirilir */
export function ImageField({ name = "image", label = "Görsel", current, allowRemove }: { name?: string; label?: string; current?: string | null; allowRemove?: boolean }) {
  return (
    <FieldShell name={name} label={label} hint="JPG, PNG, WEBP veya AVIF · en fazla 4 MB">
      <div className="flex items-center gap-4">
        {current && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="" className="size-20 rounded-[12px] border border-black/10 object-cover" />
        )}
        <input id={name} name={name} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-sm file:mr-3 file:rounded-[10px] file:border-0 file:bg-[#111] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" />
      </div>
      {current && allowRemove && (
        <label className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
          <input type="checkbox" name="removeImage" /> Görseli kaldır
        </label>
      )}
    </FieldShell>
  );
}
