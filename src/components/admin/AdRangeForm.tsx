"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange } from "lucide-react";

/** Özel tarih aralığı seçimi (ay okları yanında açılır küçük form) */
export default function AdRangeForm({ from, to, platform }: { from: string; to: string; platform?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(from);
  const [t, setT] = useState(to);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Özel tarih aralığı"
        className="flex h-10 items-center gap-2 rounded-[10px] border border-black/10 px-3 text-sm font-bold hover:border-black/30"
      >
        <CalendarRange className="h-4 w-4" /> <span className="hidden sm:inline">Aralık</span>
      </button>
      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (f && t && f <= t) router.push(`?from=${f}&to=${t}${platform ? `&platform=${platform}` : ""}`);
            setOpen(false);
          }}
          className="absolute left-0 top-12 z-30 w-72 space-y-3 rounded-[16px] border border-black/10 bg-white p-4 shadow-xl"
        >
          <label className="block text-xs font-bold">
            Başlangıç
            <input type="date" value={f} onChange={(e) => setF(e.target.value)} className="mt-1 w-full rounded-[10px] border border-black/10 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold">
            Bitiş
            <input type="date" value={t} min={f} onChange={(e) => setT(e.target.value)} className="mt-1 w-full rounded-[10px] border border-black/10 px-3 py-2 text-sm" />
          </label>
          <button className="h-10 w-full rounded-[10px] bg-[#ef101b] text-sm font-bold text-white">Uygula</button>
        </form>
      )}
    </div>
  );
}
