import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/generated/prisma/enums";
import { SESSION_COOKIE } from "@/lib/constants";

/**
 * İmzalı JWT oturum çerezi. Bu dosya proxy.ts'ten de kullanıldığı için
 * prisma / server-only import etmez. Kullanıcının hâlâ aktif olduğu
 * kontrolü lib/session.ts içinde yapılır.
 */
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 saat

export type SessionPayload = { uid: number; role: Role };

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET en az 32 karakter olmalıdır (.env dosyasını kontrol edin).");
  }
  return new TextEncoder().encode(secret);
}

export function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.uid))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const uid = Number(payload.sub);
    if (!uid || typeof payload.role !== "string") return null;
    return { uid, role: payload.role as Role };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
