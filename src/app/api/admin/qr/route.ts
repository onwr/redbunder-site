import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/constants";
import { qrMenuUrl, qrPng, qrSvg } from "@/lib/qr";

/** GET /api/admin/qr?format=png|svg – QR menü kodunu indirir (baskı için) */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "qr")) return NextResponse.json({ ok: false }, { status: 401 });

  const url = qrMenuUrl();
  const format = request.nextUrl.searchParams.get("format") === "svg" ? "svg" : "png";
  const disposition = `attachment; filename="redbunder-qr-menu.${format}"`;

  if (format === "svg") {
    return new NextResponse(await qrSvg(url), {
      headers: { "Content-Type": "image/svg+xml", "Content-Disposition": disposition },
    });
  }
  return new NextResponse(new Uint8Array(await qrPng(url)), {
    headers: { "Content-Type": "image/png", "Content-Disposition": disposition },
  });
}
