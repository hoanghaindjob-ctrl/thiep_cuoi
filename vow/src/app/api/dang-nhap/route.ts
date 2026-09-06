import { NextResponse } from "next/server";
import { STUDIO_COOKIE, sessionToken } from "@/lib/auth";

/** A wrong password should not be worth guessing at speed. */
const DELAY_MS = 400;

export async function POST(request: Request) {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Chưa đặt STUDIO_PASSWORD trên máy chủ." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    password = String(((await request.json()) as { password?: string }).password ?? "");
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, DELAY_MS));

  if (password !== expected) {
    return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE, await sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
