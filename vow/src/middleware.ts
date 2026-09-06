import { NextResponse, type NextRequest } from "next/server";
import { STUDIO_COOKIE, expectedToken, sameToken } from "@/lib/auth";

/**
 * Guards the studio and its write endpoints. The guest invitation at
 * /i/<slug>/<token> is deliberately left open — that link is the invitation.
 *
 * Fails closed: with no STUDIO_PASSWORD set, nothing gets in. An unset
 * password on a deployed site would otherwise mean an open guest list.
 */
export async function middleware(request: NextRequest) {
  const expected = await expectedToken();
  const isApi = request.nextUrl.pathname.startsWith("/api/");

  if (!expected) {
    const message =
      "Chưa đặt STUDIO_PASSWORD. Thêm biến này vào .env.local rồi khởi động lại.";
    return isApi
      ? NextResponse.json({ error: message }, { status: 503 })
      : new NextResponse(message, {
          status: 503,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
  }

  const cookie = request.cookies.get(STUDIO_COOKIE)?.value ?? "";
  if (sameToken(cookie, expected)) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  const login = new URL("/dang-nhap", request.url);
  login.searchParams.set("tiep", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/",
    "/guests",
    "/api/invitation/:path*",
    "/api/guests/:path*",
    "/api/images/:path*",
  ],
};
