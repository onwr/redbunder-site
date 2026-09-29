import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getApplication } from "@/lib/services/applications";
import { deleteApplication, updateApplication } from "@/actions/careers";
import { GENDER_LABELS, STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ActionForm, SelectField, TextArea } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function ApplicationDetailPage({ params }: PageProps<"/admin/basvurular/[id]">) {
  await requireUser("applications");
  const app = await getApplication(Number((await params).id) || 0);
  if (!app) notFound();

  const rows: [string, string | number][] = [
    ["Telefon", app.phone],
    ["Cinsiyet", GENDER_LABELS[app.gender]],
    ["Yaş", app.age],
    ["Alan", app.position.title],
    ["Tercih edilen şube", app.branch?.name ?? "Farketmez"],
    ["KVKK onayı", app.kvkkConsent ? "Evet" : "Hayır"],
    ["Başvuru tarihi", formatDate(app.createdAt)],
    ["Son güncelleme", formatDate(app.updatedAt)],
  ];

  return (
    <>
      <PageHeader
        title={app.fullName}
        description={`Başvuru #${app.id}`}
        actions={<ButtonLink href="/admin/basvurular" variant="secondary">← Başvurular</ButtonLink>}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <dl className="grid grid-cols-[150px_1fr] gap-y-2 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-neutral-500">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex gap-2">
            <a href={`tel:${app.phone}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Ara</a>
            <a href={`https://wa.me/9${app.phone}`} target="_blank" rel="noreferrer" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              WhatsApp
            </a>
          </div>
        </Card>
        <Card>
          <ActionForm action={updateApplication}>
            <input type="hidden" name="id" value={app.id} />
            <SelectField
              name="status"
              label="Durum"
              defaultValue={app.status}
              options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <TextArea name="note" label="Dahili not" rows={6} defaultValue={app.note ?? ""} />
          </ActionForm>
        </Card>
      </div>
      <div className="mt-6">
        <DeleteForm action={deleteApplication} id={app.id} label="Başvuruyu sil" />
      </div>
    </>
  );
}
