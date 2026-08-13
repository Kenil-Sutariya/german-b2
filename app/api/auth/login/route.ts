import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

function safeReturnTo(value: FormDataEntryValue | null) {
  const path = String(value ?? "/");
  return path.startsWith("/") && !path.startsWith("//") && path !== "/login"
    ? path
    : "/";
}

function loginRedirect(request: Request, returnTo: string, error: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("returnTo", returnTo);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const returnTo = safeReturnTo(form.get("returnTo"));
  const password = String(form.get("password") ?? "");
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  const client = forwarded?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(client);
  if (current && current.resetAt > now && current.count >= 8)
    return loginRedirect(request, returnTo, "too-many-attempts");

  const hash = process.env.SITE_PASSWORD_HASH;
  if (!hash)
    return loginRedirect(request, returnTo, "configuration");

  const valid = password.length > 0 && (await compare(password, hash));
  if (!valid) {
    attempts.set(client, {
      count: current && current.resetAt > now ? current.count + 1 : 1,
      resetAt: now + 15 * 60 * 1000,
    });
    return loginRedirect(request, returnTo, "invalid");
  }

  attempts.delete(client);
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(
    SESSION_COOKIE,
    await createSessionToken(),
    sessionCookieOptions,
  );
  return response;
}
