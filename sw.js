const CACHE_NAME = 'rakib-v3'; // ভার্সন চেঞ্জ করলে v4, v5 করবা

// ইনস্টল হলে সাথে সাথে একটিভ করো
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// পুরান ক্যাশ ডিলিট করো
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// রিকোয়েস্ট আসলে নেট থেকে আনো, না পাইলে ক্যাশ থেকে দাও
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
