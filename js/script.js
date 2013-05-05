$(window).load(function(){
    $('body').height($('body').height() + 1);
    $('body').height($('body').height() - 1);
});


$(document).ready(function(){
    var windowHeight= $(window).height();
    var documentHeight = $(document).height();
    
    if (documentHeight > windowHeight) {
    $('html').css('height', 'auto');
	}
});



//------------------------------------------------------------
// Menu functions
//------------------------------------------------------------

function MenuOver(menu, ev, direction, ulId,changeTop) {
   
    var pos = GETGLOBALPOSITION(menu);
    if(!ulId) return;
    var child = document.getElementById(ulId);
    
	child.style.position = "absolute";
	child.style.display = "block";
	var children = child.childNodes;
	for(var i=0; i<children.length; i++){
	    var sub = children[i];
	    sub.parentMenu = menu;
	}
	
	
	if(menu.id.indexOf("mainMenuElement") == 0){
		
		child.style.top = (menu.clientHeight) + "px";
		//window.status = menu.layout;
		//child.style.top = pos.top + menu.offsetHeight +"px";
		//child.style.left = pos.left +"px";
	}
	else{
		
		/*child.style.top = pos.top + "px";
		if(direction == "rtl")
			child.style.left = pos.left - child.offsetWidth +"px";
		else
			child.style.left = pos.left + menu.offsetWidth +"px";*/
	}
}

function MenuOut(menu, ev, ulId) {
    ev = ev || event;
	var menuElement = GetMenuElement(ev);

	HideChildMenu(menu, menuElement, ulId);
	HideMenu(menu, menuElement);
}


function HideChildMenu(menu, menuElement, ulId) {
	if(!menuElement || menuElement==menu.nextSibling || menuElement==menu.previousSibling){
		if(ulId) {
			var child = document.getElementById(ulId);
			child.style.display = "none";
		}
	}
}
function HideMenu(menu, menuElement) {

	if(!menuElement && menu.id.indexOf("mainMenuElement") != 0 && menu.id.indexOf("mainMenuVerElement") != 0) {
		menu.parentNode.style.display = "none";
		if(menu.parentMenu) HideMenu(menu.parentMenu);
	}
}
	
function GETGLOBALPOSITION(elm, toElement) {
    var left = 0;
    var top = 0;

    while(elm) {
        if(elm == toElement) break;
        left += elm.offsetLeft;
        top += elm.offsetTop;
        elm = elm.offsetParent;
    }
    return {top:top, left:left};
}



function GetMenuElement(ev){
	ev = ev || event;
	var elm = ev.toElement || ev.relatedTarget || ev.currentTarget;

	if (elm.tagName.toLowerCase()=='li')
		elm = elm.parentNode;

	while(elm){
		if(!elm.getAttribute) return null;
		if(elm.id.indexOf("menuElement") == 0)
			break;
		elm = elm.parentNode;
	}
	return elm;
}
//------------------------------------------------------------
// Form functions
//------------------------------------------------------------
function AjaxHandler() {
    this.Send = function(method, url, params, bAsync, OnComplete, OnError) {
        var req;
        if (window.XMLHttpRequest) 
            req = new XMLHttpRequest();
        else if (window.ActiveXObject) 
            req = new ActiveXObject('Microsoft.XMLHTTP');
            
        if(bAsync) {
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status < 400) {
                        if(OnComplete)
                            OnComplete(req);
                    } else if(OnError)
                        OnError(req.status, req.statusText, req.responseText);
                }
            }
        }
        req.open(method, url, bAsync);
        
        if(params) {
            req.setRequestHeader('Content-Type','application/soap+xml; charset=utf-8');
            req.setRequestHeader('Content-Length',params.length);
            req.send(params);
        } else
            req.send();
            
        return req;
    }
}

function Encode(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/''/g,'&quot;').replace(/''/g,'&apos;');
}

