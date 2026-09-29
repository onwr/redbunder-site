import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge, ButtonLink, PageHeader, Table, Td } from "@/components/admin/ui";

export const metadata = { title: "Şubeler" };

export default async function BranchesPage() {
  await requireUser("branches");
  const branches = await prisma.branch.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <>
      <PageHeader
        title="Şubeler"
        description="Şube bilgileri (Şubeler sayfası ve kariyer formu). Menü tüm şubelerde aynıdır."
        actions={<ButtonLink href="/admin/subeler/yeni">+ Yeni şube</ButtonLink>}
      />
      <Table head={["Şube", "İlçe", "Telefon", "Çalışma saatleri", "Durum", ""]} empty={branches.length === 0}>
        {branches.map((b) => (
          <tr key={b.id} className="hover:bg-neutral-50">
            <Td>
              <Link href={`/admin/subeler/${b.id}`} className="font-medium hover:text-brand">{b.name}</Link>
            </Td>
            <Td>{b.district ?? "-"}</Td>
            <Td>{b.phone ?? "-"}</Td>
            <Td>{b.openingHours ?? "-"}</Td>
            <Td>{b.isActive ? <Badge tone="green">Aktif</Badge> : <Badge>Pasif</Badge>}</Td>
            <Td className="text-right">
              <Link href={`/admin/subeler/${b.id}`} className="text-sm text-brand hover:underline">Düzenle</Link>
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
