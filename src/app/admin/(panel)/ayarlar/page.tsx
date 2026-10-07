import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/services/settings";
import { SETTING_FIELDS } from "@/lib/constants";
import { saveSettings } from "@/actions/site";
import { ActionForm, TextField } from "@/components/admin/form";
import { Card, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Site Ayarları" };

export default async function SettingsPage() {
  await requireUser("settings");
  const settings = await getSettings();
  const groups = [...new Set(SETTING_FIELDS.map((f) => f.group))];

  return (
    <>
      <PageHeader
        title="Site Ayarları"
        description="Header, footer, iletişim sayfası, sipariş platformları, ana sayfa kampanya bandı ve KVKK sayfasında (/kvkk) kullanılan bilgiler. Boş bırakılan alanlar sitede gösterilmez."
      />
      <Card className="max-w-3xl">
        <ActionForm action={saveSettings}>
          {groups.map((group) => (
            <fieldset key={group} className="border-t border-neutral-200 pt-5 first:border-0 first:pt-0">
              <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">{group}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {SETTING_FIELDS.filter((f) => f.group === group).map((f) => (
                  <TextField key={f.key} name={f.key} label={f.label} defaultValue={settings[f.key] ?? ""} />
                ))}
              </div>
            </fieldset>
          ))}
        </ActionForm>
      </Card>
    </>
  );
}
