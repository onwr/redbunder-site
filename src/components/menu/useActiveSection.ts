"use client";

import { useEffect, useState } from "react";

/**
 * Kaydırma konumuna göre aktif menü kategorisini bulur.
 * Bölümlerin id'si `${prefix}${slug}` olmalıdır. Üst kenarı `offset` px çizgisini geçen son
 * bölüm aktiftir; sayfanın sonuna gelindiyse son bölüm seçilir (kısa son kategori için).
 */
export function useActiveSection(slugs: string[], offset = 140, prefix = "kat-") {
  const [active, setActive] = useState(slugs[0]);
  const key = slugs.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    const update = () => {
      if (list.length === 0) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return setActive(list[list.length - 1]);

      let current = list[0];
      for (const slug of list) {
        const el = document.getElementById(prefix + slug);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = slug;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key, offset, prefix]);

  return active;
}
