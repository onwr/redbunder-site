import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { deleteUser, saveUser } from "@/actions/users";
import { ROLE_LABELS } from "@/lib/constants";
import { ActionForm, CheckboxField, SelectField, TextField } from "@/components/admin/form";
import { ButtonLink, Card, DeleteForm, PageHeader } from "@/components/admin/ui";

export default async function UserEditPage({ params }: PageProps<"/admin/kullanicilar/[id]">) {
  const me = await requireUser("users");
  const { id } = await params;
  const isNew = id === "yeni";
  const user = isNew
    ? null
    : await prisma.user.findUnique({
        where: { id: Number(id) || 0 },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });
  if (!isNew && !user) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "Yeni kullanıcı" : user!.name}
        actions={<ButtonLink href="/admin/kullanicilar" variant="secondary">← Kullanıcılar</ButtonLink>}
      />
      <Card className="max-w-xl">
        <ActionForm action={saveUser}>
          {user && <input type="hidden" name="id" value={user.id} />}
          <TextField name="name" label="Ad soyad" defaultValue={user?.name} required />
          <TextField name="email" label="E-posta" type="email" defaultValue={user?.email} required autoComplete="off" />
          <SelectField
            name="role"
            label="Rol"
            defaultValue={user?.role ?? "EDITOR"}
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <TextField
            name="password"
            label={isNew ? "Şifre" : "Yeni şifre"}
            type="password"
            autoComplete="new-password"
            hint={isNew ? "En az 8 karakter" : "Değiştirmek istemiyorsan boş bırak"}
            required={isNew}
          />
          <CheckboxField name="isActive" label="Aktif" defaultChecked={user?.isActive ?? true} />
        </ActionForm>
      </Card>
      {user && user.id !== me.id && (
        <div className="mt-6">
          <DeleteForm action={deleteUser} id={user.id} label="Kullanıcıyı sil" />
        </div>
      )}
    </>
  );
}
