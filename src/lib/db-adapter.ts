import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/** DATABASE_URL (mysql://user:pass@host:3306/db) → MariaDB/MySQL driver adapter */
export function createDbAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL tanımlı değil (.env dosyasını kontrol edin).");

  const url = new URL(raw);
  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 10,
    // MySQL 8 (caching_sha2_password) için gerekli
    allowPublicKeyRetrieval: true,
  });
}
