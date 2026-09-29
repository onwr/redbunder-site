import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteAdEntry, saveAdEntry } from "@/actions/ads";
import { AD_PLATFORMS } from "@/lib/constants";
import { dateToISO, isISODate, monthRange, todayISO } from "@/lib/dates";
import { ActionForm, SelectField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";
import AdSubmitNext from "@/components/admin/AdSubmitNext";

export default async function AdEntryEditPage({ params, searchParams }: PageProps<"/admin/reklamlar/kayitlar/[id]">) {
  await requireUser("ads");
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "yeni";
  const entry = isNew ? null : await prisma.adEntry.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !entry) notFound();

  // Yeni kayıt varsayılanları: "Kaydet ve yeni ekle" ile gelen platform/dönem ya da bu ay
  const month = monthRange(todayISO().slice(0, 7));
  const defaults = {
    platform: entry?.platform ?? (typeof sp.platform === "string" ? sp.platform : ""),
    from: entry ? dateToISO(entry.periodStart) : isISODate(sp.from) ? sp.from : month.from,
    to: entry ? dateToISO(entry.periodEnd) : isISODate(sp.to) ? sp.to : month.to,
  };

  return (
    <>
      <PageHeader
        eyebrow="Pazarlama"
        title={isNew ? "Reklam verisi gir" : "Kaydı düzenle"}
        description="Platform panelindeki rakamları seçtiğiniz dönem için girin. Bilmediğiniz alanları boş bırakın."
        actions={<ButtonLink href="/admin/reklamlar/kayitlar" variant="secondary">← Kayıtlar</ButtonLink>}
      />
      <Card className="max-w-3xl">
        <ActionForm action={saveAdEntry} submitLabel="Kaydet">
          {entry && <input type="hidden" name="id" value={entry.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="platform"
              label="Platform"
              defaultValue={defaults.platform}
              placeholder="Seçin"
              options={AD_PLATFORMS.map((p) => ({ value: p.value, label: p.label }))}
            />
            <TextField name="campaign" label="Kampanya / reklam seti" defaultValue={entry?.campaign ?? ""} placeholder="Örn. Hafta sonu menüsü" />
            <TextField name="periodStart" label="Dönem başlangıcı" type="date" defaultValue={defaults.from} required />
            <TextField name="periodEnd" label="Dönem bitişi" type="date" defaultValue={defaults.to} required />
          </div>

          <fieldset className="rounded-[16px] bg-[#f5f4f1] p-4">
            <legend className="px-1 text-xs font-black uppercase tracking-[0.18em] text-black/45">Rakamlar</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField name="spend" label="Harcama (₺) *" inputMode="decimal" defaultValue={entry ? String(entry.spend) : ""} placeholder="12.500,00" />
              <TextField name="revenue" label="Reklam cirosu (₺)" inputMode="decimal" defaultValue={entry?.revenue != null ? String(entry.revenue) : ""} placeholder="48.000" />
              <TextField name="orders" label="Sipariş / dönüşüm" inputMode="numeric" defaultValue={entry?.orders ?? ""} />
              <TextField name="impressions" label="Gösterim" inputMode="numeric" defaultValue={entry?.impressions ?? ""} />
              <TextField name="clicks" label="Tıklama" inputMode="numeric" defaultValue={entry?.clicks ?? ""} />
            </div>
          </fieldset>

          <TextArea name="note" label="Not" rows={3} defaultValue={entry?.note ?? ""} placeholder="Kreatif, hedefleme, dikkat çeken sonuçlar..." />
          {isNew && <AdSubmitNext />}
        </ActionForm>
      </Card>
      {entry && (
        <div className="mt-6">
          <DeleteForm action={deleteAdEntry} id={entry.id} label="Kaydı sil" />
        </div>
      )}
    </>
  );
}