function IsEmail(emailToCheck) {
    if(emailToCheck == '') return false;
    var currentChar;
    for (var i = 0; i < emailToCheck.length; i++) {
        currentChar = emailToCheck.charAt(i);
        if ((currentChar < 'a' || currentChar > 'z') && (currentChar < 'A' || currentChar > 'Z') && (currentChar < '0' || currentChar > '9') && (currentChar != '_') && (currentChar != '-') && (currentChar != '@') && (currentChar != '.'))
            return false;
    }
    var atPosition = emailToCheck.indexOf('@');
    if (atPosition < 1) return false;
    if (atPosition < emailToCheck.lastIndexOf('@')) return false;
    if (atPosition > emailToCheck.lastIndexOf('.') - 2) return false;
    if (emailToCheck.lastIndexOf('.') > emailToCheck.length - 3) return false;
    return true;
}

function IsDate(entry) {
    var mo, day, yr;
    var re = /\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/;
    if (re.test(entry)) {
        var delimChar = (entry.indexOf('/') != -1) ? '/' : '-';
        var delim1 = entry.indexOf(delimChar);
        var delim2 = entry.lastIndexOf(delimChar);
        mo = parseInt(entry.substring(0, delim1), 10);
        day = parseInt(entry.substring(delim1+1, delim2), 10);
        yr = parseInt(entry.substring(delim2+1), 10);
        var testDate = new Date(yr, mo-1, day);
        if (testDate.getDate() == day) {
            if (testDate.getMonth() + 1 == mo) {
                if (testDate.getFullYear() == yr) {
                    return true;
                }
            }
        }
    }
    return false;
}

function IsNumber(sNum) {
    var regxp = /^[0-9]+$/; 
    if(!regxp.test(sNum)) 
        return false; 
    return true;
}

function IsPhone(value) {
	value = value.replace(/\./g, '').replace(/ /g, '').replace(/-/g, '').replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '');
        var regxp = /^[0-9]+$/; 
	if(!regxp.test(value) || value.length<7) 
            return false; 
	return true;

}

function GenerateEnvelope(siteId, pageName, formId, formFields, recievingEmail) {

    var envelope = '<?xml version="1.0" encoding="utf-8"?>' +
                   '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
                       '<soap12:Body>' +
                       '<SaveForm xmlns="http://tempuri.org/">' +
                           '<siteId>' + siteId + '</siteId>' +
                           '<pageName>' + pageName + '</pageName>' +
                           '<formId>' + formId + '</formId>' +
                           '<formFields>'+ Encode(formFields) + '</formFields>' +
                           '<recievingEmailAddress>' + recievingEmail + '</recievingEmailAddress>' +
                       '</SaveForm>' +
                       '</soap12:Body>' +
                   '</soap12:Envelope>';


    return envelope;

}

