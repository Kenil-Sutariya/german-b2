import "server-only";

import { neon } from "@neondatabase/serverless";
import type { ProgressState } from "@/types/learning";

export interface StoredProgress {
  state: ProgressState;
  revision: number;
  updatedAt: string;
}

const USER_ID = "kenil";
let schemaReady: Promise<void> | undefined;

declare global {
  var __roadmapTestProgress: StoredProgress | undefined;
}

function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error("DATABASE_URL is not configured for cloud synchronization.");
  return neon(connectionString);
}

async function ensureSchema() {
  if (process.env.E2E_TEST_MODE === "1") return;
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = database();
      await sql`
        CREATE TABLE IF NOT EXISTS roadmap_progress (
          user_id TEXT PRIMARY KEY,
          state JSONB NOT NULL,
          revision INTEGER NOT NULL DEFAULT 1,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })();
  }
  await schemaReady;
}

export async function readProgress(): Promise<StoredProgress | null> {
  if (process.env.E2E_TEST_MODE === "1")
    return globalThis.__roadmapTestProgress ?? null;
  await ensureSchema();
  const sql = database();
  const rows = await sql`
    SELECT state, revision, updated_at
    FROM roadmap_progress
    WHERE user_id = ${USER_ID}
  `;
  const row = rows[0] as
    | { state: ProgressState; revision: number; updated_at: string | Date }
    | undefined;
  if (!row) return null;
  return {
    state: row.state,
    revision: Number(row.revision),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function writeProgress(
  state: ProgressState,
): Promise<StoredProgress> {
  if (process.env.E2E_TEST_MODE === "1") {
    const record = {
      state: structuredClone(state),
      revision: (globalThis.__roadmapTestProgress?.revision ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    globalThis.__roadmapTestProgress = record;
    return record;
  }
  await ensureSchema();
  const sql = database();
  const serialized = JSON.stringify(state);
  const rows = await sql`
    INSERT INTO roadmap_progress (user_id, state, revision, updated_at)
    VALUES (${USER_ID}, ${serialized}::jsonb, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      state = EXCLUDED.state,
      revision = roadmap_progress.revision + 1,
      updated_at = NOW()
    RETURNING state, revision, updated_at
  `;
  const row = rows[0] as {
    state: ProgressState;
    revision: number;
    updated_at: string | Date;
  };
  return {
    state: row.state,
    revision: Number(row.revision),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export function resetTestProgress() {
  if (process.env.E2E_TEST_MODE !== "1")
    throw new Error("Test progress can only be reset in E2E test mode.");
  globalThis.__roadmapTestProgress = undefined;
}
