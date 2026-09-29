import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteTask, saveTask } from "@/actions/tasks";
import { AD_PLATFORMS, TASK_CATEGORY_LABELS, TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/constants";
import { dateToISO, isISODate, todayISO } from "@/lib/dates";
import { formatDate } from "@/lib/utils";
import { ActionForm, SelectField, TextArea, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

const opts = (o: Record<string, string>) => Object.entries(o).map(([value, label]) => ({ value, label }));

export default async function TaskEditPage({ params, searchParams }: PageProps<"/admin/gorevler/[id]">) {
  const me = await requireUser("tasks");
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "yeni";
  const [task, users] = await Promise.all([
    isNew
      ? null
      : prisma.task.findUnique({
          where: { id: Number(id) || 0 },
          include: { createdBy: { select: { name: true } } },
        }),
    prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!isNew && !task) notFound();

  const back = typeof sp._back === "string" && sp._back.startsWith("/admin/gorevler") ? sp._back : "/admin/gorevler";
  const defaultDate = task ? dateToISO(task.dueDate) : isISODate(sp.tarih) ? sp.tarih : todayISO();

  return (
    <>
      <PageHeader
        eyebrow="Takip"
        title={isNew ? "Yeni görev" : task!.title}
        description={task ? `Oluşturan: ${task.createdBy?.name ?? "–"} · ${formatDate(task.createdAt)}${task.completedAt ? ` · Tamamlandı: ${formatDate(task.completedAt)}` : ""}` : undefined}
        actions={<ButtonLink href={back} variant="secondary">← Takvim</ButtonLink>}
      />
      <Card className="max-w-3xl">
        <ActionForm action={saveTask}>
          {task && <input type="hidden" name="id" value={task.id} />}
          <input type="hidden" name="_back" value={back} />

          <TextField name="title" label="Görev" defaultValue={task?.title} placeholder="Örn. Meta hafta sonu kampanyasını başlat" required />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField name="dueDate" label="Tarih" type="date" defaultValue={defaultDate} required />
            <SelectField
              name="assigneeId"
              label="Sorumlu"
              defaultValue={task ? (task.assigneeId ?? "") : me.id}
              placeholder="Atanmamış"
              options={users.map((u) => ({ value: u.id, label: u.name }))}
            />
            <SelectField name="status" label="Durum" defaultValue={task?.status ?? "YAPILACAK"} options={opts(TASK_STATUS_LABELS)} />
            <SelectField name="category" label="Kategori" defaultValue={task?.category ?? "DIGER"} options={opts(TASK_CATEGORY_LABELS)} />
            <SelectField name="priority" label="Öncelik" defaultValue={task?.priority ?? "NORMAL"} options={opts(TASK_PRIORITY_LABELS)} />
            <SelectField
              name="platform"
              label="İlgili platform"
              defaultValue={task?.platform ?? ""}
              placeholder="Yok"
              options={AD_PLATFORMS.map((p) => ({ value: p.value, label: p.label }))}
            />
          </div>
          <TextArea name="description" label="Açıklama / notlar" rows={5} defaultValue={task?.description ?? ""} placeholder="Yapılacaklar, linkler, sonuç notları..." />
        </ActionForm>
      </Card>
      {task && (
        <div className="mt-6">
          <DeleteForm action={deleteTask} id={task.id} label="Görevi sil" />
        </div>
      )}
    </>
  );
}
