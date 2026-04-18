// Kill-switch service worker.
//
// A previous deploy of are-self.com registered a service worker at this
// exact URL (likely from a Docusaurus PWA or search plugin that has
// since been removed). That old SW outlived the deploy that installed
// it and is still intercepting /learn/ navigations in visitors'
// browsers, returning the docs site's cached /404.html instead of
// letting the browser fetch the real learn sub-site from GitHub Pages.
//
// When a browser with the old SW installed checks for updates (at
// most every 24h per the spec, but also on navigation), it will fetch
// this file, see a new SW script body, and install this one. The
// install + activate handlers below then:
//   1. Take control of all open clients immediately (clients.claim())
//   2. Delete every Cache Storage entry this origin has accumulated
//   3. Unregister this registration so no SW controls the origin
//
// Result: one more visit with the old SW → this SW takes over → next
// visit after that → no SW, normal browser fetch, /learn/ works.
//
// Do NOT add a fetch handler here. A SW with no fetch handler is a
// pass-through; the browser routes requests as if no SW existed.

self.addEventListener('install', (event) => {
  // Replace the outgoing SW immediately instead of waiting for all
  // clients to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Take control of any open pages that were controlled by the
    // previous SW.
    await self.clients.claim();

    // Nuke all caches this origin created.
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {
      // Cache deletion is best-effort; keep going.
    }

    // Unregister this SW so the origin has no controller going forward.
    try {
      await self.registration.unregister();
    } catch (_) {
      // If unregister fails, the no-fetch-handler pass-through still
      // keeps the site usable.
    }

    // Force a reload of every controlled client so they drop the SW
    // context and re-request their HTML from the network.
    try {
      const clientList = await self.clients.matchAll({ type: 'window' });
      for (const client of clientList) {
        // navigate() only works on same-origin clients; that's all we
        // have here.
        client.navigate(client.url).catch(() => {});
      }
    } catch (_) {
      // Reload is best-effort.
    }
  })());
});
