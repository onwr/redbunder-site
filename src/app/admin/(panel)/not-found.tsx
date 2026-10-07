import { ButtonLink, Card, PageHeader } from "@/components/admin/ui";

/** Panelde olmayan kayıt (ör. silinmiş şube id'si) – sidebar korunur */
export default function AdminNotFound() {
  return (
    <>
      <PageHeader title="Kayıt bulunamadı" />
      <Card className="max-w-xl">
        <p className="text-sm text-neutral-600">Aradığın kayıt silinmiş ya da adres hatalı olabilir.</p>
        <div className="mt-4">
          <ButtonLink href="/admin">Panele dön</ButtonLink>
        </div>
      </Card>
    </>
  );
}
