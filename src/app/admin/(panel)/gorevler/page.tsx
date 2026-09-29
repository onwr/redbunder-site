import Link from "next/link";
import { AlertTriangle, CalendarDays, Check, ChevronLeft, ChevronRight, List, Plus, RotateCcw } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { setTaskStatus } from "@/actions/tasks";
import { AD_PLATFORM_LABELS, TASK_CATEGORY_LABELS, TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/constants";
import { addDays, addMonths, dateToISO, formatDay, formatLongDay, formatMonth, isoToDate, isYearMonth, monthRange, todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Badge, ButtonLink, Card, FilterChip, PageHeader, Panel, Table, Td, type Tone } from "@/components/admin/ui";
import type { Prisma } from "@/generated/prisma/client";
import type { TaskCategory, TaskStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Görevler & Takvim" };

const STATUS_TONE: Record<TaskStatus, Tone> = { YAPILACAK: "neutral", DEVAM: "amber", TAMAM: "green" };
const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default async function TasksPage({ searchParams }: PageProps<"/admin/gorevler">) {
  const me = await requireUser("tasks");
  const sp = await searchParams;
  const today = todayISO();
  const month = isYearMonth(sp.ay) ? sp.ay : today.slice(0, 7);
  const view = sp.gorunum === "liste" ? "liste" : "takvim";
  const who = typeof sp.kisi === "string" ? sp.kisi : "hepsi";
  const category = typeof sp.kategori === "string" && sp.kategori in TASK_CATEGORY_LABELS ? (sp.kategori as TaskCategory) : undefined;

  const { from, to } = monthRange(month);
  // Takvim ızgarası: ayın ilk gününün haftasının pazartesi → son gününün haftasının pazarı
  const firstDow = (isoToDate(from).getUTCDay() + 6) % 7;
  const gridStart = addDays(from, -firstDow);
  const lastDow = (isoToDate(to).getUTCDay() + 6) % 7;
  const gridEnd = addDays(to, 6 - lastDow);

  const filter: Prisma.TaskWhereInput = {
    ...(who === "benim" ? { assigneeId: me.id } : who === "atanmamis" ? { assigneeId: null } : Number(who) ? { assigneeId: Number(who) } : {}),
    ...(category ? { category } : {}),
  };

  const [tasks, overdueAndToday, users] = await Promise.all([
    prisma.task.findMany({
      where: { ...filter, dueDate: { gte: isoToDate(view === "takvim" ? gridStart : from), lte: isoToDate(view === "takvim" ? gridEnd : to) } },
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: [{ dueDate: "asc" }, { priority: "desc" }, { id: "asc" }],
    }),
    prisma.task.findMany({
      where: { ...filter, status: { not: "TAMAM" }, dueDate: { lte: isoToDate(today) } },
      include: { assignee: { select: { name: true } } },
      orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
      take: 12,
    }),
    prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const monthTasks = tasks.filter((t) => {
    const d = dateToISO(t.dueDate);
    return d >= from && d <= to;
  });
  const counts = { YAPILACAK: 0, DEVAM: 0, TAMAM: 0 } as Record<TaskStatus, number>;
  monthTasks.forEach((t) => counts[t.status]++);
  const donePct = monthTasks.length ? Math.round((counts.TAMAM / monthTasks.length) * 100) : 0;

  const qs = (p: Record<string, string | undefined>) => {
    const s = new URLSearchParams();
    const all = { ay: month, gorunum: view === "liste" ? "liste" : undefined, kisi: who === "hepsi" ? undefined : who, kategori: category, ...p };
    for (const [k, v] of Object.entries(all)) if (v) s.set(k, v);
    return `/admin/gorevler?${s.toString()}`;
  };
  const back = qs({});

  const days = Array.from({ length: Math.round((isoToDate(gridEnd).getTime() - isoToDate(gridStart).getTime()) / 864e5) + 1 }, (_, i) => addDays(gridStart, i));
  const byDay = new Map<string, typeof tasks>();
  tasks.forEach((t) => {
    const d = dateToISO(t.dueDate);
    byDay.set(d, [...(byDay.get(d) ?? []), t]);
  });

  return (
    <>
      <PageHeader
        eyebrow="Takip"
        title="Görevler & Takvim"
        description="Ne yapıldı, ne yapılmadı: işleri tarihine göre planlayın, sorumlusunu atayın, tamamlanınca işaretleyin."
        actions={
          <ButtonLink href={`/admin/gorevler/yeni?_back=${encodeURIComponent(back)}`}>
            <Plus className="h-4 w-4" /> Yeni görev
          </ButtonLink>
        }
      />

      {/* Filtreler */}
      <Card className="mb-6 flex flex-col gap-4 p-4 sm:p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <Link href={qs({ ay: addMonths(month, -1) })} aria-label="Önceki ay" className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10 hover:border-black/30">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <p className="min-w-40 text-center font-display text-xl font-black uppercase tracking-[-0.02em]">{formatMonth(month)}</p>
          <Link href={qs({ ay: addMonths(month, 1) })} aria-label="Sonraki ay" className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10 hover:border-black/30">
            <ChevronRight className="h-4 w-4" />
          </Link>
          {month !== today.slice(0, 7) && (
            <Link href={qs({ ay: today.slice(0, 7) })} className="ml-1 text-sm font-bold text-[#ef101b] hover:underline">Bugün</Link>
          )}
          <div className="ml-2 flex rounded-[10px] border border-black/10 p-0.5">
            <Link href={qs({ gorunum: undefined })} className={cn("flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-sm font-bold", view === "takvim" ? "bg-[#111] text-white" : "text-black/55")}>
              <CalendarDays className="h-4 w-4" /> <span className="hidden sm:inline">Takvim</span>
            </Link>
            <Link href={qs({ gorunum: "liste" })} className={cn("flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-sm font-bold", view === "liste" ? "bg-[#111] text-white" : "text-black/55")}>
              <List className="h-4 w-4" /> <span className="hidden sm:inline">Liste</span>
            </Link>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 xl:items-end">
          <div className="-mx-1 flex min-w-0 max-w-full gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]">
            <FilterChip href={qs({ kisi: undefined })} active={who === "hepsi"}>Herkes</FilterChip>
            <FilterChip href={qs({ kisi: "benim" })} active={who === "benim"}>Benim görevlerim</FilterChip>
            <FilterChip href={qs({ kisi: "atanmamis" })} active={who === "atanmamis"}>Atanmamış</FilterChip>
            {users.filter((u) => u.id !== me.id).map((u) => (
              <FilterChip key={u.id} href={qs({ kisi: String(u.id) })} active={who === String(u.id)}>{u.name}</FilterChip>
            ))}
          </div>
          <div className="-mx-1 flex min-w-0 max-w-full gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]">
            <FilterChip href={qs({ kategori: undefined })} active={!category}>Tüm kategoriler</FilterChip>
            {Object.entries(TASK_CATEGORY_LABELS).map(([k, l]) => (
              <FilterChip key={k} href={qs({ kategori: k })} active={category === k}>{l}</FilterChip>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* ------------------------------ Takvim / Liste ------------------------------ */}
        {view === "takvim" ? (
          <Card className="overflow-x-auto p-3 sm:p-4">
            <div className="grid min-w-[760px] grid-cols-7 gap-px overflow-hidden rounded-[14px] border border-black/[0.06] bg-black/[0.06]">
              {WEEKDAYS.map((d) => (
                <div key={d} className="bg-[#fafaf8] px-2 py-2 text-center text-[11px] font-black uppercase tracking-[0.15em] text-black/40">{d}</div>
              ))}
              {days.map((d) => {
                const inMonth = d.slice(0, 7) === month;
                const isToday = d === today;
                const list = byDay.get(d) ?? [];
                return (
                  <div key={d} className={cn("group/day relative min-h-[118px] p-1.5", inMonth ? "bg-white" : "bg-[#fafaf8]")}>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-black",
                          isToday ? "bg-[#ef101b] text-white" : inMonth ? "text-[#111]" : "text-black/25",
                        )}
                      >
                        {Number(d.slice(8))}
                      </span>
                      <Link
                        href={`/admin/gorevler/yeni?tarih=${d}&_back=${encodeURIComponent(back)}`}
                        aria-label={`${formatDay(d)} için görev ekle`}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-black/30 opacity-0 transition hover:bg-black/[0.06] hover:text-black group-hover/day:opacity-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <ul className="space-y-1">
                      {list.slice(0, 4).map((t) => (
                        <li key={t.id}>
                          <TaskChip task={t} today={today} back={back} />
                        </li>
                      ))}
                      {list.length > 4 && (
                        <li>
                          <Link href={qs({ gorunum: "liste" })} className="block px-1 text-[11px] font-bold text-black/45 hover:text-black">
                            +{list.length - 4} görev daha
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 px-1 text-[11px] font-semibold text-black/50">
              <Legend className="bg-[#111]" label="Yapılacak" />
              <Legend className="bg-amber-400" label="Devam ediyor" />
              <Legend className="bg-emerald-500" label="Tamamlandı" />
              <Legend className="bg-[#ef101b]" label="Gecikmiş" />
            </div>
          </Card>
        ) : (
          <Table head={["Tarih", "Görev", "Kategori", "Sorumlu", "Öncelik", "Durum", ""]} empty={monthTasks.length === 0}>
            {monthTasks.map((t) => {
              const due = dateToISO(t.dueDate);
              const overdue = t.status !== "TAMAM" && due < today;
              return (
                <tr key={t.id} className="hover:bg-black/[0.02]">
                  <Td className={cn("whitespace-nowrap font-semibold", overdue && "text-[#c40812]")}>
                    {formatDay(due)}
                    {overdue && <AlertTriangle className="ml-1 inline h-3.5 w-3.5" />}
                  </Td>
                  <Td>
                    <Link href={`/admin/gorevler/${t.id}?_back=${encodeURIComponent(back)}`} className={cn("font-bold hover:text-[#ef101b]", t.status === "TAMAM" && "text-black/40 line-through")}>
                      {t.title}
                    </Link>
                    {t.platform && <span className="ml-2 text-xs text-black/40">{AD_PLATFORM_LABELS[t.platform]}</span>}
                  </Td>
                  <Td>{TASK_CATEGORY_LABELS[t.category]}</Td>
                  <Td className="whitespace-nowrap">{t.assignee?.name ?? <span className="text-black/35">Atanmamış</span>}</Td>
                  <Td>{t.priority === "YUKSEK" ? <Badge tone="red">Yüksek</Badge> : <span className="text-black/50">{TASK_PRIORITY_LABELS[t.priority]}</span>}</Td>
                  <Td><Badge tone={STATUS_TONE[t.status]}>{TASK_STATUS_LABELS[t.status]}</Badge></Td>
                  <Td className="text-right"><StatusToggle id={t.id} status={t.status} /></Td>
                </tr>
              );
            })}
          </Table>
        )}

        {/* ------------------------------ Yan panel ------------------------------ */}
        <div className="space-y-6">
          <Panel title="Bu ay">
            <div className="mb-3 flex items-end justify-between">
              <p className="font-display text-4xl font-black leading-none">%{donePct}</p>
              <p className="text-xs font-semibold text-black/45">{counts.TAMAM} / {monthTasks.length} tamamlandı</p>
            </div>
            <div className="flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-black/[0.06]">
              {monthTasks.length > 0 && (
                <>
                  <div className="bg-emerald-500" style={{ width: `${(counts.TAMAM / monthTasks.length) * 100}%` }} />
                  <div className="bg-amber-400" style={{ width: `${(counts.DEVAM / monthTasks.length) * 100}%` }} />
                </>
              )}
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
              {(Object.keys(counts) as TaskStatus[]).map((s) => (
                <li key={s} className="rounded-[12px] bg-[#f5f4f1] px-2 py-2.5">
                  <p className="font-display text-2xl font-black leading-none">{counts[s]}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/45">{TASK_STATUS_LABELS[s]}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Bugün & gecikenler">
            {overdueAndToday.length === 0 ? (
              <p className="rounded-[12px] bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">Harika! Bekleyen iş yok. 🎉</p>
            ) : (
              <ul className="divide-y divide-black/[0.06]">
                {overdueAndToday.map((t) => {
                  const due = dateToISO(t.dueDate);
                  return (
                    <li key={t.id} className="flex items-start gap-3 py-3">
                      <form action={setTaskStatus}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="status" value="TAMAM" />
                        <button title="Tamamlandı olarak işaretle" className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black/20 text-transparent transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </button>
                      </form>
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/gorevler/${t.id}?_back=${encodeURIComponent(back)}`} className="block truncate text-sm font-bold hover:text-[#ef101b]">{t.title}</Link>
                        <p className={cn("text-xs font-semibold", due < today ? "text-[#c40812]" : "text-black/45")}>
                          {due < today ? `Gecikti · ${formatDay(due)}` : "Bugün"}
                          {t.assignee && ` · ${t.assignee.name}`}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-[11px] font-medium text-black/35">{formatLongDay(today)}</p>
          </Panel>
        </div>
      </div>
    </>
  );
}

function TaskChip({
  task,
  today,
  back,
}: {
  task: { id: number; title: string; status: TaskStatus; priority: string; dueDate: Date; assignee: { name: string } | null };
  today: string;
  back: string;
}) {
  const due = dateToISO(task.dueDate);
  const overdue = task.status !== "TAMAM" && due < today;
  return (
    <Link
      href={`/admin/gorevler/${task.id}?_back=${encodeURIComponent(back)}`}
      title={`${task.title}${task.assignee ? ` · ${task.assignee.name}` : ""} · ${TASK_STATUS_LABELS[task.status]}`}
      className={cn(
        "flex items-center gap-1.5 truncate rounded-[7px] px-1.5 py-1 text-[11px] font-bold leading-tight transition hover:brightness-95",
        task.status === "TAMAM" && "bg-emerald-50 text-emerald-700 line-through decoration-emerald-700/40",
        task.status === "DEVAM" && !overdue && "bg-amber-50 text-amber-900",
        task.status === "YAPILACAK" && !overdue && "bg-black/[0.05] text-[#111]",
        overdue && "bg-[#ef101b]/10 text-[#c40812]",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          task.status === "TAMAM" ? "bg-emerald-500" : overdue ? "bg-[#ef101b]" : task.status === "DEVAM" ? "bg-amber-400" : "bg-[#111]",
        )}
      />
      <span className="truncate">{task.title}</span>
    </Link>
  );
}

function StatusToggle({ id, status }: { id: number; status: TaskStatus }) {
  const next: TaskStatus = status === "TAMAM" ? "YAPILACAK" : "TAMAM";
  return (
    <form action={setTaskStatus} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={next} />
      <button
        className={cn(
          "inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-xs font-bold transition",
          status === "TAMAM" ? "text-black/45 hover:bg-black/[0.05]" : "bg-emerald-500 text-white hover:bg-emerald-600",
        )}
      >
        {status === "TAMAM" ? (
          <>
            <RotateCcw className="h-3.5 w-3.5" /> Geri al
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5" /> Tamamla
          </>
        )}
      </button>
    </form>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", className)} />
      {label}
    </span>
  );
}
