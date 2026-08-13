const CACHE = "kenil-roadmap-static-v4";
const PUBLIC_ASSETS = [
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PUBLIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Protected HTML and API responses are deliberately never cached. This keeps
// the password boundary server-enforced even after sign-out. An already-open
// authenticated tab continues to save edits to localStorage while offline and
// uploads them when the connection returns.
