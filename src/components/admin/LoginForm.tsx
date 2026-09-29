"use client";

import { startTransition, useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginAction } from "@/actions/auth";
import { initialActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initialActionState);
  const [show, setShow] = useState(false);
  const input =
    "h-[52px] w-full rounded-[12px] border border-black/10 bg-white pl-11 pr-4 text-[15px] font-medium text-[#111] outline-none transition placeholder:text-black/30 focus:border-[#ef101b] focus:ring-4 focus:ring-[#ef101b]/10";

  return (
    <form
      // action yerine onSubmit: hatalı girişte e-posta silinmesin
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-4"
    >
      <input type="hidden" name="next" value={next} />

      {state.message && (
        <div role="alert" className="rounded-[12px] border border-[#ef101b]/20 bg-[#ef101b]/[0.06] px-4 py-3 text-sm font-semibold text-[#c40812]">
          {state.message}
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-[#111]">E-posta</span>
        <span className="relative block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-black/35" />
          <input name="email" type="email" placeholder="ornek@redbunder.com" autoComplete="username" required autoFocus className={input} />
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-[#111]">Şifre</span>
        <span className="relative block">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-black/35" />
          <input
            name="password"
            type={show ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className={cn(input, "pr-12")}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[8px] text-black/40 hover:bg-black/[0.05] hover:text-black"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
      </label>

      <button
        disabled={pending}
        className="group flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#ef101b] font-display text-lg font-bold uppercase text-white shadow-[0_14px_36px_rgba(239,16,27,0.3)] transition hover:bg-[#ff1825] disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        {!pending && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
      </button>
    </form>
  );
}
