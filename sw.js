/* Schedario Quiz service worker: the app shell is precached so the app opens offline;
   Google Fonts are cached on first use. Bump VERSION whenever a shell file changes. */
const VERSION = "schedario-v2";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];
const FONTS = "schedario-fonts";

self.addEventListener("install", ev => {
  ev.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", ev => {
  ev.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages: network first so updates arrive when online, cached shell when offline.
  if (req.mode === "navigate"){
    ev.respondWith(fetch(req).then(res => {
      if (res.ok){ const copy = res.clone(); caches.open(VERSION).then(c => c.put("./index.html", copy)); }
      return res;
    }).catch(() => caches.match("./index.html", {ignoreSearch: true})));
    return;
  }

  // Fonts: serve from cache, refresh in the background.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    ev.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }

  // Other same-origin files: cache first.
  if (url.origin === self.location.origin){
    ev.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
      if (res.ok){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
