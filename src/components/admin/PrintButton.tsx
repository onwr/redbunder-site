"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#ef101b] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(239,16,27,0.25)] hover:bg-[#ff1825]"
    >
      <Printer className="h-4 w-4" /> Yazdır / PDF
    </button>
  );
}
