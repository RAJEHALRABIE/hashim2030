/**
 * Service Worker المحسّن - v4.2
 */

const CACHE_NAME = "thrivve-tracker-v4.2";
const RUNTIME_CACHE = "thrivve-runtime-v4.2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./constants.js",
  "./utils.js",
  "./report.html",
  "./manifest.webmanifest",
  "./icon-512.png",
  "./icon-196.png"
];

self.addEventListener("install", (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Core assets cached successfully');
        return self.skipWaiting(); 
      })
      .catch((error) => {
        console.error('[SW] Failed to cache core assets:', error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (url.origin !== location.origin) {
    return;
  }
  
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  event.respondWith(networkFirstStrategy(request));
});

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const coreCache = await caches.match(request);
    if (coreCache) return coreCache;
    
    const runtimeCache = await caches.match(request, { 
      cacheName: RUNTIME_CACHE 
    });
    if (runtimeCache) return runtimeCache;
    
    if (request.headers.get("accept")?.includes("text/html")) {
      return caches.match("./index.html");
    }
    
    throw error;
  }
}

async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  
  if (cached) {
    updateCache(request);
    return cached;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch:', request.url, error);
    throw error;
  }
}

async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response);
    }
  } catch (error) {
    console.log('[SW] Background update failed:', error);
  }
}

function isStaticAsset(pathname) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}
