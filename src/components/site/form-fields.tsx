import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Public formların (iletişim, franchise) ortak alan stilleri */

export function inputCls(hasError: boolean) {
  return cn(
    "h-[52px] w-full rounded-[12px] border bg-white pl-11 pr-4 text-[15px] font-medium text-[#111] outline-none transition placeholder:text-black/35 focus:ring-4",
    hasError ? "border-[#ef101b] focus:ring-[#ef101b]/10" : "border-black/[0.1] focus:border-[#ef101b] focus:ring-[#ef101b]/10",
  );
}

export function Field({
  label,
  error,
  icon,
  iconTop,
  children,
}: {
  label: string;
  error?: string;
  icon: ReactNode;
  iconTop?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#111]">{label}</span>
      <span className="relative block">
        <span
          className={cn(
            "pointer-events-none absolute left-4 z-10 text-black/40 [&>svg]:h-[18px] [&>svg]:w-[18px]",
            iconTop ? "top-4" : "top-1/2 -translate-y-1/2",
          )}
        >
          {icon}
        </span>
        {children}
      </span>
      {error && <span className="mt-1.5 block text-xs font-semibold text-[#ef101b]">{error}</span>}
    </label>
  );
}
