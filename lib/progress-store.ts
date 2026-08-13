import "server-only";

import { get, put } from "@vercel/blob";
import type { ProgressState } from "@/types/learning";

export interface StoredProgress {
  state: ProgressState;
  revision: number;
  updatedAt: string;
}

const PROGRESS_PATH = "roadmap/kenil-progress.json";

declare global {
  var __roadmapTestProgress: StoredProgress | undefined;
}

function requireBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured for cloud synchronization.",
    );
}

export async function readProgress(): Promise<StoredProgress | null> {
  if (process.env.E2E_TEST_MODE === "1")
    return globalThis.__roadmapTestProgress ?? null;
  requireBlobToken();
  const result = await get(PROGRESS_PATH, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return (await new Response(result.stream).json()) as StoredProgress;
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
  requireBlobToken();
  const record: StoredProgress = {
    state,
    revision: Date.now(),
    updatedAt: new Date().toISOString(),
  };
  await put(PROGRESS_PATH, JSON.stringify(record), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return record;
}

export function resetTestProgress() {
  if (process.env.E2E_TEST_MODE !== "1")
    throw new Error("Test progress can only be reset in E2E test mode.");
  globalThis.__roadmapTestProgress = undefined;
}
