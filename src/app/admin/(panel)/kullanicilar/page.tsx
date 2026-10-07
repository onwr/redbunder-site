import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ROLE_AREAS, ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, ButtonLink, Card, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Kullanıcılar" };

const AREA_LABELS: Record<string, string> = {
  dashboard: "Genel bakış",
  menu: "Menü",
  branches: "Şubeler",
  qr: "QR",
  applications: "Başvurular",
  positions: "Pozisyonlar",
  career: "Kariyer sitesi",
  tasks: "Görevler",
  ads: "Reklamlar",
  messages: "Mesajlar",
  reviews: "Yorumlar",
  announcements: "Duyurular",
  users: "Kullanıcılar",
  settings: "Ayarlar",
};

export default async function UsersPage() {
  const me = await requireUser("users");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" }, include: { branch: { select: { name: true } } } });

  return (
    <>
      <PageHeader
        title="Kullanıcılar"
        description="Yönetim paneline erişebilen kişiler."
        actions={<ButtonLink href="/admin/kullanicilar/yeni">+ Yeni kullanıcı</ButtonLink>}
      />
      <Table head={["Ad", "E-posta", "Rol", "Durum", "Son giriş", ""]}>
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-neutral-50">
            <Td className="font-medium">{u.name} {u.id === me.id && <Badge>Sen</Badge>}</Td>
            <Td>{u.email}</Td>
            <Td>
              {ROLE_LABELS[u.role]}
              {u.role === "ANNOUNCER" && <span className="ml-1.5 text-xs text-neutral-500">({u.branch?.name ?? "tüm şubeler"})</span>}
            </Td>
            <Td>{u.isActive ? <Badge tone="green">Aktif</Badge> : <Badge>Pasif</Badge>}</Td>
            <Td className="text-neutral-500">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "-"}</Td>
            <Td className="text-right"><Link href={`/admin/kullanicilar/${u.id}`} className="text-sm text-brand hover:underline">Düzenle</Link></Td>
          </tr>
        ))}
      </Table>

      <Card className="mt-6">
        <h2 className="mb-3 font-semibold">Rol yetkileri</h2>
        <ul className="space-y-1 text-sm">
          {Object.entries(ROLE_AREAS).map(([role, areas]) => (
            <li key={role}>
              <b>{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}:</b> {areas.map((a) => AREA_LABELS[a]).join(", ")}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
