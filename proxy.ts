import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/og.png",
  "/manifest.webmanifest",
  "/sw.js",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (
    pathname.startsWith("/_next/") ||
    PUBLIC_PATHS.some((path) => pathname === path)
  )
    return NextResponse.next();

  const valid = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  if (valid) return NextResponse.next();

  if (pathname.startsWith("/api/"))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = new URL("/login", request.url);
  login.searchParams.set("returnTo", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
