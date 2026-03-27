/* eslint-disable no-restricted-globals */

// اسم التخزين المؤقت - قم بتغييره عند تحديث التطبيق
const CACHE_NAME = "clinic-app-v1";

// الملفات التي سيتم تخزينها للعمل بدون إنترنت
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
];

// تثبيت الـ Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

// استراتيجية جلب البيانات: البحث في الكاش أولاً، ثم الشبكة
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا وجدنا الملف في الكاش، نعيده، وإلا نطلبه من الشبكة
      return response || fetch(event.request);
    }),
  );
});

// تحديث الـ Service Worker وحذف الكاش القديم
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        }),
      );
    }),
  );
});
