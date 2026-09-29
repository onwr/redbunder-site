import { NextResponse } from "next/server";
import { getMenu } from "@/lib/services/menu";

/** GET /api/menu – menü (JSON). İleride mobil uygulama / dış ekranlar için. */
export async function GET() {
  return NextResponse.json({ ok: true, categories: await getMenu() });
}
