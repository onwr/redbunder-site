// Logodan site ikonlarını üretir (web + cv): favicon.ico, icon.png, apple-icon.png + QR logosu (public/qr-mark.png)
// Kullanım: node scripts/make-icons.mjs   (logo değişirse tekrar çalıştırın)
// Küçük boyutlarda yazı okunmadığı için logonun sadece burger kısmı kullanılır.
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = path.join(root, "public/logo.png");
const targets = [path.join(root, "src/app"), path.resolve(root, "../cv/src/app")];

// logo.png içinde burger 70–918. satırlar arasında, yazı 929'dan başlıyor
const cropped = await sharp(logo).extract({ left: 0, top: 60, width: 1254, height: 866 }).png().toBuffer();
const mark = await sharp(cropped).trim().png().toBuffer();

const square = async (size, pad = 0, background = { r: 0, g: 0, b: 0, alpha: 0 }) => {
  const resized = await sharp(mark)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  // Opak zemin istenirse saydam alanları zeminle doldur
  const img = background.alpha === 1 ? sharp(resized).flatten({ background }) : sharp(resized);
  return img.png({ compressionLevel: 9, palette: size >= 128 }).toBuffer();
};

/** PNG'leri gömülü tek bir .ico dosyası (modern tarayıcılar PNG içeren ICO'yu destekler) */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const favicon = ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await square(size) }))));
const icon = await square(512, 16);
// iOS saydamlığı siyaha çevirir; marka zemini + kenar boşluğu ile
const apple = await square(180, 22, { r: 17, g: 17, b: 17, alpha: 1 });

// QR kodların ortasındaki logo (web/public/qr-mark.png) – bkz. src/lib/qr.ts
writeFileSync(path.join(root, "public/qr-mark.png"), await square(256));
console.log("✔ public/qr-mark.png");

for (const dir of targets) {
  writeFileSync(path.join(dir, "favicon.ico"), favicon);
  writeFileSync(path.join(dir, "icon.png"), icon);
  writeFileSync(path.join(dir, "apple-icon.png"), apple);
  console.log(`✔ ${path.relative(root, dir)}: favicon.ico, icon.png, apple-icon.png`);
}
