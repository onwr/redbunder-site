import type { MetadataRoute } from "next";
import { NAV_LINKS, SITE } from "@/lib/constants";

/** /sitemap.xml – public sayfalar (header menüsündekiler). /qr, /menu'nün kopyası olduğu için dahil değil */
const PRIORITY: Record<string, number> = { "/": 1, "/menu": 0.9, "/subeler": 0.9, "/duyurular": 0.7 };
type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
const FREQUENCY: Record<string, Freq> = { "/menu": "weekly", "/subeler": "weekly", "/duyurular": "daily" };

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...NAV_LINKS.map((l): MetadataRoute.Sitemap[number] => ({
      url: new URL(l.href, SITE.url).toString(),
      changeFrequency: FREQUENCY[l.href] ?? "monthly",
      priority: PRIORITY[l.href] ?? 0.6,
    })),
    { url: new URL("/kvkk", SITE.url).toString(), changeFrequency: "yearly", priority: 0.2 },
  ];
}
