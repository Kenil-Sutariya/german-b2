import { redirect } from "next/navigation";
import { hasAuthenticatedSession } from "@/lib/session";

const messages: Record<string, string> = {
  invalid: "That password was not correct. Please try again.",
  "too-many-attempts": "Too many attempts. Please wait 15 minutes and try again.",
  configuration: "Private access is not configured yet. Add the required Vercel environment variables.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; returnTo?: string }>;
}) {
  const { error, returnTo = "/" } = await searchParams;
  const safeReturnTo =
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//") &&
    returnTo !== "/login"
      ? returnTo
      : "/";
  if (await hasAuthenticatedSession()) redirect(safeReturnTo);
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-mark" aria-hidden="true">K</div>
        <p className="login-kicker">PRIVATE LEARNING SPACE</p>
        <h1>Kenil&apos;s German Roadmap</h1>
        <p className="login-affirmation">You are speaking confidently.</p>
        {error && (
          <div className="login-error" role="alert">
            {messages[error] ?? messages.invalid}
          </div>
        )}
        <form action="/api/auth/login" method="post">
          <input type="hidden" name="returnTo" value={safeReturnTo} />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
          <button type="submit">Unlock</button>
        </form>
        <small>Your password is checked securely on the server.</small>
      </section>
    </main>
  );
}
