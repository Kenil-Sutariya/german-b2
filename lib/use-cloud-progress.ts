"use client";

/* eslint-disable react-hooks/set-state-in-effect -- Effects synchronize browser cache with the authenticated cloud API. */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProgressState } from "@/types/learning";
import { migrateProgress } from "@/lib/progress-data";
import {
  defaultProgress,
  clearPendingSync,
  hasPendingSync,
  hasStoredProgress,
  loadProgress,
  markPendingSync,
  saveProgress,
} from "@/lib/storage";

export type SyncStatus = "synced" | "syncing" | "offline" | "error";

type CloudResponse = {
  exists: boolean;
  state?: ProgressState;
  revision?: number;
  updatedAt?: string;
};

export function useCloudProgress() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<SyncStatus>("syncing");
  const [migrationNotice, setMigrationNotice] = useState(false);
  const progressRef = useRef(progress);
  const initializedRef = useRef(false);
  const dirtyRef = useRef(false);
  const lastCloudSnapshotRef = useRef("");
  const uploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const upload = useCallback(
    async (initialState = progressRef.current) => {
      let state = initialState;
      while (true) {
        const snapshot = JSON.stringify(state);
        if (!navigator.onLine) {
          dirtyRef.current = true;
          setStatus("offline");
          return false;
        }
        setStatus("syncing");
        try {
          const response = await fetch("/api/progress", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ state }),
          });
          if (response.status === 401) {
            router.replace("/login");
            return false;
          }
          if (!response.ok) throw new Error("sync failed");
          lastCloudSnapshotRef.current = snapshot;
          if (JSON.stringify(progressRef.current) === snapshot) {
            dirtyRef.current = false;
            clearPendingSync();
            setStatus("synced");
            return true;
          }
          dirtyRef.current = true;
          state = progressRef.current;
        } catch {
          dirtyRef.current = true;
          setStatus(navigator.onLine ? "error" : "offline");
          return false;
        }
      }
    },
    [router],
  );

  const pull = useCallback(async () => {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }
    if (dirtyRef.current) {
      await upload();
      return;
    }
    setStatus("syncing");
    try {
      const response = await fetch("/api/progress", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) throw new Error("sync failed");
      const data = (await response.json()) as CloudResponse;
      if (data.exists && data.state) {
        const cloud = migrateProgress(data.state);
        const snapshot = JSON.stringify(cloud);
        lastCloudSnapshotRef.current = snapshot;
        progressRef.current = cloud;
        saveProgress(cloud);
        setProgress(cloud);
      }
      setStatus("synced");
    } catch {
      setStatus(navigator.onLine ? "error" : "offline");
    }
  }, [router, upload]);

  useEffect(() => {
    let active = true;
    const cached = loadProgress();
    const hadLocalProgress = hasStoredProgress();
    const pendingOfflineChanges = hasPendingSync();
    dirtyRef.current = pendingOfflineChanges;
    progressRef.current = cached;

    async function initialize() {
      if (!navigator.onLine) {
        if (!active) return;
        setProgress(cached);
        setStatus("offline");
        initializedRef.current = true;
        setReady(true);
        return;
      }
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error("sync failed");
        const data = (await response.json()) as CloudResponse;
        if (!active) return;
        if (data.exists && data.state && !pendingOfflineChanges) {
          const cloud = migrateProgress(data.state);
          progressRef.current = cloud;
          lastCloudSnapshotRef.current = JSON.stringify(cloud);
          saveProgress(cloud);
          setProgress(cloud);
          setStatus("synced");
        } else if (data.exists && pendingOfflineChanges) {
          setProgress(cached);
          await upload(cached);
        } else {
          setProgress(cached);
          const migrated = await upload(cached);
          if (migrated && hadLocalProgress) setMigrationNotice(true);
        }
      } catch {
        if (!active) return;
        setProgress(cached);
        setStatus(navigator.onLine ? "error" : "offline");
      } finally {
        if (active) {
          initializedRef.current = true;
          setReady(true);
        }
      }
    }

    void initialize();
    return () => {
      active = false;
    };
  }, [router, upload]);

  useEffect(() => {
    progressRef.current = progress;
    if (!ready || !initializedRef.current) return;
    saveProgress(progress);
    const snapshot = JSON.stringify(progress);
    if (snapshot === lastCloudSnapshotRef.current || !dirtyRef.current) return;
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }
    setStatus("syncing");
    uploadTimerRef.current = setTimeout(() => void upload(progress), 600);
    return () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, [progress, ready, upload]);

  useEffect(() => {
    const onOnline = () => void (dirtyRef.current ? upload() : pull());
    const onOffline = () => setStatus("offline");
    const onVisible = () => {
      if (document.visibilityState === "visible") void pull();
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("focus", onOnline);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("focus", onOnline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pull, upload]);

  const update = useCallback(
    (change: (current: ProgressState) => ProgressState) => {
      setProgress((current) => {
        const next = change(current);
        progressRef.current = next;
        dirtyRef.current = true;
        markPendingSync();
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  return {
    progress,
    ready,
    status,
    update,
    migrationNotice,
    dismissMigrationNotice: () => setMigrationNotice(false),
    retrySync: () => void (dirtyRef.current ? upload() : pull()),
  };
}
