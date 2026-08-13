import { NextResponse } from "next/server";
import { migrateProgress, isSupportedProgress } from "@/lib/progress-data";
import {
  readProgress,
  resetTestProgress,
  writeProgress,
} from "@/lib/progress-store";
import { hasAuthenticatedSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorized() {
  return hasAuthenticatedSession();
}

export async function GET() {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const record = await readProgress();
    if (!record) return NextResponse.json({ exists: false });
    return NextResponse.json({ exists: true, ...record });
  } catch {
    return NextResponse.json(
      { error: "Cloud synchronization is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as { state?: unknown };
    if (!isSupportedProgress(body.state))
      return NextResponse.json(
        { error: "Invalid progress payload." },
        { status: 400 },
      );
    const record = await writeProgress(migrateProgress(body.state));
    return NextResponse.json({ exists: true, ...record });
  } catch {
    return NextResponse.json(
      { error: "Cloud synchronization is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  if (!(await authorized()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.E2E_TEST_MODE !== "1")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  resetTestProgress();
  return new NextResponse(null, { status: 204 });
}