//------------------------------------------------------------
// Flash functions
//------------------------------------------------------------
//v1.7
// Flash Player Version Detection
// Detect Client Browser type
// Copyright 2005-2007 Adobe Systems Incorporated.  All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion() {
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version) {
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version) {
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version) {
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version) {
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer() {
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext) {
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) { 
  var str = '';
  if (isIE && isWin && !isOpera) {
    str += '<object ';
    for (var i in objAttrs) {
      str += i + '="' + objAttrs[i] + '" ';
    }
    str += '>';
    for (var i in params) {
      str += '<param name="' + i + '" value="' + params[i] + '" /> ';
    }
    str += '</object>';
  } else {
    str += '<embed ';
    for (var i in embedAttrs) {
      str += i + '="' + embedAttrs[i] + '" ';
    }
    str += '> </embed>';
  }

  document.write(str);
}

function AC_FL_RunContent() {
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_SW_RunContent() {
  var ret = 
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType) {
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2) {
    var currArg = args[i].toLowerCase();    

    switch (currArg) {	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblclick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
      case "id":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}

//*********************************************************************************
// gallery scroller
//*********************************************************************************
var ourInterval;
var scrollSpeed = 10;
var scrollDelta = 5;
var igObj;

var Scroller = {
	Init: function(id) {
		igObj = document.getElementById(id);
	},
	Start: function(direction, id) {
		ourInterval = setInterval("Scroller."+direction+"('" + id + "')", scrollSpeed);
	},
	End: function() {
		clearInterval(ourInterval);
	},
	Right: function(id){
		this.Init(id);
		igObj.scrollLeft -= scrollDelta;
	},
	Left: function(id){
		this.Init(id);
		igObj.scrollLeft += scrollDelta;
	},
	Up: function(id){
		this.Init(id);
		igObj.scrollTop -= scrollDelta;
	},
	Down: function(id){
		this.Init(id);
		igObj.scrollTop += scrollDelta;
	}
}

//*********************************************************************************
// search
//*********************************************************************************

var pageNumber = 1;
var totalPages = 1;
var currPage   = 1;
function OnSearchBoxClick(pageName, pageType, internalId, btnObj, fieldId, siteId) {
    var searchString = "";
    var field = document.getElementById(fieldId);
    
    if (field && field.value) field.value = TrimFunctions.All(field.value);
    
    var thisPage = location.href;
    if (thisPage.indexOf('_SearchResults') > -1) {
        if (field && field.value != '')
            searchString = field.value;
        else
            searchString = thisPage.substring(thisPage.indexOf('?q=') + 3);
        GetSearchResults(siteId, searchString);
    } else {
        pageName += "_"+internalId+'_SearchResults.html';

        if (field && field.value != '') {
            searchString = pageName + '?q=' + field.value;
            location.href = searchString;
        }
    }
}

function GetSearchResults(siteId, query) {
    var ajaxHandler = new AjaxHandler();
    
    var params = GetSearchParams(siteId, query);
    var response = ajaxHandler.Send('POST', 'LuceneSearch.asmx', params, false);
    
    var allData = {};
    
    if (response.responseText) {
        response = SearchUtils.ParseResponse(response.responseText, 'SearchResult');
        allData = eval('('+response+')');
    }

    pageNumber = 1;
    totalPages = 1;
    currPage   = 1;
    BuildResultsGrid(allData);
    showPage(1);
}

function BuildResultsGrid(allData) {
    var searchResultsGrid = document.getElementById('SearchResults');
    if (searchResultsGrid) {
        SetBoxStyle(searchResultsGrid);
        var output = '';
        var itemsPerPage = Math.ceil(searchResultsGrid.offsetHeight / 60);
        var navHeight = 0;
        if (navigatorObj) {
            navHeight += parseInt(navigatorObj.height || 0);
            navHeight += parseInt(navigatorObj.marginTop || 0);
            navHeight += parseInt(navigatorObj.marginBottom || 0);
        }
        
        if (allData.results && allData.results.length > 0) {
        
            if (Math.floor(allData.results.length / itemsPerPage) > 1)
                itemsPerPage = Math.ceil((searchResultsGrid.offsetHeight - navHeight) / 60);
        
            var divStyle = SetResultsDivMargin();
        
            for (var i = 0; i < allData.results.length; i++) {
                if (i % itemsPerPage == 0) {
                    if (i > 0) {
                        totalPages++;
                        output += '</div>';
                    }
                    output += '<div id="resultsPage' + totalPages + '" style="display:none;' + divStyle + '">';
                }
                
                var line = allData.results[i];
                output += SearchUtils.AddLink(line.title, line.filename) + '<br/>';
                output += SearchUtils.FixChars(line.sample) + '<br/>';
            }
            output += '</div>';
            if (totalPages > 1)
                output += BuildNavigator();
        } else {
            if (resultsBox && resultsBox.direction == 'ltr')
                output = 'No results were found';
            else
                output = '?? ????? ??????';
        }
        searchResultsGrid.innerHTML = output;
    }
}

function BuildNavigator() {
    var elmStyle = '';
    var outputString = '<div style="position:absolute;width:' + navigatorObj.width + 'px;height:' + navigatorObj.height + 'px;top:' + navigatorObj.top + 'px;left:' + navigatorObj.left + 'px;">';

    outputString += '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center">';
    outputString += '<table border="0" cellspacing="0" cellpadding="0" align="center" style="height:' + navigatorObj.height + 'px;">';
    outputString += '<tbody>';
    outputString += '<tr>';

    if (navigatorObj.navPrevBackgroundRepeat) elmStyle += 'background-repeat:' + navigatorObj.navPrevBackgroundRepeat + ';';
    if (navigatorObj.navPrevBackgroundColor)  elmStyle += 'background-color:' + navigatorObj.navPrevBackgroundColor + ';';
    if (navigatorObj.navPrevBackgroundImage)  elmStyle += 'background-image:' + TGalleryManager.GetBgImageUrl(navigatorObj, navigatorObj.navPrevBackgroundImage) + ';';
    if (navigatorObj.navPrevBackgroundImageWidth) elmStyle += 'width:' + navigatorObj.navPrevBackgroundImageWidth + 'px;';
    if (navigatorObj.navPrevBorderColor)      elmStyle += 'border-color:' + navigatorObj.navPrevBorderColor + ';';
    if (navigatorObj.navPrevBorderStyle)      elmStyle += 'border-style:' + navigatorObj.navPrevBorderStyle + ';';
    if (navigatorObj.navFontColor)            elmStyle += 'color:' + navigatorObj.navFontColor + ';';
    if (navigatorObj.navPrevBorderWidth) {
        elmStyle += 'border-width:' + navigatorObj.navPrevBorderWidth + 'px;';
        if(!navigatorObj.navPrevBorderStyle)
            elmStyle += 'border-style:solid;';
    }

    outputString += '<td align="center" style="' + elmStyle + '"><span style="cursor:pointer;" onclick="pagination(\'prev\')">';
    if (navigatorObj.navPrevText)
        outputString += navigatorObj.navPrevText;
    else if (!navigatorObj.navPrevBackgroundImage && !navigatorObj.navPrevBackgroundColor)
        outputString += "Prev";
    outputString += '</span></td>';

    outputString += '<td width="10px">&nbsp;</td>';

    for (var i = 1; i <= totalPages; i++) {
        outputString += '<td align="center">';
        outputString += '<span style="cursor:pointer;" onclick="showPage(' + i + ')" id="pager' + i + '">' + i + '</span>&nbsp;';
        outputString += '</td>';
    }

    outputString += '<td width="10px">&nbsp;</td>';

    elmStyle = '';
    if (navigatorObj.navNextBackgroundRepeat) elmStyle += 'background-repeat:' + navigatorObj.navNextBackgroundRepeat + ';';
    if (navigatorObj.navNextBackgroundColor)  elmStyle += 'background-color:' + navigatorObj.navNextBackgroundColor + ';';
    if (navigatorObj.navNextBackgroundImage)  elmStyle += 'background-image:' + TGalleryManager.GetBgImageUrl(navigatorObj, navigatorObj.navNextBackgroundImage) + ';';
    if (navigatorObj.navNextBackgroundImageWidth) elmStyle += 'width:' + navigatorObj.navNextBackgroundImageWidth + 'px;';
    if (navigatorObj.navNextBorderColor)      elmStyle += 'border-color:' + navigatorObj.navNextBorderColor + ';';
    if (navigatorObj.navNextBorderStyle)      elmStyle += 'border-style:' + navigatorObj.navNextBorderStyle + ';';
    if (navigatorObj.navFontColor)            elmStyle += 'color:' + navigatorObj.navFontColor + ';';
    if (navigatorObj.navNextBorderWidth) {
        elmStyle += 'border-width:' + navigatorObj.navNextBorderWidth + 'px;';
        if(!navigatorObj.navNextBorderStyle)
            elmStyle += 'border-style:solid;';
    }

    outputString += '<td align="center" style="' + elmStyle + '"><span style="cursor:pointer;" onclick="pagination(\'next\')">';
    if (navigatorObj.navNextText)
        outputString += navigatorObj.navNextText;
    else if (!navigatorObj.navNextBackgroundImage && !navigatorObj.navNextBackgroundColor)
        outputString += "Next";
    outputString += '</span></td>';

    outputString += '</tr>';
    outputString += '</tbody>';
    outputString += '</table>';
    outputString += '</td></tr></tbody></table>';
    outputString += '</div>';
    return outputString;

}

function pagination(func) {
    if (func == 'next' && currPage < totalPages) showPage(currPage + 1);
    if (func == 'prev' && currPage > 1) showPage(currPage - 1);
}

function showPage(pageNum) {
    currPage = pageNum;
    for (var i = 1; i <= totalPages; i++) {
        var pager = document.getElementById('pager' + i);
        var panel = document.getElementById('resultsPage' + i);
        if (i == currPage) {
            if (pager) {
                pager.style.color = (navigatorObj.navSelectedFontColor ? navigatorObj.navSelectedFontColor : 'black');
                pager.style.fontWeight = (navigatorObj.navSelectedFontWeight ? navigatorObj.navSelectedFontWeight : 'bold');
                if (navigatorObj.navSelectedFontSize) pager.style.fontSize = navigatorObj.navSelectedFontSize + 'px;';
            }
            if (panel)
                panel.style.display = 'block';
        } else {
            if (pager) {
                pager.style.color = (navigatorObj.navFontColor ? navigatorObj.navFontColor : 'black');
                pager.style.fontWeight = (navigatorObj.navFontWeight ? navigatorObj.navFontWeight : 'normal');
                if (navigatorObj.navFontSize) pager.style.fontSize = navigatorObj.navFontSize + 'px;';
            }
            if (panel)
                panel.style.display = 'none';
        }
    }
}

function SetBoxStyle(searchResultsGrid) {
    if (!resultsBox.direction) resultsBox.direction = 'ltr';
    searchResultsGrid.style.direction = resultsBox.direction;
    searchResultsGrid.style.dir = resultsBox.direction;
    searchResultsGrid.style.textAlign = resultsBox.direction == 'rtl' ? 'right' : 'left';
}

function SetResultsDivMargin() {
    var style = '';
    if (resultsBox.paddingTop) style += 'margin-top:' + resultsBox.paddingTop + 'px;';
    if (resultsBox.paddingLeft) style += 'margin-left:' + resultsBox.paddingLeft + 'px;';
    if (resultsBox.paddingRight) style += 'margin-right:' + resultsBox.paddingRight + 'px;';
    if (resultsBox.paddingBottom) style += 'margin-bottom:' + resultsBox.paddingBottom + 'px;';
    return style;
}

var GetSearchParams = function(siteId, searchString) {
    var params = '<?xml version="1.0" encoding="utf-8"?>';
    params += '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
      params += '<soap12:Body>';
        params += '<Search xmlns="http://tempuri.org/">';
          params += '<siteId>' + siteId + '</siteId>';
          params += '<searchString>' + searchString + '</searchString>';
        params += '</Search>';
      params += '</soap12:Body>';
    params += '</soap12:Envelope>';
    return params;
}

var SearchUtils = {
    FixChars: function(str) {
        return str.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
    },
    AddLink: function(title, url) {
        return '<a href="' + url + '" style="text-decoration:underline;">' + title + '</a>';
    },
    ParseResponse: function(responseText, functionName) {
        var regExp = '<' + functionName + '>(.*)</' + functionName + '>';
        var match = responseText.toString().match(regExp);
        if (match.length && match.length == 2)
            return match[1];
        else
            return 'Error';
    }
}


function ResetValue(element, initialText){
	if(element.value && element.value == initialText)
	   element.value='';
	else{
	   if(element.value=='')
		element.value=initialText;
	}
}

function PopUpImage(src, title, originalWidth) {
        var imagepopup_overlay = document.createElement("div");
	imagepopup_overlay.id ="imagepopup_overlay";
        imagepopup_overlay.className = "imagepopup_overlay imagepopup_overlay_fixed";
        imagepopup_overlay.style.width = "auto";
        imagepopup_overlay.style.height = "auto";
        imagepopup_overlay.style.display = "block";
        imagepopup_overlay.onclick = function (ev) {
            var elm = ev.srcElement || ev.target;
            if (elm.id == "imagepopup_overlay") {
                imagepopup_overlay.parentNode.removeChild(imagepopup_overlay);
            }
        };

        var imagepopup_wrap = document.createElement("div");
        imagepopup_wrap.className = "imagepopup_wrap imagepopup_desktop imagepopup_type_image imagepopup_opened";
        imagepopup_wrap.style.width = originalWidth + "px";
        imagepopup_wrap.style.height = "auto";
        imagepopup_wrap.style.position = "absolute";
        imagepopup_wrap.style.top = "50%";
        imagepopup_wrap.style.left = "50%";
        imagepopup_wrap.style.opacity = "1";
        imagepopup_wrap.style.overflow = "visible";
        
        var imagepopup_skin = document.createElement("div");
        imagepopup_skin.className = "imagepopup_skin";
        imagepopup_skin.style.width = "auto";
        imagepopup_skin.style.height = "auto";
        
        var imagepopup_outer = document.createElement("div");
        imagepopup_outer.className = "imagepopup_outer";
        
        var imagepopup_inner = document.createElement("div");
        imagepopup_inner.className = "imagepopup_inner";
        imagepopup_inner.style.overflow = "visible";
        imagepopup_inner.style.width = originalWidth + "px";
        imagepopup_inner.style.height = "auto";
        
        var imagepopup_image = document.createElement("img");
        imagepopup_image.className = "imagepopup_image";
        imagepopup_image.src = src;
        imagepopup_image.style.width = "100%";
        imagepopup_image.style.height = "auto";
        imagepopup_image.alt = "";
        
        var imagepopup_title = document.createElement("div");
        imagepopup_title.className = "imagepopup_title imagepopup_title_float_wrap";
        imagepopup_title.style.overflow = "visible";
        imagepopup_title.style.width = originalWidth + "px";
        imagepopup_title.style.height = "auto";
        
        var imagepopup_title_text = document.createElement("span");
        imagepopup_title_text.className = "imagepopup_title_text";
        imagepopup_title_text.innerHTML = title;

        var imagepopup_item = document.createElement("a");
        imagepopup_item.className = "imagepopup_item imagepopup_close";
        imagepopup_item.href = "javascript:;";   
        imagepopup_item.title = "Close";

        imagepopup_item.onclick = function () {            
            imagepopup_overlay.parentNode.removeChild(imagepopup_overlay);
        };

        imagepopup_inner.appendChild(imagepopup_image);
        imagepopup_outer.appendChild(imagepopup_inner);
        imagepopup_title.appendChild(imagepopup_title_text);
        imagepopup_skin.appendChild(imagepopup_outer);
        if (title != "") {
            imagepopup_skin.appendChild(imagepopup_title);
        }        
        imagepopup_skin.appendChild(imagepopup_item);
        imagepopup_wrap.appendChild(imagepopup_skin);
        imagepopup_overlay.appendChild(imagepopup_wrap);

        document.body.appendChild(imagepopup_overlay);

        imagepopup_wrap.style.marginTop = -(imagepopup_wrap.clientHeight / 2) + "px";
        imagepopup_wrap.style.marginLeft = -(imagepopup_wrap.clientWidth / 2) + "px";
}

document.onkeydown = function(ev) {
	ev = ev || window.event;	
	var key = ev.keyCode || ev.which;
	
	switch (key) {                      
		case 27:
		    var imagepopup_overlay = document.getElementById('imagepopup_overlay');
		    if (imagepopup_overlay)
		    {
		    	imagepopup_overlay.parentNode.removeChild(imagepopup_overlay);
		    }			
			break;
		default:
		break;
	}	
}

//*********************************************************************************
// string functions
//*********************************************************************************

var TrimFunctions = {
    Left: function(str) {
        return str.replace(/^\s+/, '');
    },
    Right: function(str) {
        return str.replace(/\s+$/, '');
    },
    All: function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }
}

var PaddingFunctions = {
    Left: function(str, padChar, num) {
        var re = new RegExp(".{" + num + "}$");
        var pad = "";
        if (!padChar) padChar = " ";
        do { pad += padChar; }
        while (pad.length < num);
        return re.exec(pad + val)[0];
    },
    Right: function(str, padChar, num) {
        var re = new RegExp("^.{" + num + "}");
        var pad = "";
        if (!padChar) padChar = " ";
        do { pad += padChar; } 
        while (pad.length < num);
        return re.exec(val + pad)[0];
    }
}