/* Accord ESM service worker — keeps the app shell installable and resilient, never caches the 112k Honda pages.
   Bump SW_VER together with ESM_VER in HONDAESM.HTML on every deploy (see DEPLOY.md). */
var SW_VER='esm-2.2.2';
var SHELL=/\/(HONDAESM\.HTML|welcome\.html|service\.html|trims\.html|guides\.html|index\.html|manifest\.webmanifest)$|\/$/;
var STATIC=/\/(fonts|icons)\//;
var OFFLINE='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title><body style="font-family:sans-serif;background:#191512;color:#d8c9a8;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:24px"><div><b style="color:#e8b04a;font-size:20px">Accord ESM is offline</b><br><br>The manual needs a connection the first time each page is opened.<br>Your notes, jobs and bookmarks are still saved in this browser.<br><br><a href="./HONDAESM.HTML" style="color:#e8b04a">Try again</a></div></body>';

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(SW_VER).then(function(c){return c.addAll(['./HONDAESM.HTML','./welcome.html','./manifest.webmanifest']).catch(function(){})}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==SW_VER}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});

self.addEventListener('fetch',function(e){
  var req=e.request;if(req.method!=='GET')return;
  var u;try{u=new URL(req.url)}catch(err){return}
  if(u.origin!==self.location.origin)return;
  var p=u.pathname;
  if(STATIC.test(p)){
    /* fonts + icons: cache-first (versioned via ?v=, so safe) */
    e.respondWith(caches.open(SW_VER).then(function(c){return c.match(req).then(function(hit){if(hit)return hit;
      return fetch(req).then(function(res){if(res&&res.ok){var copy=res.clone();e.waitUntil(c.put(req,copy))}return res})})}));
    return}
  if(SHELL.test(p)&&!/\/mk[78]\//.test(p)){
    /* app shell: network-first so deploys land immediately; cached copy when offline; branded page as a last resort */
    e.respondWith(fetch(req).then(function(res){
      if(res&&res.ok){var copy=res.clone();e.waitUntil(caches.open(SW_VER).then(function(c){return c.put(req,copy)}))}
      return res}).catch(function(){
      return caches.match(req).then(function(hit){return hit||new Response(OFFLINE,{status:200,headers:{'Content-Type':'text/html; charset=utf-8'}})})}));
    return}
  /* everything else (Honda pages, indexes, title lists, images): straight to network */
});
