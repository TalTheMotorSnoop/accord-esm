if(typeof Cts==='undefined'){function Cts(k,a){try{if(parent&&parent!==window&&parent.Cts){parent.Cts(k,a);return;}}catch(e){}if(window.__esmSend&&parent&&parent!==window){window.__esmSend({esm:'cts',k:k,a:a,href:location.href});return}var u=k+'.html';if(a)u+='#'+a;window.location.href=u}}
if(typeof Old==='undefined'){function Old(){}}
if(typeof Jmp==='undefined'){function Jmp(a){if(a)window.location.hash=a}}
if(typeof Prt==='undefined'){function Prt(k,a){if(!k)return;try{if(parent&&parent!==window&&parent.Prt){parent.Prt(k,a);return;}}catch(e){}if(window.__esmSend&&parent&&parent!==window){window.__esmSend({esm:'prt',k:k,a:a,href:location.href});return}var u=k+'.html';if(a)u+='#'+a;window.open(u,'_blank','width=1024,height=700,scrollbars=yes,resizable=yes')}}
if(typeof Scl==='undefined'){function Scl(){}}


/* ESM Bridge — Project Accord ESM Lazarus V2.
   postMessage channel between the launcher and content pages, so features work on file://
   where direct cross-document access is blocked. All work is done same-document (allowed). */
