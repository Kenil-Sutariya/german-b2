import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session-token";

export {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session-token";

export async function hasAuthenticatedSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}
