// Client-side kill-switch for any stranded service worker on this
// origin.
//
// Background: a previous deploy registered a service worker at /sw.js
// (likely from a Docusaurus PWA or search offline-caching plugin that
// has since been removed). The SW outlived the deploy that installed
// it and keeps intercepting /learn/ navigations, handing visitors the
// docs site's cached /404.html instead of the real learn sub-site.
//
// /sw.js itself has been replaced with a self-unregistering script,
// but browsers only re-fetch a SW script during their update check —
// which may not happen until a user's next visit and at most every
// 24h per spec. This module runs as early as Docusaurus will let us,
// on every page load, and actively unregisters any SW it finds plus
// clears Cache Storage. Once an affected user visits any page on the
// site once, their browser drops the stale SW and the next navigation
// to /learn/ goes to the network normally.
//
// Safe to leave in place indefinitely — if there are no registrations
// to unregister, it's a no-op.

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    })
    .catch(() => {});

  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {});
        }
      })
      .catch(() => {});
  }
}
