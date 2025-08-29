/* Pink Mood Garden — Service Worker */
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `pmg-static-${CACHE_VERSION}`;
const STATIC_ASSETS = [
'/',
'/index.html',
'/css/style.css',
'/js/main.js',
'/js/calendar.js',
'/js/notes.js',
'/js/effects.js',
'/assets/data/moods.json' // 若不存在会忽略
];


self.addEventListener('install', (event)=>{
event.waitUntil(
caches.open(STATIC_CACHE).then(cache=> cache.addAll(STATIC_ASSETS)).then(()=> self.skipWaiting())
);
});


self.addEventListener('activate', (event)=>{
event.waitUntil(
caches.keys().then(keys=> Promise.all(keys.map(key=>{
if(key.startsWith('pmg-static-') && key !== STATIC_CACHE){ return caches.delete(key); }
}))).then(()=> self.clients.claim())
);
});


// 静态资源优先：HTML/CSS/JS 先走缓存，失效再网络
self.addEventListener('fetch', (event)=>{
const { request } = event;
const url = new URL(request.url);


// 仅处理同源 GET
if(request.method !== 'GET' || url.origin !== self.location.origin) return;


// 对图片使用 S-W-R（stale-while-revalidate）
if(request.destination === 'image'){
event.respondWith((async ()=>{
const cache = await caches.open(STATIC_CACHE);
const cached = await cache.match(request);
const network = fetch(request).then(res=>{ cache.put(request, res.clone()); return res; }).catch(()=> cached);
return cached || network;
})());
return;
}


// 其他静态：Cache First
event.respondWith(
caches.match(request).then(cached=> cached || fetch(request))
);
});