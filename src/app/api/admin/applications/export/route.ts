import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { can, GENDER_LABELS, STATUS_LABELS } from "@/lib/constants";
import { listAllApplications } from "@/lib/services/applications";
import { applicationListQuerySchema } from "@/lib/validations/admin";
import { formatDate } from "@/lib/utils";

/** GET /api/admin/applications/export?status=&positionId=&branchId=&q= → Excel uyumlu CSV */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "applications")) return NextResponse.json({ ok: false }, { status: 401 });

  const query = applicationListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const rows = await listAllApplications(query);

  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["ID", "Ad Soyad", "Telefon", "Cinsiyet", "Yaş", "Alan", "Şube", "Durum", "Not", "Tarih"];
  const lines = rows.map((r) =>
    [
      r.id,
      r.fullName,
      r.phone,
      GENDER_LABELS[r.gender],
      r.age,
      r.position.title,
      r.branch?.name ?? "",
      STATUS_LABELS[r.status],
      r.note ?? "",
      formatDate(r.createdAt),
    ]
      .map(escape)
      .join(";"),
  );
  // BOM: Excel'in Türkçe karakterleri doğru göstermesi için
  const csv = "﻿" + [header.map(escape).join(";"), ...lines].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="basvurular-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
