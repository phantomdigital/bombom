import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "site_preview_bypass";

function isSiteOpen() {
  return process.env.SITE_OPEN === "true";
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const previewParam = url.searchParams.get("preview");
  const previewKey = process.env.SITE_PREVIEW_KEY;
  const hasBypassCookie = request.cookies.get(BYPASS_COOKIE)?.value === "1";

  if (previewParam === "off") {
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    response.cookies.delete(BYPASS_COOKIE);
    return response;
  }

  if (previewParam && previewKey && previewParam === previewKey) {
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    response.cookies.set(BYPASS_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  }

  if (isSiteOpen() || hasBypassCookie) {
    return NextResponse.next();
  }

  if (url.pathname !== "/coming-soon") {
    url.pathname = "/coming-soon";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
