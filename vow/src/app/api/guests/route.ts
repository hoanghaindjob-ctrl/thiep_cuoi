import { NextResponse } from "next/server";
import { listGuests, saveGuests } from "@/lib/db";
import type { Guest } from "@/types/invitation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ data: await listGuests() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}

/**
 * Tokens end up in a `not in (...)` clause when saving, so they have to stay
 * within a safe alphabet — and a guest with no name has no invitation.
 */
function looksLikeGuests(v: unknown): v is Guest[] {
  if (!Array.isArray(v)) return false;
  return v.every((g: unknown) => {
    if (!g || typeof g !== "object") return false;
    const x = g as Partial<Guest>;
    return (
      typeof x.token === "string" &&
      /^[A-Za-z0-9_-]{4,64}$/.test(x.token) &&
      (x.ceremonyType === "thanh-hon" || x.ceremonyType === "vu-quy") &&
      typeof x.name === "string" &&
      x.name.trim().length > 0 &&
      typeof x.attendees === "number" &&
      Number.isInteger(x.attendees) &&
      x.attendees >= 0 &&
      x.attendees <= 50
    );
  });
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 });
  }
  if (!looksLikeGuests(body)) {
    return NextResponse.json(
      { error: "Danh sách khách có bản ghi không hợp lệ." },
      { status: 400 },
    );
  }
  const tokens = new Set(body.map((g) => g.token));
  if (tokens.size !== body.length) {
    return NextResponse.json({ error: "Token khách bị trùng." }, { status: 400 });
  }
  try {
    await saveGuests(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không lưu được." },
      { status: 500 },
    );
  }
}
