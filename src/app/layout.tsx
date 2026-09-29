import type { Metadata, Viewport } from "next";
import { Inter, Kaushan_Script, Oswald } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin", "latin-ext"], weight: ["500", "700"] });
/** El yazısı vurgu (footer sloganı vb.) → font-script */
const script = Kaushan_Script({ variable: "--font-kaushan", subsets: ["latin", "latin-ext"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Red Bunder – Ankara'nın Burger Markası", template: "%s | Red Bunder" },
  description: "Red Bunder: Ankara'nın burger markası. Menümüzü inceleyin, size en yakın şubeyi bulun.",
  openGraph: { siteName: "Red Bunder", locale: "tr_TR", type: "website" },
};

export const viewport: Viewport = { themeColor: "#111111" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} ${oswald.variable} ${script.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
