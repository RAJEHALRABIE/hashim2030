/**
 * Service Worker المحسّن - v4.2
 * استراتيجيات cache ذكية لتحسين الأداء وتجربة offline
 */

const CACHE_NAME = "thrivve-tracker-v4.2";
const RUNTIME_CACHE = "thrivve-runtime-v4.2";

// الملفات الأساسية للتطبيق
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

/**
 * Install Event - تثبيت Service Worker
 * يقوم بتخزين الملفات الأساسية في الكاش
 */
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
        return self.skipWaiting(); // تفعيل SW الجديد فوراً
      })
      .catch((error) => {
        console.error('[SW] Failed to cache core assets:', error);
      })
  );
});

/**
 * Activate Event - تفعيل Service Worker
 * يقوم بحذف الكاش القديم
 */
self.addEventListener("activate", (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // حذف أي كاش قديم
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // السيطرة على جميع الصفحات فوراً
      })
  );
});

/**
 * Fetch Event - التعامل مع الطلبات
 * استراتيجيات مختلفة حسب نوع الملف
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل الطلبات الخارجية (لو كان هناك أي CDN مستقبلاً)
  if (url.origin !== location.origin) {
    return;
  }
  
  // استراتيجية Network First للـ HTML
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // استراتيجية Cache First للموارد الثابتة
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // استراتيجية Network First للملفات الديناميكية
  event.respondWith(networkFirstStrategy(request));
});

/**
 * Network First Strategy
 * جرب الشبكة أولاً، ثم الكاش عند الفشل
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // حفظ في Runtime Cache
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    // جرب الكاش الأساسي
    const coreCache = await caches.match(request);
    if (coreCache) return coreCache;
    
    // جرب الكاش المؤقت
    const runtimeCache = await caches.match(request, { 
      cacheName: RUNTIME_CACHE 
    });
    if (runtimeCache) return runtimeCache;
    
    // إذا كان HTML، أعد توجيه للصفحة الرئيسية
    if (request.headers.get("accept")?.includes("text/html")) {
      return caches.match("./index.html");
    }
    
    // فشل كل شيء
    throw error;
  }
}

/**
 * Cache First Strategy
 * جرب الكاش أولاً، ثم الشبكة عند عدم الوجود
 */
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  
  if (cached) {
    // تحديث الكاش في الخلفية (stale-while-revalidate)
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

/**
 * تحديث الكاش في الخلفية
 */
async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response);
    }
  } catch (error) {
    // تجاهل الأخطاء في التحديث الخلفي
    console.log('[SW] Background update failed:', error);
  }
}

/**
 * التحقق من كون الملف مورد ثابت
 */
function isStaticAsset(pathname) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

/**
 * Message Event - التواصل مع الصفحة الرئيسية
 */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

/**
 * Sync Event - مزامنة البيانات في الخلفية (للاستخدام المستقبلي)
 */
self.addEventListener("sync", (event) => {
  if (event.tag === 'sync-trips') {
    event.waitUntil(syncTripsData());
  }
});

/**
 * مزامنة بيانات الرحلات (placeholder للمستقبل)
 */
async function syncTripsData() {
  console.log('[SW] Syncing trips data...');
  // يمكن إضافة منطق المزامنة مع خادم هنا لاحقاً
}

/**
 * Push Event - الإشعارات (للاستخدام المستقبلي)
 */
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من متابع حافز ثرايف',
    icon: './icon-196.png',
    badge: './icon-196.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('متابع حافز ثرايف', options)
  );
});

/**
 * Notification Click Event - التعامل مع نقر الإشعار
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[SW] Service Worker script loaded');
