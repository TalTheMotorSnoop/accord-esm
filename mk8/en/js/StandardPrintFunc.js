var _allElems = null;
function _getAllElems(){if(!_allElems)_allElems=document.getElementsByTagName("*");return _allElems;}
var z,x,y;
var gImageGroupList_	= new Array;
var gIdx_		= 0;
var gHrList_		= new Array;
var gHrIdx_		= 0;
var gHrSpanList_	= new Array;
var gHrSpanIdx_		= 0;
var hrObject;
var hrSpanObject;
var imgDivObject;
var imgDivCount 	= 0;
var printPageCount;
var printCurrentPos;
function _prHrGroupStruct(hr_obj,span_obj,start_idx,end_idx,img_ctrl_obj) {
	this.obj		= hr_obj;
	this.span		= span_obj;
	this.start_idx		= start_idx;
	this.end_idx		= end_idx;
	this.img_ctrl		= img_ctrl_obj;
}
function _prImageGroupStruct(group_size,rect_size,img_size,p_tag,tp_obj,bl_obj,ul_obj) {
	this.group		= group_size;
	this.rect		= rect_size;
	this.img		= img_size;
	this.p			= p_tag;
	this.tp			= tp_obj;
	this.bl			= bl_obj;
	this.ul			= ul_obj;
}
function _prSizeStruct(newObj,newWidth,newHeight) {
	this.obj		= newObj;
	this.width		= newWidth;
	this.height		= newHeight;
}
function _prPTagStruct(newObj,newLeft,newTop,newFontSize) {
	this.obj		= newObj;
	this.left		= newLeft;
	this.top		= newTop;
	this.fontsize	= newFontSize;
}
function _prLineTagStruct(newObj,newFromx,newFromy, newTox, newToy) {
	this.obj			= newObj;
	this.fromx		= newFromx;
	this.fromy		= newFromy;
	this.tox		= newTox;
	this.toy		= newToy;
}
function _prTPTagStruct(newObj,newFontSize) {
	this.obj		= newObj;
	this.fontsize	= newFontSize;
}
function _prInitImageInfo(rate) {
	_allElems = null; // Reset cache after document.write
	var endFlag = false;
	gDefaultRate_ = rate;
	gIdx_ = 0;
	var save_i;
	var idName;
	var groupObject;
	var jj,jjj;
	var p_cnt,tp_cnt,bl_cnt,ul_cnt;
	var str_len;
	gHrIdx_ = 0;
	hrObject = null;
	hrSpanObject = null;

	for(jj=0;jj<_getAllElems().length;) {
		hrObject = null;
		hrSpanObject = null;
		for(;jj<_getAllElems().length;jj++) {
			if(_getAllElems()[jj].id != null) {
				str_len = _getAllElems()[jj].id.length;
				if((str_len >= 7) && (_getAllElems()[jj].id.substr(0,7) == "hrDivId")) {
					hrSpanObject = _getAllElems()[jj];
				}
				else if((str_len >= 4) && (_getAllElems()[jj].id.substr(0,4) == "hrId")) {
					hrObject = _getAllElems()[jj];
				}
			}
			if((hrObject != null) && (hrSpanObject != null)) {
				gHrList_[gHrIdx_++] = new _prHrGroupStruct (
									hrObject,
									hrSpanObject,
									-1,-1,null
									);
				break;
			}
		}
		imgDivObject = null;
		for(;jj<_getAllElems().length;jj++) {
			if(_getAllElems()[jj].id != null) {
				str_len = _getAllElems()[jj].id.length;
				if((str_len >= 7) && (_getAllElems()[jj].id.substr(0,7) == "hrDivId")) {
					gHrList_[gHrIdx_-1].img_ctrl = imgDivObject;
					break;
				}
				else if((str_len >= 9) && (_getAllElems()[jj].id.substr(0,9) == "prePageId")) {
					if(imgDivObject == null) {
						imgDivObject = new Array;
						imgDivCount = 0;
					}
					imgDivObject[imgDivCount] = new Array;
					imgDivObject[imgDivCount].pre = _getAllElems()[jj];
				}
				else if((str_len >= 10) && (_getAllElems()[jj].id.substr(0,10) == "postPageId")) {
					imgDivObject[imgDivCount].post = _getAllElems()[jj];
					imgDivCount++;
				}
			}
		}
	}
	if(imgDivObject != null) {
		gHrList_[gHrIdx_-1].img_ctrl = imgDivObject;
	}

	jj = 0;
	gHrIdx_ = -1;
	while(jj < _getAllElems().length) {
		groupObject = null;
		for(;jj<_getAllElems().length;) {
			idName = "";
			if((_getAllElems()[jj].name != null) &&
			   (_getAllElems()[jj].name.length >= 8)) {
				idName = _getAllElems()[jj].name.substr(0,8);
			}
			if(idName == "PrtGrpId") {
				groupObject = _getAllElems()[jj];
				jj++;
				break;
			}
			if(_getAllElems()[jj].id != null) {
				str_len = _getAllElems()[jj].id.length;
					if((str_len >= 7) && (_getAllElems()[jj].id.substr(0,7) == "hrDivId")) {
						gHrIdx_++;
						gHrList_[gHrIdx_].start_idx = gIdx_;
					}
			}
			jj++;
		}
		if(groupObject == null)  break;

		var groupWidth	= _prRemoveUnit(groupObject.style.width);
		var groupHeight	= _prRemoveUnit(groupObject.style.height);
		var rectObject	= null;
		for(;jj<_getAllElems().length;) {
			idName = "";
			if((_getAllElems()[jj].name != null) &&
			   (_getAllElems()[jj].name.length >= 9)) {
				idName = _getAllElems()[jj].name.substr(0,9);
			}
			if(idName == "PrtRectId") {
				rectObject = _getAllElems()[jj];
				jj++;
				break;
			}
			jj++;
		}
		var rectWidth	= null;
		var rectHeight	= null;
		if(rectObject != null) {
			rectWidth	= _prRemoveUnit(rectObject.style.width);
			rectHeight	= _prRemoveUnit(rectObject.style.height);
		}
		var imgObject = null;
		for(;jj<_getAllElems().length;) {
			idName = "";
			if((_getAllElems()[jj].name != null) &&
			   (_getAllElems()[jj].name.length >= 8)) {
				idName = _getAllElems()[jj].name.substr(0,8);
			}
			if(idName == "PrtImgId") {
				imgObject = _getAllElems()[jj];
				jj++;
				break;
			}
			jj++;
		}
		var imgWidth	= null;
		var imgHeight	= null;
		if(imgObject != null){
			imgWidth	= _prRemoveUnit(imgObject.style.width);
			imgHeight	= _prRemoveUnit(imgObject.style.height);
		}
		var pObject = null;
		var pTag = null;
		p_cnt = 0;
		for(jjj=jj;jjj<_getAllElems().length;jjj++) {
			idName = "";
			if((_getAllElems()[jjj].name != null) &&
			   (_getAllElems()[jjj].name.length >= 6)) {
				idName = _getAllElems()[jjj].name.substr(0,6);
			}
			if(idName == "PrtPId") {
				pTag = _getAllElems()[jjj];
				if(pObject == null){
					pObject		= new Array();
				}
				pObject[p_cnt++] = new _prPTagStruct(
									pTag,
									_prRemoveUnit(pTag.style.left),
									_prRemoveUnit(pTag.style.top),
									_prRemoveUnit(pTag.style.fontSize)
								);
			}
			else {
				idName = "";
				if((_getAllElems()[jjj].name != null) &&
				   (_getAllElems()[jjj].name.length >= 8)) {
					idName = _getAllElems()[jjj].name.substr(0,8);
				}
				if(idName == "PrtGrpId") {
					break;
				}
			}
		}
		var tpObject = null;
		var tpTag = null;
		tp_cnt = 0;
		for(jjj=jj;jjj<_getAllElems().length;jjj++) {
			idName = "";
			if((_getAllElems()[jjj].name != null) &&
			   (_getAllElems()[jjj].name.length >= 7)) {
				idName = _getAllElems()[jjj].name.substr(0,7);
			}
			if(idName == "PrtTpId") {
				tpTag = _getAllElems()[jjj];
				if(tpObject == null){
					tpObject		= new Array();
				}
				tpObject[tp_cnt++] = new _prTPTagStruct(
									tpTag,
									_prRemoveUnit(tpTag.style.fontSize)
								);
			}
			else {
				idName = "";
				if((_getAllElems()[jjj].name != null) &&
				   (_getAllElems()[jjj].name.length >= 8)) {
					idName = _getAllElems()[jjj].name.substr(0,8);
				}
				if(idName == "PrtGrpId") {
					break;
				}
			}
		}
		var blObject	= null;
		var baseline = null;
		bl_cnt = 0;
		for(jjj=jj;jjj<_getAllElems().length;jjj++) {
			idName = "";
			if((_getAllElems()[jjj].name != null) &&
			   (_getAllElems()[jjj].name.length >= 6)) {
				idName = _getAllElems()[jjj].name.substr(0,6);
			}
			if(idName == "prt_bl") {
				baseline = _getAllElems()[jjj];
				if(blObject == null){
					blObject		= new Array();
				}
				blObject[bl_cnt++] = new _prLineTagStruct(
									baseline,
									(baseline.getAttribute('from')+'').substring(0,(baseline.getAttribute('from')+'').indexOf(",")),
									(baseline.getAttribute('from')+'').substring((baseline.getAttribute('from')+'').indexOf(",")+1,(baseline.getAttribute('from')+'').length),
									(baseline.getAttribute('to')+'').substring(0,(baseline.getAttribute('to')+'').indexOf(",")),
									(baseline.getAttribute('to')+'').substring((baseline.getAttribute('to')+'').indexOf(",")+1, (baseline.getAttribute('to')+'').length)
								);
			}
			else {
				idName = "";
				if((_getAllElems()[jjj].name != null) &&
				   (_getAllElems()[jjj].name.length >= 8)) {
					idName = _getAllElems()[jjj].name.substr(0,8);
				}
				if(idName == "PrtGrpId") {
					break;
				}
			}
		}
		var ulObject	= null;
		var underline = null;
		ul_cnt = 0;
		for(jjj=jj;jjj<_getAllElems().length;jjj++) {
			idName = "";
			if((_getAllElems()[jjj].name != null) &&
			   (_getAllElems()[jjj].name.length >= 6)) {
				idName = _getAllElems()[jjj].name.substr(0,6);
			}
			if(idName == "prt_ul") {
				underline = _getAllElems()[jjj];
				if(ulObject == null){
					ulObject		= new Array();
				}
				ulObject[ul_cnt++] = new _prLineTagStruct(
									underline,
									(underline.getAttribute('from')+'').substring(0,(underline.getAttribute('from')+'').indexOf(",",0)),
									(underline.getAttribute('from')+'').substring((underline.getAttribute('from')+'').indexOf(",")+1,(underline.getAttribute('from')+'').length),
									(underline.getAttribute('to')+'').substring(0,(underline.getAttribute('to')+'').indexOf(",")),
									(underline.getAttribute('to')+'').substring((underline.getAttribute('to')+'').indexOf(",")+1, (underline.getAttribute('to')+'').length)
								);
			}
			else {
				idName = "";
				if((_getAllElems()[jjj].name != null) &&
				   (_getAllElems()[jjj].name.length >= 8)) {
					idName = _getAllElems()[jjj].name.substr(0,8);
				}
				if(idName == "PrtGrpId") {
					break;
				}
			}
		}
		gImageGroupList_[gIdx_] = new _prImageGroupStruct (
			new _prSizeStruct(groupObject,groupWidth,groupHeight),
			new _prSizeStruct(rectObject,rectWidth,rectHeight),
			new _prSizeStruct(imgObject,imgWidth,imgHeight),
			pObject,
			tpObject,
			blObject,
			ulObject
		);
		gHrList_[gHrIdx_].end_idx = gIdx_;
		gIdx_++;
		i = save_i;
	}
	return ;
}
function _prResizeImage(rate) {
	var  hei = 0;
	for(var i=0; i<gImageGroupList_.length; i++){
		if(gImageGroupList_[i].group != null){
			var obj = gImageGroupList_[i].group;
			obj.obj.style.width = (obj.width * rate) + 'px';
			obj.obj.style.height = (obj.height * rate) + 'px';
			obj.obj.coordsize = (obj.width * rate) + ',' + (obj.height * rate);
			hei = obj.height * rate
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
					p.obj.style.left		= (p.left * rate) + 'px';
				}
				if(p.top != ""){
					p.obj.style.top			= (p.top * rate) + 'px';
				}
				if(p.fontsize != ""){
					p.obj.style.fontSize	= (p.fontsize * rate) + 'pt';
				}
			}
		}
		if(gImageGroupList_[i].tp != null){
			var obj = gImageGroupList_[i].tp;
			for(var j=0; j<obj.length; j++){
				var tp = obj[j];
				if(tp.fontsize != ""){
					if(tp.fontsize*rate < 5.5){
						tp.obj.style.fontSize	= '5.5pt';
					}
					else{
						tp.obj.style.fontSize	= (tp.fontsize * rate) + 'pt';
					}
				}
			}
		}
		if(gImageGroupList_[i].bl != null){
			var obj = gImageGroupList_[i].bl;
			for(var j=0; j<obj.length; j++){
				var bl = obj[j];
				var fromx,tox;
				if(bl.fromx != ""){
					fromx = bl.fromx * rate;
					bl.obj.from	= fromx + "," + (bl.fromy * rate);
				}
				if(bl.tox != ""){
					tox = bl.tox * rate;
					if((0 >=tox-fromx) && (fromx-tox) < 1) {
						tox = tox-1;
					}
					if((0 <= tox-fromx) && (tox-fromx) < 1) {
						tox = tox+1;
					}
					bl.obj.to	= tox + "," + (bl.toy * rate);
				}
			}
		}
		if(gImageGroupList_[i].ul != null){
			var obj = gImageGroupList_[i].ul;
			for(var j=0; j<obj.length; j++){
				var ul = obj[j];
				if(ul.fromx != ""){
					ul.obj.from	= (ul.fromx * rate) + "," + (ul.fromy * rate);
				}
				if(ul.tox != ""){
					ul.obj.to	= (ul.tox * rate) + "," + (ul.toy * rate);
				}
			}
		}
	}
	return hei;
}
function _prRemoveUnit(src){
	var dst = src.substring(0,src.length-2);
	return dst;
}
var   totalImg = 1;
var   dispNum=1;
function ChangeImageDisplay(disp_flag){
	var strDisp,strPrt;

	if(disp_flag == true) {
		strDisp = "none";
		strPrt = "block";
	}
	else {
		strDisp = "block";
		strPrt = "none";
	}
	for(idx=0;idx<_getAllElems().length;idx++) {
		idName = "";
		if((_getAllElems()[idx].id != null) &&
		   (_getAllElems()[idx].id.length >= 9)) {
			idName = _getAllElems()[idx].id.substr(0,9);
			if(idName == "imgDispId") {
				dispElement = _getAllElems()[idx];
				if(dispElement != null) {
					dispElement.style.display = strDisp;
				}
			}
		}
	}
	for(idx=0;idx<_getAllElems().length;idx++) {
		idName = "";
		if((_getAllElems()[idx].id != null) &&
		   (_getAllElems()[idx].id.length >= 8)) {
			idName = _getAllElems()[idx].id.substr(0,8);
			if(idName == "imgPrtId") {
				prtElement = _getAllElems()[idx];
				if(prtElement != null) {
					prtElement.style.display = strPrt;
				}
			}
		}
	}
	var imgIdElement,idNum;
	for(idx=0;idx<_getAllElems().length;idx++) {
		idName = "";
		if((_getAllElems()[idx].id != null) &&
		   (_getAllElems()[idx].id.length >= 6)) {
			idName = _getAllElems()[idx].id.substr(0,5);
			idNum = _getAllElems()[idx].id.substr(5,_getAllElems()[idx].id.length-5);
			if((idName == "imgId") && (idNum != 1)) {
				imgIdElement = _getAllElems()[idx];
				if(imgIdElement != null) {
					imgIdElement.style.display = strPrt;
				}
			}
		}
	}
}
function MultiPageProcess(hr_idx,start_pos,end_pos){
	var imgCtrlObj;
	var img_idx;
	var imgObject;
	var img_pos;

	if(end_pos-printCurrentPos > pageHeight) {
		if(start_pos-printCurrentPos > pageHeight*3/4) {
			hrDivObj = gHrList_[hr_idx-1].span;
			hrDivObj.style.display = "block";
			printPageCount++;
			printCurrentPos = start_pos;
		}
		else {
			imgCtrlObj = gHrList_[hr_idx-1].img_ctrl;
			if(imgCtrlObj != null) {
				img_idx = gHrList_[hr_idx-1].start_idx;
				if(img_idx >= 0) {
					imgObject = gImageGroupList_[img_idx].group;
					img_pos = imgObject.obj.offsetTop + imgObject.obj.offsetHeight;
					if(img_pos-printCurrentPos > pageHeight) {
						if(imgObject.width >= 950) {
							imgCtrlObj[imgCtrlObj.length-1].pre.style.display = "block";
							printPageCount++;
							printCurrentPos = imgObject.obj.offsetTop;
						}
						else {
							hrDivObj = gHrList_[hr_idx-1].span;
							hrDivObj.style.display = "block";
							printPageCount++;
							printCurrentPos = start_pos;
						}
					}
				}
				for(var kk=1;kk<imgCtrlObj.length;kk++) {
					imgObject = gImageGroupList_[img_idx+kk].group;
					img_pos = imgObject.obj.offsetTop + imgObject.obj.offsetHeight;
					if(img_pos - printCurrentPos > pageHeight) {
						if(imgObject.obj.offsetTop - printCurrentPos > pageHeight) {
							imgCtrlObj[kk-1].post.style.display = "block";
							var postObj = gImageGroupList_[img_idx+kk-1].group;
							printCurrentPos = postObj.obj.offsetTop + postObj.obj.offsetHeight;
						}
						else {
							imgCtrlObj[kk].pre.style.display = "block";
							printCurrentPos = imgObject.obj.offsetTop;
						}
						printPageCount++;
					}
				}
				if(end_pos-printCurrentPos > pageHeight) {
					if(imgCtrlObj.length > 0) {
						imgObject = gImageGroupList_[img_idx+imgCtrlObj.length-1].group;
						if(imgObject.width >= 950) {
							img_pos = imgObject.obj.offsetTop + imgObject.obj.offsetHeight;
							imgCtrlObj[imgCtrlObj.length-1].post.style.display = "block";
							printPageCount++;
							printCurrentPos = img_pos;
						}
						else {
							printPageCount++;
							printCurrentPos += pageHeight;
						}
					}
				}
			}
		}
	}
	while(end_pos-printCurrentPos > pageHeight) {
		printPageCount++;
		printCurrentPos += pageHeight;
	}
}
var  pobj;
function Apf()
{
	if(load_flag == false) {
		return;
	}
	var  ppp;
	var  strClick;
	var  menuObj = parent.window.MENU;
	if(menuObj == null) {
		menuObj = parent.window.SM_HISTORY;
	}
	if(menuObj != null) {
		for(ppp=0;ppp<menuObj._getAllElems().length;ppp++) {
			pobj = menuObj._getAllElems()[ppp];
			if(pobj.onclick != null) {
				var str = pobj.src.split("print.png");
				if(str.length > 1) {
					pobj.style.cursor = 'wait';
					break;
				}
			}
		}
	}

	setTimeout('StandardPrint()',100);


	setTimeout("ChangeHeadCursor('hand')",100);
}
function ChangeCursor(type)
{
	document.body.style.cursor = type;
}
function ChangeHeadCursor(type)
{
	pobj.style.cursor = type;
}
function StandardPrint()
{
	_prInitImageInfo(100);
	if(gIdx_ > 0) {
		var  img_hei = _prResizeImage(67/100);
		var  idx;
		var dispId,dispElement;
		var prtId,prtElement;
		var orgWid,orgHei;

		orgWid = parent.document.body.offsetWidth + 8;
		orgHei = parent.document.body.offsetHeight + 58;

		ChangeImageDisplay(true);

		var  hrObj,hrDivObj,nextHrObj;
		var  pos_dis;
		var   obj_len;

		printPageCount = 1;
		printCurrentPos = 0;

		parent.resizeBy(pageWidth-orgWid,0);

		hrObj = gHrList_[0].obj;
		for(idx=1;idx<gHrList_.length;idx++) {
			nextHrObj = gHrList_[idx].obj;
			obj_len = nextHrObj.offsetTop - hrObj.offsetTop;
			if(obj_len > pageHeight*1/2) {
				MultiPageProcess(idx,hrObj.offsetTop,nextHrObj.offsetTop);
			}
			else {
				pos_dis = nextHrObj.offsetTop - printCurrentPos;
				if(pos_dis > pageHeight) {
					hrDivObj = gHrList_[idx-1].span;
					hrDivObj.style.display = "block";
					printPageCount++;
					printCurrentPos = hrObj.offsetTop;
					pos_dis = nextHrObj.offsetTop - printCurrentPos;
					while(pos_dis > pageHeight) {
						printPageCount++;
						printCurrentPos += pageHeight;
						pos_dis = nextHrObj.offsetTop - printCurrentPos;
					}
				}
			}
			hrObj = nextHrObj;
		}
		var totalHei = document.body.scrollHeight;
		if(totalHei - hrObj.offsetTop > pageHeight*1/2) {
			MultiPageProcess(idx,hrObj.offsetTop,totalHei);
		}
		else {
			pos_dis = totalHei - printCurrentPos;
			if(pos_dis > pageHeight) {
				hrDivObj = gHrList_[idx-1].span;
				hrDivObj.style.display = "block";
				printPageCount++;
			}
		}
		if(printPageCount > 1) {
			var strConf = "Do you want to print " + printPageCount + " pages?";
			var res = confirm(strConf);
			if(res == true) {
				window.focus();
				window.print();
			}
		}
		else {
			window.focus();
			window.print();
		}

		ChangeImageDisplay(false);

		parent.resizeBy(orgWid-pageWidth,0);
		_prResizeImage(100/100);
		window.scrollTo(0,0);
	}
	else {
		window.focus();
		window.print();
	}
}
