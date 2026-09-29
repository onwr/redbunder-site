import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";
import { SITE } from "@/lib/constants";

/** QR kodun açtığı adres – tüm şubelerde ve masalarda aynı: https://redbunder.com/menu */
export const QR_MENU_PATH = "/menu";

export function qrMenuUrl() {
  return new URL(QR_MENU_PATH, SITE.url).toString();
}

const options = {
  // H: kodun ~%30'u kapansa da okunur → ortadaki logo güvenle sığar
  errorCorrectionLevel: "H" as const,
  margin: 2,
  color: { dark: "#111111", light: "#ffffff" },
};

/** Logo kutusunun QR genişliğine oranı (alan olarak ~%5; H seviyesinin çok altında) */
const LOGO_RATIO = 0.22;

let markDataUri: Promise<string> | null = null;

/** public/qr-mark.png (npm run icons ile logodan üretilir) → data URI, bir kez okunur */
function getMark() {
  markDataUri ??= readFile(path.join(process.cwd(), "public", "qr-mark.png")).then(
    (buf) => `data:image/png;base64,${buf.toString("base64")}`,
  );
  return markDataUri;
}

/** Ortasında logo olan QR (SVG). Logo gömülüdür; dosya tek başına basılabilir. */
export async function qrSvg(url: string) {
  const svg = await QRCode.toString(url, { ...options, type: "svg" });
  const size = Number(svg.match(/viewBox="0 0 (\d+) \d+"/)?.[1]);
  if (!size) return svg;

  const box = size * LOGO_RATIO;
  const start = (size - box) / 2;
  const pad = box * 0.12; // logo ile beyaz zemin arası
  const logo =
    `<rect x="${start}" y="${start}" width="${box}" height="${box}" rx="${box * 0.22}" fill="#ffffff"/>` +
    `<image href="${await getMark()}" x="${start + pad}" y="${start + pad}" width="${box - pad * 2}" height="${box - pad * 2}" preserveAspectRatio="xMidYMid meet"/>`;

  return svg.replace("</svg>", `${logo}</svg>`);
}

/** Aynı QR'ın PNG hâli (baskı / paylaşım için) */
export async function qrPng(url: string, width = 1024) {
  const svg = await qrSvg(url);
  // SVG vektör olduğu için hedef genişlikte net render edilir
  return sharp(Buffer.from(svg), { density: 600 }).resize(width, width).png().toBuffer();
}
