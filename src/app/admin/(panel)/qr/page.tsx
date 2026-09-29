import Link from "next/link";
import { requireUser } from "@/lib/session";
import { QR_MENU_PATH, qrMenuUrl, qrSvg } from "@/lib/qr";
import { Card, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "QR Menü" };

export default async function QrPage() {
  await requireUser("qr");
  const url = qrMenuUrl();
  const svg = await qrSvg(url);

  return (
    <>
      <PageHeader
        title="QR Menü"
        description="Tüm şubelerde ve masalarda aynı QR kod kullanılır. Menüde yaptığın değişiklik anında yansır, QR'ı yeniden basmana gerek yok."
      />
      <Card className="flex max-w-md flex-col items-center text-center">
        {/* SVG, sunucuda bizim ürettiğimiz güvenli içeriktir */}
        <div className="w-64" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="mt-4 break-all text-sm font-medium text-neutral-600">{url}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
          <a href="/api/admin/qr?format=png" className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
            PNG indir
          </a>
          <a href="/api/admin/qr?format=svg" className="rounded-lg border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-50">
            SVG indir (matbaa)
          </a>
          <Link href={QR_MENU_PATH} target="_blank" className="px-2 py-2 text-neutral-600 hover:underline">
            Önizle ↗
          </Link>
        </div>
      </Card>
      <p className="mt-4 max-w-md text-xs text-neutral-500">
        QR adresi <code>NEXT_PUBLIC_SITE_URL</code> ayarından üretilir. Canlıya çıkmadan önce bunun <code>https://redbunder.com</code> olduğundan emin ol.
      </p>
    </>
  );
}
