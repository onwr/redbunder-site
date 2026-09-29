import Link from "next/link";
import { ArrowRight, CalendarCheck2, Check, Coins, FileUser, Mail, Plus, Sandwich, TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { setTaskStatus } from "@/actions/tasks";
import { AD_PLATFORM_LABELS, can, CONTACT_TOPIC_LABELS, STATUS_LABELS, STATUS_TONES } from "@/lib/constants";
import { addDays, dateToISO, formatDay, formatLongDay, formatMonth, isoToDate, monthRange, todayISO } from "@/lib/dates";
import { getAdReport } from "@/lib/services/ads";
import { cn, formatDate, formatMoney, formatRatio } from "@/lib/utils";
import { Badge, ButtonLink, ErrorNotice, PageHeader, Panel, StatCard } from "@/components/admin/ui";
import { HBarChart } from "@/components/admin/charts";

export const metadata = { title: "Genel Bakış" };

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const user = await requireUser("dashboard");
  const { hata } = await searchParams;
  const today = todayISO();
  const month = today.slice(0, 7);
  const show = {
    tasks: can(user.role, "tasks"),
    ads: can(user.role, "ads"),
    menu: can(user.role, "menu"),
    hr: can(user.role, "applications"),
    messages: can(user.role, "messages"),
  };

  const [dueTasks, weekTasks, openTasks, adReport, newApps, latestApps, unread, latestMessages, activeProducts] = await Promise.all([
    show.tasks
      ? prisma.task.findMany({
          where: { status: { not: "TAMAM" }, dueDate: { lte: isoToDate(today) } },
          include: { assignee: { select: { name: true } } },
          orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
          take: 8,
        })
      : [],
    show.tasks
      ? prisma.task.findMany({
          where: { status: { not: "TAMAM" }, dueDate: { gt: isoToDate(today), lte: isoToDate(addDays(today, 7)) } },
          include: { assignee: { select: { name: true } } },
          orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
          take: 8,
        })
      : [],
    show.tasks ? prisma.task.count({ where: { status: { not: "TAMAM" } } }) : 0,
    show.ads ? getAdReport(monthRange(month).from, monthRange(month).to) : null,
    show.hr ? prisma.application.count({ where: { status: "YENI" } }) : 0,
    show.hr
      ? prisma.application.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { position: { select: { title: true } } } })
      : [],
    show.messages ? prisma.contactMessage.count({ where: { isRead: false } }) : 0,
    show.messages ? prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" } }) : [],
    show.menu ? prisma.product.count({ where: { isActive: true } }) : 0,
  ]);

  const firstName = user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow={formatLongDay(today)}
        title={`Merhaba, ${firstName}`}
        description="Red Bunder yönetim paneline hoş geldin. Bugün neler var?"
        actions={
          show.tasks ? (
            <ButtonLink href="/admin/gorevler/yeni">
              <Plus className="h-4 w-4" /> Yeni görev
            </ButtonLink>
          ) : undefined
        }
      />
      <ErrorNotice message={hata === "yetki" ? "Bu bölüme erişim yetkiniz yok." : undefined} />

      {/* KPI'lar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {show.ads && adReport && (
          <>
            <StatCard dark label={`${formatMonth(month)} reklam`} value={formatMoney(adReport.total.spend)} hint={`${adReport.total.entries} kayıt`} icon={<Coins />} href="/admin/reklamlar" />
            <StatCard label="ROAS" value={formatRatio(adReport.total.roas)} hint={`Ciro ${formatMoney(adReport.total.revenue)}`} icon={<TrendingUp />} href="/admin/reklamlar" />
          </>
        )}
        {show.tasks && (
          <StatCard
            label="Açık görev"
            value={openTasks}
            hint={dueTasks.length ? <span className="text-[#c40812]">{dueTasks.length} bugün / gecikmiş</span> : "Gecikme yok"}
            icon={<CalendarCheck2 />}
            href="/admin/gorevler"
          />
        )}
        {show.hr && <StatCard label="Yeni başvuru" value={newApps} hint="İncelenmeyi bekliyor" icon={<FileUser />} href="/admin/basvurular?status=YENI" />}
        {show.messages && <StatCard label="Okunmamış mesaj" value={unread} icon={<Mail />} href="/admin/mesajlar?durum=okunmamis" />}
        {show.menu && <StatCard label="Aktif ürün" value={activeProducts} icon={<Sandwich />} href="/admin/menu/urunler" />}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Görevler */}
        {show.tasks && (
          <Panel title="Bugün & gecikenler" action={<MoreLink href="/admin/gorevler" />}>
            <TaskList tasks={dueTasks} today={today} empty="Bekleyen iş yok, harika! 🎉" />
          </Panel>
        )}
        {show.tasks && (
          <Panel title="Önümüzdeki 7 gün" action={<MoreLink href="/admin/gorevler" />}>
            <TaskList tasks={weekTasks} today={today} empty="Bu hafta planlanmış görev yok." />
          </Panel>
        )}

        {/* Reklam */}
        {show.ads && adReport && (
          <Panel title={`${formatMonth(month)} · platform harcaması`} action={<MoreLink href="/admin/reklamlar" label="Rapor" />}>
            <HBarChart
              rows={adReport.platforms.map((p) => ({ key: p.platform, label: AD_PLATFORM_LABELS[p.platform].split(" (")[0], value: p.spend }))}
              format={formatMoney}
            />
            {adReport.platforms.length === 0 && (
              <Link href="/admin/reklamlar/kayitlar/yeni" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#ef101b] hover:underline">
                <Plus className="h-4 w-4" /> Bu ayın ilk reklam verisini gir
              </Link>
            )}
          </Panel>
        )}

        {/* Başvurular */}
        {show.hr && (
          <Panel title="Son başvurular" action={<MoreLink href="/admin/basvurular" />}>
            <ul className="divide-y divide-black/[0.06]">
              {latestApps.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/basvurular/${a.id}`} className="block truncate text-sm font-bold hover:text-[#ef101b]">{a.fullName}</Link>
                    <p className="text-xs font-medium text-black/45">{a.position.title} · {formatDate(a.createdAt)}</p>
                  </div>
                  <Badge tone={STATUS_TONES[a.status]}>{STATUS_LABELS[a.status]}</Badge>
                </li>
              ))}
              {latestApps.length === 0 && <li className="py-4 text-sm text-black/45">Henüz başvuru yok.</li>}
            </ul>
          </Panel>
        )}

        {/* Mesajlar */}
        {show.messages && (
          <Panel title="Son mesajlar" action={<MoreLink href="/admin/mesajlar" />}>
            <ul className="divide-y divide-black/[0.06]">
              {latestMessages.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className={cn("truncate text-sm", m.isRead ? "font-semibold text-black/60" : "font-black")}>{m.name}</p>
                    <Badge>{CONTACT_TOPIC_LABELS[m.topic]}</Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs font-medium text-black/45">{m.message}</p>
                </li>
              ))}
              {latestMessages.length === 0 && <li className="py-4 text-sm text-black/45">Henüz mesaj yok.</li>}
            </ul>
          </Panel>
        )}
      </div>
    </>
  );
}

function MoreLink({ href, label = "Tümü" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-bold text-[#ef101b] hover:underline">
      {label} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function TaskList({
  tasks,
  today,
  empty,
}: {
  tasks: { id: number; title: string; dueDate: Date; priority: string; platform: string | null; assignee: { name: string } | null }[];
  today: string;
  empty: string;
}) {
  if (tasks.length === 0) return <p className="rounded-[12px] bg-[#f5f4f1] p-4 text-sm font-semibold text-black/55">{empty}</p>;
  return (
    <ul className="divide-y divide-black/[0.06]">
      {tasks.map((t) => {
        const due = dateToISO(t.dueDate);
        const overdue = due < today;
        return (
          <li key={t.id} className="flex items-start gap-3 py-3">
            <form action={setTaskStatus}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="status" value="TAMAM" />
              <button title="Tamamlandı" className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black/20 text-transparent transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </button>
            </form>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/gorevler/${t.id}`} className="block truncate text-sm font-bold hover:text-[#ef101b]">
                {t.title}
              </Link>
              <p className={cn("text-xs font-semibold", overdue ? "text-[#c40812]" : "text-black/45")}>
                {overdue ? `Gecikti · ${formatDay(due)}` : due === today ? "Bugün" : formatDay(due)}
                {t.assignee && ` · ${t.assignee.name}`}
              </p>
            </div>
            {t.priority === "YUKSEK" && <Badge tone="red">Öncelikli</Badge>}
          </li>
        );
      })}
    </ul>
  );
}
