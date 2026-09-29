/**
 * Basit, bellek içi (in-memory) IP bazlı hız sınırlayıcı.
 * Tek sunuculu kurulum için yeterlidir; birden fazla instance'ta Redis vb. kullanın.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }
  bucket.count++;
  return { ok: true, remaining: limit - bucket.count };
}

// Süresi dolmuş kayıtları ara ara temizle
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
  }, 60_000).unref?.();
}
