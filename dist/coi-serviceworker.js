/* coi-serviceworker v0.1.7 - https://github.com/gzuidhof/coi-serviceworker */
/* License: MIT */

/* As a service worker script */
if (typeof window === "undefined") {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) =>
    event.waitUntil(self.clients.claim())
  );

  async function handleFetch(request) {
    if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
      return;
    }
    const response = await fetch(request).catch(() => new Response(null, { status: 503 }));
    if (response.status === 0) {
      return response;
    }
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  self.addEventListener("fetch", (event) => {
    event.respondWith(handleFetch(event.request));
  });
} else {
  /* As a page script — registers the service worker then reloads if needed */
  (() => {
    if (!("serviceWorker" in navigator)) return;

    const reloadedKey = "coi-sw-reloaded";

    async function register() {
      const registration = await navigator.serviceWorker.register(
        window.coiServiceWorkerPath || "/coi-serviceworker.js"
      );

      if (registration.active && !navigator.serviceWorker.controller) {
        /* SW installed but not yet controlling — reload once */
        if (!sessionStorage.getItem(reloadedKey)) {
          sessionStorage.setItem(reloadedKey, "1");
          window.location.reload();
          return;
        }
      }
      sessionStorage.removeItem(reloadedKey);
    }

    if (
      !crossOriginIsolated &&
      !location.href.startsWith("https://localhost") &&
      !location.href.startsWith("http://localhost")
    ) {
      register();
    }
  })();
}
