/* Accord ESM — translation of the launcher's own pages (Welcome, Common Jobs, Service dashboard). v2.5
   English is the source text in the page. The dictionary ./i18n/pages.<lang>.js maps
     h: a whole block (innerHTML of an element that holds text + inline tags)  →  translated HTML
     s: a bare text node / option / title / placeholder                         →  translated text
     r: [regex, template] for composed strings ("Next at 60,000 km …"), $m1 = month name of group 1
     g: Common Jobs search phrase (an English procedure title)                  →  the same procedure's title in this language
   Exact matches only; anything unknown stays English. The language comes from the launcher (localStorage esm_lang). */
(function(){
  if(window.__esmPI18N)return;window.__esmPI18N=1;
  var LANGS={hu:1,cs:1,pl:1,nl:1,fr:1,ru:1},lang='en',V=(function(){try{var s=document.currentScript&&document.currentScript.src||'';var m=/[?&]v=([^&]+)/.exec(s);return m?m[1]:''}catch(e){return''}})();
  var INL={B:1,STRONG:1,EM:1,I:1,KBD:1,CODE:1,SPAN:1,A:1,BR:1,SUP:1,SUB:1,SMALL:1,U:1,MARK:1};
  var OH=new WeakMap(),OT=new WeakMap(),OA=new WeakMap(),LT=new WeakMap(),obs=null,rx={};
  function norm(x){return String(x).replace(/\s+/g,' ').trim()}
  function dict(){return(lang!=='en'&&window.ESM_PI18N&&window.ESM_PI18N[lang])||null}
  function readLang(){try{var l=localStorage.getItem('esm_lang');return(l&&LANGS[l]&&location.protocol!=='file:')?l:'en'}catch(e){return'en'}}
  function inlineOnly(el){var d=el.querySelectorAll('*');for(var i=0;i<d.length;i++){if(!INL[d[i].tagName])return false;if(d[i].tagName==='A'&&d[i].querySelector('*:not(span):not(b):not(i):not(em):not(strong)'))return false}return true}
  function hasOwnText(el){for(var n=el.firstChild;n;n=n.nextSibling){if(n.nodeType===3&&/[A-Za-zÀ-ɏЀ-ӿ]/.test(n.data))return true}return false}
  function isUnit(el){if(!el.children.length||!inlineOnly(el)||!hasOwnText(el))return false;if(!INL[el.tagName])return true;var p=el.parentElement;return !p||!inlineOnly(p)||!hasOwnText(p)}
  function trText(src){var d=dict();if(!d)return null;var k=norm(src);if(k.length<2)return null;var t=d.s[k];if(t!==undefined)return t;
    if(!/[0-9:]/.test(k)||k.length>200)return null;var R=rx[lang];if(!R){R=rx[lang]=[];for(var i=0;i<d.r.length;i++){try{R.push([new RegExp(d.r[i][0]),d.r[i][1]])}catch(e){}}}
    for(var j=0;j<R.length;j++){var m=R[j][0].exec(k);if(m){return R[j][1].replace(/\$m(\d)/g,function(_,g){var EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],ix=EN.indexOf(m[+g]);return(ix>=0&&d.m&&d.m[ix])||m[+g]}).replace(/\$(\d)/g,function(_,g){return m[+g]||''})}}
    return null}
  function doText(nd){var p=nd.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName))return;var cur=nd.data,o=OT.get(nd);if(o===undefined||cur!==LT.get(nd)){o=cur;OT.set(nd,o)}
    var t=trText(o),out=o;if(t!==null){var m=/^(\s*)[\s\S]*?(\s*)$/.exec(o);out=m[1]+t+m[2]}LT.set(nd,out);if(out!==cur)nd.data=out}
  function doUnit(el){var cur=el.innerHTML,st=OH.get(el);if(!st||cur!==st.l){st={o:cur,l:cur};OH.set(el,st)}
    var d=dict(),t=d?d.h[norm(st.o)]:undefined;
    if(t===undefined){if(st.l!==st.o){el.innerHTML=st.o;st.l=el.innerHTML}var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),x;while((x=w.nextNode()))doText(x);st.l=el.innerHTML;return}
    if(cur!==t){el.innerHTML=t;st.l=el.innerHTML}}
  function doAttrs(el){var names=['title','placeholder'];for(var i=0;i<names.length;i++){var a=names[i];if(!el.hasAttribute||!el.hasAttribute(a))continue;var cur=el.getAttribute(a),st=OA.get(el);if(!st){st={};OA.set(el,st)}
    var r=st[a];if(!r||cur!==r.l)r=st[a]={o:cur,l:cur};var t=trText(r.o),out=t===null?r.o:t;r.l=out;if(out!==cur)el.setAttribute(a,out)}}
  function walk(el){if(el.nodeType===3){var pu=el.parentElement;while(pu&&pu!==document.body){if(OH.has(pu)){doUnit(pu);return}pu=pu.parentElement}doText(el);return}
    if(el.nodeType!==1||/^(SCRIPT|STYLE|TEXTAREA)$/.test(el.tagName))return;doAttrs(el);
    if(isUnit(el)){doUnit(el);var q=el.querySelectorAll('[title],[placeholder]');for(var i=0;i<q.length;i++)doAttrs(q[i]);return}
    for(var n=el.firstChild;n;){var nx=n.nextSibling;if(n.nodeType===3)doText(n);else walk(n);n=nx}}
  function applyAll(){try{document.documentElement.lang=lang}catch(e){}if(document.body)walk(document.body)}
  function start(){if(obs||typeof MutationObserver!=='function'||!document.body)return;
    obs=new MutationObserver(function(ms){if(lang==='en')return;obs.disconnect();try{for(var i=0;i<ms.length;i++){var m=ms[i];if(m.type==='characterData')walk(m.target);else if(m.type==='attributes')doAttrs(m.target);else for(var j=0;j<m.addedNodes.length;j++){if(m.addedNodes[j].isConnected)walk(m.addedNodes[j])}}}catch(e){}watch()});watch()}
  function watch(){obs.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder']})}
  function load(l,cb){if(l==='en'||(window.ESM_PI18N&&window.ESM_PI18N[l])){cb();return}var s=document.createElement('script');s.src='./i18n/pages.'+l+'.js'+(V?'?v='+V:'');s.onload=cb;s.onerror=cb;document.head.appendChild(s)}
  function use(l){lang=l;load(l,function(){if(lang!==l)return;if(obs)obs.disconnect();applyAll();start();if(obs)watch()})}
  /* Common Jobs: search the translated manual by the procedure's own title in that language */
  window.__esmGuideKw=function(kw){try{var d=dict(),g='';try{g=parent.getGen()}catch(e){}if(d&&d.g&&d.g[kw]&&g.length>3)return d.g[kw]}catch(e2){}return kw};
  window.addEventListener('storage',function(ev){if(ev.key==='esm_lang'){var l=readLang();if(l!==lang)use(l)}});
  window.addEventListener('message',function(ev){try{if(ev.data&&ev.data.esm==='lang'){var l=readLang();if(l!==lang)use(l)}}catch(e){}});
  function boot(){var l=readLang();if(l!=='en')use(l);else start()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
