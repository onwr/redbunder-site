import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Görseller public/ yerine UPLOAD_DIR'e yazılır ve /uploads/[...path] route'u ile sunulur
 * (Next.js, build sonrasında public/'e eklenen dosyaları servis etmez).
 */
export const UPLOAD_ROOT = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || "storage/uploads");

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export class UploadError extends Error {}

/** Formdan gelen File'ı kaydeder → "/uploads/urunler/2026/09/<uuid>.webp". Dosya seçilmemişse null. */
export async function saveImage(file: FormDataEntryValue | null, folder: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new UploadError("Sadece JPG, PNG, WEBP veya AVIF yükleyebilirsiniz.");
  if (file.size > MAX_BYTES) throw new UploadError("Görsel en fazla 4 MB olabilir.");

  const now = new Date();
  const rel = path.posix.join(
    folder,
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
    `${randomUUID()}.${ext}`,
  );
  const abs = path.join(/*turbopackIgnore: true*/ UPLOAD_ROOT, rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${rel}`;
}

/** Eski görseli siler (yalnızca /uploads altındakileri) */
export async function deleteImage(url: string | null | undefined) {
  if (!url?.startsWith("/uploads/")) return;
  const abs = path.resolve(/*turbopackIgnore: true*/ UPLOAD_ROOT, url.slice("/uploads/".length));
  if (!abs.startsWith(UPLOAD_ROOT + path.sep)) return;
  await unlink(abs).catch(() => undefined);
}
