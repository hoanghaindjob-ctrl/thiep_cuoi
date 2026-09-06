import { NextResponse } from "next/server";
import { getInvitation, saveInvitation } from "@/lib/db";
import type { Invitation } from "@/types/invitation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ data: await getInvitation() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}

/** Enough of a shape check that a malformed save cannot blank the invitation. */
function looksLikeInvitation(v: unknown): v is Invitation {
  if (!v || typeof v !== "object") return false;
  const i = v as Partial<Invitation>;
  return (
    typeof i.slug === "string" &&
    i.slug.length > 0 &&
    typeof i.bride === "string" &&
    typeof i.groom === "string" &&
    typeof i.event === "object" &&
    i.event !== null &&
    Array.isArray(i.timeline) &&
    Array.isArray(i.gallery) &&
    Array.isArray(i.sections)
  );
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 });
  }
  if (!looksLikeInvitation(body)) {
    return NextResponse.json(
      { error: "Dữ liệu thiệp thiếu trường bắt buộc." },
      { status: 400 },
    );
  }
  try {
    await saveInvitation(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không lưu được." },
      { status: 500 },
    );
  }
}
