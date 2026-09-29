import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ExternalLink, FileUser, Store } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { can, CAREER_FIELDS, SITE } from "@/lib/constants";
import { saveCareerSettings } from "@/actions/site";
import { ActionForm, SelectField, TextArea, TextField } from "@/components/admin/form";
import { Badge, ButtonLink, Card, PageHeader, Panel } from "@/components/admin/ui";

export const metadata = { title: "Kariyer Sitesi" };

export default async function CareerSitePage() {
  const user = await requireUser("career");
  const [rows, activePositions, newApplications] = await Promise.all([
    prisma.setting.findMany({ where: { key: { startsWith: "cv_" } } }),
    prisma.position.count({ where: { isActive: true } }),
    prisma.application.count({ where: { status: "YENI" } }),
  ]);
  const saved = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const isOpen = saved.cv_open !== "0";
  const groups = [...new Set(CAREER_FIELDS.map((f) => f.group))];

  return (
    <>
      <PageHeader
        eyebrow="İletişim & İK"
        title="Kariyer Sitesi"
        description="cv.redbunder.com'daki metinler ve başvuru ayarları. Boş bırakılan alanlarda sitedeki varsayılan metin (soluk yazı) kullanılır."
        actions={
          <ButtonLink href={SITE.careerUrl} variant="secondary" target="_blank">
            <ExternalLink className="h-4 w-4" /> Siteyi aç
          </ButtonLink>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <ActionForm action={saveCareerSettings}>
            {groups.map((group) => (
              <fieldset key={group} className="border-t border-black/[0.06] pt-5 first:border-0 first:pt-0">
                <legend className="mb-4 font-display text-lg font-black uppercase tracking-[-0.02em]">{group}</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {CAREER_FIELDS.filter((f) => f.group === group).map((f) => {
                    const common = { name: f.key, label: f.label, hint: f.hint, placeholder: f.placeholder, defaultValue: saved[f.key] ?? "" };
                    if (f.type === "toggle") {
                      return (
                        <SelectField
                          key={f.key}
                          name={f.key}
                          label={f.label}
                          defaultValue={isOpen ? "1" : "0"}
                          options={[
                            { value: "1", label: "Açık – form gösterilir" },
                            { value: "0", label: "Kapalı – mesaj gösterilir" },
                          ]}
                          hint="Kapalıyken form gizlenir ve yeni başvuru kabul edilmez."
                        />
                      );
                    }
                    if (f.type === "textarea") {
                      return (
                        <div key={f.key} className="sm:col-span-2">
                          <TextArea {...common} rows={3} />
                        </div>
                      );
                    }
                    return <TextField key={f.key} {...common} type={f.type === "number" ? "number" : "text"} min={f.type === "number" ? 14 : undefined} max={f.type === "number" ? 99 : undefined} />;
                  })}
                </div>
              </fieldset>
            ))}
          </ActionForm>
        </Card>

        <div className="space-y-6">
          <Panel title="Durum">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-black/60">Başvurular</span>
              {isOpen ? <Badge tone="green">Açık</Badge> : <Badge tone="red">Kapalı</Badge>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-black/60">Yaş aralığı</span>
              <span className="text-sm font-bold">
                {saved.cv_age_min || 18} – {saved.cv_age_max || 55}
              </span>
            </div>
          </Panel>

          <Panel title="Bunlar da kariyer sitesinde">
            <ul className="space-y-2">
              {can(user.role, "positions") && (
                <QuickLink href="/admin/pozisyonlar" icon={<BriefcaseBusiness />} label="Pozisyonlar" hint={`${activePositions} alımda · formdaki "alan" seçenekleri`} />
              )}
              {can(user.role, "applications") && (
                <QuickLink href="/admin/basvurular" icon={<FileUser />} label="Başvurular" hint={`${newApplications} yeni başvuru`} />
              )}
              {can(user.role, "branches") && (
                <QuickLink href="/admin/subeler" icon={<Store />} label="Şubeler" hint="Formdaki şube listesi ve şube sayısı" />
              )}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function QuickLink({ href, icon, label, hint }: { href: string; icon: React.ReactNode; label: string; hint: string }) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-3 rounded-[14px] border border-black/[0.06] p-3 transition hover:border-[#ef101b]/40">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ef101b]/10 text-[#ef101b] [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">{label}</span>
          <span className="block truncate text-xs font-medium text-black/45">{hint}</span>
        </span>
        <ArrowRight className="h-4 w-4 text-black/30 transition group-hover:translate-x-0.5 group-hover:text-[#ef101b]" />
      </Link>
    </li>
  );
}
