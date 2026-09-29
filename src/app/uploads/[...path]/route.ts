import { readFile } from "node:fs/promises";
import path from "node:path";
import { IMAGE_TYPES, UPLOAD_ROOT } from "@/lib/uploads";

const MIME_BY_EXT = Object.fromEntries(Object.entries(IMAGE_TYPES).map(([mime, ext]) => [ext, mime]));

/** GET /uploads/... – admin panelinden yüklenen görselleri sunar */
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: parts } = await ctx.params;
  const abs = path.resolve(/*turbopackIgnore: true*/ UPLOAD_ROOT, ...parts);
  const mime = MIME_BY_EXT[path.extname(abs).slice(1).toLowerCase()];

  // Dizin dışına çıkma (../) ve bilinmeyen uzantı engellenir
  if (!abs.startsWith(UPLOAD_ROOT + path.sep) || !mime) return new Response("Bulunamadı", { status: 404 });

  try {
    const file = await readFile(abs);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": mime,
        // Dosya adları UUID olduğu için içerik değişmez → uzun süre cache'lenebilir
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Bulunamadı", { status: 404 });
  }
}
