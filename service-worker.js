const CACHE_NAME = 'wordpassport-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/words.js',
    '/icon-192.png',
    '/icon-512.png'
];

// 安裝：快取所有資源
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 啟動：清除舊快取
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// 攔截請求：有快取用快取，沒有才去網路
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});
