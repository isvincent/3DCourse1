'use strict';
const CACHE='aigc-island-v1.0.0';
const CORE=['./','./index.html','./enhancements.js','./enhancements.css','./learning-tasks.json','./manifest.webmanifest','./assets/icons/icon-192.png','./assets/icons/icon-512.png','./assets/icons/maskable-512.png'];
const EXTERNAL=new Set(['cdn.tailwindcss.com','cdnjs.cloudflare.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com']);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('aigc-island-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);if(req.method!=='GET'||(!EXTERNAL.has(url.hostname)&&url.origin!==self.location.origin))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);
 try{const response=await fetch(req);if(response.ok||response.type==='opaque')await cache.put(req,response.clone());return response;}
 catch(error){const cached=await cache.match(req);if(cached)return cached;if(req.mode==='navigate')return cache.match('./index.html');return Response.error();}
 })());
});
