/* Shim: IE made elements with name= accessible as globals. Modern browsers only do this for id=. */
(function(){
  var _names = ["cmbRateList","hidDefaultSelectedItem","divBody"];
  function _shimNames(){
    for(var i=0;i<_names.length;i++){
      if(typeof window[_names[i]]==="undefined"){
        var el = document.getElementsByName(_names[i])[0] || document.getElementById(_names[i]);
        if(el) window[_names[i]] = el;
      }
    }
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",_shimNames)}
  else{_shimNames()}
})();
function jsInitializeImageHandler(rate) {
_prInitEventHandle();
_prInitImageInfo(rate);
_prInitToolGraphicImageInfo(rate);
_prCheckLevel();
_prMoveToolbar();
return;
}
function jsResetImage() {
_prResetPosition();
_prResetImage();
return;
}
function jsResizeImage(rate) {
_prResizeImage(rate);
return;
}
var z,x,y;
var gDragApproved_ = false;
function _prInitEventHandle() {
document.onmousedown=_prOnMouseMove;
document.onmouseup=new Function("gDragApproved_=false");
return;
}
function _prOnMouseMove(e){ e=e||window.event;
if ((e.target||e.srcElement).className=="drag"){
gDragApproved_=true;
if ((e.target||e.srcElement).tagName == 'RECT') {
z=(e.target||e.srcElement).parentNode;
} else if ((e.target||e.srcElement).tagName == 'IMG') {
z=(e.target||e.srcElement).parentNode.parentNode;
} else if ((e.target||e.srcElement).tagName == 'P') {
z=(e.target||e.srcElement).parentNode;
}
temp1=parseInt(z.style.left)||0;
temp2=parseInt(z.style.top)||0;
x=e.clientX;
y=e.clientY;
document.onmousemove=_prMoveImages;
}
}
function _prMoveImages(e){ e=e||window.event;
if ((e.button==0||e.button==1)&&gDragApproved_){
z.style.left=(temp1+e.clientX-x)+"px";
z.style.top=(temp2+e.clientY-y)+"px";
return false;
}
}
function _prResetPosition(){
if(z != null){
z.style.left="0px";
z.style.top="0px";
}
return;
}
var gImageGroupList_ = new Array;
var gDefaultRate_ = 100;
var gIdx_ = 0;
function _prImageGroupStruct(group_size,rect_size,img_size,p_tag,tp_obj,bl_obj,ul_obj) {
this.group = group_size;
this.rect = rect_size;
this.img = img_size;
this.p = p_tag;
this.tp = tp_obj;
this.bl = bl_obj;
this.ul = ul_obj;
}
function _prSizeStruct(newObj,newWidth,newHeight) {
this.obj = newObj;
this.width = newWidth;
this.height = newHeight;
}
function _prPTagStruct(newObj,newLeft,newTop,newFontSize) {
this.obj = newObj;
this.left = newLeft;
this.top = newTop;
this.fontsize = newFontSize;
}
function _prLineTagStruct(newObj,newFromx,newFromy, newTox, newToy) {
this.obj = newObj;
this.fromx = newFromx;
this.fromy = newFromy;
this.tox = newTox;
this.toy = newToy;
}
function _prTPTagStruct(newObj,newFontSize) {
this.obj = newObj;
this.fontsize = newFontSize;
}
function _prInitImageInfo(rate) {
var endFlag = false;
gDefaultRate_ = rate;
for(var i = 1; i<100; i++){
var groupObject = document.getElementById("group" + i);
if(groupObject == null){
continue;
}
var groupWidth = _prRemoveUnit(groupObject.style.width);
var groupHeight = _prRemoveUnit(groupObject.style.height);
var rectObject = document.getElementById("rect" + i);
var rectWidth = null;
var rectHeight = null;
if(rectObject != null){
rectWidth = _prRemoveUnit(rectObject.style.width);
rectHeight = _prRemoveUnit(rectObject.style.height);
}
var imgObject = document.getElementById("img" + i);
var imgWidth = null;
var imgHeight = null;
if(imgObject != null){
imgWidth = _prRemoveUnit(imgObject.style.width);
imgHeight = _prRemoveUnit(imgObject.style.height);
}
var pObject = null;
for(var j = 1; !endFlag; j++){
var pTag = document.getElementById("p" + i + "_" + j);
if(pTag == null){
if(j == 1){
endFlag = true;
}
break;
}
if(j == 1){
pObject = new Array();
}
pObject[j-1] = new _prPTagStruct(
pTag,
_prRemoveUnit(pTag.style.left),
_prRemoveUnit(pTag.style.top),
_prRemoveUnit(pTag.style.fontSize)
);
}
endFlag = false;
var tpObject = null;
for(var j = 1; !endFlag; j++){
var tpTag = document.getElementById("tp" + i + "_" + j);
if(tpTag == null){
if(j == 1){
endFlag = true;
}
break;
}
if(j == 1){
tpObject = new Array();
}
tpObject[j-1] = new _prTPTagStruct(
tpTag,
_prRemoveUnit(tpTag.style.fontSize)
);
}
endFlag = false;
var blObject = null;
for(var j = 1; !endFlag; j++){
var baseline = document.getElementById("bl" + i + "_" + j);
if(baseline == null){
if(j == 1){
endFlag = true;
}
break;
}
if(j == 1){
blObject = new Array();
}
blObject[j-1] = new _prLineTagStruct(
baseline,
(baseline.from+'').substring(0,(baseline.from+'').indexOf(",")),
(baseline.from+'').substring((baseline.from+'').indexOf(",")+1,(baseline.from+'').length),
(baseline.to+'').substring(0,(baseline.to+'').indexOf(",")),
(baseline.to+'').substring((baseline.to+'').indexOf(",")+1, (baseline.to+'').length)
);
}
endFlag = false;
var ulObject = null;
for(var j = 1; !endFlag; j++){
var underline = document.getElementById("ul" + i + "_" + j);
if(underline == null){
if(j == 1){
endFlag = true;
}
break;
}
if(j == 1){
ulObject = new Array();
}
ulObject[j-1] = new _prLineTagStruct(
underline,
(underline.from+'').substring(0,(underline.from+'').indexOf(",",0)),
(underline.from+'').substring((underline.from+'').indexOf(",")+1,(underline.from+'').length),
(underline.to+'').substring(0,(underline.to+'').indexOf(",")),
(underline.to+'').substring((underline.to+'').indexOf(",")+1, (underline.to+'').length)
);
}
endFlag = false;
gImageGroupList_[gIdx_] = new _prImageGroupStruct (
new _prSizeStruct(groupObject,groupWidth,groupHeight),
new _prSizeStruct(rectObject,rectWidth,rectHeight),
new _prSizeStruct(imgObject,imgWidth,imgHeight),
pObject,
tpObject,
blObject,
ulObject
);
gIdx_++;
}
return ;
}
function _prInitToolGraphicImageInfo(rate) {
var endFlag = false;
gDefaultRate_ = rate;
for(var i = 1; i<100; i++){
var groupObject = document.getElementById("toolgroup" + i);
if(groupObject == null){
continue;
}
var groupWidth = _prRemoveUnit(groupObject.style.width);
var groupHeight = _prRemoveUnit(groupObject.style.height);
var rectObject = document.getElementById("toolrect" + i);
var rectWidth = null;
var rectHeight = null;
if(rectObject != null){
rectWidth = _prRemoveUnit(rectObject.style.width);
rectHeight = _prRemoveUnit(rectObject.style.height);
}
var imgObject = document.getElementById("toolimg" + i);
var imgWidth = null;
var imgHeight = null;
if(imgObject != null){
imgWidth = _prRemoveUnit(imgObject.style.width);
imgHeight = _prRemoveUnit(imgObject.style.height);
}
var pObject = null;
for(var j = 1; !endFlag; j++){
var pTag = document.getElementById("toolp" + i + "_" + j);
if(pTag == null){
if(j == 1){
endFlag = true;
}
break;
}
if(j == 1){
pObject = new Array();
}
pObject[j-1] = new _prPTagStruct(
pTag,
_prRemoveUnit(pTag.style.left),
_prRemoveUnit(pTag.style.top),
_prRemoveUnit(pTag.style.fontSize)
);
}
endFlag = false;
gImageGroupList_[gIdx_] = new _prImageGroupStruct (
new _prSizeStruct(groupObject,groupWidth,groupHeight),
new _prSizeStruct(rectObject,rectWidth,rectHeight),
new _prSizeStruct(imgObject,imgWidth,imgHeight),
pObject
);
gIdx_++;
}
return;
}
function _prResetImage() {
_prResizeImage(gDefaultRate_/100);
return;
}
function _prResizeImage(rate) {
var minPoint = 3.0;
for(var i=0; i<gImageGroupList_.length; i++){
if(gImageGroupList_[i].group != null){
var obj = gImageGroupList_[i].group;
obj.obj.style.width = (obj.width * rate) + 'px';
obj.obj.style.height = (obj.height * rate) + 'px';
obj.obj.coordsize = (obj.width * rate) + ',' + (obj.height * rate);
}
if(gImageGroupList_[i].rect != null){
var obj = gImageGroupList_[i].rect;
obj.obj.style.width = (obj.width * rate) + 'px';
obj.obj.style.height = (obj.height * rate) + 'px';
}
if(gImageGroupList_[i].img != null){
var obj = gImageGroupList_[i].img;
obj.obj.style.width = (obj.width * rate) + 'px';
obj.obj.style.height = (obj.height * rate) + 'px';
}
if(gImageGroupList_[i].p != null){
var obj = gImageGroupList_[i].p;
for(var j=0; j<obj.length; j++){
var p = obj[j];
if(p.left != ""){
p.obj.style.left = (p.left * rate) + 'px';
}
if(p.top != ""){
p.obj.style.top = (p.top * rate) + 'px';
}
if(p.fontsize != ""){
if(p.fontsize*rate < minPoint) {
p.obj.style.fontSize = minPoint + 'pt';
}
else {
p.obj.style.fontSize = (p.fontsize * rate) + 'pt';
}
}
}
}
if(gImageGroupList_[i].tp != null){
var obj = gImageGroupList_[i].tp;
for(var j=0; j<obj.length; j++){
var tp = obj[j];
if(tp.fontsize != ""){
if(tp.fontsize*rate < 5.5){
tp.obj.style.fontSize = '5.5pt';
}
else{
if(tp.fontsize*rate < minPoint) {
tp.obj.style.fontSize = minPoint + 'pt';
}
else {
tp.obj.style.fontSize = (tp.fontsize * rate) + 'pt';
}
}
}
}
}
if(gImageGroupList_[i].bl != null){
var obj = gImageGroupList_[i].bl;
for(var j=0; j<obj.length; j++){
var bl = obj[j];
if(bl.fromx != ""){
bl.obj.from = (bl.fromx * rate) + "," + (bl.fromy * rate);
}
if(bl.tox != ""){
bl.obj.to = (bl.tox * rate) + "," + (bl.toy * rate);
}
}
}
if(gImageGroupList_[i].ul != null){
var obj = gImageGroupList_[i].ul;
for(var j=0; j<obj.length; j++){
var ul = obj[j];
if(ul.fromx != ""){
ul.obj.from = (ul.fromx * rate) + "," + (ul.fromy * rate);
}
if(ul.tox != ""){
ul.obj.to = (ul.tox * rate) + "," + (ul.toy * rate);
}
}
}
}
return;
}
function _prRemoveUnit(src){
var dst = src.substring(0,src.length-2);
return dst;
}
var gToolBarObj = null;
var gToolBarLeft = 10;
var gToolBarTop = 10;
function _prCheckLevel() {
if (true){
var obj = document.getElementById("toolbar");
if(obj != null){
gToolBarObj = obj.style;
return;
}
}
if (document.layers){
var obj = document.layers["toolbar"];
if(obj != null){
gToolBarObj = obj;
return;
}
}
if (document.getElementById){
var obj = document.getElementById("toolbar");
if(obj != null){
gToolBarObj = obj.style;
return;
}
}
}
function _prMoveToolbar() {
if(true){
PosLeft = document.body.scrollLeft;
PosTop = document.body.scrollTop;
}else if(document.layers){
PosLeft = window.pageXOffset;
PosTop = window.pageYOffset;
}else if(document.getElementById){
PosLeft = window.pageXOffset;
PosTop = window.pageYOffset;
}
if(gToolBarObj != null){
gToolBarObj.left = PosLeft + gToolBarLeft;
gToolBarObj.top = PosTop + gToolBarTop;
gToolBarObj.visibility = "visible";
TimerID = setTimeout("_prMoveToolbar()",250);
}
return;
}
var defaultRate = 100;
function prOnLoadProc() {
jsInitializeImageHandler(defaultRate);
cmbRateList.options.selectedIndex = hidDefaultSelectedItem.value;
prRateSelect();
self.moveTo(0,0);
self.resizeTo(screen.width,screen.height-30);
self.focus();
divBody.style.display = "block";
return;
}
function prOnUnloadProc() {
jsClosePopup();
return;
}
function prZoomOut() {
if(cmbRateList.options.selectedIndex == (cmbRateList.options.length - 1)){
return;
}
var changed = cmbRateList.options.selectedIndex + 1;
cmbRateList.options.selectedIndex = changed;
prRateSelect();
return;
}
function prRateSelect() {
jsResizeImage(cmbRateList.options[cmbRateList.options.selectedIndex].value);
return;
}
function prZoomIn() {
if(cmbRateList.options.selectedIndex == 0){
return;
}
var changed = cmbRateList.options.selectedIndex - 1;
cmbRateList.options.selectedIndex = changed;
prRateSelect();
return;
}
function prResetImage() {
cmbRateList.options.selectedIndex = hidDefaultSelectedItem.value;
jsResetImage();
return;
}
function prPrintImage() {
var  hv_rate = 1.0;
var  img_rate = 1.0;
var  obj;
var  paper_wid,paper_hei;
if(gImageGroupList_[0].group != null){
obj = gImageGroupList_[0].group;
hv_rate =  obj.height/obj.width;
if(hv_rate >= 0.67) {
paper_wid = 640.0;
paper_hei = 950.0;
}
else {
alert("For best printing result, select 'landscape' layout from the print menu.");
paper_wid = 950.0;
paper_hei = 640.0;
}
if(img_rate > paper_wid/obj.width) {
img_rate =  paper_wid/obj.width;
}
if(img_rate > paper_hei/obj.height) {
img_rate =  paper_hei/obj.height;
}
var   save_idx = cmbRateList.options.selectedIndex;
prResetImage();
_prResizeImage(img_rate);
gToolBarObj.left = -100;
gToolBarObj.top = -100;
window.print();
divBody.style.display = "none";
cmbRateList.options.selectedIndex = save_idx ;
jsResizeImage(cmbRateList.options[cmbRateList.options.selectedIndex].value);
divBody.style.display = "block";
window.scrollTo(0,0);
}
return;
}