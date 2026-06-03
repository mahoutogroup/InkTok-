/* ============================================================
   InkTok — Service Worker v2 (FORCE REFRESH)
   ©2026 MAHOUTO X-PRO BY MAJESTÉ PRESSE
   ============================================================ */

/* Changer ce numéro à chaque mise à jour pour forcer le rechargement */
const CACHE_NAME = 'inktok-v2';

const ASSETS = [
  '/',
  '/index.html',
  '/profil.html',
  '/manifest.json'
];

/* Installation */
self.addEventListener('install', event => {
  self.skipWaiting(); /* Force l'activation immédiate */
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* Activation — supprime TOUS les anciens caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k))) /* Supprime tout */
    ).then(() => self.clients.claim()) /* Prend le contrôle immédiatement */
  );
});

/* Fetch — Network First (toujours chercher le réseau en priorité) */
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        /* Met en cache la nouvelle version */
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) /* Fallback cache si offline */
  );
});
