import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cn, formatDate } from "@/lib/utils";
import { CONTACT_TOPICS, CONTACT_TOPIC_LABELS } from "@/lib/constants";
import { deleteMessage, toggleMessageRead } from "@/actions/site";
import { Badge, Card, DeleteForm, PageHeader } from "@/components/admin/ui";
import type { ContactTopic } from "@/generated/prisma/enums";

export const metadata = { title: "Mesajlar" };

const TOPIC_TONES = Object.fromEntries(CONTACT_TOPICS.map((t) => [t.value, t.tone])) as Record<ContactTopic, (typeof CONTACT_TOPICS)[number]["tone"]>;

export default async function MessagesPage({ searchParams }: PageProps<"/admin/mesajlar">) {
  await requireUser("messages");
  const { konu, durum } = await searchParams;
  const topic = CONTACT_TOPICS.find((t) => t.value === konu)?.value;
  const unreadOnly = durum === "okunmamis";

  const [messages, counts, unreadTotal] = await Promise.all([
    prisma.contactMessage.findMany({
      where: { topic, ...(unreadOnly ? { isRead: false } : {}) },
      include: { branch: { select: { name: true } } },
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.contactMessage.groupBy({ by: ["topic"], _count: { _all: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  const countOf = (t: ContactTopic) => counts.find((c) => c.topic === t)?._count._all ?? 0;
  const total = counts.reduce((n, c) => n + c._count._all, 0);

  const href = (params: { konu?: string; durum?: string }) => {
    const s = new URLSearchParams();
    const k = "konu" in params ? params.konu : topic;
    const d = "durum" in params ? params.durum : unreadOnly ? "okunmamis" : undefined;
    if (k) s.set("konu", k);
    if (d) s.set("durum", d);
    const q = s.toString();
    return q ? `?${q}` : "/admin/mesajlar";
  };
  const chip = (active: boolean) =>
    cn("rounded-full px-3 py-1.5 text-sm transition", active ? "bg-ink font-semibold text-white" : "bg-white text-neutral-600 hover:bg-neutral-200");

  return (
    <>
      <PageHeader title="Mesajlar" description="İletişim formundan gelen mesajlar: sorular, öneri ve görüşler, şikayetler." />

      <div className="mb-3 flex flex-wrap gap-2">
        <Link href={href({ konu: undefined })} className={chip(!topic)}>Tümü ({total})</Link>
        {CONTACT_TOPICS.map((t) => (
          <Link key={t.value} href={href({ konu: t.value })} className={chip(topic === t.value)}>
            {t.label} ({countOf(t.value)})
          </Link>
        ))}
      </div>
      <div className="mb-6 flex gap-2 text-sm">
        <Link href={href({ durum: undefined })} className={cn(!unreadOnly ? "font-semibold text-brand" : "text-neutral-500")}>Hepsi</Link>
        <span className="text-neutral-300">·</span>
        <Link href={href({ durum: "okunmamis" })} className={cn(unreadOnly ? "font-semibold text-brand" : "text-neutral-500")}>
          Okunmamış ({unreadTotal})
        </Link>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <Card key={m.id} className={m.isRead ? "opacity-70" : "border-l-4 border-l-brand"}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{m.name}</p>
                  <Badge tone={TOPIC_TONES[m.topic]}>{CONTACT_TOPIC_LABELS[m.topic]}</Badge>
                  {m.branch && <Badge>{m.branch.name} şubesi</Badge>}
                  {!m.isRead && <Badge tone="red">Yeni</Badge>}
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {[m.phone, m.email].filter(Boolean).join(" · ")} · {formatDate(m.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="text-sm text-neutral-600 hover:underline">{m.isRead ? "Okunmadı yap" : "Okundu yap"}</button>
                </form>
                <DeleteForm action={deleteMessage} id={m.id} />
              </div>
            </div>
            {m.subject && <p className="mt-3 font-medium">{m.subject}</p>}
            <p className="mt-3 whitespace-pre-line text-sm">{m.message}</p>
            <div className="mt-3 flex gap-4 text-sm">
              {m.email && (
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: Red Bunder – ${CONTACT_TOPIC_LABELS[m.topic]}`)}`} className="text-brand hover:underline">
                  E-posta ile yanıtla
                </a>
              )}
              {m.phone && (
                <a href={`tel:${m.phone}`} className="text-brand hover:underline">Ara</a>
              )}
            </div>
          </Card>
        ))}
        {messages.length === 0 && <Card>Bu filtrede mesaj yok.</Card>}
      </div>
    </>
  );
}
