import type {
  AdPlatform,
  ApplicationStatus,
  ContactTopic,
  Gender,
  Role,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/generated/prisma/enums";

export const SITE = {
  name: "Red Bunder",
  slogan: "Ankara'nın Burger Markası.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  careerUrl: process.env.NEXT_PUBLIC_CAREER_URL ?? "https://cv.redbunder.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/subeler", label: "Şubeler" },
  { href: "/franchise", label: "Franchise" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

/* ------------------------------- Admin rolleri ------------------------------- */

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Yönetici",
  EDITOR: "Menü Editörü",
  HR: "İnsan Kaynakları",
};

/** Admin panelindeki bölümler */
export type AdminArea =
  | "dashboard"
  | "tasks"
  | "ads"
  | "menu"
  | "branches"
  | "qr"
  | "applications"
  | "positions"
  | "career"
  | "messages"
  | "reviews"
  | "users"
  | "settings";

/** Hangi rol hangi bölüme erişebilir */
export const ROLE_AREAS: Record<Role, AdminArea[]> = {
  ADMIN: ["dashboard", "tasks", "ads", "menu", "branches", "qr", "applications", "positions", "career", "messages", "reviews", "users", "settings"],
  EDITOR: ["dashboard", "tasks", "ads", "menu", "branches", "qr", "career", "messages", "reviews", "settings"],
  HR: ["dashboard", "tasks", "applications", "positions", "career"],
};

export function can(role: Role, area: AdminArea) {
  return ROLE_AREAS[role].includes(area);
}

/** Admin menüsü (sidebar) – group: menüdeki bölüm başlığı */
export const ADMIN_NAV: { href: string; label: string; area: AdminArea; group: string }[] = [
  { href: "/admin", label: "Genel Bakış", area: "dashboard", group: "Genel" },
  { href: "/admin/gorevler", label: "Görevler & Takvim", area: "tasks", group: "Genel" },
  { href: "/admin/reklamlar", label: "Reklam Raporları", area: "ads", group: "Pazarlama" },
  { href: "/admin/reklamlar/kayitlar", label: "Reklam Kayıtları", area: "ads", group: "Pazarlama" },
  { href: "/admin/menu/urunler", label: "Ürünler", area: "menu", group: "İçerik" },
  { href: "/admin/menu/kategoriler", label: "Kategoriler", area: "menu", group: "İçerik" },
  { href: "/admin/subeler", label: "Şubeler", area: "branches", group: "İçerik" },
  { href: "/admin/qr", label: "QR Menü", area: "qr", group: "İçerik" },
  { href: "/admin/yorumlar", label: "Yorumlar", area: "reviews", group: "İçerik" },
  { href: "/admin/mesajlar", label: "Mesajlar", area: "messages", group: "İletişim & İK" },
  { href: "/admin/basvurular", label: "Başvurular", area: "applications", group: "İletişim & İK" },
  { href: "/admin/pozisyonlar", label: "Pozisyonlar", area: "positions", group: "İletişim & İK" },
  { href: "/admin/kariyer-sitesi", label: "Kariyer Sitesi", area: "career", group: "İletişim & İK" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", area: "users", group: "Sistem" },
  { href: "/admin/ayarlar", label: "Site Ayarları", area: "settings", group: "Sistem" },
];

/* --------------------------------- Pazarlama --------------------------------- */

export const AD_PLATFORMS: { value: AdPlatform; label: string; dot: string }[] = [
  { value: "META", label: "Meta (Instagram/Facebook)", dot: "#1877f2" },
  { value: "GOOGLE", label: "Google Ads", dot: "#34a853" },
  { value: "TIKTOK", label: "TikTok", dot: "#111111" },
  { value: "TRENDYOL", label: "Trendyol Go", dot: "#f27a1a" },
  { value: "YEMEKSEPETI", label: "Yemeksepeti", dot: "#ea004b" },
  { value: "GETIR", label: "Getir Yemek", dot: "#5d3ebc" },
  { value: "MIGROS", label: "Migros Yemek", dot: "#ff7f00" },
  { value: "DIGER", label: "Diğer", dot: "#9ca3af" },
];
export const AD_PLATFORM_LABELS = Object.fromEntries(AD_PLATFORMS.map((p) => [p.value, p.label])) as Record<AdPlatform, string>;

/* ---------------------------------- Görevler --------------------------------- */

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = { YAPILACAK: "Yapılacak", DEVAM: "Devam ediyor", TAMAM: "Tamamlandı" };
export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = { DUSUK: "Düşük", NORMAL: "Normal", YUKSEK: "Yüksek" };
export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  REKLAM: "Reklam",
  SOSYAL_MEDYA: "Sosyal medya",
  KAMPANYA: "Kampanya",
  OPERASYON: "Operasyon",
  MENU: "Menü",
  IK: "İK",
  DIGER: "Diğer",
};

/* ---------------------------------- Kariyer ---------------------------------- */

export const GENDER_LABELS: Record<Gender, string> = {
  KADIN: "Kadın",
  ERKEK: "Erkek",
  DIGER: "Diğer",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  YENI: "Yeni",
  INCELENIYOR: "İnceleniyor",
  GORUSME: "Görüşme",
  KABUL: "Kabul",
  RED: "Red",
};

export const STATUS_TONES: Record<ApplicationStatus, "blue" | "amber" | "neutral" | "green" | "red"> = {
  YENI: "blue",
  INCELENIYOR: "amber",
  GORUSME: "neutral",
  KABUL: "green",
  RED: "red",
};

/* --------------------------------- İletişim ---------------------------------- */

/** İletişim formu konu seçenekleri (sıra formdaki sıradır) */
export const CONTACT_TOPICS: { value: ContactTopic; label: string; tone: "blue" | "green" | "red" | "amber" | "neutral" }[] = [
  { value: "GENEL", label: "Genel Bilgi", tone: "blue" },
  { value: "ONERI_GORUS", label: "Öneri ve Görüşler", tone: "green" },
  { value: "SIKAYET", label: "Şikayet", tone: "red" },
  { value: "FRANCHISE", label: "Franchise / İş Birliği", tone: "amber" },
  { value: "DIGER", label: "Diğer", tone: "neutral" },
];

export const CONTACT_TOPIC_LABELS = Object.fromEntries(CONTACT_TOPICS.map((t) => [t.value, t.label])) as Record<ContactTopic, string>;

/* ------------------------------- Kariyer sitesi ------------------------------ */

/**
 * cv.redbunder.com içerikleri (settings tablosu, "cv_" önekli). Boş bırakılan alan
 * CV projesindeki varsayılanı kullanır: cv/src/lib/career-content.ts → CAREER_DEFAULTS.
 * "placeholder" o varsayılanın kopyasıdır; değiştirirseniz ikisini birlikte güncelleyin.
 */
export const CAREER_FIELDS: {
  key: string;
  label: string;
  group: string;
  type?: "textarea" | "number" | "toggle";
  placeholder?: string;
  hint?: string;
}[] = [
  { key: "cv_open", label: "Başvurular", group: "Başvuru durumu", type: "toggle" },
  {
    key: "cv_closed_message",
    label: "Başvurular kapalıyken gösterilecek mesaj",
    group: "Başvuru durumu",
    type: "textarea",
    placeholder: "Şu anda aktif bir alımımız bulunmuyor. Yeni pozisyonlar açıldığında bu sayfadan duyuracağız.",
  },
  { key: "cv_age_min", label: "En düşük yaş", group: "Başvuru durumu", type: "number", placeholder: "18" },
  { key: "cv_age_max", label: "En yüksek yaş", group: "Başvuru durumu", type: "number", placeholder: "55" },

  { key: "cv_hero_eyebrow", label: "Üst etiket", group: "Ana başlık (hero)", placeholder: "Kariyer Fırsatları" },
  { key: "cv_hero_line1", label: "Başlık 1. satır (beyaz)", group: "Ana başlık (hero)", placeholder: "RED BUNDER" },
  { key: "cv_hero_line2", label: "Başlık 2. satır (kırmızı)", group: "Ana başlık (hero)", placeholder: "AİLESİNE" },
  { key: "cv_hero_line3", label: "Başlık 3. satır (krem)", group: "Ana başlık (hero)", placeholder: "KATIL" },
  {
    key: "cv_hero_text",
    label: "Açıklama",
    group: "Ana başlık (hero)",
    type: "textarea",
    placeholder: "Ankara'nın burger markasında\nkariyer fırsatları seni bekliyor.",
    hint: "Her satır ayrı satırda gösterilir.",
  },
  {
    key: "cv_slogan",
    label: "Eğik slogan",
    group: "Ana başlık (hero)",
    type: "textarea",
    placeholder: "Lezzetli\nkariyerler\nburada başlar.",
    hint: "Her satır ayrı satırda gösterilir.",
  },

  { key: "cv_form_subtitle", label: "Form alt başlığı", group: "Başvuru formu", placeholder: "Kısa formu doldur, Red Bunder ekibine katıl." },
  {
    key: "cv_kvkk_text",
    label: "KVKK onay metni",
    group: "Başvuru formu",
    type: "textarea",
    placeholder: "KVKK aydınlatma metnini okudum, kişisel verilerimin işe alım süreci için işlenmesini onaylıyorum.",
  },
  {
    key: "cv_success_text",
    label: "Başvuru sonrası teşekkür metni",
    group: "Başvuru formu",
    type: "textarea",
    placeholder: "Red Bunder ailesine gösterdiğin ilgi için teşekkürler. En kısa sürede seninle iletişime geçeceğiz.",
  },

  { key: "cv_benefits_title", label: "Bölüm başlığı", group: "Sana neler sunuyoruz?", placeholder: "Sana Neler Sunuyoruz?", hint: "Son kelime kırmızı gösterilir." },
  {
    key: "cv_benefits_text",
    label: "Bölüm açıklaması",
    group: "Sana neler sunuyoruz?",
    type: "textarea",
    placeholder: "Dinamik bir ekibin parçası ol. Çalışma hayatına güçlü bir başlangıç yap ve Red Bunder ailesinde kariyerine yeni bir yön ver.",
  },
  { key: "cv_benefit_1_title", label: "Kart 1 başlık", group: "Sana neler sunuyoruz?", placeholder: "Esnek Çalışma" },
  { key: "cv_benefit_1_text", label: "Kart 1 metin", group: "Sana neler sunuyoruz?", placeholder: "Pozisyonlara uygun esnek çalışma seçeneklerinden yararlan." },
  { key: "cv_benefit_2_title", label: "Kart 2 başlık", group: "Sana neler sunuyoruz?", placeholder: "Şube Seçeneği" },
  { key: "cv_benefit_2_text", label: "Kart 2 metin", group: "Sana neler sunuyoruz?", placeholder: "Sana en uygun Red Bunder şubesinde çalışma fırsatı yakala." },
  { key: "cv_benefit_3_title", label: "Kart 3 başlık", group: "Sana neler sunuyoruz?", placeholder: "Hızlı Geri Dönüş" },
  { key: "cv_benefit_3_text", label: "Kart 3 metin", group: "Sana neler sunuyoruz?", placeholder: "Başvurular kısa sürede değerlendirilir ve uygun adaylarla iletişime geçilir." },
  { key: "cv_benefit_4_title", label: "Kart 4 başlık", group: "Sana neler sunuyoruz?", placeholder: "Genç & Dinamik" },
  { key: "cv_benefit_4_text", label: "Kart 4 metin", group: "Sana neler sunuyoruz?", placeholder: "Enerjik, hızlı ve takım ruhunun güçlü olduğu bir ekibin parçası ol." },
];

/* ------------------------------- Site ayarları ------------------------------- */

/** Admin > Site Ayarları'nda düzenlenebilen anahtarlar (group: formdaki bölüm başlığı) */
export const SETTING_FIELDS = [
  { key: "phone", label: "Telefon", group: "İletişim" },
  { key: "email", label: "E-posta", group: "İletişim" },
  { key: "address", label: "Merkez Adres", group: "İletişim" },
  { key: "instagram", label: "Instagram URL", group: "Sosyal Medya" },
  { key: "x", label: "X (Twitter) URL", group: "Sosyal Medya" },
  { key: "tiktok", label: "TikTok URL", group: "Sosyal Medya" },
  { key: "youtube", label: "YouTube URL", group: "Sosyal Medya" },
  { key: "linkedin", label: "LinkedIn URL", group: "Sosyal Medya" },
  { key: "order_trendyol", label: "Trendyol Go mağaza linki", group: "Sipariş Platformları" },
  { key: "order_yemeksepeti", label: "Yemeksepeti mağaza linki", group: "Sipariş Platformları" },
  { key: "order_getir", label: "Getir Yemek mağaza linki", group: "Sipariş Platformları" },
  { key: "order_migros", label: "Migros Yemek mağaza linki", group: "Sipariş Platformları" },
  { key: "campaign_title", label: "Kampanya başlığı (boşsa bant gizlenir)", group: "Ana Sayfa Kampanya Bandı" },
  { key: "campaign_subtitle", label: "Kampanya alt başlığı", group: "Ana Sayfa Kampanya Bandı" },
  { key: "campaign_text", label: "Kampanya açıklaması", group: "Ana Sayfa Kampanya Bandı" },
  { key: "campaign_url", label: "Kampanya butonu linki", group: "Ana Sayfa Kampanya Bandı" },
] as const;

/** Online sipariş platformları – linkler Site Ayarları'ndan, girilmeyen gösterilmez */
export const ORDER_PLATFORMS = [
  { key: "order_trendyol", name: "Trendyol Go", className: "bg-white text-[#f27a1a]" },
  { key: "order_yemeksepeti", name: "Yemeksepeti", className: "bg-[#ea004b] text-white" },
  { key: "order_getir", name: "Getir Yemek", className: "bg-[#5d3ebc] text-[#ffd300]" },
  { key: "order_migros", name: "Migros Yemek", className: "bg-[#ff7f00] text-white" },
] as const;

export type SettingKey = (typeof SETTING_FIELDS)[number]["key"];

export const SESSION_COOKIE = "rb_session";
export const ADMIN_PAGE_SIZE = 20;
