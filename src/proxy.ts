import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";

/**
 * /admin ve /api/admin için iyimser oturum kontrolü (sadece JWT imzası).
 * Rol/aktiflik kontrolü sayfa ve action'lardaki requireUser() ile yapılır.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, message: "Yetkisiz erişim." }, { status: 401 });
  }
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
