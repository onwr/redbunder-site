import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { toggleAnnouncement } from "@/actions/announcements";
import { dateToISO, formatDay, todayISO } from "@/lib/dates";
import { formatDate } from "@/lib/utils";
import { Badge, ButtonLink, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Duyurular" };

export default async function AnnouncementsPage() {
  const user = await requireUser("announcements");
  const [announcements, myBranch] = await Promise.all([
    prisma.announcement.findMany({
      where: user.branchId ? { branchId: user.branchId } : {},
      orderBy: { createdAt: "desc" },
      include: { branch: { select: { name: true } }, createdBy: { select: { name: true } } },
    }),
    user.branchId ? prisma.branch.findUnique({ where: { id: user.branchId }, select: { name: true } }) : null,
  ]);
  const today = todayISO();

  return (
    <>
      <PageHeader
        title="Duyurular"
        description={
          myBranch
            ? `${myBranch.name} şubesinin duyuruları. Sitede Duyurular sayfasında ve şube kartında görünür.`
            : "Sitede Duyurular sayfasında ve şube kartlarında görünür. Şube seçilmeyen duyuru tüm şubeler için geçerlidir."
        }
        actions={<ButtonLink href="/admin/duyurular/yeni">+ Yeni duyuru</ButtonLink>}
      />
      <Table head={["Başlık", "Şube", "Yazan", "Tarih", "Bitiş", "Durum", ""]} empty={announcements.length === 0}>
        {announcements.map((a) => {
          const expired = a.endsAt != null && dateToISO(a.endsAt) < today;
          return (
            <tr key={a.id} className="hover:bg-neutral-50">
              <Td className="max-w-sm">
                <Link href={`/admin/duyurular/${a.id}`} className="block truncate font-medium hover:text-brand">{a.title}</Link>
                <p className="truncate text-xs text-neutral-500">{a.body}</p>
              </Td>
              <Td>{a.branch?.name ?? <Badge tone="blue">Tüm şubeler</Badge>}</Td>
              <Td className="text-neutral-500">{a.createdBy?.name ?? "-"}</Td>
              <Td className="whitespace-nowrap text-neutral-500">{formatDate(a.createdAt)}</Td>
              <Td className="whitespace-nowrap text-neutral-500">{a.endsAt ? formatDay(dateToISO(a.endsAt)) : "-"}</Td>
              <Td>
                {!a.isPublished ? <Badge>Taslak</Badge> : expired ? <Badge tone="amber">Süresi doldu</Badge> : <Badge tone="green">Yayında</Badge>}
              </Td>
              <Td className="whitespace-nowrap text-right">
                <form action={toggleAnnouncement} className="inline">
                  <input type="hidden" name="id" value={a.id} />
                  <button className="mr-3 text-sm text-neutral-500 hover:text-[#111] hover:underline">
                    {a.isPublished ? "Yayından kaldır" : "Yayınla"}
                  </button>
                </form>
                <Link href={`/admin/duyurular/${a.id}`} className="text-sm text-brand hover:underline">Düzenle</Link>
              </Td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
