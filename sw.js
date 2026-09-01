/* Accord ESM service worker — keeps the app shell installable and resilient, never caches the 112k Honda pages.
   Bump SW_VER together with ESM_VER in HONDAESM.HTML on every deploy (see DEPLOY.md). */
var SW_VER='esm-2.0.0';
var SHELL=/\/(HONDAESM\.HTML|welcome\.html|service\.html|trims\.html|guides\.html|index\.html|manifest\.webmanifest)$|\/$/;
var STATIC=/\/(fonts|icons)\//;

self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==SW_VER}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});

self.addEventListener('fetch',function(e){
  var req=e.request;if(req.method!=='GET')return;
  var u;try{u=new URL(req.url)}catch(err){return}
  if(u.origin!==self.location.origin)return;
  var p=u.pathname;
  if(STATIC.test(p)){
    /* fonts + icons: cache-first (versioned via ?v=, so safe) */
    e.respondWith(caches.open(SW_VER).then(function(c){return c.match(req).then(function(hit){return hit||fetch(req).then(function(res){if(res&&res.ok)c.put(req,res.clone());return res})})}));
    return}
  if(SHELL.test(p)&&!/\/mk[78]\//.test(p)){
    /* app shell: network-first so deploys land immediately; cached copy only when offline */
    e.respondWith(fetch(req).then(function(res){if(res&&res.ok)caches.open(SW_VER).then(function(c){c.put(req,res.clone())});return res}).catch(function(){return caches.match(req)}));
    return}
  /* everything else (Honda pages, indexes, title lists, images): straight to network */
});
