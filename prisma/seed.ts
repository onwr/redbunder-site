import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDbAdapter } from "../src/lib/db-adapter";

/**
 * Başlangıç verisi. Tekrar çalıştırılabilir (upsert) – mevcut kayıtları ezmez,
 * sadece eksikleri ekler.
 */
const prisma = new PrismaClient({ adapter: createDbAdapter() });

const positions = [
  { slug: "mutfak", title: "Mutfak", description: "Burger hazırlama, ızgara ve mutfak operasyonu." },
  { slug: "servis", title: "Servis", description: "Salon servisi ve misafir memnuniyeti." },
  { slug: "kasiyer", title: "Kasiyer", description: "Sipariş alma, kasa ve ödeme işlemleri." },
  { slug: "kurye", title: "Kurye", description: "Paket servis teslimatları (motor ehliyeti gerekli)." },
  { slug: "vardiya-sorumlusu", title: "Vardiya Sorumlusu", description: "Vardiya planlama ve ekip yönetimi." },
];

/** Gerçek şubeler (telefon, saat, harita linki ve görsel Admin > Şubeler'den eklenir) */
const branches = [
  { slug: "subayevleri", name: "Subayevleri", district: "Keçiören", address: "Subayevleri Mah. Fahrettin Altay Cd. No:6, Keçiören/Ankara" },
  { slug: "mamak", name: "Mamak", district: "Mamak", address: "Kutlu Mahallesi Mutlu Caddesi 26/13, Mamak/Ankara" },
  { slug: "yesilova", name: "Yeşilova", district: "Etimesgut", address: "Yeşilova Mah. 4014 Cad. Doğan Life No:4 B, Etimesgut/Ankara" },
  { slug: "demetevler", name: "Demetevler", district: "Yenimahalle", address: "Demetevler, 359. Cd. Saray Apartmanı 2/D, 06170 Yenimahalle/Ankara" },
  { slug: "cubuk-ataturk", name: "Çubuk Atatürk", district: "Çubuk", address: "Atatürk Mah. Adnan Menderes Blv. No:30 B, Çubuk/Ankara" },
  { slug: "esenboga", name: "Esenboğa", district: "Çubuk", address: "Esenboğa Merkez, Atatürk Cd. No:56 D:B, 06760 Çubuk/Ankara" },
  { slug: "atapark", name: "Atapark", district: "Keçiören", address: "Atapark Mahallesi 340. Cadde 18/B, Keçiören/Ankara" },
  { slug: "ayranci", name: "Ayrancı", district: "Çankaya", address: "Ayrancı Mahallesi Tirebolu Sokak No:36/B Kuğu Apartmanı, Çankaya/Ankara" },
  { slug: "ozgunkent", name: "Özgünkent", district: "Yenimahalle", address: "1859. Cad. Özgünkent No:12, 06370 Yenimahalle/Ankara" },
];

const menu: { slug: string; name: string; products: { slug: string; name: string; price: number; description?: string; isPopular?: boolean; isSpicy?: boolean; isNew?: boolean }[] }[] = [
  {
    slug: "burgerler",
    name: "Burgerler",
    products: [
      { slug: "red-bunder-classic", name: "Red Bunder Classic", price: 289, description: "150 gr dana köfte, cheddar, marul, domates, turşu, özel sos.", isPopular: true },
      { slug: "double-smash", name: "Double Smash", price: 349, description: "2 x 90 gr smash köfte, çift cheddar, karamelize soğan.", isPopular: true },
      { slug: "hot-bunder", name: "Hot Bunder", price: 309, description: "Jalapeno, acı sos, pepper jack peyniri.", isSpicy: true },
      { slug: "crispy-chicken", name: "Crispy Chicken", price: 259, description: "Çıtır tavuk göğsü, coleslaw, ranch sos.", isNew: true },
    ],
  },
  {
    slug: "yan-urunler",
    name: "Yan Ürünler",
    products: [
      { slug: "patates-kizartmasi", name: "Patates Kızartması", price: 89, isPopular: true },
      { slug: "sogan-halkasi", name: "Soğan Halkası", price: 99 },
      { slug: "cheddar-patates", name: "Cheddar Soslu Patates", price: 119 },
    ],
  },
  {
    slug: "icecekler",
    name: "İçecekler",
    products: [
      { slug: "kola", name: "Kola (33 cl)", price: 55 },
      { slug: "ayran", name: "Ayran", price: 40 },
      { slug: "limonata", name: "Ev Yapımı Limonata", price: 65 },
    ],
  },
];

async function main() {
  // İlk yönetici
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@redbunder.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 8) throw new Error("SEED_ADMIN_PASSWORD en az 8 karakter olmalı (.env).");
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Yönetici", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });

  for (const [i, p] of positions.entries()) {
    await prisma.position.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, sortOrder: i } });
  }
  for (const [i, b] of branches.entries()) {
    await prisma.branch.upsert({ where: { slug: b.slug }, update: {}, create: { ...b, sortOrder: i } });
  }
  for (const [ci, c] of menu.entries()) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, sortOrder: ci },
    });
    for (const [pi, p] of c.products.entries()) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: { ...p, categoryId: category.id, sortOrder: pi },
      });
    }
  }
  await prisma.setting.upsert({ where: { key: "email" }, update: {}, create: { key: "email", value: "info@redbunder.com" } });

  console.log(`✔ Seed tamam. Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
