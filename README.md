# Red Bunder – Ana Site + Yönetim Paneli

**Next.js 16 · Tailwind CSS 4 · MySQL · Prisma 7 · Zod · jose · bcryptjs · qrcode**

Ana site, QR menü ve tüm yönetim paneli. Menü ve fiyatlar tüm şubelerde aynıdır. Ortak veritabanı şemasının sahibi bu projedir (bkz. [../README.md](../README.md)).
Public sayfalar çalışan ama minimal stilli iskeletlerdir; tasarım yerleri `TODO(UI)` ile işaretli.

## Kurulum

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev            # http://localhost:3000 · panel: http://localhost:3000/admin
```

**MySQL:** `../docker-compose.yml` (Docker) ya da XAMPP. XAMPP'ta phpMyAdmin'den `redbunder` veritabanını `utf8mb4_turkish_ci` ile oluştur, `DATABASE_URL="mysql://root@localhost:3306/redbunder"`.

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | Ortak MySQL adresi (cv ile aynı) |
| `NEXT_PUBLIC_SITE_URL` | Sitenin dış adresi – **QR kodlar buna göre üretilir** (canlıda `https://redbunder.com`) |
| `NEXT_PUBLIC_CAREER_URL` | Kariyer sitesi adresi (menüdeki "Kariyer") |
| `AUTH_SECRET` | Oturum imzalama anahtarı (≥ 32 karakter) |
| `UPLOAD_DIR` | Yüklenen görsellerin klasörü (varsayılan `storage/uploads`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | `db:seed` ile oluşturulan ilk yönetici |

## Scriptler

| Komut | İş |
|---|---|
| `dev` / `build` / `start` | Geliştirme / derleme / production |
| `lint` / `typecheck` | ESLint / TypeScript |
| `db:migrate` | Şema değişikliğinden migration üret + uygula |
| `db:deploy` | Production'da migration'ları uygula |
| `db:seed` | Başlangıç verisi (tekrar çalıştırılabilir, mevcutları ezmez) |
| `db:studio` | Prisma Studio |
| `icons` | `public/logo.png`'den favicon.ico, icon.png, apple-icon.png üretir (web + cv). Logo değişince çalıştırın |

## Sayfalar

| Yol | Açıklama |
|---|---|
| `/` | Ana sayfa: hero, sipariş platformları, öne çıkanlar, neden biz, kampanya bandı, şubeler, yorumlar, Instagram, franchise/kariyer bandı. Verisi olmayan bölüm gizlenir |
| `/menu` | Menü (arama, kategoriler, ürün detayı) |
| `/qr` | Sade mobil menü (header/footer'sız). Basılı QR kod `/menu`'yü açar |
| `/subeler` · `/hakkimizda` | Şube bulucu · hikaye |
| `/franchise` | Franchise tanıtımı + başvuru formu → Admin > Mesajlar (konu: Franchise; şehir, bütçe, lokasyon, deneyim mesaj metninde) |
| `/iletisim` | Konu seçmeli form (Genel, Öneri ve Görüşler, Şikayet, Franchise, Diğer) + opsiyonel şube → Admin > Mesajlar. `?konu=oneri` ön seçer. Instagram kartı Site Ayarları'ndan |
| `/api/menu` | Menü JSON |

## Yönetim Paneli (`/admin`)

Veritabanındaki kullanıcılarla e-posta + şifre girişi. Roller:

| Rol | Erişim |
|---|---|
| Yönetici (`ADMIN`) | Her şey + kullanıcı yönetimi |
| Menü Editörü (`EDITOR`) | Görevler, reklam raporları, menü, şubeler, QR, mesajlar, yorumlar, site ayarları |
| İnsan Kaynakları (`HR`) | Görevler, başvurular, pozisyonlar |

Yetki haritası: `src/lib/constants.ts` → `ROLE_AREAS`. Her sayfa ve action `requireUser("<bölüm>")` ile korunur; `src/proxy.ts` sadece oturum çerezine bakan ön kontroldür.

| Bölüm | Özellikler |
|---|---|
| Ürünler / Kategoriler | CRUD, görsel yükleme, yeni/popüler/acı etiketleri, kalori, alerjen, sıralama, hızlı yayından kaldırma |
| Şubeler | Adres, telefon, saat, harita linki, görsel (Şubeler sayfası + kariyer formu) |
| QR Menü | Tek QR kod → `/menu` (`src/lib/qr.ts` → `QR_MENU_PATH`), ortasında logo (`public/qr-mark.png`, `npm run icons` ile üretilir; hata düzeltme seviyesi H). PNG (1024px) ve SVG (matbaa, logo gömülü) indirme |
| Başvurular | cv'den gelenler; filtre, arama, durum + not, CSV/Excel, ara/WhatsApp |
| Pozisyonlar | Kariyer formundaki alanlar (başvurusu olan pozisyon silinmez, pasife alınır) |
| Kariyer Sitesi | cv.redbunder.com içerikleri: başvuruları aç/kapat (+ kapalı mesajı), yaş aralığı, hero metinleri, slogan, form alt başlığı, KVKK metni, teşekkür metni, 4 avantaj kartı. `settings` tablosunda `cv_` önekli; boş alan CV varsayılanını kullanır |
| Mesajlar | İletişim formu; konu ve okunmamış filtresi, şube bilgisi, okundu/okunmadı, e-posta ile yanıtla / ara |
| Kullanıcılar | Ekle/düzenle/sil, rol, pasife alma (kendini kilitleyemezsin) |
| Görevler & Takvim | Ay takvimi + liste; durum (yapılacak/devam/tamam), sorumlu, öncelik, kategori, ilgili platform; gecikenler kırmızı, sidebar rozeti = bugün + gecikmiş açık görev; tek tıkla tamamla |
| Reklam Raporları | Elle girilen platform verilerinden (Meta, Google, TikTok, Trendyol Go, Yemeksepeti, Getir, Migros) ay/aralık özeti: harcama, ciro, ROAS, CTR, TBM, sipariş başı maliyet; platform kırılımı, son 6 ay trendi. **Sunum / Yazdır** → `/admin/rapor` (PDF olarak kaydedilebilir). Kayıtlar CSV olarak indirilebilir |
| Yorumlar | Ana sayfadaki müşteri yorumları (sadece gerçek yorumlar; aktif yorum yoksa bölüm gizlenir) |
| Site Ayarları | İletişim, sosyal medya, sipariş platformu linkleri (Trendyol Go, Yemeksepeti, Getir, Migros), ana sayfa kampanya bandı |

## Klasör yapısı

```
prisma/schema.prisma        ORTAK şema (cv buradan kopyalar)
src/
  app/
    (site)/                 Public sayfalar (Header + Footer)
    (qr)/qr/                QR menü (kendi sade düzeni)
    admin/login/            Giriş
    admin/(panel)/          Panel sayfaları (sidebar layout); [id] = "yeni" → oluştur
    api/                    menü JSON, admin QR indirme, başvuru CSV
    uploads/[...path]/      Yüklenen görselleri sunar
  actions/                  Server action'lar (auth, menu, branches, careers, users, site)
  components/
    admin/form.tsx          ActionForm + TextField/SelectField/ImageField… (hataları otomatik gösterir)
    admin/ui.tsx            PageHeader, Card, Table, Badge, DeleteForm…
    menu/                   MenuBrowser (/menu), QrMenu (QR menü), parts (ortak kart/detay)
    site/                   Header, Footer, PageHero, ContactForm        ← UI
  lib/
    services/menu.ts        getMenu() – aktif kategoriler + ürünler
    session.ts              getCurrentUser / requireUser(area)
    constants.ts            Roller, yetkiler, admin menüsü, etiketler
    uploads.ts · qr.ts · validations/ · utils.ts (slugify, formatPrice)
```

## Notlar

- **Görseller** `public/` yerine `UPLOAD_DIR`'e yazılır ve `/uploads/...` route'u ile sunulur (Next.js build sonrası `public/`'e eklenenleri servis etmez). Sunucuda bu klasörü yedekle; birden fazla sunucuda S3 vb. kullan.
- QR kod sabittir (`/menu`); menü değişince yeniden basmaya gerek yok. Eski `/menu/<şube>` adresleri `/menu`'ye yönlendirilir (`next.config.ts`). Sade mobil QR menü sayfası `/qr` de ayrıca açık kalır.
- Rate limit bellek içidir (tek sunucu için).
