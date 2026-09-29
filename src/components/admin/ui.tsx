import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

/** Admin sayfa başlığı + sağda aksiyonlar */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-[3px] w-6 rounded-full bg-[#ef101b]" />
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ef101b]">{eyebrow}</span>
          </div>
        )}
        <h1 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] font-black uppercase leading-none tracking-[-0.04em]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm font-medium text-black/50">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6", className)}>{children}</div>;
}

/** Başlıklı kart (dashboard/rapor blokları) */
export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-black uppercase tracking-[-0.02em]">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

/** Büyük sayı kutusu (KPI) */
export function StatCard({
  label,
  value,
  hint,
  href,
  icon,
  dark,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  href?: string;
  icon?: ReactNode;
  dark?: boolean;
}) {
  const body = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-[20px] p-5 transition",
        dark ? "bg-[#111] text-white" : "border border-black/[0.06] bg-white",
        href && "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]",
      )}
    >
      {dark && <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#e50914]/30 blur-2xl" />}
      <div className="relative flex items-start justify-between gap-3">
        <p className={cn("text-[11px] font-black uppercase tracking-[0.18em]", dark ? "text-white/50" : "text-black/40")}>{label}</p>
        {icon && (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] [&>svg]:h-[18px] [&>svg]:w-[18px]",
              dark ? "bg-[#ef101b] text-white" : "bg-[#ef101b]/10 text-[#ef101b]",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="relative mt-2 font-display text-[34px] font-black leading-none tracking-[-0.04em]">{value}</p>
      {hint && <p className={cn("relative mt-2 text-xs font-semibold", dark ? "text-white/55" : "text-black/45")}>{hint}</p>}
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  target,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-[12px] px-4 text-sm font-bold transition",
        variant === "primary" && "bg-[#ef101b] text-white shadow-[0_8px_20px_rgba(239,16,27,0.25)] hover:bg-[#ff1825]",
        variant === "secondary" && "border border-black/10 bg-white text-[#111] hover:border-black/25",
        variant === "dark" && "bg-[#111] text-white hover:bg-black",
      )}
    >
      {children}
    </Link>
  );
}

export type Tone = "neutral" | "green" | "red" | "amber" | "blue";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    neutral: "bg-black/[0.06] text-black/70",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-[#ef101b]/10 text-[#c40812]",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-sky-100 text-sky-800",
  };
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold", tones[tone])}>{children}</span>;
}

/** Silme butonu: server action + onay penceresi */
export function DeleteForm({
  action,
  id,
  label = "Sil",
  confirm = "Silmek istediğinize emin misiniz?",
}: {
  action: (fd: FormData) => Promise<void>;
  id: number;
  label?: string;
  confirm?: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <ConfirmButton message={confirm} className="text-sm font-bold text-[#c40812] hover:underline">
        {label}
      </ConfirmButton>
    </form>
  );
}

/** Tablo kabuğu */
export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-black/[0.06] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/[0.06] text-[11px] uppercase tracking-[0.12em] text-black/40">
          <tr>
            {head.map((h, i) => (
              <th key={`${h}-${i}`} className="whitespace-nowrap px-4 py-3.5 font-black">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.05] [&>tr]:transition-colors">
          {children}
          {empty && (
            <tr>
              <td colSpan={head.length} className="px-4 py-12 text-center text-sm font-medium text-black/40">
                Kayıt yok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 align-middle", className)}>{children}</td>;
}

/** URL'den gelen ?hata=... mesajı */
export function ErrorNotice({ message }: { message?: string | string[] }) {
  if (!message || Array.isArray(message)) return null;
  return (
    <div className="mb-5 rounded-[14px] border border-[#ef101b]/20 bg-[#ef101b]/[0.06] px-4 py-3 text-sm font-semibold text-[#c40812]">{message}</div>
  );
}

/** Filtre çipi (link) */
export function FilterChip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition",
        active ? "bg-[#111] text-white" : "bg-white text-black/60 hover:bg-black/[0.06] hover:text-black",
      )}
    >
      {children}
    </Link>
  );
}
