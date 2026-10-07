import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/** /robots.txt – panel ve API taranmaz */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