(function(){
if(window.__esmBridge)return;window.__esmBridge=1;
var PARENT=null;try{if(window.parent&&window.parent!==window)PARENT=window.parent}catch(e){}
var OPENER=null;try{if(window.opener)OPENER=window.opener}catch(e){}
function send(m){try{if(PARENT)PARENT.postMessage(m,'*');else if(OPENER)OPENER.postMessage(m,'*')}catch(e){}}
window.__esmSend=send;
function pageTitle(){try{var el=document.querySelector('.top_title');
  if(el){var t=el.textContent.replace(/\s+/g,' ').trim();if(t)return t}}catch(e){}
  return document.title||''}
function hello(){send({esm:'hello',title:pageTitle(),href:location.href,zoomPage:(typeof window.jsResizeImage==='function')})}
/* ---- dark mode ---- */
function setDark(css){try{var ex=document.getElementById('esm-dark');if(ex&&ex.parentNode)ex.parentNode.removeChild(ex);
  if(!css)return;var s=document.createElement('style');s.id='esm-dark';s.textContent=css;
  (document.head||document.documentElement).appendChild(s)}catch(e){}}
/* ---- text zoom ---- */
function setZoom(v){try{document.documentElement.style.zoom=(v&&v!==1)?(''+v):''}catch(e){}}
/* ---- helpers ---- */
function textNodes(rx,cap){var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),nodes=[],n;
  while(n=walker.nextNode()){var pn=n.parentNode,p=pn&&pn.nodeName;
    if(p==='SCRIPT'||p==='STYLE')continue;
    var pc=pn.className||'';
    if(pc==='esmgl'||pc==='esmhl'||pc==='esmhl cur')continue;
    rx.lastIndex=0;if(rx.test(n.nodeValue)){nodes.push(n);if(nodes.length>=cap)break}}
  return nodes}
function unwrap(cls){var sp=document.querySelectorAll('.'+cls);
  for(var i=0;i<sp.length;i++){if(sp[i].parentNode)sp[i].parentNode.replaceChild(document.createTextNode(sp[i].textContent),sp[i])}}
/* ---- glossary ---- */
var glMap=null;
function glApply(map){try{
  glMap=map||{};var terms=[],k;for(k in glMap)terms.push(k);
  if(!terms.length)return;
  if(document.querySelector('.esmgl'))return;
  terms.sort(function(a,b){return b.length-a.length});
  var esc=[];for(var i2=0;i2<terms.length;i2++)esc.push(terms[i2].replace(/[.*+?^{}$()|[\]\\]/g,'\\$&'));
  var rx=new RegExp('(^|[^A-Za-z0-9])('+esc.join('|')+')(?![A-Za-z0-9])','g');
  if(!document.getElementById('esm-gl-style')){var st=document.createElement('style');st.id='esm-gl-style';
    st.textContent='.esmgl{border-bottom:1px dotted #5b9bd5;cursor:help}#esmglTip{position:fixed;z-index:9999;max-width:280px;background:#1c2230;color:#e8ecf2!important;font-family:sans-serif;font-size:12px;line-height:1.5;padding:8px 10px;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,.4)}#esmglTip b{color:#8ec5ff!important}';
    (document.head||document.documentElement).appendChild(st)}
  var nodes=textNodes(rx,300);
  for(var i=0;i<nodes.length;i++){var node=nodes[i],frag=document.createDocumentFragment(),txt=node.nodeValue,last=0,m;
    rx.lastIndex=0;
    while((m=rx.exec(txt))!==null){var stx=m.index+m[1].length;
      if(stx>last)frag.appendChild(document.createTextNode(txt.slice(last,stx)));
      var sp=document.createElement('span');sp.className='esmgl';sp.textContent=m[2];frag.appendChild(sp);
      last=stx+m[2].length;
      if(m[0].length===0)rx.lastIndex++}
    if(last===0)continue;
    if(last<txt.length)frag.appendChild(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag,node)}
  if(!window.__esmGlBound){window.__esmGlBound=1;
    document.addEventListener('click',function(ev){var tip=document.getElementById('esmglTip');var t=ev.target;
      if(t&&t.className==='esmgl'&&glMap&&glMap[t.textContent]!==undefined){
        if(!tip){tip=document.createElement('div');tip.id='esmglTip';document.body.appendChild(tip)}
        tip.innerHTML='<b></b>';tip.firstChild.textContent=t.textContent;
        tip.appendChild(document.createTextNode(' — '+glMap[t.textContent]));
        tip.style.left=Math.max(6,Math.min(ev.clientX,window.innerWidth-300))+'px';
        tip.style.top=Math.min(ev.clientY+14,window.innerHeight-120)+'px';
        tip.style.display='block';ev.stopPropagation()}
      else if(tip){tip.style.display='none'}})}
}catch(e){}}
function glRemove(){try{var t=document.getElementById('esmglTip');if(t&&t.parentNode)t.parentNode.removeChild(t);unwrap('esmgl')}catch(e){}}
/* ---- search-term highlighting ---- */
var hlEls=[],hlIdx=0,hlSig='';
function hlApply(terms){try{
  var sig=(terms||[]).join('\u0001');
  if(sig===hlSig&&hlEls.length){send({esm:'hlpos',i:hlIdx+1,n:hlEls.length});return}
  hlOff();hlSig=sig;
  if(!terms||!terms.length){send({esm:'hlcount',n:0});return}
  if(!document.getElementById('esm-hl-style')){var st=document.createElement('style');st.id='esm-hl-style';
    st.textContent='.esmhl{background:#ffd54d!important;color:#000!important;border-radius:2px}.esmhl.cur{background:#ff9800!important;outline:2px solid #ff9800}';
    (document.head||document.documentElement).appendChild(st)}
  var esc=[];for(var i2=0;i2<terms.length;i2++)esc.push(String(terms[i2]).replace(/[.*+?^{}$()|[\]\\]/g,'\\$&'));
  var rx=new RegExp('('+esc.join('|')+')','gi');
  var nodes=textNodes(rx,400);
  for(var i=0;i<nodes.length;i++){var node=nodes[i],frag=document.createDocumentFragment(),txt=node.nodeValue,last=0,m;
    rx.lastIndex=0;
    while((m=rx.exec(txt))!==null){
      if(m.index>last)frag.appendChild(document.createTextNode(txt.slice(last,m.index)));
      var sp=document.createElement('span');sp.className='esmhl';sp.textContent=m[0];frag.appendChild(sp);hlEls.push(sp);
      last=m.index+m[0].length;
      if(m[0].length===0)rx.lastIndex++}
    if(last===0)continue;
    if(last<txt.length)frag.appendChild(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag,node)}
  if(hlEls.length)hlGo(0);
  send({esm:'hlcount',n:hlEls.length});
}catch(e){send({esm:'hlcount',n:0})}}
function hlGo(i){if(!hlEls.length)return;
  if(hlEls[hlIdx])hlEls[hlIdx].className='esmhl';
  hlIdx=((i%hlEls.length)+hlEls.length)%hlEls.length;
  var el=hlEls[hlIdx];el.className='esmhl cur';
  try{el.scrollIntoView({block:'center'})}catch(e){try{el.scrollIntoView()}catch(e2){}}
  send({esm:'hlpos',i:hlIdx+1,n:hlEls.length})}
function hlOff(){try{for(var i=0;i<hlEls.length;i++){var sp=hlEls[i];if(sp.parentNode)sp.parentNode.replaceChild(document.createTextNode(sp.textContent),sp)}}catch(e){}hlEls=[];hlIdx=0;hlSig=''}
/* ---- zoom-window wheel controls ---- */
function enableWheelZoom(){if(window.__esmWheel)return;window.__esmWheel=1;
  if(typeof window.jsResizeImage!=='function')return;
  var rate=1;
  try{var st=document.createElement('style');st.textContent='#esmZoomHint{position:fixed;right:10px;bottom:10px;z-index:999;background:rgba(20,24,32,.85);color:#fff;font:11px sans-serif;padding:5px 10px;border-radius:12px}';(document.head||document.documentElement).appendChild(st);
    if(!document.getElementById('esmZoomHint')){var hint=document.createElement('div');hint.id='esmZoomHint';hint.textContent='Scroll to zoom · drag to pan · double-click to reset';document.body.appendChild(hint);
      setTimeout(function(){try{hint.style.display='none'}catch(e){}},6000)}}catch(e){}
  document.addEventListener('wheel',function(ev){ev.preventDefault();
    rate=Math.max(0.3,Math.min(4,rate*(ev.deltaY<0?1.15:1/1.15)));
    try{window.jsResizeImage(rate)}catch(e){}},{passive:false});
  document.addEventListener('dblclick',function(){rate=1;
    try{window.jsResetImage()}catch(e){}
    try{window.jsResizeImage(1)}catch(e){}
    try{if(window.z&&window.z.style){window.z.style.left='0px';window.z.style.top='0px'}}catch(e){}})}
/* ---- inbound ---- */
window.addEventListener('message',function(ev){var d=ev.data;if(!d||!d.esm)return;
  try{
    if(d.esm==='dark')setDark(d.css||'');
    else if(d.esm==='zoom')setZoom(d.v);
    else if(d.esm==='gl')glApply(d.map);
    else if(d.esm==='gloff')glRemove();
    else if(d.esm==='hl')hlApply(d.terms);
    else if(d.esm==='hlnav')hlGo(hlIdx+d.d);
    else if(d.esm==='hloff')hlOff();
    else if(d.esm==='print'){try{window.print()}catch(e){}}
    else if(d.esm==='wheelzoom')enableWheelZoom();
  }catch(e){}});
/* ---- reroute mk8 inline nav wrappers through the bridge when parent access is blocked ---- */
function wrapNav(){
  if(typeof window.CtsProc==='function'&&!window.__esmCtsW){window.__esmCtsW=1;
    var oc=window.CtsProc;
    window.CtsProc=function(Type,Key,Anc){var ok=false;try{ok=!!(PARENT&&PARENT.Cts)}catch(e){ok=false}
      if(ok){oc(Type,Key,Anc);return}
      if(PARENT){send({esm:'cts',k:Key,a:Anc,href:location.href});return}
      oc(Type,Key,Anc)}}
  if(typeof window.PrtProc==='function'&&!window.__esmPrtW){window.__esmPrtW=1;
    var op=window.PrtProc;
    window.PrtProc=function(Type,Key,Anc){var ok=false;try{ok=!!(PARENT&&PARENT.Prt)}catch(e){ok=false}
      if(ok){op(Type,Key,Anc);return}
      if(PARENT){send({esm:'prt',k:Key,a:Anc,href:location.href});return}
      op(Type,Key,Anc)}}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){wrapNav();hello()})}
else{wrapNav();hello()}
window.addEventListener('load',function(){wrapNav();hello()});
})();
