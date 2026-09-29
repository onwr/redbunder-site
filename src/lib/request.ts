import "server-only";

/** Header'lardan istemci IP ve user-agent bilgisi */
export function getClientInfo(h: Headers) {
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || null;
  const userAgent = h.get("user-agent")?.slice(0, 255) ?? null;
  return { ip: ip ? ip.slice(0, 45) : null, userAgent };
}
