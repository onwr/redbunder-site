import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";
import { getSettings } from "@/lib/services/settings";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Red Bunder kişisel verilerin korunması ve işlenmesi hakkında aydınlatma metni.",
};

/**
 * 6698 sayılı KVKK m.10 kapsamında aydınlatma metni. Veri sorumlusu unvanı, başvuru e-postası,
 * KEP ve adres: Admin > Site Ayarları. TODO(hukuk): yayın öncesi hukuk danışmanına kontrol ettirin;
 * yeni form/çerez/analitik eklenirse ilgili bölümleri güncelleyin.
 */
const LAST_UPDATED = "07.10.2026";

export default async function KvkkPage() {
  await connection();
  const settings = await getSettings();
  const company = settings.company_title || "Red Bunder";
  const email = settings.kvkk_email || settings.email;

  return (
    <>
      <PageHero eyebrow="Kişisel Veriler" title="KVKK" highlight="Aydınlatma Metni">
        Kişisel verilerini nasıl işlediğimizi ve haklarını burada bulabilirsin.
      </PageHero>

      <section className="bg-[#f5f4f1] px-5 py-16 lg:px-8 lg:py-20 xl:px-10">
        <article className="mx-auto max-w-[860px] space-y-10 rounded-[28px] border border-black/[0.06] bg-white p-6 text-[15px] font-medium leading-7 text-black/65 sm:p-10">
          <p>
            {company} (&quot;Red Bunder&quot;) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri
            sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan kapsamda işlemekteyiz. Bu metin; {SITE.url.replace(/^https?:\/\//, "")}{" "}
            internet sitesindeki iletişim ve franchise formları ile şubelerimiz üzerinden bizimle iletişime geçen kişileri kapsar.
          </p>

          <Block n="1" title="Veri sorumlusu">
            <dl className="grid gap-2 sm:grid-cols-[160px_1fr]">
              <Dt>Unvan</Dt>
              <dd>{company}</dd>
              {settings.address && (
                <>
                  <Dt>Adres</Dt>
                  <dd>{settings.address}</dd>
                </>
              )}
              {email && (
                <>
                  <Dt>E-posta</Dt>
                  <dd>
                    <a href={`mailto:${email}`} className="font-bold text-[#ef101b] hover:underline">{email}</a>
                  </dd>
                </>
              )}
              {settings.kvkk_kep && (
                <>
                  <Dt>KEP</Dt>
                  <dd>{settings.kvkk_kep}</dd>
                </>
              )}
            </dl>
          </Block>

          <Block n="2" title="İşlenen kişisel veriler">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <b className="text-[#111]">İletişim formu:</b> ad soyad, e-posta adresi, telefon numarası, mesaj konusu ve içeriği,
                varsa ilgili şube.
              </li>
              <li>
                <b className="text-[#111]">Franchise başvuru formu:</b> ad soyad, telefon, e-posta, şehir/ilçe, yatırım bütçesi aralığı,
                lokasyon durumu, sektör deneyimi ve mesaj içeriği.
              </li>
              <li>
                <b className="text-[#111]">İşlem güvenliği:</b> formu gönderdiğiniz cihazın IP adresi ve gönderim zamanı.
              </li>
            </ul>
            <p>
              Kariyer başvuruları{" "}
              <a href={SITE.careerUrl} className="font-bold text-[#ef101b] hover:underline">kariyer sitemiz</a> üzerinden alınır ve
              orada yer alan ayrı aydınlatma metnine tabidir.
            </p>
          </Block>

          <Block n="3" title="İşleme amaçları">
            <ul className="list-disc space-y-2 pl-5">
              <li>Talep, öneri ve şikayetlerinizi almak, değerlendirmek ve size geri dönüş yapmak,</li>
              <li>Franchise başvurularını değerlendirmek ve başvuru sahipleriyle iletişime geçmek,</li>
              <li>Ürün ve hizmet kalitemizi, şube operasyonlarımızı iyileştirmek,</li>
              <li>Form kötüye kullanımını (spam, saldırı) önlemek ve bilgi güvenliğini sağlamak,</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek ve yetkili kurumların taleplerini karşılamak.</li>
            </ul>
          </Block>

          <Block n="4" title="Toplama yöntemi ve hukuki sebepler">
            <p>
              Kişisel verileriniz, internet sitemizdeki formlar aracılığıyla elektronik ortamda, tamamen veya kısmen otomatik yollarla
              toplanır. Verileriniz KVKK m.5/2 kapsamında;
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>(c) bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (franchise ön değerlendirmesi),</li>
              <li>(ç) veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi,</li>
              <li>(f) ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaatimiz (talep ve şikayet yönetimi, güvenlik)</li>
            </ul>
            <p>hukuki sebeplerine; gerekli hallerde ise m.5/1 uyarınca açık rızanıza dayanılarak işlenir.</p>
          </Block>

          <Block n="5" title="Aktarım">
            <p>
              Kişisel verileriniz yurt içinde; yalnızca yukarıdaki amaçlarla sınırlı olarak, sitemizin barındırma ve teknik altyapı
              hizmetlerini aldığımız tedarikçilere, talebiniz ilgili olduğu ölçüde şubelerimize ve franchise işletmelerimize, hukuken
              yetkili kamu kurum ve kuruluşlarına KVKK m.8 ve m.9&apos;a uygun şekilde aktarılabilir. Verileriniz pazarlama amacıyla üçüncü
              kişilerle paylaşılmaz.
            </p>
          </Block>

          <Block n="6" title="Saklama süresi">
            <p>
              Verileriniz işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır; süre
              sonunda silinir, yok edilir veya anonim hale getirilir.
            </p>
          </Block>

          <Block n="7" title="Çerezler">
            <p>
              Sitemiz ziyaretçileri takip eden reklam veya analitik çerezleri kullanmaz. Yalnızca yönetim paneli oturumu için zorunlu bir
              oturum çerezi kullanılır.
            </p>
          </Block>

          <Block n="8" title="KVKK m.11 kapsamındaki haklarınız">
            <p>Veri sorumlusuna başvurarak;</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini, KVKK m.7 şartları çerçevesinde silinmesini veya yok edilmesini isteme ve bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
              <li>Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç ortaya çıkmasına itiraz etme,</li>
              <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>
            <p>haklarına sahipsiniz.</p>
          </Block>

          <Block n="9" title="Başvuru">
            <p>
              Taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&apos;e uygun olarak kimliğinizi tespit edici
              bilgilerle birlikte
              {email ? (
                <>
                  {" "}
                  <a href={`mailto:${email}`} className="font-bold text-[#ef101b] hover:underline">{email}</a> adresine e-posta ile
                </>
              ) : (
                " bize e-posta ile"
              )}
              {settings.kvkk_kep && <>, {settings.kvkk_kep} KEP adresine</>}
              {settings.address && <> veya {settings.address} adresine yazılı olarak</>} iletebilirsiniz. Başvurunuz en geç 30 gün içinde
              ücretsiz olarak sonuçlandırılır.
            </p>
          </Block>

          <p className="border-t border-black/[0.06] pt-6 text-xs text-black/40">Son güncelleme: {LAST_UPDATED}</p>
        </article>
      </section>
    </>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-baseline gap-3 font-display text-2xl font-black uppercase tracking-[-0.03em] text-[#111]">
        <span className="text-[#ef101b]">{n}.</span> {title}
      </h2>
      {children}
    </section>
  );
}

function Dt({ children }: { children: ReactNode }) {
  return <dt className="font-bold text-[#111]">{children}</dt>;
}
