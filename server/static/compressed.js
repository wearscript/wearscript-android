/*! jQuery v1.9.1 | (c) 2005, 2012 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery.min.map
*/(function(e,t){var n,r,i=typeof t,o=e.document,a=e.location,s=e.jQuery,u=e.$,l={},c=[],p="1.9.1",f=c.concat,d=c.push,h=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=p.trim,b=function(e,t){return new b.fn.init(e,t,r)},x=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^[\],:{}\s]*$/,E=/(?:^|:|,)(?:\s*\[)+/g,S=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,A=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,j=/^-ms-/,D=/-([\da-z])/gi,L=function(e,t){return t.toUpperCase()},H=function(e){(o.addEventListener||"load"===e.type||"complete"===o.readyState)&&(q(),b.ready())},q=function(){o.addEventListener?(o.removeEventListener("DOMContentLoaded",H,!1),e.removeEventListener("load",H,!1)):(o.detachEvent("onreadystatechange",H),e.detachEvent("onload",H))};b.fn=b.prototype={jquery:p,constructor:b,init:function(e,n,r){var i,a;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof b?n[0]:n,b.merge(this,b.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:o,!0)),C.test(i[1])&&b.isPlainObject(n))for(i in n)b.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(a=o.getElementById(i[2]),a&&a.parentNode){if(a.id!==i[2])return r.find(e);this.length=1,this[0]=a}return this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):b.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),b.makeArray(e,this))},selector:"",length:0,size:function(){return this.length},toArray:function(){return h.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=b.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return b.each(this,e,t)},ready:function(e){return b.ready.promise().done(e),this},slice:function(){return this.pushStack(h.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(b.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:d,sort:[].sort,splice:[].splice},b.fn.init.prototype=b.fn,b.extend=b.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},u=1,l=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},u=2),"object"==typeof s||b.isFunction(s)||(s={}),l===u&&(s=this,--u);l>u;u++)if(null!=(o=arguments[u]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(b.isPlainObject(r)||(n=b.isArray(r)))?(n?(n=!1,a=e&&b.isArray(e)?e:[]):a=e&&b.isPlainObject(e)?e:{},s[i]=b.extend(c,a,r)):r!==t&&(s[i]=r));return s},b.extend({noConflict:function(t){return e.$===b&&(e.$=u),t&&e.jQuery===b&&(e.jQuery=s),b},isReady:!1,readyWait:1,holdReady:function(e){e?b.readyWait++:b.ready(!0)},ready:function(e){if(e===!0?!--b.readyWait:!b.isReady){if(!o.body)return setTimeout(b.ready);b.isReady=!0,e!==!0&&--b.readyWait>0||(n.resolveWith(o,[b]),b.fn.trigger&&b(o).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===b.type(e)},isArray:Array.isArray||function(e){return"array"===b.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if(!e||"object"!==b.type(e)||e.nodeType||b.isWindow(e))return!1;try{if(e.constructor&&!y.call(e,"constructor")&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||y.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=b.buildFragment([e],t,i),i&&b(i).remove(),b.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=b.trim(n),n&&k.test(n.replace(S,"@").replace(A,"]").replace(E,"")))?Function("return "+n)():(b.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||b.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&b.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(j,"ms-").replace(D,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:v&&!v.call("\ufeff\u00a0")?function(e){return null==e?"":v.call(e)}:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?b.merge(n,"string"==typeof e?[e]:e):d.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(g)return g.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return f.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),b.isFunction(e)?(r=h.call(arguments,2),i=function(){return e.apply(n||this,r.concat(h.call(arguments)))},i.guid=e.guid=e.guid||b.guid++,i):t},access:function(e,n,r,i,o,a,s){var u=0,l=e.length,c=null==r;if("object"===b.type(r)){o=!0;for(u in r)b.access(e,n,u,r[u],!0,a,s)}else if(i!==t&&(o=!0,b.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(b(e),n)})),n))for(;l>u;u++)n(e[u],r,s?i:i.call(e[u],u,n(e[u],r)));return o?e:c?n.call(e):l?n(e[0],r):a},now:function(){return(new Date).getTime()}}),b.ready.promise=function(t){if(!n)if(n=b.Deferred(),"complete"===o.readyState)setTimeout(b.ready);else if(o.addEventListener)o.addEventListener("DOMContentLoaded",H,!1),e.addEventListener("load",H,!1);else{o.attachEvent("onreadystatechange",H),e.attachEvent("onload",H);var r=!1;try{r=null==e.frameElement&&o.documentElement}catch(i){}r&&r.doScroll&&function a(){if(!b.isReady){try{r.doScroll("left")}catch(e){return setTimeout(a,50)}q(),b.ready()}}()}return n.promise(t)},b.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=b.type(e);return b.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=b(o);var _={};function F(e){var t=_[e]={};return b.each(e.match(w)||[],function(e,n){t[n]=!0}),t}b.Callbacks=function(e){e="string"==typeof e?_[e]||F(e):b.extend({},e);var n,r,i,o,a,s,u=[],l=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=u.length,n=!0;u&&o>a;a++)if(u[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,u&&(l?l.length&&c(l.shift()):r?u=[]:p.disable())},p={add:function(){if(u){var t=u.length;(function i(t){b.each(t,function(t,n){var r=b.type(n);"function"===r?e.unique&&p.has(n)||u.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=u.length:r&&(s=t,c(r))}return this},remove:function(){return u&&b.each(arguments,function(e,t){var r;while((r=b.inArray(t,u,r))>-1)u.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?b.inArray(e,u)>-1:!(!u||!u.length)},empty:function(){return u=[],this},disable:function(){return u=l=r=t,this},disabled:function(){return!u},lock:function(){return l=t,r||p.disable(),this},locked:function(){return!l},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!u||i&&!l||(n?l.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},b.extend({Deferred:function(e){var t=[["resolve","done",b.Callbacks("once memory"),"resolved"],["reject","fail",b.Callbacks("once memory"),"rejected"],["notify","progress",b.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return b.Deferred(function(n){b.each(t,function(t,o){var a=o[0],s=b.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&b.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?b.extend(e,r):r}},i={};return r.pipe=r.then,b.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=h.call(arguments),r=n.length,i=1!==r||e&&b.isFunction(e.promise)?r:0,o=1===i?e:b.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?h.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,u,l;if(r>1)for(s=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&b.isFunction(n[t].promise)?n[t].promise().done(a(t,l,n)).fail(o.reject).progress(a(t,u,s)):--i;return i||o.resolveWith(l,n),o.promise()}}),b.support=function(){var t,n,r,a,s,u,l,c,p,f,d=o.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*"),r=d.getElementsByTagName("a")[0],!n||!r||!n.length)return{};s=o.createElement("select"),l=s.appendChild(o.createElement("option")),a=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={getSetAttribute:"t"!==d.className,leadingWhitespace:3===d.firstChild.nodeType,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:"/a"===r.getAttribute("href"),opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:!!a.value,optSelected:l.selected,enctype:!!o.createElement("form").enctype,html5Clone:"<:nav></:nav>"!==o.createElement("nav").cloneNode(!0).outerHTML,boxModel:"CSS1Compat"===o.compatMode,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},a.checked=!0,t.noCloneChecked=a.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!l.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}a=o.createElement("input"),a.setAttribute("value",""),t.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),t.radioValue="t"===a.value,a.setAttribute("checked","t"),a.setAttribute("name","t"),u=o.createDocumentFragment(),u.appendChild(a),t.appendChecked=a.checked,t.checkClone=u.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;return d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip,b(function(){var n,r,a,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",u=o.getElementsByTagName("body")[0];u&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",u.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",a=d.getElementsByTagName("td"),a[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===a[0].offsetHeight,a[0].style.display="",a[1].style.display="none",t.reliableHiddenOffsets=p&&0===a[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=4===d.offsetWidth,t.doesNotIncludeMarginInBodyOffset=1!==u.offsetTop,e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(o.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(u.style.zoom=1)),u.removeChild(n),n=d=a=r=null)}),n=s=u=l=r=a=null,t}();var O=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,B=/([A-Z])/g;function P(e,n,r,i){if(b.acceptData(e)){var o,a,s=b.expando,u="string"==typeof n,l=e.nodeType,p=l?b.cache:e,f=l?e[s]:e[s]&&s;if(f&&p[f]&&(i||p[f].data)||!u||r!==t)return f||(l?e[s]=f=c.pop()||b.guid++:f=s),p[f]||(p[f]={},l||(p[f].toJSON=b.noop)),("object"==typeof n||"function"==typeof n)&&(i?p[f]=b.extend(p[f],n):p[f].data=b.extend(p[f].data,n)),o=p[f],i||(o.data||(o.data={}),o=o.data),r!==t&&(o[b.camelCase(n)]=r),u?(a=o[n],null==a&&(a=o[b.camelCase(n)])):a=o,a}}function R(e,t,n){if(b.acceptData(e)){var r,i,o,a=e.nodeType,s=a?b.cache:e,u=a?e[b.expando]:b.expando;if(s[u]){if(t&&(o=n?s[u]:s[u].data)){b.isArray(t)?t=t.concat(b.map(t,b.camelCase)):t in o?t=[t]:(t=b.camelCase(t),t=t in o?[t]:t.split(" "));for(r=0,i=t.length;i>r;r++)delete o[t[r]];if(!(n?$:b.isEmptyObject)(o))return}(n||(delete s[u].data,$(s[u])))&&(a?b.cleanData([e],!0):b.support.deleteExpando||s!=s.window?delete s[u]:s[u]=null)}}}b.extend({cache:{},expando:"jQuery"+(p+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?b.cache[e[b.expando]]:e[b.expando],!!e&&!$(e)},data:function(e,t,n){return P(e,t,n)},removeData:function(e,t){return R(e,t)},_data:function(e,t,n){return P(e,t,n,!0)},_removeData:function(e,t){return R(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&b.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),b.fn.extend({data:function(e,n){var r,i,o=this[0],a=0,s=null;if(e===t){if(this.length&&(s=b.data(o),1===o.nodeType&&!b._data(o,"parsedAttrs"))){for(r=o.attributes;r.length>a;a++)i=r[a].name,i.indexOf("data-")||(i=b.camelCase(i.slice(5)),W(o,i,s[i]));b._data(o,"parsedAttrs",!0)}return s}return"object"==typeof e?this.each(function(){b.data(this,e)}):b.access(this,function(n){return n===t?o?W(o,e,b.data(o,e)):null:(this.each(function(){b.data(this,e,n)}),t)},null,n,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){b.removeData(this,e)})}});function W(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(B,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:O.test(r)?b.parseJSON(r):r}catch(o){}b.data(e,n,r)}else r=t}return r}function $(e){var t;for(t in e)if(("data"!==t||!b.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}b.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=b._data(e,n),r&&(!i||b.isArray(r)?i=b._data(e,n,b.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=b.queue(e,t),r=n.length,i=n.shift(),o=b._queueHooks(e,t),a=function(){b.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),o.cur=i,i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return b._data(e,n)||b._data(e,n,{empty:b.Callbacks("once memory").add(function(){b._removeData(e,t+"queue"),b._removeData(e,n)})})}}),b.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?b.queue(this[0],e):n===t?this:this.each(function(){var t=b.queue(this,e,n);b._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&b.dequeue(this,e)})},dequeue:function(e){return this.each(function(){b.dequeue(this,e)})},delay:function(e,t){return e=b.fx?b.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=b.Deferred(),a=this,s=this.length,u=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=b._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(u));return u(),o.promise(n)}});var I,z,X=/[\t\r\n]/g,U=/\r/g,V=/^(?:input|select|textarea|button|object)$/i,Y=/^(?:a|area)$/i,J=/^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,G=/^(?:checked|selected)$/i,Q=b.support.getSetAttribute,K=b.support.input;b.fn.extend({attr:function(e,t){return b.access(this,b.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){b.removeAttr(this,e)})},prop:function(e,t){return b.access(this,b.prop,e,t,arguments.length>1)},removeProp:function(e){return e=b.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,u="string"==typeof e&&e;if(b.isFunction(e))return this.each(function(t){b(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(X," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=b.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,u=0===arguments.length||"string"==typeof e&&e;if(b.isFunction(e))return this.each(function(t){b(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(X," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?b.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return b.isFunction(e)?this.each(function(n){b(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=b(this),u=t,l=e.match(w)||[];while(o=l[a++])u=r?u:!s.hasClass(o),s[u?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&b._data(this,"__className__",this.className),this.className=this.className||e===!1?"":b._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(X," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=b.isFunction(e),this.each(function(n){var o,a=b(this);1===this.nodeType&&(o=i?e.call(this,n,a.val()):e,null==o?o="":"number"==typeof o?o+="":b.isArray(o)&&(o=b.map(o,function(e){return null==e?"":e+""})),r=b.valHooks[this.type]||b.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=b.valHooks[o.type]||b.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(U,""):null==n?"":n)}}}),b.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,u=0>i?s:o?i:0;for(;s>u;u++)if(n=r[u],!(!n.selected&&u!==i||(b.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&b.nodeName(n.parentNode,"optgroup"))){if(t=b(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n=b.makeArray(t);return b(e).find("option").each(function(){this.selected=b.inArray(b(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attr:function(e,n,r){var o,a,s,u=e.nodeType;if(e&&3!==u&&8!==u&&2!==u)return typeof e.getAttribute===i?b.prop(e,n,r):(a=1!==u||!b.isXMLDoc(e),a&&(n=n.toLowerCase(),o=b.attrHooks[n]||(J.test(n)?z:I)),r===t?o&&a&&"get"in o&&null!==(s=o.get(e,n))?s:(typeof e.getAttribute!==i&&(s=e.getAttribute(n)),null==s?t:s):null!==r?o&&a&&"set"in o&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r):(b.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=b.propFix[n]||n,J.test(n)?!Q&&G.test(n)?e[b.camelCase("default-"+n)]=e[r]=!1:e[r]=!1:b.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!b.support.radioValue&&"radio"===t&&b.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!b.isXMLDoc(e),a&&(n=b.propFix[n]||n,o=b.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):V.test(e.nodeName)||Y.test(e.nodeName)&&e.href?0:t}}}}),z={get:function(e,n){var r=b.prop(e,n),i="boolean"==typeof r&&e.getAttribute(n),o="boolean"==typeof r?K&&Q?null!=i:G.test(n)?e[b.camelCase("default-"+n)]:!!i:e.getAttributeNode(n);return o&&o.value!==!1?n.toLowerCase():t},set:function(e,t,n){return t===!1?b.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&b.propFix[n]||n,n):e[b.camelCase("default-"+n)]=e[n]=!0,n}},K&&Q||(b.attrHooks.value={get:function(e,n){var r=e.getAttributeNode(n);return b.nodeName(e,"input")?e.defaultValue:r&&r.specified?r.value:t},set:function(e,n,r){return b.nodeName(e,"input")?(e.defaultValue=n,t):I&&I.set(e,n,r)}}),Q||(I=b.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&("id"===n||"name"===n||"coords"===n?""!==r.value:r.specified)?r.value:t},set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},b.attrHooks.contenteditable={get:I.get,set:function(e,t,n){I.set(e,""===t?!1:t,n)}},b.each(["width","height"],function(e,n){b.attrHooks[n]=b.extend(b.attrHooks[n],{set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}})})),b.support.hrefNormalized||(b.each(["href","src","width","height"],function(e,n){b.attrHooks[n]=b.extend(b.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return null==r?t:r}})}),b.each(["href","src"],function(e,t){b.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}})),b.support.style||(b.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),b.support.optSelected||(b.propHooks.selected=b.extend(b.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),b.support.enctype||(b.propFix.enctype="encoding"),b.support.checkOn||b.each(["radio","checkbox"],function(){b.valHooks[this]={get:function(e){return null===e.getAttribute("value")?"on":e.value}}}),b.each(["radio","checkbox"],function(){b.valHooks[this]=b.extend(b.valHooks[this],{set:function(e,n){return b.isArray(n)?e.checked=b.inArray(b(e).val(),n)>=0:t}})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}b.event={global:{},add:function(e,n,r,o,a){var s,u,l,c,p,f,d,h,g,m,y,v=b._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=b.guid++),(u=v.events)||(u=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof b===i||e&&b.event.triggered===e.type?t:b.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(w)||[""],l=n.length;while(l--)s=rt.exec(n[l])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),p=b.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=b.event.special[g]||{},d=b.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&b.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=u[g])||(h=u[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),b.event.global[g]=!0;e=null}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,p,f,d,h,g,m=b.hasData(e)&&b._data(e);if(m&&(c=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(s=rt.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=b.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),u=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));u&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||b.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)b.event.remove(e,d+t[l],n,r,!0);b.isEmptyObject(c)&&(delete m.handle,b._removeData(e,"events"))}},trigger:function(n,r,i,a){var s,u,l,c,p,f,d,h=[i||o],g=y.call(n,"type")?n.type:n,m=y.call(n,"namespace")?n.namespace.split("."):[];if(l=f=i=i||o,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+b.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),u=0>g.indexOf(":")&&"on"+g,n=n[b.expando]?n:new b.Event(g,"object"==typeof n&&n),n.isTrigger=!0,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:b.makeArray(r,[n]),p=b.event.special[g]||{},a||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!a&&!p.noBubble&&!b.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(l=l.parentNode);l;l=l.parentNode)h.push(l),f=l;f===(i.ownerDocument||o)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((l=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(b._data(l,"events")||{})[n.type]&&b._data(l,"handle"),s&&s.apply(l,r),s=u&&l[u],s&&b.acceptData(l)&&s.apply&&s.apply(l,r)===!1&&n.preventDefault();if(n.type=g,!(a||n.isDefaultPrevented()||p._default&&p._default.apply(i.ownerDocument,r)!==!1||"click"===g&&b.nodeName(i,"a")||!b.acceptData(i)||!u||!i[g]||b.isWindow(i))){f=i[u],f&&(i[u]=null),b.event.triggered=g;try{i[g]()}catch(v){}b.event.triggered=t,f&&(i[u]=f)}return n.result}},dispatch:function(e){e=b.event.fix(e);var n,r,i,o,a,s=[],u=h.call(arguments),l=(b._data(this,"events")||{})[e.type]||[],c=b.event.special[e.type]||{};if(u[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=b.event.handlers.call(this,e,l),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((b.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,u),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],u=n.delegateCount,l=e.target;if(u&&l.nodeType&&(!e.button||"click"!==e.type))for(;l!=this;l=l.parentNode||this)if(1===l.nodeType&&(l.disabled!==!0||"click"!==e.type)){for(o=[],a=0;u>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?b(r,this).index(l)>=0:b.find(r,this,null,[l]).length),o[r]&&o.push(i);o.length&&s.push({elem:l,handlers:o})}return n.length>u&&s.push({elem:this,handlers:n.slice(u)}),s},fix:function(e){if(e[b.expando])return e;var t,n,r,i=e.type,a=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new b.Event(a),t=r.length;while(t--)n=r[t],e[n]=a[n];return e.target||(e.target=a.srcElement||o),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,a):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,a,s=n.button,u=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||o,a=i.documentElement,r=i.body,e.pageX=n.clientX+(a&&a.scrollLeft||r&&r.scrollLeft||0)-(a&&a.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(a&&a.scrollTop||r&&r.scrollTop||0)-(a&&a.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&u&&(e.relatedTarget=u===e.target?n.toElement:u),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},click:{trigger:function(){return b.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t}},focus:{trigger:function(){if(this!==o.activeElement&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===o.activeElement&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=b.extend(new b.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?b.event.trigger(i,null,t):b.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},b.removeEvent=o.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},b.Event=function(e,n){return this instanceof b.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&b.extend(this,n),this.timeStamp=e&&e.timeStamp||b.now(),this[b.expando]=!0,t):new b.Event(e,n)},b.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},b.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){b.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;
return(!i||i!==r&&!b.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),b.support.submitBubbles||(b.event.special.submit={setup:function(){return b.nodeName(this,"form")?!1:(b.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=b.nodeName(n,"input")||b.nodeName(n,"button")?n.form:t;r&&!b._data(r,"submitBubbles")&&(b.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),b._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&b.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return b.nodeName(this,"form")?!1:(b.event.remove(this,"._submit"),t)}}),b.support.changeBubbles||(b.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(b.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),b.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),b.event.simulate("change",this,e,!0)})),!1):(b.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!b._data(t,"changeBubbles")&&(b.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||b.event.simulate("change",this.parentNode,e,!0)}),b._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return b.event.remove(this,"._change"),!Z.test(this.nodeName)}}),b.support.focusinBubbles||b.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){b.event.simulate(t,e.target,b.event.fix(e),!0)};b.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),b.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return b().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=b.guid++)),this.each(function(){b.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,b(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){b.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){b.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?b.event.trigger(e,n,r,!0):t}}),function(e,t){var n,r,i,o,a,s,u,l,c,p,f,d,h,g,m,y,v,x="sizzle"+-new Date,w=e.document,T={},N=0,C=0,k=it(),E=it(),S=it(),A=typeof t,j=1<<31,D=[],L=D.pop,H=D.push,q=D.slice,M=D.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},_="[\\x20\\t\\r\\n\\f]",F="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=F.replace("w","w#"),B="([*^$|!~]?=)",P="\\["+_+"*("+F+")"+_+"*(?:"+B+_+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+O+")|)|)"+_+"*\\]",R=":("+F+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+P.replace(3,8)+")*)|.*)\\)|)",W=RegExp("^"+_+"+|((?:^|[^\\\\])(?:\\\\.)*)"+_+"+$","g"),$=RegExp("^"+_+"*,"+_+"*"),I=RegExp("^"+_+"*([\\x20\\t\\r\\n\\f>+~])"+_+"*"),z=RegExp(R),X=RegExp("^"+O+"$"),U={ID:RegExp("^#("+F+")"),CLASS:RegExp("^\\.("+F+")"),NAME:RegExp("^\\[name=['\"]?("+F+")['\"]?\\]"),TAG:RegExp("^("+F.replace("w","w*")+")"),ATTR:RegExp("^"+P),PSEUDO:RegExp("^"+R),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+_+"*(even|odd|(([+-]|)(\\d*)n|)"+_+"*(?:([+-]|)"+_+"*(\\d+)|))"+_+"*\\)|)","i"),needsContext:RegExp("^"+_+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+_+"*((?:-\\d)?\\d*)"+_+"*\\)|)(?=[^-]|$)","i")},V=/[\x20\t\r\n\f]*[+~]/,Y=/^[^{]+\{\s*\[native code/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,G=/^(?:input|select|textarea|button)$/i,Q=/^h\d$/i,K=/'|\\/g,Z=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,et=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,tt=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(55296|n>>10,56320|1023&n)};try{q.call(w.documentElement.childNodes,0)[0].nodeType}catch(nt){q=function(e){var t,n=[];while(t=this[e++])n.push(t);return n}}function rt(e){return Y.test(e+"")}function it(){var e,t=[];return e=function(n,r){return t.push(n+=" ")>i.cacheLength&&delete e[t.shift()],e[n]=r}}function ot(e){return e[x]=!0,e}function at(e){var t=p.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}}function st(e,t,n,r){var i,o,a,s,u,l,f,g,m,v;if((t?t.ownerDocument||t:w)!==p&&c(t),t=t||p,n=n||[],!e||"string"!=typeof e)return n;if(1!==(s=t.nodeType)&&9!==s)return[];if(!d&&!r){if(i=J.exec(e))if(a=i[1]){if(9===s){if(o=t.getElementById(a),!o||!o.parentNode)return n;if(o.id===a)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(a))&&y(t,o)&&o.id===a)return n.push(o),n}else{if(i[2])return H.apply(n,q.call(t.getElementsByTagName(e),0)),n;if((a=i[3])&&T.getByClassName&&t.getElementsByClassName)return H.apply(n,q.call(t.getElementsByClassName(a),0)),n}if(T.qsa&&!h.test(e)){if(f=!0,g=x,m=t,v=9===s&&e,1===s&&"object"!==t.nodeName.toLowerCase()){l=ft(e),(f=t.getAttribute("id"))?g=f.replace(K,"\\$&"):t.setAttribute("id",g),g="[id='"+g+"'] ",u=l.length;while(u--)l[u]=g+dt(l[u]);m=V.test(e)&&t.parentNode||t,v=l.join(",")}if(v)try{return H.apply(n,q.call(m.querySelectorAll(v),0)),n}catch(b){}finally{f||t.removeAttribute("id")}}}return wt(e.replace(W,"$1"),t,n,r)}a=st.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},c=st.setDocument=function(e){var n=e?e.ownerDocument||e:w;return n!==p&&9===n.nodeType&&n.documentElement?(p=n,f=n.documentElement,d=a(n),T.tagNameNoComments=at(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),T.attributes=at(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return"boolean"!==t&&"string"!==t}),T.getByClassName=at(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",e.getElementsByClassName&&e.getElementsByClassName("e").length?(e.lastChild.className="e",2===e.getElementsByClassName("e").length):!1}),T.getByName=at(function(e){e.id=x+0,e.innerHTML="<a name='"+x+"'></a><div name='"+x+"'></div>",f.insertBefore(e,f.firstChild);var t=n.getElementsByName&&n.getElementsByName(x).length===2+n.getElementsByName(x+0).length;return T.getIdNotName=!n.getElementById(x),f.removeChild(e),t}),i.attrHandle=at(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==A&&"#"===e.firstChild.getAttribute("href")})?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},T.getIdNotName?(i.find.ID=function(e,t){if(typeof t.getElementById!==A&&!d){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(et,tt);return function(e){return e.getAttribute("id")===t}}):(i.find.ID=function(e,n){if(typeof n.getElementById!==A&&!d){var r=n.getElementById(e);return r?r.id===e||typeof r.getAttributeNode!==A&&r.getAttributeNode("id").value===e?[r]:t:[]}},i.filter.ID=function(e){var t=e.replace(et,tt);return function(e){var n=typeof e.getAttributeNode!==A&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=T.tagNameNoComments?function(e,n){return typeof n.getElementsByTagName!==A?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.NAME=T.getByName&&function(e,n){return typeof n.getElementsByName!==A?n.getElementsByName(name):t},i.find.CLASS=T.getByClassName&&function(e,n){return typeof n.getElementsByClassName===A||d?t:n.getElementsByClassName(e)},g=[],h=[":focus"],(T.qsa=rt(n.querySelectorAll))&&(at(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||h.push("\\["+_+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||h.push(":checked")}),at(function(e){e.innerHTML="<input type='hidden' i=''/>",e.querySelectorAll("[i^='']").length&&h.push("[*^$]="+_+"*(?:\"\"|'')"),e.querySelectorAll(":enabled").length||h.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),h.push(",.*:")})),(T.matchesSelector=rt(m=f.matchesSelector||f.mozMatchesSelector||f.webkitMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&at(function(e){T.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",R)}),h=RegExp(h.join("|")),g=RegExp(g.join("|")),y=rt(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},v=f.compareDocumentPosition?function(e,t){var r;return e===t?(u=!0,0):(r=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t))?1&r||e.parentNode&&11===e.parentNode.nodeType?e===n||y(w,e)?-1:t===n||y(w,t)?1:0:4&r?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return u=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:0;if(o===a)return ut(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?ut(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},u=!1,[0,0].sort(v),T.detectDuplicates=u,p):p},st.matches=function(e,t){return st(e,null,null,t)},st.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&c(e),t=t.replace(Z,"='$1']"),!(!T.matchesSelector||d||g&&g.test(t)||h.test(t)))try{var n=m.call(e,t);if(n||T.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(r){}return st(t,p,null,[e]).length>0},st.contains=function(e,t){return(e.ownerDocument||e)!==p&&c(e),y(e,t)},st.attr=function(e,t){var n;return(e.ownerDocument||e)!==p&&c(e),d||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):d||T.attributes?e.getAttribute(t):((n=e.getAttributeNode(t))||e.getAttribute(t))&&e[t]===!0?t:n&&n.specified?n.value:null},st.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},st.uniqueSort=function(e){var t,n=[],r=1,i=0;if(u=!T.detectDuplicates,e.sort(v),u){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e};function ut(e,t){var n=t&&e,r=n&&(~t.sourceIndex||j)-(~e.sourceIndex||j);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function lt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ct(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function pt(e){return ot(function(t){return t=+t,ot(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}o=st.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=st.selectors={cacheLength:50,createPseudo:ot,match:U,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(et,tt),e[3]=(e[4]||e[5]||"").replace(et,tt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||st.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&st.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return U.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&z.test(n)&&(t=ft(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){return"*"===e?function(){return!0}:(e=e.replace(et,tt).toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[e+" "];return t||(t=RegExp("(^|"+_+")"+e+"("+_+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==A&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=st.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!u&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[x]||(m[x]={}),l=c[e]||[],d=l[0]===N&&l[1],f=l[0]===N&&l[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[N,d,f];break}}else if(v&&(l=(t[x]||(t[x]={}))[e])&&l[0]===N)f=l[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[x]||(p[x]={}))[e]=[N,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||st.error("unsupported pseudo: "+e);return r[x]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?ot(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=M.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ot(function(e){var t=[],n=[],r=s(e.replace(W,"$1"));return r[x]?ot(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ot(function(e){return function(t){return st(e,t).length>0}}),contains:ot(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:ot(function(e){return X.test(e||"")||st.error("unsupported lang: "+e),e=e.replace(et,tt).toLowerCase(),function(t){var n;do if(n=d?t.getAttribute("xml:lang")||t.getAttribute("lang"):t.lang)return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return Q.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:pt(function(){return[0]}),last:pt(function(e,t){return[t-1]}),eq:pt(function(e,t,n){return[0>n?n+t:n]}),even:pt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:pt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:pt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:pt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[n]=lt(n);for(n in{submit:!0,reset:!0})i.pseudos[n]=ct(n);function ft(e,t){var n,r,o,a,s,u,l,c=E[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=i.preFilter;while(s){(!n||(r=$.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),u.push(o=[])),n=!1,(r=I.exec(s))&&(n=r.shift(),o.push({value:n,type:r[0].replace(W," ")}),s=s.slice(n.length));for(a in i.filter)!(r=U[a].exec(s))||l[a]&&!(r=l[a](r))||(n=r.shift(),o.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?st.error(e):E(e,u).slice(0)}function dt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function ht(e,t,n){var i=t.dir,o=n&&"parentNode"===i,a=C++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,s){var u,l,c,p=N+" "+a;if(s){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[x]||(t[x]={}),(l=c[i])&&l[0]===p){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[p],l[1]=e(t,n,s)||r,l[1]===!0)return!0}}function gt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function mt(e,t,n,r,i){var o,a=[],s=0,u=e.length,l=null!=t;for(;u>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),l&&t.push(s));return a}function yt(e,t,n,r,i,o){return r&&!r[x]&&(r=yt(r)),i&&!i[x]&&(i=yt(i,o)),ot(function(o,a,s,u){var l,c,p,f=[],d=[],h=a.length,g=o||xt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:mt(g,f,e,s,u),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,u),r){l=mt(y,d),r(l,[],s,u),c=l.length;while(c--)(p=l[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(p=y[c])&&l.push(m[c]=p);i(null,y=[],l,u)}c=y.length;while(c--)(p=y[c])&&(l=i?M.call(o,p):f[c])>-1&&(o[l]=!(a[l]=p))}}else y=mt(y===a?y.splice(h,y.length):y),i?i(null,a,y,u):H.apply(a,y)})}function vt(e){var t,n,r,o=e.length,a=i.relative[e[0].type],s=a||i.relative[" "],u=a?1:0,c=ht(function(e){return e===t},s,!0),p=ht(function(e){return M.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;o>u;u++)if(n=i.relative[e[u].type])f=[ht(gt(f),n)];else{if(n=i.filter[e[u].type].apply(null,e[u].matches),n[x]){for(r=++u;o>r;r++)if(i.relative[e[r].type])break;return yt(u>1&&gt(f),u>1&&dt(e.slice(0,u-1)).replace(W,"$1"),n,r>u&&vt(e.slice(u,r)),o>r&&vt(e=e.slice(r)),o>r&&dt(e))}f.push(n)}return gt(f)}function bt(e,t){var n=0,o=t.length>0,a=e.length>0,s=function(s,u,c,f,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,T=l,C=s||a&&i.find.TAG("*",d&&u.parentNode||u),k=N+=null==T?1:Math.random()||.1;for(w&&(l=u!==p&&u,r=n);null!=(h=C[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,u,c)){f.push(h);break}w&&(N=k,r=++n)}o&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,o&&b!==v){g=0;while(m=t[g++])m(x,y,u,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=L.call(f));y=mt(y)}H.apply(f,y),w&&!s&&y.length>0&&v+t.length>1&&st.uniqueSort(f)}return w&&(N=k,l=T),x};return o?ot(s):s}s=st.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=ft(e)),n=t.length;while(n--)o=vt(t[n]),o[x]?r.push(o):i.push(o);o=S(e,bt(i,r))}return o};function xt(e,t,n){var r=0,i=t.length;for(;i>r;r++)st(e,t[r],n);return n}function wt(e,t,n,r){var o,a,u,l,c,p=ft(e);if(!r&&1===p.length){if(a=p[0]=p[0].slice(0),a.length>2&&"ID"===(u=a[0]).type&&9===t.nodeType&&!d&&i.relative[a[1].type]){if(t=i.find.ID(u.matches[0].replace(et,tt),t)[0],!t)return n;e=e.slice(a.shift().value.length)}o=U.needsContext.test(e)?0:a.length;while(o--){if(u=a[o],i.relative[l=u.type])break;if((c=i.find[l])&&(r=c(u.matches[0].replace(et,tt),V.test(a[0].type)&&t.parentNode||t))){if(a.splice(o,1),e=r.length&&dt(a),!e)return H.apply(n,q.call(r,0)),n;break}}}return s(e,p)(r,t,d,n,V.test(e)),n}i.pseudos.nth=i.pseudos.eq;function Tt(){}i.filters=Tt.prototype=i.pseudos,i.setFilters=new Tt,c(),st.attr=b.attr,b.find=st,b.expr=st.selectors,b.expr[":"]=b.expr.pseudos,b.unique=st.uniqueSort,b.text=st.getText,b.isXMLDoc=st.isXML,b.contains=st.contains}(e);var at=/Until$/,st=/^(?:parents|prev(?:Until|All))/,ut=/^.[^:#\[\.,]*$/,lt=b.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};b.fn.extend({find:function(e){var t,n,r,i=this.length;if("string"!=typeof e)return r=this,this.pushStack(b(e).filter(function(){for(t=0;i>t;t++)if(b.contains(r[t],this))return!0}));for(n=[],t=0;i>t;t++)b.find(e,this[t],n);return n=this.pushStack(i>1?b.unique(n):n),n.selector=(this.selector?this.selector+" ":"")+e,n},has:function(e){var t,n=b(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(b.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1))},filter:function(e){return this.pushStack(ft(this,e,!0))},is:function(e){return!!e&&("string"==typeof e?lt.test(e)?b(e,this.context).index(this[0])>=0:b.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,o=[],a=lt.test(e)||"string"!=typeof e?b(e,t||this.context):0;for(;i>r;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&11!==n.nodeType){if(a?a.index(n)>-1:b.find.matchesSelector(n,e)){o.push(n);break}n=n.parentNode}}return this.pushStack(o.length>1?b.unique(o):o)},index:function(e){return e?"string"==typeof e?b.inArray(this[0],b(e)):b.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?b(e,t):b.makeArray(e&&e.nodeType?[e]:e),r=b.merge(this.get(),n);return this.pushStack(b.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),b.fn.andSelf=b.fn.addBack;function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}b.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return b.dir(e,"parentNode")},parentsUntil:function(e,t,n){return b.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return b.dir(e,"nextSibling")},prevAll:function(e){return b.dir(e,"previousSibling")},nextUntil:function(e,t,n){return b.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return b.dir(e,"previousSibling",n)},siblings:function(e){return b.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return b.sibling(e.firstChild)},contents:function(e){return b.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:b.merge([],e.childNodes)}},function(e,t){b.fn[e]=function(n,r){var i=b.map(this,t,n);return at.test(e)||(r=n),r&&"string"==typeof r&&(i=b.filter(r,i)),i=this.length>1&&!ct[e]?b.unique(i):i,this.length>1&&st.test(e)&&(i=i.reverse()),this.pushStack(i)}}),b.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),1===t.length?b.find.matchesSelector(t[0],e)?[t[0]]:[]:b.find.matches(e,t)},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!b(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(t=t||0,b.isFunction(t))return b.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return b.grep(e,function(e){return e===t===n});if("string"==typeof t){var r=b.grep(e,function(e){return 1===e.nodeType});if(ut.test(t))return b.filter(t,r,!n);t=b.filter(t,r)}return b.grep(e,function(e){return b.inArray(e,t)>=0===n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Nt=/^(?:checkbox|radio)$/i,Ct=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:b.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(o),Dt=jt.appendChild(o.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,b.fn.extend({text:function(e){return b.access(this,function(e){return e===t?b.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(b.isFunction(e))return this.each(function(t){b(this).wrapAll(e.call(this,t))});if(this[0]){var t=b(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return b.isFunction(e)?this.each(function(t){b(this).wrapInner(e.call(this,t))}):this.each(function(){var t=b(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=b.isFunction(e);return this.each(function(n){b(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){b.nodeName(this,"body")||b(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.insertBefore(e,this.firstChild)})},before:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=0;for(;null!=(n=this[r]);r++)(!e||b.filter(e,[n]).length>0)&&(t||1!==n.nodeType||b.cleanData(Ot(n)),n.parentNode&&(t&&b.contains(n.ownerDocument,n)&&Mt(Ot(n,"script")),n.parentNode.removeChild(n)));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&b.cleanData(Ot(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&b.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return b.clone(this,e,t)})},html:function(e){return b.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!b.support.htmlSerialize&&mt.test(e)||!b.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(b.cleanData(Ot(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){var t=b.isFunction(e);return t||"string"==typeof e||(e=b(e).not(this).detach()),this.domManip([e],!0,function(e){var t=this.nextSibling,n=this.parentNode;n&&(b(this).remove(),n.insertBefore(e,t))})},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=f.apply([],e);var i,o,a,s,u,l,c=0,p=this.length,d=this,h=p-1,g=e[0],m=b.isFunction(g);if(m||!(1>=p||"string"!=typeof g||b.support.checkClone)&&Ct.test(g))return this.each(function(i){var o=d.eq(i);m&&(e[0]=g.call(this,i,n?o.html():t)),o.domManip(e,n,r)});if(p&&(l=b.buildFragment(e,this[0].ownerDocument,!1,this),i=l.firstChild,1===l.childNodes.length&&(l=i),i)){for(n=n&&b.nodeName(i,"tr"),s=b.map(Ot(l,"script"),Ht),a=s.length;p>c;c++)o=l,c!==h&&(o=b.clone(o,!0,!0),a&&b.merge(s,Ot(o,"script"))),r.call(n&&b.nodeName(this[c],"table")?Lt(this[c],"tbody"):this[c],o,c);if(a)for(u=s[s.length-1].ownerDocument,b.map(s,qt),c=0;a>c;c++)o=s[c],kt.test(o.type||"")&&!b._data(o,"globalEval")&&b.contains(u,o)&&(o.src?b.ajax({url:o.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):b.globalEval((o.text||o.textContent||o.innerHTML||"").replace(St,"")));l=i=null}return this}});function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function Ht(e){var t=e.getAttributeNode("type");return e.type=(t&&t.specified)+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function Mt(e,t){var n,r=0;for(;null!=(n=e[r]);r++)b._data(n,"globalEval",!t||b._data(t[r],"globalEval"))}function _t(e,t){if(1===t.nodeType&&b.hasData(e)){var n,r,i,o=b._data(e),a=b._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)b.event.add(t,n,s[n][r])}a.data&&(a.data=b.extend({},a.data))}}function Ft(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!b.support.noCloneEvent&&t[b.expando]){i=b._data(t);for(r in i.events)b.removeEvent(t,r,i.handle);t.removeAttribute(b.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),b.support.html5Clone&&e.innerHTML&&!b.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Nt.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}b.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){b.fn[e]=function(e){var n,r=0,i=[],o=b(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),b(o[r])[t](n),d.apply(i,n.get());return this.pushStack(i)}});function Ot(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||b.nodeName(o,n)?s.push(o):b.merge(s,Ot(o,n));return n===t||n&&b.nodeName(e,n)?b.merge([e],s):s}function Bt(e){Nt.test(e.type)&&(e.defaultChecked=e.checked)}b.extend({clone:function(e,t,n){var r,i,o,a,s,u=b.contains(e.ownerDocument,e);if(b.support.html5Clone||b.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(b.support.noCloneEvent&&b.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||b.isXMLDoc(e)))for(r=Ot(o),s=Ot(e),a=0;null!=(i=s[a]);++a)r[a]&&Ft(i,r[a]);if(t)if(n)for(s=s||Ot(e),r=r||Ot(o),a=0;null!=(i=s[a]);a++)_t(i,r[a]);else _t(e,o);return r=Ot(o,"script"),r.length>0&&Mt(r,!u&&Ot(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,u,l,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===b.type(o))b.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),u=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[u]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!b.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!b.support.tbody){o="table"!==u||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)b.nodeName(l=o.childNodes[i],"tbody")&&!l.childNodes.length&&o.removeChild(l)
}b.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),b.support.appendChecked||b.grep(Ot(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===b.inArray(o,r))&&(a=b.contains(o.ownerDocument,o),s=Ot(f.appendChild(o),"script"),a&&Mt(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,u=b.expando,l=b.cache,p=b.support.deleteExpando,f=b.event.special;for(;null!=(n=e[s]);s++)if((t||b.acceptData(n))&&(o=n[u],a=o&&l[o])){if(a.events)for(r in a.events)f[r]?b.event.remove(n,r):b.removeEvent(n,r,a.handle);l[o]&&(delete l[o],p?delete n[u]:typeof n.removeAttribute!==i?n.removeAttribute(u):n[u]=null,c.push(o))}}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+x+")(.*)$","i"),Yt=RegExp("^("+x+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+x+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===b.css(e,"display")||!b.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=b._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=b._data(r,"olddisplay",un(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&b._data(r,"olddisplay",i?n:b.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}b.fn.extend({css:function(e,n){return b.access(this,function(e,n,r){var i,o,a={},s=0;if(b.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=b.css(e,n[s],!1,o);return a}return r!==t?b.style(e,n,r):b.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?b(this).show():b(this).hide()})}}),b.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":b.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,u=b.camelCase(n),l=e.style;if(n=b.cssProps[u]||(b.cssProps[u]=tn(l,u)),s=b.cssHooks[n]||b.cssHooks[u],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:l[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(b.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||b.cssNumber[u]||(r+="px"),b.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(l[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{l[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,u=b.camelCase(n);return n=b.cssProps[u]||(b.cssProps[u]=tn(e.style,u)),s=b.cssHooks[n]||b.cssHooks[u],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||b.isNumeric(o)?o||0:a):a},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),u=s?s.getPropertyValue(n)||s[n]:t,l=e.style;return s&&(""!==u||b.contains(e.ownerDocument,e)||(u=b.style(e,n)),Yt.test(u)&&Ut.test(n)&&(i=l.width,o=l.minWidth,a=l.maxWidth,l.minWidth=l.maxWidth=l.width=u,u=s.width,l.width=i,l.minWidth=o,l.maxWidth=a)),u}):o.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),u=s?s[n]:t,l=e.style;return null==u&&l&&l[n]&&(u=l[n]),Yt.test(u)&&!zt.test(n)&&(i=l.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),l.left="fontSize"===n?"1em":u,u=l.pixelLeft+"px",l.left=i,a&&(o.left=a)),""===u?"auto":u});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=b.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=b.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=b.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=b.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=b.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=b.support.boxSizing&&"border-box"===b.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(b.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function un(e){var t=o,n=Gt[e];return n||(n=ln(e,t),"none"!==n&&n||(Pt=(Pt||b("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=ln(e,t),Pt.detach()),Gt[e]=n),n}function ln(e,t){var n=b(t.createElement(e)).appendTo(t.body),r=b.css(n[0],"display");return n.remove(),r}b.each(["height","width"],function(e,n){b.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(b.css(e,"display"))?b.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,b.support.boxSizing&&"border-box"===b.css(e,"boxSizing",!1,i),i):0)}}}),b.support.opacity||(b.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=b.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===b.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),b(function(){b.support.reliableMarginRight||(b.cssHooks.marginRight={get:function(e,n){return n?b.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!b.support.pixelPosition&&b.fn.position&&b.each(["top","left"],function(e,n){b.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?b(e).position()[n]+"px":r):t}}})}),b.expr&&b.expr.filters&&(b.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!b.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||b.css(e,"display"))},b.expr.filters.visible=function(e){return!b.expr.filters.hidden(e)}),b.each({margin:"",padding:"",border:"Width"},function(e,t){b.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(b.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;b.fn.extend({serialize:function(){return b.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=b.prop(this,"elements");return e?b.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!b(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Nt.test(e))}).map(function(e,t){var n=b(this).val();return null==n?null:b.isArray(n)?b.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),b.param=function(e,n){var r,i=[],o=function(e,t){t=b.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=b.ajaxSettings&&b.ajaxSettings.traditional),b.isArray(e)||e.jquery&&!b.isPlainObject(e))b.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(b.isArray(t))b.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==b.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}b.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){b.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),b.fn.hover=function(e,t){return this.mouseenter(e).mouseleave(t||e)};var mn,yn,vn=b.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Nn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Cn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=b.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=a.href}catch(Ln){yn=o.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(b.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(u){var l;return o[u]=!0,b.each(e[u]||[],function(e,u){var c=u(n,r,i);return"string"!=typeof c||a||o[c]?a?!(l=c):t:(n.dataTypes.unshift(c),s(c),!1)}),l}return s(n.dataTypes[0])||!o["*"]&&s("*")}function Mn(e,n){var r,i,o=b.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&b.extend(!0,e,r),e}b.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,u=e.indexOf(" ");return u>=0&&(i=e.slice(u,e.length),e=e.slice(0,u)),b.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&b.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?b("<div>").append(b.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},b.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){b.fn[t]=function(e){return this.on(t,e)}}),b.each(["get","post"],function(e,n){b[n]=function(e,r,i,o){return b.isFunction(r)&&(o=o||i,i=r,r=t),b.ajax({url:e,type:n,dataType:o,data:r,success:i})}}),b.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Nn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":b.parseJSON,"text xml":b.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Mn(Mn(e,b.ajaxSettings),t):Mn(b.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,u,l,c,p=b.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?b(f):b.event,h=b.Deferred(),g=b.Callbacks("once memory"),m=p.statusCode||{},y={},v={},x=0,T="canceled",N={readyState:0,getResponseHeader:function(e){var t;if(2===x){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return x||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return x||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>x)for(t in e)m[t]=[m[t],e[t]];else N.always(e[N.status]);return this},abort:function(e){var t=e||T;return l&&l.abort(t),k(0,t),this}};if(h.promise(N).complete=g.add,N.success=N.done,N.error=N.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=b.trim(p.dataType||"*").toLowerCase().match(w)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?80:443))==(mn[3]||("http:"===mn[1]?80:443)))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=b.param(p.data,p.traditional)),qn(An,p,n,N),2===x)return N;u=p.global,u&&0===b.active++&&b.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Cn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(b.lastModified[o]&&N.setRequestHeader("If-Modified-Since",b.lastModified[o]),b.etag[o]&&N.setRequestHeader("If-None-Match",b.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&N.setRequestHeader("Content-Type",p.contentType),N.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)N.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,N,p)===!1||2===x))return N.abort();T="abort";for(i in{success:1,error:1,complete:1})N[i](p[i]);if(l=qn(jn,p,n,N)){N.readyState=1,u&&d.trigger("ajaxSend",[N,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){N.abort("timeout")},p.timeout));try{x=1,l.send(y,k)}catch(C){if(!(2>x))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,C=n;2!==x&&(x=2,s&&clearTimeout(s),l=t,a=i||"",N.readyState=e>0?4:0,r&&(w=_n(p,N,r)),e>=200&&300>e||304===e?(p.ifModified&&(T=N.getResponseHeader("Last-Modified"),T&&(b.lastModified[o]=T),T=N.getResponseHeader("etag"),T&&(b.etag[o]=T)),204===e?(c=!0,C="nocontent"):304===e?(c=!0,C="notmodified"):(c=Fn(p,w),C=c.state,y=c.data,v=c.error,c=!v)):(v=C,(e||!C)&&(C="error",0>e&&(e=0))),N.status=e,N.statusText=(n||C)+"",c?h.resolveWith(f,[y,C,N]):h.rejectWith(f,[N,C,v]),N.statusCode(m),m=t,u&&d.trigger(c?"ajaxSuccess":"ajaxError",[N,p,c?y:v]),g.fireWith(f,[N,C]),u&&(d.trigger("ajaxComplete",[N,p]),--b.active||b.event.trigger("ajaxStop")))}return N},getScript:function(e,n){return b.get(e,t,n,"script")},getJSON:function(e,t,n){return b.get(e,t,n,"json")}});function _n(e,n,r){var i,o,a,s,u=e.contents,l=e.dataTypes,c=e.responseFields;for(s in c)s in r&&(n[c[s]]=r[s]);while("*"===l[0])l.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in u)if(u[s]&&u[s].test(o)){l.unshift(s);break}if(l[0]in r)a=l[0];else{for(s in r){if(!l[0]||e.converters[s+" "+l[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==l[0]&&l.unshift(a),r[a]):t}function Fn(e,t){var n,r,i,o,a={},s=0,u=e.dataTypes.slice(),l=u[0];if(e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u[1])for(i in e.converters)a[i.toLowerCase()]=e.converters[i];for(;r=u[++s];)if("*"!==r){if("*"!==l&&l!==r){if(i=a[l+" "+r]||a["* "+r],!i)for(n in a)if(o=n.split(" "),o[1]===r&&(i=a[l+" "+o[0]]||a["* "+o[0]])){i===!0?i=a[n]:a[n]!==!0&&(r=o[0],u.splice(s--,0,r));break}if(i!==!0)if(i&&e["throws"])t=i(t);else try{t=i(t)}catch(c){return{state:"parsererror",error:i?c:"No conversion from "+l+" to "+r}}}l=r}return{state:"success",data:t}}b.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return b.globalEval(e),e}}}),b.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),b.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=o.head||b("head")[0]||o.documentElement;return{send:function(t,i){n=o.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var On=[],Bn=/(=)\?(?=&|$)|\?\?/;b.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=On.pop()||b.expando+"_"+vn++;return this[e]=!0,e}}),b.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,u=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return u||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=b.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,u?n[u]=n[u].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||b.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,On.push(o)),s&&b.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}b.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=b.ajaxSettings.xhr(),b.support.cors=!!Rn&&"withCredentials"in Rn,Rn=b.support.ajax=!!Rn,Rn&&b.ajaxTransport(function(n){if(!n.crossDomain||b.support.cors){var r;return{send:function(i,o){var a,s,u=n.xhr();if(n.username?u.open(n.type,n.url,n.async,n.username,n.password):u.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)u[s]=n.xhrFields[s];n.mimeType&&u.overrideMimeType&&u.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)u.setRequestHeader(s,i[s])}catch(l){}u.send(n.hasContent&&n.data||null),r=function(e,i){var s,l,c,p;try{if(r&&(i||4===u.readyState))if(r=t,a&&(u.onreadystatechange=b.noop,$n&&delete Pn[a]),i)4!==u.readyState&&u.abort();else{p={},s=u.status,l=u.getAllResponseHeaders(),"string"==typeof u.responseText&&(p.text=u.responseText);try{c=u.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,l)},n.async?4===u.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},b(e).unload($n)),Pn[a]=r),u.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+x+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n,r,i=this.createTween(e,t),o=Yn.exec(t),a=i.cur(),s=+a||0,u=1,l=20;if(o){if(n=+o[2],r=o[3]||(b.cssNumber[e]?"":"px"),"px"!==r&&s){s=b.css(i.elem,e,!0)||n||1;do u=u||".5",s/=u,b.style(i.elem,e,s+r);while(u!==(u=i.cur()/a)&&1!==u&&--l)}i.unit=r,i.start=s,i.end=o[1]?s+(o[1]+1)*n:n}return i}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=b.now()}function Zn(e,t){b.each(t,function(t,n){var r=(Qn[t]||[]).concat(Qn["*"]),i=0,o=r.length;for(;o>i;i++)if(r[i].call(e,t,n))return})}function er(e,t,n){var r,i,o=0,a=Gn.length,s=b.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;for(;u>a;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),1>o&&u?n:(s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:b.extend({},t),opts:b.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=b.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?s.resolveWith(e,[l,t]):s.rejectWith(e,[l,t]),this}}),c=l.props;for(tr(c,l.opts.specialEasing);a>o;o++)if(r=Gn[o].call(l,e,c,l.opts))return r;return Zn(l,c),b.isFunction(l.opts.start)&&l.opts.start.call(e,l),b.fx.timer(b.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function tr(e,t){var n,r,i,o,a;for(i in e)if(r=b.camelCase(i),o=t[r],n=e[i],b.isArray(n)&&(o=n[1],n=e[i]=n[0]),i!==r&&(e[r]=n,delete e[i]),a=b.cssHooks[r],a&&"expand"in a){n=a.expand(n),delete e[r];for(i in n)i in e||(e[i]=n[i],t[i]=o)}else t[r]=o}b.Animation=b.extend(er,{tweener:function(e,t){b.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,u,l,c,p,f=this,d=e.style,h={},g=[],m=e.nodeType&&nn(e);n.queue||(c=b._queueHooks(e,"fx"),null==c.unqueued&&(c.unqueued=0,p=c.empty.fire,c.empty.fire=function(){c.unqueued||p()}),c.unqueued++,f.always(function(){f.always(function(){c.unqueued--,b.queue(e,"fx").length||c.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[d.overflow,d.overflowX,d.overflowY],"inline"===b.css(e,"display")&&"none"===b.css(e,"float")&&(b.support.inlineBlockNeedsLayout&&"inline"!==un(e.nodeName)?d.zoom=1:d.display="inline-block")),n.overflow&&(d.overflow="hidden",b.support.shrinkWrapBlocks||f.always(function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]}));for(i in t)if(a=t[i],Vn.exec(a)){if(delete t[i],u=u||"toggle"===a,a===(m?"hide":"show"))continue;g.push(i)}if(o=g.length){s=b._data(e,"fxshow")||b._data(e,"fxshow",{}),"hidden"in s&&(m=s.hidden),u&&(s.hidden=!m),m?b(e).show():f.done(function(){b(e).hide()}),f.done(function(){var t;b._removeData(e,"fxshow");for(t in h)b.style(e,t,h[t])});for(i=0;o>i;i++)r=g[i],l=f.createTween(r,m?s[r]:0),h[r]=s[r]||b.style(e,r),r in s||(s[r]=l.start,m&&(l.end=l.start,l.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}b.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(b.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?b.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=b.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){b.fx.step[e.prop]?b.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[b.cssProps[e.prop]]||b.cssHooks[e.prop])?b.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},b.each(["toggle","show","hide"],function(e,t){var n=b.fn[t];b.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),b.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=b.isEmptyObject(e),o=b.speed(t,n,r),a=function(){var t=er(this,b.extend({},e),o);a.finish=function(){t.stop(!0)},(i||b._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=b.timers,a=b._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&b.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=b._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=b.timers,a=r?r.length:0;for(n.finish=!0,b.queue(this,e,[]),i&&i.cur&&i.cur.finish&&i.cur.finish.call(this),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}b.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){b.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),b.speed=function(e,t,n){var r=e&&"object"==typeof e?b.extend({},e):{complete:n||!n&&t||b.isFunction(e)&&e,duration:e,easing:n&&t||t&&!b.isFunction(t)&&t};return r.duration=b.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in b.fx.speeds?b.fx.speeds[r.duration]:b.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){b.isFunction(r.old)&&r.old.call(this),r.queue&&b.dequeue(this,r.queue)},r},b.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},b.timers=[],b.fx=rr.prototype.init,b.fx.tick=function(){var e,n=b.timers,r=0;for(Xn=b.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||b.fx.stop(),Xn=t},b.fx.timer=function(e){e()&&b.timers.push(e)&&b.fx.start()},b.fx.interval=13,b.fx.start=function(){Un||(Un=setInterval(b.fx.tick,b.fx.interval))},b.fx.stop=function(){clearInterval(Un),Un=null},b.fx.speeds={slow:600,fast:200,_default:400},b.fx.step={},b.expr&&b.expr.filters&&(b.expr.filters.animated=function(e){return b.grep(b.timers,function(t){return e===t.elem}).length}),b.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){b.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,b.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},b.offset={setOffset:function(e,t,n){var r=b.css(e,"position");"static"===r&&(e.style.position="relative");var i=b(e),o=i.offset(),a=b.css(e,"top"),s=b.css(e,"left"),u=("absolute"===r||"fixed"===r)&&b.inArray("auto",[a,s])>-1,l={},c={},p,f;u?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),b.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(l.top=t.top-o.top+p),null!=t.left&&(l.left=t.left-o.left+f),"using"in t?t.using.call(e,l):i.css(l)}},b.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===b.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),b.nodeName(e[0],"html")||(n=e.offset()),n.top+=b.css(e[0],"borderTopWidth",!0),n.left+=b.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-b.css(r,"marginTop",!0),left:t.left-n.left-b.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||o.documentElement;while(e&&!b.nodeName(e,"html")&&"static"===b.css(e,"position"))e=e.offsetParent;return e||o.documentElement})}}),b.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);b.fn[e]=function(i){return b.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?b(a).scrollLeft():o,r?o:b(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return b.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}b.each({Height:"height",Width:"width"},function(e,n){b.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){b.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return b.access(this,function(n,r,i){var o;return b.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?b.css(n,r,s):b.style(n,r,i,s)},n,a?i:t,a,null)}})}),e.jQuery=e.$=b,"function"==typeof define&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return b})})(window);;
// https://github.com/joewalnes/reconnecting-websocket/
function ReconnectingWebSocket(a){function f(g){c=new WebSocket(a);if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","attempt-connect",a)}var h=c;var i=setTimeout(function(){if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","connection-timeout",a)}e=true;h.close();e=false},b.timeoutInterval);c.onopen=function(c){clearTimeout(i);if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","onopen",a)}b.readyState=WebSocket.OPEN;g=false;b.onopen(c)};c.onclose=function(h){clearTimeout(i);c=null;if(d){b.readyState=WebSocket.CLOSED;b.onclose(h)}else{b.readyState=WebSocket.CONNECTING;if(!g&&!e){if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","onclose",a)}b.onclose(h)}setTimeout(function(){f(true)},b.reconnectInterval)}};c.onmessage=function(c){if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","onmessage",a,c.data)}b.onmessage(c)};c.onerror=function(c){if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","onerror",a,c)}b.onerror(c)}}this.debug=false;this.reconnectInterval=1e3;this.timeoutInterval=2e3;var b=this;var c;var d=false;var e=false;this.url=a;this.readyState=WebSocket.CONNECTING;this.URL=a;this.onopen=function(a){};this.onclose=function(a){};this.onmessage=function(a){};this.onerror=function(a){};f(a);this.send=function(d){if(c){if(b.debug||ReconnectingWebSocket.debugAll){console.debug("ReconnectingWebSocket","send",a,d)}return c.send(d)}else{throw"INVALID_STATE_ERR : Pausing to reconnect websocket"}};this.close=function(){if(c){d=true;c.close()}};this.refresh=function(){if(c){c.close()}}}ReconnectingWebSocket.debugAll=false
;
/*!{id:msgpack.js,ver:1.05,license:"MIT",author:"uupaa.js@gmail.com"}*/

// === msgpack ===
// MessagePack -> http://msgpack.sourceforge.net/

this.msgpack || (function(globalScope) {

globalScope.msgpack = {
    pack:       msgpackpack,    // msgpack.pack(data:Mix,
                                //              toString:Boolean = false):ByteArray/ByteString/false
                                //  [1][mix to String]    msgpack.pack({}, true) -> "..."
                                //  [2][mix to ByteArray] msgpack.pack({})       -> [...]
    unpack:     msgpackunpack,  // msgpack.unpack(data:BinaryString/ByteArray):Mix
                                //  [1][String to mix]    msgpack.unpack("...") -> {}
                                //  [2][ByteArray to mix] msgpack.unpack([...]) -> {}
    worker:     "msgpack.js",   // msgpack.worker - WebWorkers script filename
    upload:     msgpackupload,  // msgpack.upload(url:String, option:Hash, callback:Function)
    download:   msgpackdownload // msgpack.download(url:String, option:Hash, callback:Function)
};

var _ie         = /MSIE/.test(navigator.userAgent),
    _bin2num    = {}, // BinaryStringToNumber   { "\00": 0, ... "\ff": 255 }
    _num2bin    = {}, // NumberToBinaryString   { 0: "\00", ... 255: "\ff" }
    _num2b64    = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                   "abcdefghijklmnopqrstuvwxyz0123456789+/").split(""),
    _buf        = [], // decode buffer
    _idx        = 0,  // decode buffer[index]
    _error      = 0,  // msgpack.pack() error code. 1 = CYCLIC_REFERENCE_ERROR
    _isArray    = Array.isArray || (function(mix) {
                    return Object.prototype.toString.call(mix) === "[object Array]";
                  }),
    _toString   = String.fromCharCode, // CharCode/ByteArray to String
    _MAX_DEPTH  = 512;

// for WebWorkers Code Block
self.importScripts && (onmessage = function(event) {
    if (event.data.method === "pack") {
        postMessage(base64encode(msgpackpack(event.data.data)));
    } else {
        postMessage(msgpackunpack(event.data.data));
    }
});

// msgpack.pack
function msgpackpack(data,       // @param Mix:
                     toString) { // @param Boolean(= false):
                                 // @return ByteArray/BinaryString/false:
                                 //     false is error return
    //  [1][mix to String]    msgpack.pack({}, true) -> "..."
    //  [2][mix to ByteArray] msgpack.pack({})       -> [...]

    _error = 0;

    var byteArray = encode([], data, 0);

    return _error ? false
                  : toString ? byteArrayToByteString(byteArray)
                             : byteArray;
}

// msgpack.unpack
function msgpackunpack(data) { // @param BinaryString/ByteArray:
                               // @return Mix/undefined:
                               //       undefined is error return
    //  [1][String to mix]    msgpack.unpack("...") -> {}
    //  [2][ByteArray to mix] msgpack.unpack([...]) -> {}

    _buf = typeof data === "string" ? toByteArray(data) : data;
    _idx = -1;
    return decode(); // mix or undefined
}

// inner - encoder
function encode(rv,      // @param ByteArray: result
                mix,     // @param Mix: source data
                depth) { // @param Number: depth
    var size, i, iz, c, pos,        // for UTF8.encode, Array.encode, Hash.encode
        high, low, sign, exp, frac; // for IEEE754

    if (mix == null) { // null or undefined -> 0xc0 ( null )
        rv.push(0xc0);
    } else if (mix === false) { // false -> 0xc2 ( false )
        rv.push(0xc2);
    } else if (mix === true) {  // true  -> 0xc3 ( true  )
        rv.push(0xc3);
    } else {
        switch (typeof mix) {
        case "number":
            if (mix !== mix) { // isNaN
                rv.push(0xcb, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff); // quiet NaN
            } else if (mix === Infinity) {
                rv.push(0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00); // positive infinity
            } else if (Math.floor(mix) === mix) { // int or uint
                if (mix < 0) {
                    // int
                    if (mix >= -32) { // negative fixnum
                        rv.push(0xe0 + mix + 32);
                    } else if (mix > -0x80) {
                        rv.push(0xd0, mix + 0x100);
                    } else if (mix > -0x8000) {
                        mix += 0x10000;
                        rv.push(0xd1, mix >> 8, mix & 0xff);
                    } else if (mix > -0x80000000) {
                        mix += 0x100000000;
                        rv.push(0xd2, mix >>> 24, (mix >> 16) & 0xff,
                                                  (mix >>  8) & 0xff, mix & 0xff);
                    } else {
                        high = Math.floor(mix / 0x100000000);
                        low  = mix & 0xffffffff;
                        rv.push(0xd3, (high >> 24) & 0xff, (high >> 16) & 0xff,
                                      (high >>  8) & 0xff,         high & 0xff,
                                      (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                                      (low  >>  8) & 0xff,          low & 0xff);
                    }
                } else {
                    // uint
                    if (mix < 0x80) {
                        rv.push(mix); // positive fixnum
                    } else if (mix < 0x100) { // uint 8
                        rv.push(0xcc, mix);
                    } else if (mix < 0x10000) { // uint 16
                        rv.push(0xcd, mix >> 8, mix & 0xff);
                    } else if (mix < 0x100000000) { // uint 32
                        rv.push(0xce, mix >>> 24, (mix >> 16) & 0xff,
                                                  (mix >>  8) & 0xff, mix & 0xff);
                    } else {
                        high = Math.floor(mix / 0x100000000);
                        low  = mix & 0xffffffff;
                        rv.push(0xcf, (high >> 24) & 0xff, (high >> 16) & 0xff,
                                      (high >>  8) & 0xff,         high & 0xff,
                                      (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                                      (low  >>  8) & 0xff,          low & 0xff);
                    }
                }
            } else { // double
                // THX!! @edvakf
                // http://javascript.g.hatena.ne.jp/edvakf/20101128/1291000731
                sign = mix < 0;
                sign && (mix *= -1);

                // add offset 1023 to ensure positive
                // 0.6931471805599453 = Math.LN2;
                exp  = ((Math.log(mix) / 0.6931471805599453) + 1023) | 0;

                // shift 52 - (exp - 1023) bits to make integer part exactly 53 bits,
                // then throw away trash less than decimal point
                frac = mix * Math.pow(2, 52 + 1023 - exp);

                //  S+-Exp(11)--++-----------------Fraction(52bits)-----------------------+
                //  ||          ||                                                        |
                //  v+----------++--------------------------------------------------------+
                //  00000000|00000000|00000000|00000000|00000000|00000000|00000000|00000000
                //  6      5    55  4        4        3        2        1        8        0
                //  3      6    21  8        0        2        4        6
                //
                //  +----------high(32bits)-----------+ +----------low(32bits)------------+
                //  |                                 | |                                 |
                //  +---------------------------------+ +---------------------------------+
                //  3      2    21  1        8        0
                //  1      4    09  6
                low  = frac & 0xffffffff;
                sign && (exp |= 0x800);
                high = ((frac / 0x100000000) & 0xfffff) | (exp << 20);

                rv.push(0xcb, (high >> 24) & 0xff, (high >> 16) & 0xff,
                              (high >>  8) & 0xff,  high        & 0xff,
                              (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                              (low  >>  8) & 0xff,  low         & 0xff);
            }
            break;
        case "string":
            // http://d.hatena.ne.jp/uupaa/20101128
            iz = mix.length;
            pos = rv.length; // keep rewrite position

            rv.push(0); // placeholder

            // utf8.encode
            for (i = 0; i < iz; ++i) {
                c = mix.charCodeAt(i);
                if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
                    rv.push(c & 0x7f);
                } else if (c < 0x0800) {
                    rv.push(((c >>>  6) & 0x1f) | 0xc0, (c & 0x3f) | 0x80);
                } else if (c < 0x10000) {
                    rv.push(((c >>> 12) & 0x0f) | 0xe0,
                            ((c >>>  6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
                }
            }
            size = rv.length - pos - 1;

            if (size < 32) {
                rv[pos] = 0xa0 + size; // rewrite
            } else if (size < 0x10000) { // 16
                rv.splice(pos, 1, 0xda, size >> 8, size & 0xff);
            } else if (size < 0x100000000) { // 32
                rv.splice(pos, 1, 0xdb,
                          size >>> 24, (size >> 16) & 0xff,
                                       (size >>  8) & 0xff, size & 0xff);
            }
            break;
        default: // array or hash
            if (++depth >= _MAX_DEPTH) {
                _error = 1; // CYCLIC_REFERENCE_ERROR
                return rv = []; // clear
            }
            if (_isArray(mix)) {
                size = mix.length;
                if (size < 16) {
                    rv.push(0x90 + size);
                } else if (size < 0x10000) { // 16
                    rv.push(0xdc, size >> 8, size & 0xff);
                } else if (size < 0x100000000) { // 32
                    rv.push(0xdd, size >>> 24, (size >> 16) & 0xff,
                                               (size >>  8) & 0xff, size & 0xff);
                }
                for (i = 0; i < size; ++i) {
                    encode(rv, mix[i], depth);
                }
            } else { // hash
                // http://d.hatena.ne.jp/uupaa/20101129
                pos = rv.length; // keep rewrite position
                rv.push(0); // placeholder
                size = 0;
                for (i in mix) {
                    ++size;
                    encode(rv, i,      depth);
                    encode(rv, mix[i], depth);
                }
                if (size < 16) {
                    rv[pos] = 0x80 + size; // rewrite
                } else if (size < 0x10000) { // 16
                    rv.splice(pos, 1, 0xde, size >> 8, size & 0xff);
                } else if (size < 0x100000000) { // 32
                    rv.splice(pos, 1, 0xdf,
                              size >>> 24, (size >> 16) & 0xff,
                                           (size >>  8) & 0xff, size & 0xff);
                }
            }
        }
    }
    return rv;
}

// inner - decoder
function decode() { // @return Mix:
    var size, i, iz, c, num = 0,
        sign, exp, frac, ary, hash,
        buf = _buf, type = buf[++_idx];

    if (type >= 0xe0) {             // Negative FixNum (111x xxxx) (-32 ~ -1)
        return type - 0x100;
    }
    if (type < 0xc0) {
        if (type < 0x80) {          // Positive FixNum (0xxx xxxx) (0 ~ 127)
            return type;
        }
        if (type < 0x90) {          // FixMap (1000 xxxx)
            num  = type - 0x80;
            type = 0x80;
        } else if (type < 0xa0) {   // FixArray (1001 xxxx)
            num  = type - 0x90;
            type = 0x90;
        } else { // if (type < 0xc0) {   // FixRaw (101x xxxx)
            num  = type - 0xa0;
            type = 0xa0;
        }
    }
    switch (type) {
    case 0xc0:  return null;
    case 0xc2:  return false;
    case 0xc3:  return true;
    case 0xca:  // float
                num = buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                (buf[++_idx] <<  8) + buf[++_idx];
                sign =  num & 0x80000000;    //  1bit
                exp  = (num >> 23) & 0xff;   //  8bits
                frac =  num & 0x7fffff;      // 23bits
                if (!num || num === 0x80000000) { // 0.0 or -0.0
                    return 0;
                }
                if (exp === 0xff) { // NaN or Infinity
                    return frac ? NaN : Infinity;
                }
                return (sign ? -1 : 1) *
                            (frac | 0x800000) * Math.pow(2, exp - 127 - 23); // 127: bias
    case 0xcb:  // double
                num = buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                (buf[++_idx] <<  8) + buf[++_idx];
                sign =  num & 0x80000000;    //  1bit
                exp  = (num >> 20) & 0x7ff;  // 11bits
                frac =  num & 0xfffff;       // 52bits - 32bits (high word)
                if (!num || num === 0x80000000) { // 0.0 or -0.0
                    _idx += 4;
                    return 0;
                }
                if (exp === 0x7ff) { // NaN or Infinity
                    _idx += 4;
                    return frac ? NaN : Infinity;
                }
                num = buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                (buf[++_idx] <<  8) + buf[++_idx];
                return (sign ? -1 : 1) *
                            ((frac | 0x100000) * Math.pow(2, exp - 1023 - 20) // 1023: bias
                             + num * Math.pow(2, exp - 1023 - 52));
    // 0xcf: uint64, 0xce: uint32, 0xcd: uint16
    case 0xcf:  num =  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                 (buf[++_idx] <<  8) + buf[++_idx];
                return num * 0x100000000 +
                       buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                 (buf[++_idx] <<  8) + buf[++_idx];
    case 0xce:  num += buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xcd:  num += buf[++_idx] << 8;
    case 0xcc:  return num + buf[++_idx];
    // 0xd3: int64, 0xd2: int32, 0xd1: int16, 0xd0: int8
    case 0xd3:  num = buf[++_idx];
                if (num & 0x80) { // sign -> avoid overflow
                    return ((num         ^ 0xff) * 0x100000000000000 +
                            (buf[++_idx] ^ 0xff) *   0x1000000000000 +
                            (buf[++_idx] ^ 0xff) *     0x10000000000 +
                            (buf[++_idx] ^ 0xff) *       0x100000000 +
                            (buf[++_idx] ^ 0xff) *         0x1000000 +
                            (buf[++_idx] ^ 0xff) *           0x10000 +
                            (buf[++_idx] ^ 0xff) *             0x100 +
                            (buf[++_idx] ^ 0xff) + 1) * -1;
                }
                return num         * 0x100000000000000 +
                       buf[++_idx] *   0x1000000000000 +
                       buf[++_idx] *     0x10000000000 +
                       buf[++_idx] *       0x100000000 +
                       buf[++_idx] *         0x1000000 +
                       buf[++_idx] *           0x10000 +
                       buf[++_idx] *             0x100 +
                       buf[++_idx];
    case 0xd2:  num  =  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                       (buf[++_idx] << 8) + buf[++_idx];
                return num < 0x80000000 ? num : num - 0x100000000; // 0x80000000 * 2
    case 0xd1:  num  = (buf[++_idx] << 8) + buf[++_idx];
                return num < 0x8000 ? num : num - 0x10000; // 0x8000 * 2
    case 0xd0:  num  =  buf[++_idx];
                return num < 0x80 ? num : num - 0x100; // 0x80 * 2
    // 0xdb: raw32, 0xda: raw16, 0xa0: raw ( string )
    case 0xdb:  num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xda:  num += (buf[++_idx] << 8)       +  buf[++_idx];
    case 0xa0:  // utf8.decode
                for (ary = [], i = _idx, iz = i + num; i < iz; ) {
                    c = buf[++i]; // lead byte
                    ary.push(c); // NOTE(Brandyn): Changed this
                    /*ary.push(c < 0x80 ? c : // ASCII(0x00 ~ 0x7f)
                             c < 0xe0 ? ((c & 0x1f) <<  6 | (buf[++i] & 0x3f)) :
                                        ((c & 0x0f) << 12 | (buf[++i] & 0x3f) << 6
                                                          | (buf[++i] & 0x3f))); */
                }
                _idx = i;
                return ary.length < 10240 ? _toString.apply(null, ary)
                                          : byteArrayToByteString(ary);
    // 0xdf: map32, 0xde: map16, 0x80: map
    case 0xdf:  num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xde:  num += (buf[++_idx] << 8)       +  buf[++_idx];
    case 0x80:  hash = {};
                while (num--) {
                    // make key/value pair
                    size = buf[++_idx] - 0xa0;

                    for (ary = [], i = _idx, iz = i + size; i < iz; ) {
                        c = buf[++i]; // lead byte
                        ary.push(c < 0x80 ? c : // ASCII(0x00 ~ 0x7f)
                                 c < 0xe0 ? ((c & 0x1f) <<  6 | (buf[++i] & 0x3f)) :
                                            ((c & 0x0f) << 12 | (buf[++i] & 0x3f) << 6
                                                              | (buf[++i] & 0x3f)));
                    }
                    _idx = i;
                    hash[_toString.apply(null, ary)] = decode();
                }
                return hash;
    // 0xdd: array32, 0xdc: array16, 0x90: array
    case 0xdd:  num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xdc:  num += (buf[++_idx] << 8)       +  buf[++_idx];
    case 0x90:  ary = [];
                while (num--) {
                    ary.push(decode());
                }
                return ary;
    }
    return;
}

// inner - byteArray To ByteString
function byteArrayToByteString(byteArray) { // @param ByteArray
                                            // @return String
    // http://d.hatena.ne.jp/uupaa/20101128
    try {
        return _toString.apply(this, byteArray); // toString
    } catch(err) {
        ; // avoid "Maximum call stack size exceeded"
    }
    var rv = [], i = 0, iz = byteArray.length, num2bin = _num2bin;

    for (; i < iz; ++i) {
        rv[i] = num2bin[byteArray[i]];
    }
    return rv.join("");
}

// msgpack.download - load from server
function msgpackdownload(url,        // @param String:
                         option,     // @param Hash: { worker, timeout, before, after }
                                     //    option.worker - Boolean(= false): true is use WebWorkers
                                     //    option.timeout - Number(= 10): timeout sec
                                     //    option.before  - Function: before(xhr, option)
                                     //    option.after   - Function: after(xhr, option, { status, ok })
                         callback) { // @param Function: callback(data, option, { status, ok })
                                     //    data   - Mix/null:
                                     //    option - Hash:
                                     //    status - Number: HTTP status code
                                     //    ok     - Boolean:
    option.method = "GET";
    option.binary = true;
    ajax(url, option, callback);
}

// msgpack.upload - save to server
function msgpackupload(url,        // @param String:
                       option,     // @param Hash: { data, worker, timeout, before, after }
                                   //    option.data - Mix:
                                   //    option.worker - Boolean(= false): true is use WebWorkers
                                   //    option.timeout - Number(= 10): timeout sec
                                   //    option.before  - Function: before(xhr, option)
                                   //    option.after   - Function: after(xhr, option, { status, ok })
                       callback) { // @param Function: callback(data, option, { status, ok })
                                   //    data   - String: responseText
                                   //    option - Hash:
                                   //    status - Number: HTTP status code
                                   //    ok     - Boolean:
    option.method = "PUT";
    option.binary = true;

    if (option.worker && globalScope.Worker) {
        var worker = new Worker(msgpack.worker);

        worker.onmessage = function(event) {
            option.data = event.data;
            ajax(url, option, callback);
        };
        worker.postMessage({ method: "pack", data: option.data });
    } else {
        // pack and base64 encode
        option.data = base64encode(msgpackpack(option.data));
        ajax(url, option, callback);
    }
}

// inner -
function ajax(url,        // @param String:
              option,     // @param Hash: { data, ifmod, method, timeout,
                          //                header, binary, before, after, worker }
                          //    option.data    - Mix: upload data
                          //    option.ifmod   - Boolean: true is "If-Modified-Since" header
                          //    option.method  - String: "GET", "POST", "PUT"
                          //    option.timeout - Number(= 10): timeout sec
                          //    option.header  - Hash(= {}): { key: "value", ... }
                          //    option.binary  - Boolean(= false): true is binary data
                          //    option.before  - Function: before(xhr, option)
                          //    option.after   - Function: after(xhr, option, { status, ok })
                          //    option.worker  - Boolean(= false): true is use WebWorkers
              callback) { // @param Function: callback(data, option, { status, ok })
                          //    data   - String/Mix/null:
                          //    option - Hash:
                          //    status - Number: HTTP status code
                          //    ok     - Boolean:
    function readyStateChange() {
        if (xhr.readyState === 4) {
            var data, status = xhr.status, worker, byteArray,
                rv = { status: status, ok: status >= 200 && status < 300 };

            if (!run++) {
                if (method === "PUT") {
                    data = rv.ok ? xhr.responseText : "";
                } else {
                    if (rv.ok) {
                        if (option.worker && globalScope.Worker) {
                            worker = new Worker(msgpack.worker);
                            worker.onmessage = function(event) {
                                callback(event.data, option, rv);
                            };
                            worker.postMessage({ method: "unpack",
                                                 data: xhr.responseText });
                            gc();
                            return;
                        } else {
                            byteArray = _ie ? toByteArrayIE(xhr)
                                            : toByteArray(xhr.responseText);
                            data = msgpackunpack(byteArray);
                        }
                    }
                }
                after && after(xhr, option, rv);
                callback(data, option, rv);
                gc();
            }
        }
    }

    function ng(abort, status) {
        if (!run++) {
            var rv = { status: status || 400, ok: false };

            after && after(xhr, option, rv);
            callback(null, option, rv);
            gc(abort);
        }
    }

    function gc(abort) {
        abort && xhr && xhr.abort && xhr.abort();
        watchdog && (clearTimeout(watchdog), watchdog = 0);
        xhr = null;
        globalScope.addEventListener &&
            globalScope.removeEventListener("beforeunload", ng, false);
    }

    var watchdog = 0,
        method = option.method || "GET",
        header = option.header || {},
        before = option.before,
        after = option.after,
        data = option.data || null,
        xhr = globalScope.XMLHttpRequest ? new XMLHttpRequest() :
              globalScope.ActiveXObject  ? new ActiveXObject("Microsoft.XMLHTTP") :
              null,
        run = 0, i,
        overrideMimeType = "overrideMimeType",
        setRequestHeader = "setRequestHeader",
        getbinary = method === "GET" && option.binary;

    try {
        xhr.onreadystatechange = readyStateChange;
        xhr.open(method, url, true); // ASync

        before && before(xhr, option);

        getbinary && xhr[overrideMimeType] &&
            xhr[overrideMimeType]("text/plain; charset=x-user-defined");
        data &&
            xhr[setRequestHeader]("Content-Type",
                                  "application/x-www-form-urlencoded");

        for (i in header) {
            xhr[setRequestHeader](i, header[i]);
        }

        globalScope.addEventListener &&
            globalScope.addEventListener("beforeunload", ng, false); // 400: Bad Request

        xhr.send(data);
        watchdog = setTimeout(function() {
            ng(1, 408); // 408: Request Time-out
        }, (option.timeout || 10) * 1000);
    } catch (err) {
        ng(0, 400); // 400: Bad Request
    }
}

// inner - BinaryString To ByteArray
function toByteArray(data) { // @param BinaryString: "\00\01"
                             // @return ByteArray: [0x00, 0x01]
    var rv = [], bin2num = _bin2num, remain,
        ary = data.split(""),
        i = -1, iz;

    iz = ary.length;
    remain = iz % 8;

    while (remain--) {
        ++i;
        rv[i] = bin2num[ary[i]];
    }
    remain = iz >> 3;
    while (remain--) {
        rv.push(bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]]);
    }
    return rv;
}

// inner - BinaryString to ByteArray
function toByteArrayIE(xhr) {
    var rv = [], data, remain,
        charCodeAt = "charCodeAt",
        loop, v0, v1, v2, v3, v4, v5, v6, v7,
        i = -1, iz;

    iz = vblen(xhr);
    data = vbstr(xhr);
    loop = Math.ceil(iz / 2);
    remain = loop % 8;

    while (remain--) {
        v0 = data[charCodeAt](++i); // 0x00,0x01 -> 0x0100
        rv.push(v0 & 0xff, v0 >> 8);
    }
    remain = loop >> 3;
    while (remain--) {
        v0 = data[charCodeAt](++i);
        v1 = data[charCodeAt](++i);
        v2 = data[charCodeAt](++i);
        v3 = data[charCodeAt](++i);
        v4 = data[charCodeAt](++i);
        v5 = data[charCodeAt](++i);
        v6 = data[charCodeAt](++i);
        v7 = data[charCodeAt](++i);
        rv.push(v0 & 0xff, v0 >> 8, v1 & 0xff, v1 >> 8,
                v2 & 0xff, v2 >> 8, v3 & 0xff, v3 >> 8,
                v4 & 0xff, v4 >> 8, v5 & 0xff, v5 >> 8,
                v6 & 0xff, v6 >> 8, v7 & 0xff, v7 >> 8);
    }
    iz % 2 && rv.pop();

    return rv;
}

// inner - base64.encode
function base64encode(data) { // @param ByteArray:
                              // @return Base64String:
    var rv = [],
        c = 0, i = -1, iz = data.length,
        pad = [0, 2, 1][data.length % 3],
        num2bin = _num2bin,
        num2b64 = _num2b64;

    if (globalScope.btoa) {
        while (i < iz) {
            rv.push(num2bin[data[++i]]);
        }
        return btoa(rv.join(""));
    }
    --iz;
    while (i < iz) {
        c = (data[++i] << 16) | (data[++i] << 8) | (data[++i]); // 24bit
        rv.push(num2b64[(c >> 18) & 0x3f],
                num2b64[(c >> 12) & 0x3f],
                num2b64[(c >>  6) & 0x3f],
                num2b64[ c        & 0x3f]);
    }
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");
    return rv.join("");
}

// --- init ---
(function() {
    var i = 0, v;

    for (; i < 0x100; ++i) {
        v = _toString(i);
        _bin2num[v] = i; // "\00" -> 0x00
        _num2bin[i] = v; //     0 -> "\00"
    }
    // http://twitter.com/edvakf/statuses/15576483807
    for (i = 0x80; i < 0x100; ++i) { // [Webkit][Gecko]
        _bin2num[_toString(0xf700 + i)] = i; // "\f780" -> 0x80
    }
})();

_ie && document.write('<script type="text/vbscript">\
Function vblen(b)vblen=LenB(b.responseBody)End Function\n\
Function vbstr(b)vbstr=CStr(b.responseBody)+chr(0)End Function</'+'script>');

})(this);
;
/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/
if(!jQuery)throw new Error("Bootstrap requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]}}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(window.jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d)};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.is("input")?"val":"html",e=c.data();a+="Text",e.resetText||c.data("resetText",c[d]()),c[d](e[a]||this.options[a]),setTimeout(function(){"loadingText"==a?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons"]');if(a.length){var b=this.$element.find("input").prop("checked",!this.$element.hasClass("active")).trigger("change");"radio"===b.prop("type")&&a.find(".active").removeClass("active")}this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition.end&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}this.sliding=!0,f&&this.pause();var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});if(!e.hasClass("active")){if(this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")){if(this.$element.trigger(j),j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid")},0)}).emulateTransitionEnd(600)}else{if(this.$element.trigger(j),j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return f&&this.cycle(),this}};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?(this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350),void 0):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(window.jQuery),+function(a){"use strict";function b(){a(d).remove(),a(e).each(function(b){var d=c(a(this));d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown")),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown"))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){if("ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b),f.trigger(d=a.Event("show.bs.dropdown")),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown"),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=a("[role=menu] li:not(.divider):visible a",f);if(h.length){var i=h.index(h.filter(":focus"));38==b.keyCode&&i>0&&i--,40==b.keyCode&&i<h.length-1&&i++,~i||(i=0),h.eq(i).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("dropdown");d||c.data("dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu]",f.prototype.keydown)}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.load(this.options.remote)};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show(),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(window.jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focus",i="hover"==g?"mouseleave":"blur";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show),void 0):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide),void 0):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this.tip();this.setContent(),this.options.animation&&c.addClass("fade");var d="function"==typeof this.options.placement?this.options.placement.call(this,c[0],this.$element[0]):this.options.placement,e=/\s?auto?\s?/i,f=e.test(d);f&&(d=d.replace(e,"")||"top"),c.detach().css({top:0,left:0,display:"block"}).addClass(d),this.options.container?c.appendTo(this.options.container):c.insertAfter(this.$element);var g=this.getPosition(),h=c[0].offsetWidth,i=c[0].offsetHeight;if(f){var j=this.$element.parent(),k=d,l=document.documentElement.scrollTop||document.body.scrollTop,m="body"==this.options.container?window.innerWidth:j.outerWidth(),n="body"==this.options.container?window.innerHeight:j.outerHeight(),o="body"==this.options.container?0:j.offset().left;d="bottom"==d&&g.top+g.height+i-l>n?"top":"top"==d&&g.top-l-i<0?"bottom":"right"==d&&g.right+h>m?"left":"left"==d&&g.left-h<o?"right":d,c.removeClass(k).addClass(d)}var p=this.getCalculatedOffset(d,g,h,i);this.applyPlacement(p,d),this.$element.trigger("shown.bs."+this.type)}},b.prototype.applyPlacement=function(a,b){var c,d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),a.top=a.top+g,a.left=a.left+h,d.offset(a).addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;if("top"==b&&j!=f&&(c=!0,a.top=a.top+f-j),/bottom|top/.test(b)){var k=0;a.left<0&&(k=-2*a.left,a.left=0,d.offset(a),i=d[0].offsetWidth,j=d[0].offsetHeight),this.replaceArrow(k-e+i,i,"left")}else this.replaceArrow(j-f,j,"top");c&&d.offset(a)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach()}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.$element.trigger("hidden.bs."+this.type),this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(window.jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"html":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(window.jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(c).is("body")?a(window):a(c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#\w/.test(e)&&a(e);return f&&f.length&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parents(".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top()),"function"==typeof h&&(h=f.bottom());var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;this.affixed!==i&&(this.unpin&&this.$element.css("top",""),this.affixed=i,this.unpin="bottom"==i?e.top-d:null,this.$element.removeClass(b.RESET).addClass("affix"+(i?"-"+i:"")),"bottom"==i&&this.$element.offset({top:document.body.offsetHeight-h-this.$element.height()}))}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(window.jQuery);;
// CodeMirror is the only global var we claim
window.CodeMirror = (function() {
  "use strict";

  // BROWSER SNIFFING

  // Crude, but necessary to handle a number of hard-to-feature-detect
  // bugs and behavior differences.
  var gecko = /gecko\/\d/i.test(navigator.userAgent);
  var ie = /MSIE \d/.test(navigator.userAgent);
  var ie_lt8 = ie && (document.documentMode == null || document.documentMode < 8);
  var ie_lt9 = ie && (document.documentMode == null || document.documentMode < 9);
  var webkit = /WebKit\//.test(navigator.userAgent);
  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);
  var chrome = /Chrome\//.test(navigator.userAgent);
  var opera = /Opera\//.test(navigator.userAgent);
  var safari = /Apple Computer/.test(navigator.vendor);
  var khtml = /KHTML\//.test(navigator.userAgent);
  var mac_geLion = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent);
  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);
  var phantom = /PhantomJS/.test(navigator.userAgent);

  var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
  // This is woefully incomplete. Suggestions for alternative methods welcome.
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
  var mac = ios || /Mac/.test(navigator.platform);
  var windows = /win/i.test(navigator.platform);

  var opera_version = opera && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
  if (opera_version) opera_version = Number(opera_version[1]);
  if (opera_version && opera_version >= 15) { opera = false; webkit = true; }
  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
  var flipCtrlCmd = mac && (qtwebkit || opera && (opera_version == null || opera_version < 12.11));
  var captureMiddleClick = gecko || (ie && !ie_lt9);

  // Optimize some code when these features are not used
  var sawReadOnlySpans = false, sawCollapsedSpans = false;

  // CONSTRUCTOR

  function CodeMirror(place, options) {
    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

    this.options = options = options || {};
    // Determine effective options based on given values and defaults.
    for (var opt in defaults) if (!options.hasOwnProperty(opt) && defaults.hasOwnProperty(opt))
      options[opt] = defaults[opt];
    setGuttersForLineNumbers(options);

    var docStart = typeof options.value == "string" ? 0 : options.value.first;
    var display = this.display = makeDisplay(place, docStart);
    display.wrapper.CodeMirror = this;
    updateGutters(this);
    if (options.autofocus && !mobile) focusInput(this);

    this.state = {keyMaps: [],
                  overlays: [],
                  modeGen: 0,
                  overwrite: false, focused: false,
                  suppressEdits: false, pasteIncoming: false,
                  draggingText: false,
                  highlight: new Delayed()};

    themeChanged(this);
    if (options.lineWrapping)
      this.display.wrapper.className += " CodeMirror-wrap";

    var doc = options.value;
    if (typeof doc == "string") doc = new Doc(options.value, options.mode);
    operation(this, attachDoc)(this, doc);

    // Override magic textarea content restore that IE sometimes does
    // on our hidden textarea on reload
    if (ie) setTimeout(bind(resetInput, this, true), 20);

    registerEventHandlers(this);
    // IE throws unspecified error in certain cases, when
    // trying to access activeElement before onload
    var hasFocus; try { hasFocus = (document.activeElement == display.input); } catch(e) { }
    if (hasFocus || (options.autofocus && !mobile)) setTimeout(bind(onFocus, this), 20);
    else onBlur(this);

    operation(this, function() {
      for (var opt in optionHandlers)
        if (optionHandlers.propertyIsEnumerable(opt))
          optionHandlers[opt](this, options[opt], Init);
      for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
    })();
  }

  // DISPLAY CONSTRUCTOR

  function makeDisplay(place, docStart) {
    var d = {};

    var input = d.input = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;");
    if (webkit) input.style.width = "1000px";
    else input.setAttribute("wrap", "off");
    // if border: 0; -- iOS fails to open keyboard (issue #1287)
    if (ios) input.style.border = "1px solid black";
    input.setAttribute("autocorrect", "off"); input.setAttribute("autocapitalize", "off"); input.setAttribute("spellcheck", "false");

    // Wraps and hides input textarea
    d.inputDiv = elt("div", [input], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
    // The actual fake scrollbars.
    d.scrollbarH = elt("div", [elt("div", null, null, "height: 1px")], "CodeMirror-hscrollbar");
    d.scrollbarV = elt("div", [elt("div", null, null, "width: 1px")], "CodeMirror-vscrollbar");
    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
    d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
    // DIVs containing the selection and the actual code
    d.lineDiv = elt("div", null, "CodeMirror-code");
    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
    // Blinky cursor, and element used to ensure cursor fits at the end of a line
    d.cursor = elt("div", "\u00a0", "CodeMirror-cursor");
    // Secondary cursor, shown when on a 'jump' in bi-directional text
    d.otherCursor = elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor");
    // Used to measure text size
    d.measure = elt("div", null, "CodeMirror-measure");
    // Wraps everything that needs to exist inside the vertically-padded coordinate system
    d.lineSpace = elt("div", [d.measure, d.selectionDiv, d.lineDiv, d.cursor, d.otherCursor],
                         null, "position: relative; outline: none");
    // Moved around its parent to cover visible view
    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
    // Set to the height of the text, causes scrolling
    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
    // D is needed because behavior of elts with overflow: auto and padding is inconsistent across browsers
    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerCutOff + "px; width: 1px;");
    // Will contain the gutters, if any
    d.gutters = elt("div", null, "CodeMirror-gutters");
    d.lineGutter = null;
    // Provides scrolling
    d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
    d.scroller.setAttribute("tabIndex", "-1");
    // The element in which the editor lives.
    d.wrapper = elt("div", [d.inputDiv, d.scrollbarH, d.scrollbarV,
                            d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");
    // Work around IE7 z-index bug
    if (ie_lt8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
    if (place.appendChild) place.appendChild(d.wrapper); else place(d.wrapper);

    // Needed to hide big blue blinking cursor on Mobile Safari
    if (ios) input.style.width = "0px";
    if (!webkit) d.scroller.draggable = true;
    // Needed to handle Tab key in KHTML
    if (khtml) { d.inputDiv.style.height = "1px"; d.inputDiv.style.position = "absolute"; }
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
    else if (ie_lt8) d.scrollbarH.style.minWidth = d.scrollbarV.style.minWidth = "18px";

    // Current visible range (may be bigger than the view window).
    d.viewOffset = d.lastSizeC = 0;
    d.showingFrom = d.showingTo = docStart;

    // Used to only resize the line number gutter when necessary (when
    // the amount of lines crosses a boundary that makes its width change)
    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
    // See readInput and resetInput
    d.prevInput = "";
    // Set to true when a non-horizontal-scrolling widget is added. As
    // an optimization, widget aligning is skipped when d is false.
    d.alignWidgets = false;
    // Flag that indicates whether we currently expect input to appear
    // (after some event like 'keypress' or 'input') and are polling
    // intensively.
    d.pollingFast = false;
    // Self-resetting timeout for the poller
    d.poll = new Delayed();

    d.cachedCharWidth = d.cachedTextHeight = null;
    d.measureLineCache = [];
    d.measureLineCachePos = 0;

    // Tracks when resetInput has punted to just putting a short
    // string instead of the (large) selection.
    d.inaccurateSelection = false;

    // Tracks the maximum line length so that the horizontal scrollbar
    // can be kept static when scrolling.
    d.maxLine = null;
    d.maxLineLength = 0;
    d.maxLineChanged = false;

    // Used for measuring wheel scrolling granularity
    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

    return d;
  }

  // STATE UPDATES

  // Used to get the editor into a consistent state again when options change.

  function loadMode(cm) {
    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
    cm.doc.iter(function(line) {
      if (line.stateAfter) line.stateAfter = null;
      if (line.styles) line.styles = null;
    });
    cm.doc.frontier = cm.doc.first;
    startWorker(cm, 100);
    cm.state.modeGen++;
    if (cm.curOp) regChange(cm);
  }

  function wrappingChanged(cm) {
    if (cm.options.lineWrapping) {
      cm.display.wrapper.className += " CodeMirror-wrap";
      cm.display.sizer.style.minWidth = "";
    } else {
      cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-wrap", "");
      computeMaxLength(cm);
    }
    estimateLineHeights(cm);
    regChange(cm);
    clearCaches(cm);
    setTimeout(function(){updateScrollbars(cm);}, 100);
  }

  function estimateHeight(cm) {
    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
    return function(line) {
      if (lineIsHidden(cm.doc, line))
        return 0;
      else if (wrapping)
        return (Math.ceil(line.text.length / perLine) || 1) * th;
      else
        return th;
    };
  }

  function estimateLineHeights(cm) {
    var doc = cm.doc, est = estimateHeight(cm);
    doc.iter(function(line) {
      var estHeight = est(line);
      if (estHeight != line.height) updateLineHeight(line, estHeight);
    });
  }

  function keyMapChanged(cm) {
    var map = keyMap[cm.options.keyMap], style = map.style;
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") +
      (style ? " cm-keymap-" + style : "");
    cm.state.disableInput = map.disableInput;
  }

  function themeChanged(cm) {
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
    clearCaches(cm);
  }

  function guttersChanged(cm) {
    updateGutters(cm);
    regChange(cm);
    setTimeout(function(){alignHorizontally(cm);}, 20);
  }

  function updateGutters(cm) {
    var gutters = cm.display.gutters, specs = cm.options.gutters;
    removeChildren(gutters);
    for (var i = 0; i < specs.length; ++i) {
      var gutterClass = specs[i];
      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
      if (gutterClass == "CodeMirror-linenumbers") {
        cm.display.lineGutter = gElt;
        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
      }
    }
    gutters.style.display = i ? "" : "none";
  }

  function lineLength(doc, line) {
    if (line.height == 0) return 0;
    var len = line.text.length, merged, cur = line;
    while (merged = collapsedSpanAtStart(cur)) {
      var found = merged.find();
      cur = getLine(doc, found.from.line);
      len += found.from.ch - found.to.ch;
    }
    cur = line;
    while (merged = collapsedSpanAtEnd(cur)) {
      var found = merged.find();
      len -= cur.text.length - found.from.ch;
      cur = getLine(doc, found.to.line);
      len += cur.text.length - found.to.ch;
    }
    return len;
  }

  function computeMaxLength(cm) {
    var d = cm.display, doc = cm.doc;
    d.maxLine = getLine(doc, doc.first);
    d.maxLineLength = lineLength(doc, d.maxLine);
    d.maxLineChanged = true;
    doc.iter(function(line) {
      var len = lineLength(doc, line);
      if (len > d.maxLineLength) {
        d.maxLineLength = len;
        d.maxLine = line;
      }
    });
  }

  // Make sure the gutters options contains the element
  // "CodeMirror-linenumbers" when the lineNumbers option is true.
  function setGuttersForLineNumbers(options) {
    var found = indexOf(options.gutters, "CodeMirror-linenumbers");
    if (found == -1 && options.lineNumbers) {
      options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
    } else if (found > -1 && !options.lineNumbers) {
      options.gutters = options.gutters.slice(0);
      options.gutters.splice(found, 1);
    }
  }

  // SCROLLBARS

  // Re-synchronize the fake scrollbars with the actual size of the
  // content. Optionally force a scrollTop.
  function updateScrollbars(cm) {
    var d = cm.display, docHeight = cm.doc.height;
    var totalHeight = docHeight + paddingVert(d);
    d.sizer.style.minHeight = d.heightForcer.style.top = totalHeight + "px";
    d.gutters.style.height = Math.max(totalHeight, d.scroller.clientHeight - scrollerCutOff) + "px";
    var scrollHeight = Math.max(totalHeight, d.scroller.scrollHeight);
    var needsH = d.scroller.scrollWidth > (d.scroller.clientWidth + 1);
    var needsV = scrollHeight > (d.scroller.clientHeight + 1);
    if (needsV) {
      d.scrollbarV.style.display = "block";
      d.scrollbarV.style.bottom = needsH ? scrollbarWidth(d.measure) + "px" : "0";
      d.scrollbarV.firstChild.style.height =
        (scrollHeight - d.scroller.clientHeight + d.scrollbarV.clientHeight) + "px";
    } else {
      d.scrollbarV.style.display = "";
      d.scrollbarV.firstChild.style.height = "0";
    }
    if (needsH) {
      d.scrollbarH.style.display = "block";
      d.scrollbarH.style.right = needsV ? scrollbarWidth(d.measure) + "px" : "0";
      d.scrollbarH.firstChild.style.width =
        (d.scroller.scrollWidth - d.scroller.clientWidth + d.scrollbarH.clientWidth) + "px";
    } else {
      d.scrollbarH.style.display = "";
      d.scrollbarH.firstChild.style.width = "0";
    }
    if (needsH && needsV) {
      d.scrollbarFiller.style.display = "block";
      d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = scrollbarWidth(d.measure) + "px";
    } else d.scrollbarFiller.style.display = "";
    if (needsH && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
      d.gutterFiller.style.display = "block";
      d.gutterFiller.style.height = scrollbarWidth(d.measure) + "px";
      d.gutterFiller.style.width = d.gutters.offsetWidth + "px";
    } else d.gutterFiller.style.display = "";

    if (mac_geLion && scrollbarWidth(d.measure) === 0) {
      d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = mac_geMountainLion ? "18px" : "12px";
      d.scrollbarV.style.pointerEvents = d.scrollbarH.style.pointerEvents = "none";
    }
  }

  function visibleLines(display, doc, viewPort) {
    var top = display.scroller.scrollTop, height = display.wrapper.clientHeight;
    if (typeof viewPort == "number") top = viewPort;
    else if (viewPort) {top = viewPort.top; height = viewPort.bottom - viewPort.top;}
    top = Math.floor(top - paddingTop(display));
    var bottom = Math.ceil(top + height);
    return {from: lineAtHeight(doc, top), to: lineAtHeight(doc, bottom)};
  }

  // LINE NUMBERS

  function alignHorizontally(cm) {
    var display = cm.display;
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
    var gutterW = display.gutters.offsetWidth, l = comp + "px";
    for (var n = display.lineDiv.firstChild; n; n = n.nextSibling) if (n.alignable) {
      for (var i = 0, a = n.alignable; i < a.length; ++i) a[i].style.left = l;
    }
    if (cm.options.fixedGutter)
      display.gutters.style.left = (comp + gutterW) + "px";
  }

  function maybeUpdateLineNumberWidth(cm) {
    if (!cm.options.lineNumbers) return false;
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
    if (last.length != display.lineNumChars) {
      var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
      display.lineGutter.style.width = "";
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding);
      display.lineNumWidth = display.lineNumInnerWidth + padding;
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
      display.lineGutter.style.width = display.lineNumWidth + "px";
      return true;
    }
    return false;
  }

  function lineNumberFor(options, i) {
    return String(options.lineNumberFormatter(i + options.firstLineNumber));
  }
  function compensateForHScroll(display) {
    return getRect(display.scroller).left - getRect(display.sizer).left;
  }

  // DISPLAY DRAWING

  function updateDisplay(cm, changes, viewPort, forced) {
    var oldFrom = cm.display.showingFrom, oldTo = cm.display.showingTo, updated;
    var visible = visibleLines(cm.display, cm.doc, viewPort);
    for (var first = true;; first = false) {
      var oldWidth = cm.display.scroller.clientWidth;
      if (!updateDisplayInner(cm, changes, visible, forced)) break;
      updated = true;
      changes = [];
      updateSelection(cm);
      updateScrollbars(cm);
      if (first && cm.options.lineWrapping && oldWidth != cm.display.scroller.clientWidth) {
        forced = true;
        continue;
      }
      forced = false;

      // Clip forced viewport to actual scrollable area
      if (viewPort)
        viewPort = Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight,
                            typeof viewPort == "number" ? viewPort : viewPort.top);
      visible = visibleLines(cm.display, cm.doc, viewPort);
      if (visible.from >= cm.display.showingFrom && visible.to <= cm.display.showingTo)
        break;
    }

    if (updated) {
      signalLater(cm, "update", cm);
      if (cm.display.showingFrom != oldFrom || cm.display.showingTo != oldTo)
        signalLater(cm, "viewportChange", cm, cm.display.showingFrom, cm.display.showingTo);
    }
    return updated;
  }

  // Uses a set of changes plus the current scroll position to
  // determine which DOM updates have to be made, and makes the
  // updates.
  function updateDisplayInner(cm, changes, visible, forced) {
    var display = cm.display, doc = cm.doc;
    if (!display.wrapper.clientWidth) {
      display.showingFrom = display.showingTo = doc.first;
      display.viewOffset = 0;
      return;
    }

    // Bail out if the visible area is already rendered and nothing changed.
    if (!forced && changes.length == 0 &&
        visible.from > display.showingFrom && visible.to < display.showingTo)
      return;

    if (maybeUpdateLineNumberWidth(cm))
      changes = [{from: doc.first, to: doc.first + doc.size}];
    var gutterW = display.sizer.style.marginLeft = display.gutters.offsetWidth + "px";
    display.scrollbarH.style.left = cm.options.fixedGutter ? gutterW : "0";

    // Used to determine which lines need their line numbers updated
    var positionsChangedFrom = Infinity;
    if (cm.options.lineNumbers)
      for (var i = 0; i < changes.length; ++i)
        if (changes[i].diff && changes[i].from < positionsChangedFrom) { positionsChangedFrom = changes[i].from; }

    var end = doc.first + doc.size;
    var from = Math.max(visible.from - cm.options.viewportMargin, doc.first);
    var to = Math.min(end, visible.to + cm.options.viewportMargin);
    if (display.showingFrom < from && from - display.showingFrom < 20) from = Math.max(doc.first, display.showingFrom);
    if (display.showingTo > to && display.showingTo - to < 20) to = Math.min(end, display.showingTo);
    if (sawCollapsedSpans) {
      from = lineNo(visualLine(doc, getLine(doc, from)));
      while (to < end && lineIsHidden(doc, getLine(doc, to))) ++to;
    }

    // Create a range of theoretically intact lines, and punch holes
    // in that using the change info.
    var intact = [{from: Math.max(display.showingFrom, doc.first),
                   to: Math.min(display.showingTo, end)}];
    if (intact[0].from >= intact[0].to) intact = [];
    else intact = computeIntact(intact, changes);
    // When merged lines are present, we might have to reduce the
    // intact ranges because changes in continued fragments of the
    // intact lines do require the lines to be redrawn.
    if (sawCollapsedSpans)
      for (var i = 0; i < intact.length; ++i) {
        var range = intact[i], merged;
        while (merged = collapsedSpanAtEnd(getLine(doc, range.to - 1))) {
          var newTo = merged.find().from.line;
          if (newTo > range.from) range.to = newTo;
          else { intact.splice(i--, 1); break; }
        }
      }

    // Clip off the parts that won't be visible
    var intactLines = 0;
    for (var i = 0; i < intact.length; ++i) {
      var range = intact[i];
      if (range.from < from) range.from = from;
      if (range.to > to) range.to = to;
      if (range.from >= range.to) intact.splice(i--, 1);
      else intactLines += range.to - range.from;
    }
    if (!forced && intactLines == to - from && from == display.showingFrom && to == display.showingTo) {
      updateViewOffset(cm);
      return;
    }
    intact.sort(function(a, b) {return a.from - b.from;});

    // Avoid crashing on IE's "unspecified error" when in iframes
    try {
      var focused = document.activeElement;
    } catch(e) {}
    if (intactLines < (to - from) * .7) display.lineDiv.style.display = "none";
    patchDisplay(cm, from, to, intact, positionsChangedFrom);
    display.lineDiv.style.display = "";
    if (focused && document.activeElement != focused && focused.offsetHeight) focused.focus();

    var different = from != display.showingFrom || to != display.showingTo ||
      display.lastSizeC != display.wrapper.clientHeight;
    // This is just a bogus formula that detects when the editor is
    // resized or the font size changes.
    if (different) {
      display.lastSizeC = display.wrapper.clientHeight;
      startWorker(cm, 400);
    }
    display.showingFrom = from; display.showingTo = to;

    updateHeightsInViewport(cm);
    updateViewOffset(cm);

    return true;
  }

  function updateHeightsInViewport(cm) {
    var display = cm.display;
    var prevBottom = display.lineDiv.offsetTop;
    for (var node = display.lineDiv.firstChild, height; node; node = node.nextSibling) if (node.lineObj) {
      if (ie_lt8) {
        var bot = node.offsetTop + node.offsetHeight;
        height = bot - prevBottom;
        prevBottom = bot;
      } else {
        var box = getRect(node);
        height = box.bottom - box.top;
      }
      var diff = node.lineObj.height - height;
      if (height < 2) height = textHeight(display);
      if (diff > .001 || diff < -.001) {
        updateLineHeight(node.lineObj, height);
        var widgets = node.lineObj.widgets;
        if (widgets) for (var i = 0; i < widgets.length; ++i)
          widgets[i].height = widgets[i].node.offsetHeight;
      }
    }
  }

  function updateViewOffset(cm) {
    var off = cm.display.viewOffset = heightAtLine(cm, getLine(cm.doc, cm.display.showingFrom));
    // Position the mover div to align with the current virtual scroll position
    cm.display.mover.style.top = off + "px";
  }

  function computeIntact(intact, changes) {
    for (var i = 0, l = changes.length || 0; i < l; ++i) {
      var change = changes[i], intact2 = [], diff = change.diff || 0;
      for (var j = 0, l2 = intact.length; j < l2; ++j) {
        var range = intact[j];
        if (change.to <= range.from && change.diff) {
          intact2.push({from: range.from + diff, to: range.to + diff});
        } else if (change.to <= range.from || change.from >= range.to) {
          intact2.push(range);
        } else {
          if (change.from > range.from)
            intact2.push({from: range.from, to: change.from});
          if (change.to < range.to)
            intact2.push({from: change.to + diff, to: range.to + diff});
        }
      }
      intact = intact2;
    }
    return intact;
  }

  function getDimensions(cm) {
    var d = cm.display, left = {}, width = {};
    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
      left[cm.options.gutters[i]] = n.offsetLeft;
      width[cm.options.gutters[i]] = n.offsetWidth;
    }
    return {fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth};
  }

  function patchDisplay(cm, from, to, intact, updateNumbersFrom) {
    var dims = getDimensions(cm);
    var display = cm.display, lineNumbers = cm.options.lineNumbers;
    if (!intact.length && (!webkit || !cm.display.currentWheelTarget))
      removeChildren(display.lineDiv);
    var container = display.lineDiv, cur = container.firstChild;

    function rm(node) {
      var next = node.nextSibling;
      if (webkit && mac && cm.display.currentWheelTarget == node) {
        node.style.display = "none";
        node.lineObj = null;
      } else {
        node.parentNode.removeChild(node);
      }
      return next;
    }

    var nextIntact = intact.shift(), lineN = from;
    cm.doc.iter(from, to, function(line) {
      if (nextIntact && nextIntact.to == lineN) nextIntact = intact.shift();
      if (lineIsHidden(cm.doc, line)) {
        if (line.height != 0) updateLineHeight(line, 0);
        if (line.widgets && cur && cur.previousSibling) for (var i = 0; i < line.widgets.length; ++i) {
          var w = line.widgets[i];
          if (w.showIfHidden) {
            var prev = cur.previousSibling;
            if (/pre/i.test(prev.nodeName)) {
              var wrap = elt("div", null, null, "position: relative");
              prev.parentNode.replaceChild(wrap, prev);
              wrap.appendChild(prev);
              prev = wrap;
            }
            var wnode = prev.appendChild(elt("div", [w.node], "CodeMirror-linewidget"));
            if (!w.handleMouseEvents) wnode.ignoreEvents = true;
            positionLineWidget(w, wnode, prev, dims);
          }
        }
      } else if (nextIntact && nextIntact.from <= lineN && nextIntact.to > lineN) {
        // This line is intact. Skip to the actual node. Update its
        // line number if needed.
        while (cur.lineObj != line) cur = rm(cur);
        if (lineNumbers && updateNumbersFrom <= lineN && cur.lineNumber)
          setTextContent(cur.lineNumber, lineNumberFor(cm.options, lineN));
        cur = cur.nextSibling;
      } else {
        // For lines with widgets, make an attempt to find and reuse
        // the existing element, so that widgets aren't needlessly
        // removed and re-inserted into the dom
        if (line.widgets) for (var j = 0, search = cur, reuse; search && j < 20; ++j, search = search.nextSibling)
          if (search.lineObj == line && /div/i.test(search.nodeName)) { reuse = search; break; }
        // This line needs to be generated.
        var lineNode = buildLineElement(cm, line, lineN, dims, reuse);
        if (lineNode != reuse) {
          container.insertBefore(lineNode, cur);
        } else {
          while (cur != reuse) cur = rm(cur);
          cur = cur.nextSibling;
        }

        lineNode.lineObj = line;
      }
      ++lineN;
    });
    while (cur) cur = rm(cur);
  }

  function buildLineElement(cm, line, lineNo, dims, reuse) {
    var built = buildLineContent(cm, line), lineElement = built.pre;
    var markers = line.gutterMarkers, display = cm.display, wrap;

    var bgClass = built.bgClass ? built.bgClass + " " + (line.bgClass || "") : line.bgClass;
    if (!cm.options.lineNumbers && !markers && !bgClass && !line.wrapClass && !line.widgets)
      return lineElement;

    // Lines with gutter elements, widgets or a background class need
    // to be wrapped again, and have the extra elements added to the
    // wrapper div

    if (reuse) {
      reuse.alignable = null;
      var isOk = true, widgetsSeen = 0, insertBefore = null;
      for (var n = reuse.firstChild, next; n; n = next) {
        next = n.nextSibling;
        if (!/\bCodeMirror-linewidget\b/.test(n.className)) {
          reuse.removeChild(n);
        } else {
          for (var i = 0; i < line.widgets.length; ++i) {
            var widget = line.widgets[i];
            if (widget.node == n.firstChild) {
              if (!widget.above && !insertBefore) insertBefore = n;
              positionLineWidget(widget, n, reuse, dims);
              ++widgetsSeen;
              break;
            }
          }
          if (i == line.widgets.length) { isOk = false; break; }
        }
      }
      reuse.insertBefore(lineElement, insertBefore);
      if (isOk && widgetsSeen == line.widgets.length) {
        wrap = reuse;
        reuse.className = line.wrapClass || "";
      }
    }
    if (!wrap) {
      wrap = elt("div", null, line.wrapClass, "position: relative");
      wrap.appendChild(lineElement);
    }
    // Kludge to make sure the styled element lies behind the selection (by z-index)
    if (bgClass)
      wrap.insertBefore(elt("div", null, bgClass + " CodeMirror-linebackground"), wrap.firstChild);
    if (cm.options.lineNumbers || markers) {
      var gutterWrap = wrap.insertBefore(elt("div", null, null, "position: absolute; left: " +
                                             (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"),
                                         wrap.firstChild);
      if (cm.options.fixedGutter) (wrap.alignable || (wrap.alignable = [])).push(gutterWrap);
      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
        wrap.lineNumber = gutterWrap.appendChild(
          elt("div", lineNumberFor(cm.options, lineNo),
              "CodeMirror-linenumber CodeMirror-gutter-elt",
              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
              + display.lineNumInnerWidth + "px"));
      if (markers)
        for (var k = 0; k < cm.options.gutters.length; ++k) {
          var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
          if (found)
            gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
                                       dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
        }
    }
    if (ie_lt8) wrap.style.zIndex = 2;
    if (line.widgets && wrap != reuse) for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
      if (!widget.handleMouseEvents) node.ignoreEvents = true;
      positionLineWidget(widget, node, wrap, dims);
      if (widget.above)
        wrap.insertBefore(node, cm.options.lineNumbers && line.height != 0 ? gutterWrap : lineElement);
      else
        wrap.appendChild(node);
      signalLater(widget, "redraw");
    }
    return wrap;
  }

  function positionLineWidget(widget, node, wrap, dims) {
    if (widget.noHScroll) {
      (wrap.alignable || (wrap.alignable = [])).push(node);
      var width = dims.wrapperWidth;
      node.style.left = dims.fixedPos + "px";
      if (!widget.coverGutter) {
        width -= dims.gutterTotalWidth;
        node.style.paddingLeft = dims.gutterTotalWidth + "px";
      }
      node.style.width = width + "px";
    }
    if (widget.coverGutter) {
      node.style.zIndex = 5;
      node.style.position = "relative";
      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
    }
  }

  // SELECTION / CURSOR

  function updateSelection(cm) {
    var display = cm.display;
    var collapsed = posEq(cm.doc.sel.from, cm.doc.sel.to);
    if (collapsed || cm.options.showCursorWhenSelecting)
      updateSelectionCursor(cm);
    else
      display.cursor.style.display = display.otherCursor.style.display = "none";
    if (!collapsed)
      updateSelectionRange(cm);
    else
      display.selectionDiv.style.display = "none";

    // Move the hidden textarea near the cursor to prevent scrolling artifacts
    if (cm.options.moveInputWithCursor) {
      var headPos = cursorCoords(cm, cm.doc.sel.head, "div");
      var wrapOff = getRect(display.wrapper), lineOff = getRect(display.lineDiv);
      display.inputDiv.style.top = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                                        headPos.top + lineOff.top - wrapOff.top)) + "px";
      display.inputDiv.style.left = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                                         headPos.left + lineOff.left - wrapOff.left)) + "px";
    }
  }

  // No selection, plain cursor
  function updateSelectionCursor(cm) {
    var display = cm.display, pos = cursorCoords(cm, cm.doc.sel.head, "div");
    display.cursor.style.left = pos.left + "px";
    display.cursor.style.top = pos.top + "px";
    display.cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
    display.cursor.style.display = "";

    if (pos.other) {
      display.otherCursor.style.display = "";
      display.otherCursor.style.left = pos.other.left + "px";
      display.otherCursor.style.top = pos.other.top + "px";
      display.otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
    } else { display.otherCursor.style.display = "none"; }
  }

  // Highlight selection
  function updateSelectionRange(cm) {
    var display = cm.display, doc = cm.doc, sel = cm.doc.sel;
    var fragment = document.createDocumentFragment();
    var clientWidth = display.lineSpace.offsetWidth, pl = paddingLeft(cm.display);

    function add(left, top, width, bottom) {
      if (top < 0) top = 0;
      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
                               "px; top: " + top + "px; width: " + (width == null ? clientWidth - left : width) +
                               "px; height: " + (bottom - top) + "px"));
    }

    function drawForLine(line, fromArg, toArg) {
      var lineObj = getLine(doc, line);
      var lineLen = lineObj.text.length;
      var start, end;
      function coords(ch, bias) {
        return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
      }

      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
        var leftPos = coords(from, "left"), rightPos, left, right;
        if (from == to) {
          rightPos = leftPos;
          left = right = leftPos.left;
        } else {
          rightPos = coords(to - 1, "right");
          if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
          left = leftPos.left;
          right = rightPos.right;
        }
        if (fromArg == null && from == 0) left = pl;
        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
          add(left, leftPos.top, null, leftPos.bottom);
          left = pl;
          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
        }
        if (toArg == null && to == lineLen) right = clientWidth;
        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
          start = leftPos;
        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
          end = rightPos;
        if (left < pl + 1) left = pl;
        add(left, rightPos.top, right - left, rightPos.bottom);
      });
      return {start: start, end: end};
    }

    if (sel.from.line == sel.to.line) {
      drawForLine(sel.from.line, sel.from.ch, sel.to.ch);
    } else {
      var fromLine = getLine(doc, sel.from.line), toLine = getLine(doc, sel.to.line);
      var singleVLine = visualLine(doc, fromLine) == visualLine(doc, toLine);
      var leftEnd = drawForLine(sel.from.line, sel.from.ch, singleVLine ? fromLine.text.length : null).end;
      var rightStart = drawForLine(sel.to.line, singleVLine ? 0 : null, sel.to.ch).start;
      if (singleVLine) {
        if (leftEnd.top < rightStart.top - 2) {
          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
          add(pl, rightStart.top, rightStart.left, rightStart.bottom);
        } else {
          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
        }
      }
      if (leftEnd.bottom < rightStart.top)
        add(pl, leftEnd.bottom, null, rightStart.top);
    }

    removeChildrenAndAdd(display.selectionDiv, fragment);
    display.selectionDiv.style.display = "";
  }

  // Cursor-blinking
  function restartBlink(cm) {
    if (!cm.state.focused) return;
    var display = cm.display;
    clearInterval(display.blinker);
    var on = true;
    display.cursor.style.visibility = display.otherCursor.style.visibility = "";
    if (cm.options.cursorBlinkRate > 0)
      display.blinker = setInterval(function() {
        display.cursor.style.visibility = display.otherCursor.style.visibility = (on = !on) ? "" : "hidden";
      }, cm.options.cursorBlinkRate);
  }

  // HIGHLIGHT WORKER

  function startWorker(cm, time) {
    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.showingTo)
      cm.state.highlight.set(time, bind(highlightWorker, cm));
  }

  function highlightWorker(cm) {
    var doc = cm.doc;
    if (doc.frontier < doc.first) doc.frontier = doc.first;
    if (doc.frontier >= cm.display.showingTo) return;
    var end = +new Date + cm.options.workTime;
    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
    var changed = [], prevChange;
    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.showingTo + 500), function(line) {
      if (doc.frontier >= cm.display.showingFrom) { // Visible
        var oldStyles = line.styles;
        line.styles = highlightLine(cm, line, state);
        var ischange = !oldStyles || oldStyles.length != line.styles.length;
        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
        if (ischange) {
          if (prevChange && prevChange.end == doc.frontier) prevChange.end++;
          else changed.push(prevChange = {start: doc.frontier, end: doc.frontier + 1});
        }
        line.stateAfter = copyState(doc.mode, state);
      } else {
        processLine(cm, line, state);
        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
      }
      ++doc.frontier;
      if (+new Date > end) {
        startWorker(cm, cm.options.workDelay);
        return true;
      }
    });
    if (changed.length)
      operation(cm, function() {
        for (var i = 0; i < changed.length; ++i)
          regChange(this, changed[i].start, changed[i].end);
      })();
  }

  // Finds the line to start with when starting a parse. Tries to
  // find a line with a stateAfter, so that it can start with a
  // valid state. If that fails, it returns the line with the
  // smallest indentation, which tends to need the least context to
  // parse correctly.
  function findStartLine(cm, n, precise) {
    var minindent, minline, doc = cm.doc;
    var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
    for (var search = n; search > lim; --search) {
      if (search <= doc.first) return doc.first;
      var line = getLine(doc, search - 1);
      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
      var indented = countColumn(line.text, null, cm.options.tabSize);
      if (minline == null || minindent > indented) {
        minline = search - 1;
        minindent = indented;
      }
    }
    return minline;
  }

  function getStateBefore(cm, n, precise) {
    var doc = cm.doc, display = cm.display;
    if (!doc.mode.startState) return true;
    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
    if (!state) state = startState(doc.mode);
    else state = copyState(doc.mode, state);
    doc.iter(pos, n, function(line) {
      processLine(cm, line, state);
      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.showingFrom && pos < display.showingTo;
      line.stateAfter = save ? copyState(doc.mode, state) : null;
      ++pos;
    });
    if (precise) doc.frontier = pos;
    return state;
  }

  // POSITION MEASUREMENT

  function paddingTop(display) {return display.lineSpace.offsetTop;}
  function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
  function paddingLeft(display) {
    var e = removeChildrenAndAdd(display.measure, elt("pre", null, null, "text-align: left")).appendChild(elt("span", "x"));
    return e.offsetLeft;
  }

  function measureChar(cm, line, ch, data, bias) {
    var dir = -1;
    data = data || measureLine(cm, line);
    if (data.crude) {
      var left = data.left + ch * data.width;
      return {left: left, right: left + data.width, top: data.top, bottom: data.bottom};
    }

    for (var pos = ch;; pos += dir) {
      var r = data[pos];
      if (r) break;
      if (dir < 0 && pos == 0) dir = 1;
    }
    bias = pos > ch ? "left" : pos < ch ? "right" : bias;
    if (bias == "left" && r.leftSide) r = r.leftSide;
    else if (bias == "right" && r.rightSide) r = r.rightSide;
    return {left: pos < ch ? r.right : r.left,
            right: pos > ch ? r.left : r.right,
            top: r.top,
            bottom: r.bottom};
  }

  function findCachedMeasurement(cm, line) {
    var cache = cm.display.measureLineCache;
    for (var i = 0; i < cache.length; ++i) {
      var memo = cache[i];
      if (memo.text == line.text && memo.markedSpans == line.markedSpans &&
          cm.display.scroller.clientWidth == memo.width &&
          memo.classes == line.textClass + "|" + line.wrapClass)
        return memo;
    }
  }

  function clearCachedMeasurement(cm, line) {
    var exists = findCachedMeasurement(cm, line);
    if (exists) exists.text = exists.measure = exists.markedSpans = null;
  }

  function measureLine(cm, line) {
    // First look in the cache
    var cached = findCachedMeasurement(cm, line);
    if (cached) return cached.measure;

    // Failing that, recompute and store result in cache
    var measure = measureLineInner(cm, line);
    var cache = cm.display.measureLineCache;
    var memo = {text: line.text, width: cm.display.scroller.clientWidth,
                markedSpans: line.markedSpans, measure: measure,
                classes: line.textClass + "|" + line.wrapClass};
    if (cache.length == 16) cache[++cm.display.measureLineCachePos % 16] = memo;
    else cache.push(memo);
    return measure;
  }

  function measureLineInner(cm, line) {
    if (!cm.options.lineWrapping && line.text.length >= cm.options.crudeMeasuringFrom)
      return crudelyMeasureLine(cm, line);

    var display = cm.display, measure = emptyArray(line.text.length);
    var pre = buildLineContent(cm, line, measure, true).pre;

    // IE does not cache element positions of inline elements between
    // calls to getBoundingClientRect. This makes the loop below,
    // which gathers the positions of all the characters on the line,
    // do an amount of layout work quadratic to the number of
    // characters. When line wrapping is off, we try to improve things
    // by first subdividing the line into a bunch of inline blocks, so
    // that IE can reuse most of the layout information from caches
    // for those blocks. This does interfere with line wrapping, so it
    // doesn't work when wrapping is on, but in that case the
    // situation is slightly better, since IE does cache line-wrapping
    // information and only recomputes per-line.
    if (ie && !ie_lt8 && !cm.options.lineWrapping && pre.childNodes.length > 100) {
      var fragment = document.createDocumentFragment();
      var chunk = 10, n = pre.childNodes.length;
      for (var i = 0, chunks = Math.ceil(n / chunk); i < chunks; ++i) {
        var wrap = elt("div", null, null, "display: inline-block");
        for (var j = 0; j < chunk && n; ++j) {
          wrap.appendChild(pre.firstChild);
          --n;
        }
        fragment.appendChild(wrap);
      }
      pre.appendChild(fragment);
    }

    removeChildrenAndAdd(display.measure, pre);

    var outer = getRect(display.lineDiv);
    var vranges = [], data = emptyArray(line.text.length), maxBot = pre.offsetHeight;
    // Work around an IE7/8 bug where it will sometimes have randomly
    // replaced our pre with a clone at this point.
    if (ie_lt9 && display.measure.first != pre)
      removeChildrenAndAdd(display.measure, pre);

    function measureRect(rect) {
      var top = rect.top - outer.top, bot = rect.bottom - outer.top;
      if (bot > maxBot) bot = maxBot;
      if (top < 0) top = 0;
      for (var i = vranges.length - 2; i >= 0; i -= 2) {
        var rtop = vranges[i], rbot = vranges[i+1];
        if (rtop > bot || rbot < top) continue;
        if (rtop <= top && rbot >= bot ||
            top <= rtop && bot >= rbot ||
            Math.min(bot, rbot) - Math.max(top, rtop) >= (bot - top) >> 1) {
          vranges[i] = Math.min(top, rtop);
          vranges[i+1] = Math.max(bot, rbot);
          break;
        }
      }
      if (i < 0) { i = vranges.length; vranges.push(top, bot); }
      return {left: rect.left - outer.left,
              right: rect.right - outer.left,
              top: i, bottom: null};
    }
    function finishRect(rect) {
      rect.bottom = vranges[rect.top+1];
      rect.top = vranges[rect.top];
    }

    for (var i = 0, cur; i < measure.length; ++i) if (cur = measure[i]) {
      var node = cur, rect = null;
      // A widget might wrap, needs special care
      if (/\bCodeMirror-widget\b/.test(cur.className) && cur.getClientRects) {
        if (cur.firstChild.nodeType == 1) node = cur.firstChild;
        var rects = node.getClientRects();
        if (rects.length > 1) {
          rect = data[i] = measureRect(rects[0]);
          rect.rightSide = measureRect(rects[rects.length - 1]);
        }
      }
      if (!rect) rect = data[i] = measureRect(getRect(node));
      if (cur.measureRight) rect.right = getRect(cur.measureRight).left;
      if (cur.leftSide) rect.leftSide = measureRect(getRect(cur.leftSide));
    }
    removeChildren(cm.display.measure);
    for (var i = 0, cur; i < data.length; ++i) if (cur = data[i]) {
      finishRect(cur);
      if (cur.leftSide) finishRect(cur.leftSide);
      if (cur.rightSide) finishRect(cur.rightSide);
    }
    return data;
  }

  function crudelyMeasureLine(cm, line) {
    var copy = new Line(line.text.slice(0, 100), null);
    if (line.textClass) copy.textClass = line.textClass;
    var measure = measureLineInner(cm, copy);
    var left = measureChar(cm, copy, 0, measure, "left");
    var right = measureChar(cm, copy, 99, measure, "right");
    return {crude: true, top: left.top, left: left.left, bottom: left.bottom, width: (right.right - left.left) / 100};
  }

  function measureLineWidth(cm, line) {
    var hasBadSpan = false;
    if (line.markedSpans) for (var i = 0; i < line.markedSpans; ++i) {
      var sp = line.markedSpans[i];
      if (sp.collapsed && (sp.to == null || sp.to == line.text.length)) hasBadSpan = true;
    }
    var cached = !hasBadSpan && findCachedMeasurement(cm, line);
    if (cached || line.text.length >= cm.options.crudeMeasuringFrom)
      return measureChar(cm, line, line.text.length, cached && cached.measure, "right").right;

    var pre = buildLineContent(cm, line, null, true).pre;
    var end = pre.appendChild(zeroWidthElement(cm.display.measure));
    removeChildrenAndAdd(cm.display.measure, pre);
    return getRect(end).right - getRect(cm.display.lineDiv).left;
  }

  function clearCaches(cm) {
    cm.display.measureLineCache.length = cm.display.measureLineCachePos = 0;
    cm.display.cachedCharWidth = cm.display.cachedTextHeight = null;
    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
    cm.display.lineNumChars = null;
  }

  function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
  function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }

  // Context is one of "line", "div" (display.lineDiv), "local"/null (editor), or "page"
  function intoCoordSystem(cm, lineObj, rect, context) {
    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
      var size = widgetHeight(lineObj.widgets[i]);
      rect.top += size; rect.bottom += size;
    }
    if (context == "line") return rect;
    if (!context) context = "local";
    var yOff = heightAtLine(cm, lineObj);
    if (context == "local") yOff += paddingTop(cm.display);
    else yOff -= cm.display.viewOffset;
    if (context == "page" || context == "window") {
      var lOff = getRect(cm.display.lineSpace);
      yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
      var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
      rect.left += xOff; rect.right += xOff;
    }
    rect.top += yOff; rect.bottom += yOff;
    return rect;
  }

  // Context may be "window", "page", "div", or "local"/null
  // Result is in "div" coords
  function fromCoordSystem(cm, coords, context) {
    if (context == "div") return coords;
    var left = coords.left, top = coords.top;
    // First move into "page" coordinate system
    if (context == "page") {
      left -= pageScrollX();
      top -= pageScrollY();
    } else if (context == "local" || !context) {
      var localBox = getRect(cm.display.sizer);
      left += localBox.left;
      top += localBox.top;
    }

    var lineSpaceBox = getRect(cm.display.lineSpace);
    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
  }

  function charCoords(cm, pos, context, lineObj, bias) {
    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, null, bias), context);
  }

  function cursorCoords(cm, pos, context, lineObj, measurement) {
    lineObj = lineObj || getLine(cm.doc, pos.line);
    if (!measurement) measurement = measureLine(cm, lineObj);
    function get(ch, right) {
      var m = measureChar(cm, lineObj, ch, measurement, right ? "right" : "left");
      if (right) m.left = m.right; else m.right = m.left;
      return intoCoordSystem(cm, lineObj, m, context);
    }
    function getBidi(ch, partPos) {
      var part = order[partPos], right = part.level % 2;
      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
        part = order[--partPos];
        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
        right = true;
      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
        part = order[++partPos];
        ch = bidiLeft(part) - part.level % 2;
        right = false;
      }
      if (right && ch == part.to && ch > part.from) return get(ch - 1);
      return get(ch, right);
    }
    var order = getOrder(lineObj), ch = pos.ch;
    if (!order) return get(ch);
    var partPos = getBidiPartAt(order, ch);
    var val = getBidi(ch, partPos);
    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
    return val;
  }

  function PosWithInfo(line, ch, outside, xRel) {
    var pos = new Pos(line, ch);
    pos.xRel = xRel;
    if (outside) pos.outside = true;
    return pos;
  }

  // Coords must be lineSpace-local
  function coordsChar(cm, x, y) {
    var doc = cm.doc;
    y += cm.display.viewOffset;
    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
    var lineNo = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
    if (lineNo > last)
      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
    if (x < 0) x = 0;

    for (;;) {
      var lineObj = getLine(doc, lineNo);
      var found = coordsCharInner(cm, lineObj, lineNo, x, y);
      var merged = collapsedSpanAtEnd(lineObj);
      var mergedPos = merged && merged.find();
      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
        lineNo = mergedPos.to.line;
      else
        return found;
    }
  }

  function coordsCharInner(cm, lineObj, lineNo, x, y) {
    var innerOff = y - heightAtLine(cm, lineObj);
    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
    var measurement = measureLine(cm, lineObj);

    function getX(ch) {
      var sp = cursorCoords(cm, Pos(lineNo, ch), "line",
                            lineObj, measurement);
      wrongLine = true;
      if (innerOff > sp.bottom) return sp.left - adjust;
      else if (innerOff < sp.top) return sp.left + adjust;
      else wrongLine = false;
      return sp.left;
    }

    var bidi = getOrder(lineObj), dist = lineObj.text.length;
    var from = lineLeft(lineObj), to = lineRight(lineObj);
    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
    // Do a binary search between these bounds.
    for (;;) {
      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
        var ch = x < fromX || x - fromX <= toX - x ? from : to;
        var xDiff = x - (ch == from ? fromX : toX);
        while (isExtendingChar.test(lineObj.text.charAt(ch))) ++ch;
        var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
                              xDiff < 0 ? -1 : xDiff ? 1 : 0);
        return pos;
      }
      var step = Math.ceil(dist / 2), middle = from + step;
      if (bidi) {
        middle = from;
        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
      }
      var middleX = getX(middle);
      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
    }
  }

  var measureText;
  function textHeight(display) {
    if (display.cachedTextHeight != null) return display.cachedTextHeight;
    if (measureText == null) {
      measureText = elt("pre");
      // Measure a bunch of lines, for browsers that compute
      // fractional heights.
      for (var i = 0; i < 49; ++i) {
        measureText.appendChild(document.createTextNode("x"));
        measureText.appendChild(elt("br"));
      }
      measureText.appendChild(document.createTextNode("x"));
    }
    removeChildrenAndAdd(display.measure, measureText);
    var height = measureText.offsetHeight / 50;
    if (height > 3) display.cachedTextHeight = height;
    removeChildren(display.measure);
    return height || 1;
  }

  function charWidth(display) {
    if (display.cachedCharWidth != null) return display.cachedCharWidth;
    var anchor = elt("span", "x");
    var pre = elt("pre", [anchor]);
    removeChildrenAndAdd(display.measure, pre);
    var width = anchor.offsetWidth;
    if (width > 2) display.cachedCharWidth = width;
    return width || 10;
  }

  // OPERATIONS

  // Operations are used to wrap changes in such a way that each
  // change won't have to update the cursor and display (which would
  // be awkward, slow, and error-prone), but instead updates are
  // batched and then all combined and executed at once.

  var nextOpId = 0;
  function startOperation(cm) {
    cm.curOp = {
      // An array of ranges of lines that have to be updated. See
      // updateDisplay.
      changes: [],
      forceUpdate: false,
      updateInput: null,
      userSelChange: null,
      textChanged: null,
      selectionChanged: false,
      cursorActivity: false,
      updateMaxLine: false,
      updateScrollPos: false,
      id: ++nextOpId
    };
    if (!delayedCallbackDepth++) delayedCallbacks = [];
  }

  function endOperation(cm) {
    var op = cm.curOp, doc = cm.doc, display = cm.display;
    cm.curOp = null;

    if (op.updateMaxLine) computeMaxLength(cm);
    if (display.maxLineChanged && !cm.options.lineWrapping && display.maxLine) {
      var width = measureLineWidth(cm, display.maxLine);
      display.sizer.style.minWidth = Math.max(0, width + 3 + scrollerCutOff) + "px";
      display.maxLineChanged = false;
      var maxScrollLeft = Math.max(0, display.sizer.offsetLeft + display.sizer.offsetWidth - display.scroller.clientWidth);
      if (maxScrollLeft < doc.scrollLeft && !op.updateScrollPos)
        setScrollLeft(cm, Math.min(display.scroller.scrollLeft, maxScrollLeft), true);
    }
    var newScrollPos, updated;
    if (op.updateScrollPos) {
      newScrollPos = op.updateScrollPos;
    } else if (op.selectionChanged && display.scroller.clientHeight) { // don't rescroll if not visible
      var coords = cursorCoords(cm, doc.sel.head);
      newScrollPos = calculateScrollPos(cm, coords.left, coords.top, coords.left, coords.bottom);
    }
    if (op.changes.length || op.forceUpdate || newScrollPos && newScrollPos.scrollTop != null) {
      updated = updateDisplay(cm, op.changes, newScrollPos && newScrollPos.scrollTop, op.forceUpdate);
      if (cm.display.scroller.offsetHeight) cm.doc.scrollTop = cm.display.scroller.scrollTop;
    }
    if (!updated && op.selectionChanged) updateSelection(cm);
    if (op.updateScrollPos) {
      display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = newScrollPos.scrollTop;
      display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = newScrollPos.scrollLeft;
      alignHorizontally(cm);
      if (op.scrollToPos)
        scrollPosIntoView(cm, clipPos(cm.doc, op.scrollToPos), op.scrollToPosMargin);
    } else if (newScrollPos) {
      scrollCursorIntoView(cm);
    }
    if (op.selectionChanged) restartBlink(cm);

    if (cm.state.focused && op.updateInput)
      resetInput(cm, op.userSelChange);

    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
    if (hidden) for (var i = 0; i < hidden.length; ++i)
      if (!hidden[i].lines.length) signal(hidden[i], "hide");
    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");

    var delayed;
    if (!--delayedCallbackDepth) {
      delayed = delayedCallbacks;
      delayedCallbacks = null;
    }
    if (op.textChanged)
      signal(cm, "change", cm, op.textChanged);
    if (op.cursorActivity) signal(cm, "cursorActivity", cm);
    if (delayed) for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  // Wraps a function in an operation. Returns the wrapped function.
  function operation(cm1, f) {
    return function() {
      var cm = cm1 || this, withOp = !cm.curOp;
      if (withOp) startOperation(cm);
      try { var result = f.apply(cm, arguments); }
      finally { if (withOp) endOperation(cm); }
      return result;
    };
  }
  function docOperation(f) {
    return function() {
      var withOp = this.cm && !this.cm.curOp, result;
      if (withOp) startOperation(this.cm);
      try { result = f.apply(this, arguments); }
      finally { if (withOp) endOperation(this.cm); }
      return result;
    };
  }
  function runInOp(cm, f) {
    var withOp = !cm.curOp, result;
    if (withOp) startOperation(cm);
    try { result = f(); }
    finally { if (withOp) endOperation(cm); }
    return result;
  }

  function regChange(cm, from, to, lendiff) {
    if (from == null) from = cm.doc.first;
    if (to == null) to = cm.doc.first + cm.doc.size;
    cm.curOp.changes.push({from: from, to: to, diff: lendiff});
  }

  // INPUT HANDLING

  function slowPoll(cm) {
    if (cm.display.pollingFast) return;
    cm.display.poll.set(cm.options.pollInterval, function() {
      readInput(cm);
      if (cm.state.focused) slowPoll(cm);
    });
  }

  function fastPoll(cm) {
    var missed = false;
    cm.display.pollingFast = true;
    function p() {
      var changed = readInput(cm);
      if (!changed && !missed) {missed = true; cm.display.poll.set(60, p);}
      else {cm.display.pollingFast = false; slowPoll(cm);}
    }
    cm.display.poll.set(20, p);
  }

  // prevInput is a hack to work with IME. If we reset the textarea
  // on every change, that breaks IME. So we look for changes
  // compared to the previous content instead. (Modern browsers have
  // events that indicate IME taking place, but these are not widely
  // supported or compatible enough yet to rely on.)
  function readInput(cm) {
    var input = cm.display.input, prevInput = cm.display.prevInput, doc = cm.doc, sel = doc.sel;
    if (!cm.state.focused || hasSelection(input) || isReadOnly(cm) || cm.state.disableInput) return false;
    if (cm.state.pasteIncoming && cm.state.fakedLastChar) {
      input.value = input.value.substring(0, input.value.length - 1);
      cm.state.fakedLastChar = false;
    }
    var text = input.value;
    if (text == prevInput && posEq(sel.from, sel.to)) return false;
    if (ie && !ie_lt9 && cm.display.inputHasSelection === text) {
      resetInput(cm, true);
      return false;
    }

    var withOp = !cm.curOp;
    if (withOp) startOperation(cm);
    sel.shift = false;
    var same = 0, l = Math.min(prevInput.length, text.length);
    while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;
    var from = sel.from, to = sel.to;
    if (same < prevInput.length)
      from = Pos(from.line, from.ch - (prevInput.length - same));
    else if (cm.state.overwrite && posEq(from, to) && !cm.state.pasteIncoming)
      to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + (text.length - same)));

    var updateInput = cm.curOp.updateInput;
    var changeEvent = {from: from, to: to, text: splitLines(text.slice(same)),
                       origin: cm.state.pasteIncoming ? "paste" : "+input"};
    makeChange(cm.doc, changeEvent, "end");
    cm.curOp.updateInput = updateInput;
    signalLater(cm, "inputRead", cm, changeEvent);

    if (text.length > 1000 || text.indexOf("\n") > -1) input.value = cm.display.prevInput = "";
    else cm.display.prevInput = text;
    if (withOp) endOperation(cm);
    cm.state.pasteIncoming = false;
    return true;
  }

  function resetInput(cm, user) {
    var minimal, selected, doc = cm.doc;
    if (!posEq(doc.sel.from, doc.sel.to)) {
      cm.display.prevInput = "";
      minimal = hasCopyEvent &&
        (doc.sel.to.line - doc.sel.from.line > 100 || (selected = cm.getSelection()).length > 1000);
      var content = minimal ? "-" : selected || cm.getSelection();
      cm.display.input.value = content;
      if (cm.state.focused) selectInput(cm.display.input);
      if (ie && !ie_lt9) cm.display.inputHasSelection = content;
    } else if (user) {
      cm.display.prevInput = cm.display.input.value = "";
      if (ie && !ie_lt9) cm.display.inputHasSelection = null;
    }
    cm.display.inaccurateSelection = minimal;
  }

  function focusInput(cm) {
    if (cm.options.readOnly != "nocursor" && (!mobile || document.activeElement != cm.display.input))
      cm.display.input.focus();
  }

  function isReadOnly(cm) {
    return cm.options.readOnly || cm.doc.cantEdit;
  }

  // EVENT HANDLERS

  function registerEventHandlers(cm) {
    var d = cm.display;
    on(d.scroller, "mousedown", operation(cm, onMouseDown));
    if (ie)
      on(d.scroller, "dblclick", operation(cm, function(e) {
        if (signalDOMEvent(cm, e)) return;
        var pos = posFromMouse(cm, e);
        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
        e_preventDefault(e);
        var word = findWordAt(getLine(cm.doc, pos.line).text, pos);
        extendSelection(cm.doc, word.from, word.to);
      }));
    else
      on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
    on(d.lineSpace, "selectstart", function(e) {
      if (!eventInWidget(d, e)) e_preventDefault(e);
    });
    // Gecko browsers fire contextmenu *after* opening the menu, at
    // which point we can't mess with it anymore. Context menu is
    // handled in onMouseDown for Gecko.
    if (!captureMiddleClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});

    on(d.scroller, "scroll", function() {
      if (d.scroller.clientHeight) {
        setScrollTop(cm, d.scroller.scrollTop);
        setScrollLeft(cm, d.scroller.scrollLeft, true);
        signal(cm, "scroll", cm);
      }
    });
    on(d.scrollbarV, "scroll", function() {
      if (d.scroller.clientHeight) setScrollTop(cm, d.scrollbarV.scrollTop);
    });
    on(d.scrollbarH, "scroll", function() {
      if (d.scroller.clientHeight) setScrollLeft(cm, d.scrollbarH.scrollLeft);
    });

    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});

    function reFocus() { if (cm.state.focused) setTimeout(bind(focusInput, cm), 0); }
    on(d.scrollbarH, "mousedown", reFocus);
    on(d.scrollbarV, "mousedown", reFocus);
    // Prevent wrapper from ever scrolling
    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });

    var resizeTimer;
    function onResize() {
      if (resizeTimer == null) resizeTimer = setTimeout(function() {
        resizeTimer = null;
        // Might be a text scaling operation, clear size caches.
        d.cachedCharWidth = d.cachedTextHeight = knownScrollbarWidth = null;
        clearCaches(cm);
        runInOp(cm, bind(regChange, cm));
      }, 100);
    }
    on(window, "resize", onResize);
    // Above handler holds on to the editor and its data structures.
    // Here we poll to unregister it when the editor is no longer in
    // the document, so that it can be garbage-collected.
    function unregister() {
      for (var p = d.wrapper.parentNode; p && p != document.body; p = p.parentNode) {}
      if (p) setTimeout(unregister, 5000);
      else off(window, "resize", onResize);
    }
    setTimeout(unregister, 5000);

    on(d.input, "keyup", operation(cm, function(e) {
      if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
      if (e.keyCode == 16) cm.doc.sel.shift = false;
    }));
    on(d.input, "input", function() {
      if (ie && !ie_lt9 && cm.display.inputHasSelection) cm.display.inputHasSelection = null;
      fastPoll(cm);
    });
    on(d.input, "keydown", operation(cm, onKeyDown));
    on(d.input, "keypress", operation(cm, onKeyPress));
    on(d.input, "focus", bind(onFocus, cm));
    on(d.input, "blur", bind(onBlur, cm));

    function drag_(e) {
      if (signalDOMEvent(cm, e) || cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))) return;
      e_stop(e);
    }
    if (cm.options.dragDrop) {
      on(d.scroller, "dragstart", function(e){onDragStart(cm, e);});
      on(d.scroller, "dragenter", drag_);
      on(d.scroller, "dragover", drag_);
      on(d.scroller, "drop", operation(cm, onDrop));
    }
    on(d.scroller, "paste", function(e) {
      if (eventInWidget(d, e)) return;
      focusInput(cm);
      fastPoll(cm);
    });
    on(d.input, "paste", function() {
      // Workaround for webkit bug https://bugs.webkit.org/show_bug.cgi?id=90206
      // Add a char to the end of textarea before paste occur so that
      // selection doesn't span to the end of textarea.
      if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
        var start = d.input.selectionStart, end = d.input.selectionEnd;
        d.input.value += "$";
        d.input.selectionStart = start;
        d.input.selectionEnd = end;
        cm.state.fakedLastChar = true;
      }
      cm.state.pasteIncoming = true;
      fastPoll(cm);
    });

    function prepareCopy() {
      if (d.inaccurateSelection) {
        d.prevInput = "";
        d.inaccurateSelection = false;
        d.input.value = cm.getSelection();
        selectInput(d.input);
      }
    }
    on(d.input, "cut", prepareCopy);
    on(d.input, "copy", prepareCopy);

    // Needed to handle Tab key in KHTML
    if (khtml) on(d.sizer, "mouseup", function() {
        if (document.activeElement == d.input) d.input.blur();
        focusInput(cm);
    });
  }

  function eventInWidget(display, e) {
    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
      if (!n || n.ignoreEvents || n.parentNode == display.sizer && n != display.mover) return true;
    }
  }

  function posFromMouse(cm, e, liberal) {
    var display = cm.display;
    if (!liberal) {
      var target = e_target(e);
      if (target == display.scrollbarH || target == display.scrollbarH.firstChild ||
          target == display.scrollbarV || target == display.scrollbarV.firstChild ||
          target == display.scrollbarFiller || target == display.gutterFiller) return null;
    }
    var x, y, space = getRect(display.lineSpace);
    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
    try { x = e.clientX; y = e.clientY; } catch (e) { return null; }
    return coordsChar(cm, x - space.left, y - space.top);
  }

  var lastClick, lastDoubleClick;
  function onMouseDown(e) {
    if (signalDOMEvent(this, e)) return;
    var cm = this, display = cm.display, doc = cm.doc, sel = doc.sel;
    sel.shift = e.shiftKey;

    if (eventInWidget(display, e)) {
      if (!webkit) {
        display.scroller.draggable = false;
        setTimeout(function(){display.scroller.draggable = true;}, 100);
      }
      return;
    }
    if (clickInGutter(cm, e)) return;
    var start = posFromMouse(cm, e);

    switch (e_button(e)) {
    case 3:
      if (captureMiddleClick) onContextMenu.call(cm, cm, e);
      return;
    case 2:
      if (webkit) cm.state.lastMiddleDown = +new Date;
      if (start) extendSelection(cm.doc, start);
      setTimeout(bind(focusInput, cm), 20);
      e_preventDefault(e);
      return;
    }
    // For button 1, if it was clicked inside the editor
    // (posFromMouse returning non-null), we have to adjust the
    // selection.
    if (!start) {if (e_target(e) == display.scroller) e_preventDefault(e); return;}

    if (!cm.state.focused) onFocus(cm);

    var now = +new Date, type = "single";
    if (lastDoubleClick && lastDoubleClick.time > now - 400 && posEq(lastDoubleClick.pos, start)) {
      type = "triple";
      e_preventDefault(e);
      setTimeout(bind(focusInput, cm), 20);
      selectLine(cm, start.line);
    } else if (lastClick && lastClick.time > now - 400 && posEq(lastClick.pos, start)) {
      type = "double";
      lastDoubleClick = {time: now, pos: start};
      e_preventDefault(e);
      var word = findWordAt(getLine(doc, start.line).text, start);
      extendSelection(cm.doc, word.from, word.to);
    } else { lastClick = {time: now, pos: start}; }

    var last = start;
    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) && !posEq(sel.from, sel.to) &&
        !posLess(start, sel.from) && !posLess(sel.to, start) && type == "single") {
      var dragEnd = operation(cm, function(e2) {
        if (webkit) display.scroller.draggable = false;
        cm.state.draggingText = false;
        off(document, "mouseup", dragEnd);
        off(display.scroller, "drop", dragEnd);
        if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
          e_preventDefault(e2);
          extendSelection(cm.doc, start);
          focusInput(cm);
        }
      });
      // Let the drag handler handle this.
      if (webkit) display.scroller.draggable = true;
      cm.state.draggingText = dragEnd;
      // IE's approach to draggable
      if (display.scroller.dragDrop) display.scroller.dragDrop();
      on(document, "mouseup", dragEnd);
      on(display.scroller, "drop", dragEnd);
      return;
    }
    e_preventDefault(e);
    if (type == "single") extendSelection(cm.doc, clipPos(doc, start));

    var startstart = sel.from, startend = sel.to, lastPos = start;

    function doSelect(cur) {
      if (posEq(lastPos, cur)) return;
      lastPos = cur;

      if (type == "single") {
        extendSelection(cm.doc, clipPos(doc, start), cur);
        return;
      }

      startstart = clipPos(doc, startstart);
      startend = clipPos(doc, startend);
      if (type == "double") {
        var word = findWordAt(getLine(doc, cur.line).text, cur);
        if (posLess(cur, startstart)) extendSelection(cm.doc, word.from, startend);
        else extendSelection(cm.doc, startstart, word.to);
      } else if (type == "triple") {
        if (posLess(cur, startstart)) extendSelection(cm.doc, startend, clipPos(doc, Pos(cur.line, 0)));
        else extendSelection(cm.doc, startstart, clipPos(doc, Pos(cur.line + 1, 0)));
      }
    }

    var editorSize = getRect(display.wrapper);
    // Used to ensure timeout re-tries don't fire when another extend
    // happened in the meantime (clearTimeout isn't reliable -- at
    // least on Chrome, the timeouts still happen even when cleared,
    // if the clear happens after their scheduled firing time).
    var counter = 0;

    function extend(e) {
      var curCount = ++counter;
      var cur = posFromMouse(cm, e, true);
      if (!cur) return;
      if (!posEq(cur, last)) {
        if (!cm.state.focused) onFocus(cm);
        last = cur;
        doSelect(cur);
        var visible = visibleLines(display, doc);
        if (cur.line >= visible.to || cur.line < visible.from)
          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
      } else {
        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
        if (outside) setTimeout(operation(cm, function() {
          if (counter != curCount) return;
          display.scroller.scrollTop += outside;
          extend(e);
        }), 50);
      }
    }

    function done(e) {
      counter = Infinity;
      e_preventDefault(e);
      focusInput(cm);
      off(document, "mousemove", move);
      off(document, "mouseup", up);
    }

    var move = operation(cm, function(e) {
      if (!ie && !e_button(e)) done(e);
      else extend(e);
    });
    var up = operation(cm, done);
    on(document, "mousemove", move);
    on(document, "mouseup", up);
  }

  function gutterEvent(cm, e, type, prevent, signalfn) {
    try { var mX = e.clientX, mY = e.clientY; }
    catch(e) { return false; }
    if (mX >= Math.floor(getRect(cm.display.gutters).right)) return false;
    if (prevent) e_preventDefault(e);

    var display = cm.display;
    var lineBox = getRect(display.lineDiv);

    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
    mY -= lineBox.top - display.viewOffset;

    for (var i = 0; i < cm.options.gutters.length; ++i) {
      var g = display.gutters.childNodes[i];
      if (g && getRect(g).right >= mX) {
        var line = lineAtHeight(cm.doc, mY);
        var gutter = cm.options.gutters[i];
        signalfn(cm, type, cm, line, gutter, e);
        return e_defaultPrevented(e);
      }
    }
  }

  function contextMenuInGutter(cm, e) {
    if (!hasHandler(cm, "gutterContextMenu")) return false;
    return gutterEvent(cm, e, "gutterContextMenu", false, signal);
  }

  function clickInGutter(cm, e) {
    return gutterEvent(cm, e, "gutterClick", true, signalLater);
  }

  // Kludge to work around strange IE behavior where it'll sometimes
  // re-fire a series of drag-related events right after the drop (#1551)
  var lastDrop = 0;

  function onDrop(e) {
    var cm = this;
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e) || (cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))))
      return;
    e_preventDefault(e);
    if (ie) lastDrop = +new Date;
    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
    if (!pos || isReadOnly(cm)) return;
    if (files && files.length && window.FileReader && window.File) {
      var n = files.length, text = Array(n), read = 0;
      var loadFile = function(file, i) {
        var reader = new FileReader;
        reader.onload = function() {
          text[i] = reader.result;
          if (++read == n) {
            pos = clipPos(cm.doc, pos);
            makeChange(cm.doc, {from: pos, to: pos, text: splitLines(text.join("\n")), origin: "paste"}, "around");
          }
        };
        reader.readAsText(file);
      };
      for (var i = 0; i < n; ++i) loadFile(files[i], i);
    } else {
      // Don't do a replace if the drop happened inside of the selected text.
      if (cm.state.draggingText && !(posLess(pos, cm.doc.sel.from) || posLess(cm.doc.sel.to, pos))) {
        cm.state.draggingText(e);
        // Ensure the editor is re-focused
        setTimeout(bind(focusInput, cm), 20);
        return;
      }
      try {
        var text = e.dataTransfer.getData("Text");
        if (text) {
          var curFrom = cm.doc.sel.from, curTo = cm.doc.sel.to;
          setSelection(cm.doc, pos, pos);
          if (cm.state.draggingText) replaceRange(cm.doc, "", curFrom, curTo, "paste");
          cm.replaceSelection(text, null, "paste");
          focusInput(cm);
          onFocus(cm);
        }
      }
      catch(e){}
    }
  }

  function onDragStart(cm, e) {
    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

    var txt = cm.getSelection();
    e.dataTransfer.setData("Text", txt);

    // Use dummy image instead of default browsers image.
    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
    if (e.dataTransfer.setDragImage && !safari) {
      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      if (opera) {
        img.width = img.height = 1;
        cm.display.wrapper.appendChild(img);
        // Force a relayout, or Opera won't use our image for some obscure reason
        img._top = img.offsetTop;
      }
      e.dataTransfer.setDragImage(img, 0, 0);
      if (opera) img.parentNode.removeChild(img);
    }
  }

  function setScrollTop(cm, val) {
    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
    cm.doc.scrollTop = val;
    if (!gecko) updateDisplay(cm, [], val);
    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
    if (cm.display.scrollbarV.scrollTop != val) cm.display.scrollbarV.scrollTop = val;
    if (gecko) updateDisplay(cm, []);
    startWorker(cm, 100);
  }
  function setScrollLeft(cm, val, isScroller) {
    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
    cm.doc.scrollLeft = val;
    alignHorizontally(cm);
    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
    if (cm.display.scrollbarH.scrollLeft != val) cm.display.scrollbarH.scrollLeft = val;
  }

  // Since the delta values reported on mouse wheel events are
  // unstandardized between browsers and even browser versions, and
  // generally horribly unpredictable, this code starts by measuring
  // the scroll effect that the first few mouse wheel events have,
  // and, from that, detects the way it can convert deltas to pixel
  // offsets afterwards.
  //
  // The reason we want to know the amount a wheel event will scroll
  // is that it gives us a chance to update the display before the
  // actual scrolling happens, reducing flickering.

  var wheelSamples = 0, wheelPixelsPerUnit = null;
  // Fill in a browser-detected starting value on browsers where we
  // know one. These don't have to be accurate -- the result of them
  // being wrong would just be a slight flicker on the first wheel
  // scroll (if it is large enough).
  if (ie) wheelPixelsPerUnit = -.53;
  else if (gecko) wheelPixelsPerUnit = 15;
  else if (chrome) wheelPixelsPerUnit = -.7;
  else if (safari) wheelPixelsPerUnit = -1/3;

  function onScrollWheel(cm, e) {
    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
    else if (dy == null) dy = e.wheelDelta;

    var display = cm.display, scroll = display.scroller;
    // Quit if there's nothing to scroll here
    if (!(dx && scroll.scrollWidth > scroll.clientWidth ||
          dy && scroll.scrollHeight > scroll.clientHeight)) return;

    // Webkit browsers on OS X abort momentum scrolls when the target
    // of the scroll event is removed from the scrollable element.
    // This hack (see related code in patchDisplay) makes sure the
    // element is kept around.
    if (dy && mac && webkit) {
      for (var cur = e.target; cur != scroll; cur = cur.parentNode) {
        if (cur.lineObj) {
          cm.display.currentWheelTarget = cur;
          break;
        }
      }
    }

    // On some browsers, horizontal scrolling will cause redraws to
    // happen before the gutter has been realigned, causing it to
    // wriggle around in a most unseemly way. When we have an
    // estimated pixels/delta value, we just handle horizontal
    // scrolling entirely here. It'll be slightly off from native, but
    // better than glitching out.
    if (dx && !gecko && !opera && wheelPixelsPerUnit != null) {
      if (dy)
        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
      e_preventDefault(e);
      display.wheelStartX = null; // Abort measurement, if in progress
      return;
    }

    if (dy && wheelPixelsPerUnit != null) {
      var pixels = dy * wheelPixelsPerUnit;
      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
      if (pixels < 0) top = Math.max(0, top + pixels - 50);
      else bot = Math.min(cm.doc.height, bot + pixels + 50);
      updateDisplay(cm, [], {top: top, bottom: bot});
    }

    if (wheelSamples < 20) {
      if (display.wheelStartX == null) {
        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
        display.wheelDX = dx; display.wheelDY = dy;
        setTimeout(function() {
          if (display.wheelStartX == null) return;
          var movedX = scroll.scrollLeft - display.wheelStartX;
          var movedY = scroll.scrollTop - display.wheelStartY;
          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
            (movedX && display.wheelDX && movedX / display.wheelDX);
          display.wheelStartX = display.wheelStartY = null;
          if (!sample) return;
          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
          ++wheelSamples;
        }, 200);
      } else {
        display.wheelDX += dx; display.wheelDY += dy;
      }
    }
  }

  function doHandleBinding(cm, bound, dropShift) {
    if (typeof bound == "string") {
      bound = commands[bound];
      if (!bound) return false;
    }
    // Ensure previous input has been read, so that the handler sees a
    // consistent view of the document
    if (cm.display.pollingFast && readInput(cm)) cm.display.pollingFast = false;
    var doc = cm.doc, prevShift = doc.sel.shift, done = false;
    try {
      if (isReadOnly(cm)) cm.state.suppressEdits = true;
      if (dropShift) doc.sel.shift = false;
      done = bound(cm) != Pass;
    } finally {
      doc.sel.shift = prevShift;
      cm.state.suppressEdits = false;
    }
    return done;
  }

  function allKeyMaps(cm) {
    var maps = cm.state.keyMaps.slice(0);
    if (cm.options.extraKeys) maps.push(cm.options.extraKeys);
    maps.push(cm.options.keyMap);
    return maps;
  }

  var maybeTransition;
  function handleKeyBinding(cm, e) {
    // Handle auto keymap transitions
    var startMap = getKeyMap(cm.options.keyMap), next = startMap.auto;
    clearTimeout(maybeTransition);
    if (next && !isModifierKey(e)) maybeTransition = setTimeout(function() {
      if (getKeyMap(cm.options.keyMap) == startMap) {
        cm.options.keyMap = (next.call ? next.call(null, cm) : next);
        keyMapChanged(cm);
      }
    }, 50);

    var name = keyName(e, true), handled = false;
    if (!name) return false;
    var keymaps = allKeyMaps(cm);

    if (e.shiftKey) {
      // First try to resolve full name (including 'Shift-'). Failing
      // that, see if there is a cursor-motion command (starting with
      // 'go') bound to the keyname without 'Shift-'.
      handled = lookupKey("Shift-" + name, keymaps, function(b) {return doHandleBinding(cm, b, true);})
             || lookupKey(name, keymaps, function(b) {
                  if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
                    return doHandleBinding(cm, b);
                });
    } else {
      handled = lookupKey(name, keymaps, function(b) { return doHandleBinding(cm, b); });
    }

    if (handled) {
      e_preventDefault(e);
      restartBlink(cm);
      if (ie_lt9) { e.oldKeyCode = e.keyCode; e.keyCode = 0; }
      signalLater(cm, "keyHandled", cm, name, e);
    }
    return handled;
  }

  function handleCharBinding(cm, e, ch) {
    var handled = lookupKey("'" + ch + "'", allKeyMaps(cm),
                            function(b) { return doHandleBinding(cm, b, true); });
    if (handled) {
      e_preventDefault(e);
      restartBlink(cm);
      signalLater(cm, "keyHandled", cm, "'" + ch + "'", e);
    }
    return handled;
  }

  var lastStoppedKey = null;
  function onKeyDown(e) {
    var cm = this;
    if (!cm.state.focused) onFocus(cm);
    if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
    if (ie && e.keyCode == 27) e.returnValue = false;
    var code = e.keyCode;
    // IE does strange things with escape.
    cm.doc.sel.shift = code == 16 || e.shiftKey;
    // First give onKeyEvent option a chance to handle this.
    var handled = handleKeyBinding(cm, e);
    if (opera) {
      lastStoppedKey = handled ? code : null;
      // Opera has no cut event... we try to at least catch the key combo
      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
        cm.replaceSelection("");
    }
  }

  function onKeyPress(e) {
    var cm = this;
    if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
    var keyCode = e.keyCode, charCode = e.charCode;
    if (opera && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
    if (((opera && (!e.which || e.which < 10)) || khtml) && handleKeyBinding(cm, e)) return;
    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
    if (this.options.electricChars && this.doc.mode.electricChars &&
        this.options.smartIndent && !isReadOnly(this) &&
        this.doc.mode.electricChars.indexOf(ch) > -1)
      setTimeout(operation(cm, function() {indentLine(cm, cm.doc.sel.to.line, "smart");}), 75);
    if (handleCharBinding(cm, e, ch)) return;
    if (ie && !ie_lt9) cm.display.inputHasSelection = null;
    fastPoll(cm);
  }

  function onFocus(cm) {
    if (cm.options.readOnly == "nocursor") return;
    if (!cm.state.focused) {
      signal(cm, "focus", cm);
      cm.state.focused = true;
      if (cm.display.wrapper.className.search(/\bCodeMirror-focused\b/) == -1)
        cm.display.wrapper.className += " CodeMirror-focused";
      if (!cm.curOp) {
        resetInput(cm, true);
        if (webkit) setTimeout(bind(resetInput, cm, true), 0); // Issue #1730
      }
    }
    slowPoll(cm);
    restartBlink(cm);
  }
  function onBlur(cm) {
    if (cm.state.focused) {
      signal(cm, "blur", cm);
      cm.state.focused = false;
      cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-focused", "");
    }
    clearInterval(cm.display.blinker);
    setTimeout(function() {if (!cm.state.focused) cm.doc.sel.shift = false;}, 150);
  }

  var detectingSelectAll;
  function onContextMenu(cm, e) {
    if (signalDOMEvent(cm, e, "contextmenu")) return;
    var display = cm.display, sel = cm.doc.sel;
    if (eventInWidget(display, e) || contextMenuInGutter(cm, e)) return;

    var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
    if (!pos || opera) return; // Opera is difficult.
    if (posEq(sel.from, sel.to) || posLess(pos, sel.from) || !posLess(pos, sel.to))
      operation(cm, setSelection)(cm.doc, pos, pos);

    var oldCSS = display.input.style.cssText;
    display.inputDiv.style.position = "absolute";
    display.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
      "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: white; outline: none;" +
      "border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);";
    focusInput(cm);
    resetInput(cm, true);
    // Adds "Select all" to context menu in FF
    if (posEq(sel.from, sel.to)) display.input.value = display.prevInput = " ";

    function prepareSelectAllHack() {
      if (display.input.selectionStart != null) {
        var extval = display.input.value = "\u200b" + (posEq(sel.from, sel.to) ? "" : display.input.value);
        display.prevInput = "\u200b";
        display.input.selectionStart = 1; display.input.selectionEnd = extval.length;
      }
    }
    function rehide() {
      display.inputDiv.style.position = "relative";
      display.input.style.cssText = oldCSS;
      if (ie_lt9) display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos;
      slowPoll(cm);

      // Try to detect the user choosing select-all
      if (display.input.selectionStart != null) {
        if (!ie || ie_lt9) prepareSelectAllHack();
        clearTimeout(detectingSelectAll);
        var i = 0, poll = function(){
          if (display.prevInput == " " && display.input.selectionStart == 0)
            operation(cm, commands.selectAll)(cm);
          else if (i++ < 10) detectingSelectAll = setTimeout(poll, 500);
          else resetInput(cm);
        };
        detectingSelectAll = setTimeout(poll, 200);
      }
    }

    if (ie && !ie_lt9) prepareSelectAllHack();
    if (captureMiddleClick) {
      e_stop(e);
      var mouseup = function() {
        off(window, "mouseup", mouseup);
        setTimeout(rehide, 20);
      };
      on(window, "mouseup", mouseup);
    } else {
      setTimeout(rehide, 50);
    }
  }

  // UPDATING

  var changeEnd = CodeMirror.changeEnd = function(change) {
    if (!change.text) return change.to;
    return Pos(change.from.line + change.text.length - 1,
               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
  };

  // Make sure a position will be valid after the given change.
  function clipPostChange(doc, change, pos) {
    if (!posLess(change.from, pos)) return clipPos(doc, pos);
    var diff = (change.text.length - 1) - (change.to.line - change.from.line);
    if (pos.line > change.to.line + diff) {
      var preLine = pos.line - diff, lastLine = doc.first + doc.size - 1;
      if (preLine > lastLine) return Pos(lastLine, getLine(doc, lastLine).text.length);
      return clipToLen(pos, getLine(doc, preLine).text.length);
    }
    if (pos.line == change.to.line + diff)
      return clipToLen(pos, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0) +
                       getLine(doc, change.to.line).text.length - change.to.ch);
    var inside = pos.line - change.from.line;
    return clipToLen(pos, change.text[inside].length + (inside ? 0 : change.from.ch));
  }

  // Hint can be null|"end"|"start"|"around"|{anchor,head}
  function computeSelAfterChange(doc, change, hint) {
    if (hint && typeof hint == "object") // Assumed to be {anchor, head} object
      return {anchor: clipPostChange(doc, change, hint.anchor),
              head: clipPostChange(doc, change, hint.head)};

    if (hint == "start") return {anchor: change.from, head: change.from};

    var end = changeEnd(change);
    if (hint == "around") return {anchor: change.from, head: end};
    if (hint == "end") return {anchor: end, head: end};

    // hint is null, leave the selection alone as much as possible
    var adjustPos = function(pos) {
      if (posLess(pos, change.from)) return pos;
      if (!posLess(change.to, pos)) return end;

      var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
      if (pos.line == change.to.line) ch += end.ch - change.to.ch;
      return Pos(line, ch);
    };
    return {anchor: adjustPos(doc.sel.anchor), head: adjustPos(doc.sel.head)};
  }

  function filterChange(doc, change, update) {
    var obj = {
      canceled: false,
      from: change.from,
      to: change.to,
      text: change.text,
      origin: change.origin,
      cancel: function() { this.canceled = true; }
    };
    if (update) obj.update = function(from, to, text, origin) {
      if (from) this.from = clipPos(doc, from);
      if (to) this.to = clipPos(doc, to);
      if (text) this.text = text;
      if (origin !== undefined) this.origin = origin;
    };
    signal(doc, "beforeChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

    if (obj.canceled) return null;
    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
  }

  // Replace the range from from to to by the strings in replacement.
  // change is a {from, to, text [, origin]} object
  function makeChange(doc, change, selUpdate, ignoreReadOnly) {
    if (doc.cm) {
      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, selUpdate, ignoreReadOnly);
      if (doc.cm.state.suppressEdits) return;
    }

    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
      change = filterChange(doc, change, true);
      if (!change) return;
    }

    // Possibly split or suppress the update based on the presence
    // of read-only spans in its range.
    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
    if (split) {
      for (var i = split.length - 1; i >= 1; --i)
        makeChangeNoReadonly(doc, {from: split[i].from, to: split[i].to, text: [""]});
      if (split.length)
        makeChangeNoReadonly(doc, {from: split[0].from, to: split[0].to, text: change.text}, selUpdate);
    } else {
      makeChangeNoReadonly(doc, change, selUpdate);
    }
  }

  function makeChangeNoReadonly(doc, change, selUpdate) {
    if (change.text.length == 1 && change.text[0] == "" && posEq(change.from, change.to)) return;
    var selAfter = computeSelAfterChange(doc, change, selUpdate);
    addToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
    var rebased = [];

    linkedDocs(doc, function(doc, sharedHist) {
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
        rebaseHist(doc.history, change);
        rebased.push(doc.history);
      }
      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
    });
  }

  function makeChangeFromHistory(doc, type) {
    if (doc.cm && doc.cm.state.suppressEdits) return;

    var hist = doc.history;
    var event = (type == "undo" ? hist.done : hist.undone).pop();
    if (!event) return;

    var anti = {changes: [], anchorBefore: event.anchorAfter, headBefore: event.headAfter,
                anchorAfter: event.anchorBefore, headAfter: event.headBefore,
                generation: hist.generation};
    (type == "undo" ? hist.undone : hist.done).push(anti);
    hist.generation = event.generation || ++hist.maxGeneration;

    var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

    for (var i = event.changes.length - 1; i >= 0; --i) {
      var change = event.changes[i];
      change.origin = type;
      if (filter && !filterChange(doc, change, false)) {
        (type == "undo" ? hist.done : hist.undone).length = 0;
        return;
      }

      anti.changes.push(historyChangeFromChange(doc, change));

      var after = i ? computeSelAfterChange(doc, change, null)
                    : {anchor: event.anchorBefore, head: event.headBefore};
      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
      var rebased = [];

      linkedDocs(doc, function(doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
      });
    }
  }

  function shiftDoc(doc, distance) {
    function shiftPos(pos) {return Pos(pos.line + distance, pos.ch);}
    doc.first += distance;
    if (doc.cm) regChange(doc.cm, doc.first, doc.first, distance);
    doc.sel.head = shiftPos(doc.sel.head); doc.sel.anchor = shiftPos(doc.sel.anchor);
    doc.sel.from = shiftPos(doc.sel.from); doc.sel.to = shiftPos(doc.sel.to);
  }

  function makeChangeSingleDoc(doc, change, selAfter, spans) {
    if (doc.cm && !doc.cm.curOp)
      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

    if (change.to.line < doc.first) {
      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
      return;
    }
    if (change.from.line > doc.lastLine()) return;

    // Clip the change to the size of this doc
    if (change.from.line < doc.first) {
      var shift = change.text.length - 1 - (doc.first - change.from.line);
      shiftDoc(doc, shift);
      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
                text: [lst(change.text)], origin: change.origin};
    }
    var last = doc.lastLine();
    if (change.to.line > last) {
      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
                text: [change.text[0]], origin: change.origin};
    }

    change.removed = getBetween(doc, change.from, change.to);

    if (!selAfter) selAfter = computeSelAfterChange(doc, change, null);
    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans, selAfter);
    else updateDoc(doc, change, spans, selAfter);
  }

  function makeChangeSingleDocInEditor(cm, change, spans, selAfter) {
    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

    var recomputeMaxLength = false, checkWidthStart = from.line;
    if (!cm.options.lineWrapping) {
      checkWidthStart = lineNo(visualLine(doc, getLine(doc, from.line)));
      doc.iter(checkWidthStart, to.line + 1, function(line) {
        if (line == display.maxLine) {
          recomputeMaxLength = true;
          return true;
        }
      });
    }

    if (!posLess(doc.sel.head, change.from) && !posLess(change.to, doc.sel.head))
      cm.curOp.cursorActivity = true;

    updateDoc(doc, change, spans, selAfter, estimateHeight(cm));

    if (!cm.options.lineWrapping) {
      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
        var len = lineLength(doc, line);
        if (len > display.maxLineLength) {
          display.maxLine = line;
          display.maxLineLength = len;
          display.maxLineChanged = true;
          recomputeMaxLength = false;
        }
      });
      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
    }

    // Adjust frontier, schedule worker
    doc.frontier = Math.min(doc.frontier, from.line);
    startWorker(cm, 400);

    var lendiff = change.text.length - (to.line - from.line) - 1;
    // Remember that these lines changed, for updating the display
    regChange(cm, from.line, to.line + 1, lendiff);

    if (hasHandler(cm, "change")) {
      var changeObj = {from: from, to: to,
                       text: change.text,
                       removed: change.removed,
                       origin: change.origin};
      if (cm.curOp.textChanged) {
        for (var cur = cm.curOp.textChanged; cur.next; cur = cur.next) {}
        cur.next = changeObj;
      } else cm.curOp.textChanged = changeObj;
    }
  }

  function replaceRange(doc, code, from, to, origin) {
    if (!to) to = from;
    if (posLess(to, from)) { var tmp = to; to = from; from = tmp; }
    if (typeof code == "string") code = splitLines(code);
    makeChange(doc, {from: from, to: to, text: code, origin: origin}, null);
  }

  // POSITION OBJECT

  function Pos(line, ch) {
    if (!(this instanceof Pos)) return new Pos(line, ch);
    this.line = line; this.ch = ch;
  }
  CodeMirror.Pos = Pos;

  function posEq(a, b) {return a.line == b.line && a.ch == b.ch;}
  function posLess(a, b) {return a.line < b.line || (a.line == b.line && a.ch < b.ch);}
  function copyPos(x) {return Pos(x.line, x.ch);}

  // SELECTION

  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
  function clipPos(doc, pos) {
    if (pos.line < doc.first) return Pos(doc.first, 0);
    var last = doc.first + doc.size - 1;
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
    return clipToLen(pos, getLine(doc, pos.line).text.length);
  }
  function clipToLen(pos, linelen) {
    var ch = pos.ch;
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
    else if (ch < 0) return Pos(pos.line, 0);
    else return pos;
  }
  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}

  // If shift is held, this will move the selection anchor. Otherwise,
  // it'll set the whole selection.
  function extendSelection(doc, pos, other, bias) {
    if (doc.sel.shift || doc.sel.extend) {
      var anchor = doc.sel.anchor;
      if (other) {
        var posBefore = posLess(pos, anchor);
        if (posBefore != posLess(other, anchor)) {
          anchor = pos;
          pos = other;
        } else if (posBefore != posLess(pos, other)) {
          pos = other;
        }
      }
      setSelection(doc, anchor, pos, bias);
    } else {
      setSelection(doc, pos, other || pos, bias);
    }
    if (doc.cm) doc.cm.curOp.userSelChange = true;
  }

  function filterSelectionChange(doc, anchor, head) {
    var obj = {anchor: anchor, head: head};
    signal(doc, "beforeSelectionChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
    obj.anchor = clipPos(doc, obj.anchor); obj.head = clipPos(doc, obj.head);
    return obj;
  }

  // Update the selection. Last two args are only used by
  // updateDoc, since they have to be expressed in the line
  // numbers before the update.
  function setSelection(doc, anchor, head, bias, checkAtomic) {
    if (!checkAtomic && hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) {
      var filtered = filterSelectionChange(doc, anchor, head);
      head = filtered.head;
      anchor = filtered.anchor;
    }

    var sel = doc.sel;
    sel.goalColumn = null;
    if (bias == null) bias = posLess(head, sel.head) ? -1 : 1;
    // Skip over atomic spans.
    if (checkAtomic || !posEq(anchor, sel.anchor))
      anchor = skipAtomic(doc, anchor, bias, checkAtomic != "push");
    if (checkAtomic || !posEq(head, sel.head))
      head = skipAtomic(doc, head, bias, checkAtomic != "push");

    if (posEq(sel.anchor, anchor) && posEq(sel.head, head)) return;

    sel.anchor = anchor; sel.head = head;
    var inv = posLess(head, anchor);
    sel.from = inv ? head : anchor;
    sel.to = inv ? anchor : head;

    if (doc.cm)
      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged =
        doc.cm.curOp.cursorActivity = true;

    signalLater(doc, "cursorActivity", doc);
  }

  function reCheckSelection(cm) {
    setSelection(cm.doc, cm.doc.sel.from, cm.doc.sel.to, null, "push");
  }

  function skipAtomic(doc, pos, bias, mayClear) {
    var flipped = false, curPos = pos;
    var dir = bias || 1;
    doc.cantEdit = false;
    search: for (;;) {
      var line = getLine(doc, curPos.line);
      if (line.markedSpans) {
        for (var i = 0; i < line.markedSpans.length; ++i) {
          var sp = line.markedSpans[i], m = sp.marker;
          if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&
              (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
            if (mayClear) {
              signal(m, "beforeCursorEnter");
              if (m.explicitlyCleared) {
                if (!line.markedSpans) break;
                else {--i; continue;}
              }
            }
            if (!m.atomic) continue;
            var newPos = m.find()[dir < 0 ? "from" : "to"];
            if (posEq(newPos, curPos)) {
              newPos.ch += dir;
              if (newPos.ch < 0) {
                if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));
                else newPos = null;
              } else if (newPos.ch > line.text.length) {
                if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);
                else newPos = null;
              }
              if (!newPos) {
                if (flipped) {
                  // Driven in a corner -- no valid cursor position found at all
                  // -- try again *with* clearing, if we didn't already
                  if (!mayClear) return skipAtomic(doc, pos, bias, true);
                  // Otherwise, turn off editing until further notice, and return the start of the doc
                  doc.cantEdit = true;
                  return Pos(doc.first, 0);
                }
                flipped = true; newPos = pos; dir = -dir;
              }
            }
            curPos = newPos;
            continue search;
          }
        }
      }
      return curPos;
    }
  }

  // SCROLLING

  function scrollCursorIntoView(cm) {
    var coords = scrollPosIntoView(cm, cm.doc.sel.head, cm.options.cursorScrollMargin);
    if (!cm.state.focused) return;
    var display = cm.display, box = getRect(display.sizer), doScroll = null;
    if (coords.top + box.top < 0) doScroll = true;
    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
    if (doScroll != null && !phantom) {
      var hidden = display.cursor.style.display == "none";
      if (hidden) {
        display.cursor.style.display = "";
        display.cursor.style.left = coords.left + "px";
        display.cursor.style.top = (coords.top - display.viewOffset) + "px";
      }
      display.cursor.scrollIntoView(doScroll);
      if (hidden) display.cursor.style.display = "none";
    }
  }

  function scrollPosIntoView(cm, pos, margin) {
    if (margin == null) margin = 0;
    for (;;) {
      var changed = false, coords = cursorCoords(cm, pos);
      var scrollPos = calculateScrollPos(cm, coords.left, coords.top - margin, coords.left, coords.bottom + margin);
      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
      if (scrollPos.scrollTop != null) {
        setScrollTop(cm, scrollPos.scrollTop);
        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
      }
      if (scrollPos.scrollLeft != null) {
        setScrollLeft(cm, scrollPos.scrollLeft);
        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
      }
      if (!changed) return coords;
    }
  }

  function scrollIntoView(cm, x1, y1, x2, y2) {
    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
  }

  function calculateScrollPos(cm, x1, y1, x2, y2) {
    var display = cm.display, snapMargin = textHeight(cm.display);
    if (y1 < 0) y1 = 0;
    var screen = display.scroller.clientHeight - scrollerCutOff, screentop = display.scroller.scrollTop, result = {};
    var docBottom = cm.doc.height + paddingVert(display);
    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
    if (y1 < screentop) {
      result.scrollTop = atTop ? 0 : y1;
    } else if (y2 > screentop + screen) {
      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
      if (newTop != screentop) result.scrollTop = newTop;
    }

    var screenw = display.scroller.clientWidth - scrollerCutOff, screenleft = display.scroller.scrollLeft;
    x1 += display.gutters.offsetWidth; x2 += display.gutters.offsetWidth;
    var gutterw = display.gutters.offsetWidth;
    var atLeft = x1 < gutterw + 10;
    if (x1 < screenleft + gutterw || atLeft) {
      if (atLeft) x1 = 0;
      result.scrollLeft = Math.max(0, x1 - 10 - gutterw);
    } else if (x2 > screenw + screenleft - 3) {
      result.scrollLeft = x2 + 10 - screenw;
    }
    return result;
  }

  function updateScrollPos(cm, left, top) {
    cm.curOp.updateScrollPos = {scrollLeft: left == null ? cm.doc.scrollLeft : left,
                                scrollTop: top == null ? cm.doc.scrollTop : top};
  }

  function addToScrollPos(cm, left, top) {
    var pos = cm.curOp.updateScrollPos || (cm.curOp.updateScrollPos = {scrollLeft: cm.doc.scrollLeft, scrollTop: cm.doc.scrollTop});
    var scroll = cm.display.scroller;
    pos.scrollTop = Math.max(0, Math.min(scroll.scrollHeight - scroll.clientHeight, pos.scrollTop + top));
    pos.scrollLeft = Math.max(0, Math.min(scroll.scrollWidth - scroll.clientWidth, pos.scrollLeft + left));
  }

  // API UTILITIES

  function indentLine(cm, n, how, aggressive) {
    var doc = cm.doc;
    if (how == null) how = "add";
    if (how == "smart") {
      if (!cm.doc.mode.indent) how = "prev";
      else var state = getStateBefore(cm, n);
    }

    var tabSize = cm.options.tabSize;
    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
    if (how == "smart") {
      indentation = cm.doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
      if (indentation == Pass) {
        if (!aggressive) return;
        how = "prev";
      }
    }
    if (how == "prev") {
      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
      else indentation = 0;
    } else if (how == "add") {
      indentation = curSpace + cm.options.indentUnit;
    } else if (how == "subtract") {
      indentation = curSpace - cm.options.indentUnit;
    } else if (typeof how == "number") {
      indentation = curSpace + how;
    }
    indentation = Math.max(0, indentation);

    var indentString = "", pos = 0;
    if (cm.options.indentWithTabs)
      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
    if (pos < indentation) indentString += spaceStr(indentation - pos);

    if (indentString != curSpaceString)
      replaceRange(cm.doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
    line.stateAfter = null;
  }

  function changeLine(cm, handle, op) {
    var no = handle, line = handle, doc = cm.doc;
    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
    else no = lineNo(handle);
    if (no == null) return null;
    if (op(line, no)) regChange(cm, no, no + 1);
    else return null;
    return line;
  }

  function findPosH(doc, pos, dir, unit, visually) {
    var line = pos.line, ch = pos.ch, origDir = dir;
    var lineObj = getLine(doc, line);
    var possible = true;
    function findNextLine() {
      var l = line + dir;
      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
      line = l;
      return lineObj = getLine(doc, l);
    }
    function moveOnce(boundToLine) {
      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
      if (next == null) {
        if (!boundToLine && findNextLine()) {
          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
          else ch = dir < 0 ? lineObj.text.length : 0;
        } else return (possible = false);
      } else ch = next;
      return true;
    }

    if (unit == "char") moveOnce();
    else if (unit == "column") moveOnce(true);
    else if (unit == "word" || unit == "group") {
      var sawType = null, group = unit == "group";
      for (var first = true;; first = false) {
        if (dir < 0 && !moveOnce(!first)) break;
        var cur = lineObj.text.charAt(ch) || "\n";
        var type = isWordChar(cur) ? "w"
          : !group ? null
          : /\s/.test(cur) ? null
          : "p";
        if (sawType && sawType != type) {
          if (dir < 0) {dir = 1; moveOnce();}
          break;
        }
        if (type) sawType = type;
        if (dir > 0 && !moveOnce(!first)) break;
      }
    }
    var result = skipAtomic(doc, Pos(line, ch), origDir, true);
    if (!possible) result.hitSide = true;
    return result;
  }

  function findPosV(cm, pos, dir, unit) {
    var doc = cm.doc, x = pos.left, y;
    if (unit == "page") {
      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
    } else if (unit == "line") {
      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
    }
    for (;;) {
      var target = coordsChar(cm, x, y);
      if (!target.outside) break;
      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
      y += dir * 5;
    }
    return target;
  }

  function findWordAt(line, pos) {
    var start = pos.ch, end = pos.ch;
    if (line) {
      if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
      var startChar = line.charAt(start);
      var check = isWordChar(startChar) ? isWordChar
        : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
        : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
      while (start > 0 && check(line.charAt(start - 1))) --start;
      while (end < line.length && check(line.charAt(end))) ++end;
    }
    return {from: Pos(pos.line, start), to: Pos(pos.line, end)};
  }

  function selectLine(cm, line) {
    extendSelection(cm.doc, Pos(line, 0), clipPos(cm.doc, Pos(line + 1, 0)));
  }

  // PROTOTYPE

  // The publicly visible API. Note that operation(null, f) means
  // 'wrap f in an operation, performed on its `this` parameter'

  CodeMirror.prototype = {
    constructor: CodeMirror,
    focus: function(){window.focus(); focusInput(this); onFocus(this); fastPoll(this);},

    setOption: function(option, value) {
      var options = this.options, old = options[option];
      if (options[option] == value && option != "mode") return;
      options[option] = value;
      if (optionHandlers.hasOwnProperty(option))
        operation(this, optionHandlers[option])(this, value, old);
    },

    getOption: function(option) {return this.options[option];},
    getDoc: function() {return this.doc;},

    addKeyMap: function(map, bottom) {
      this.state.keyMaps[bottom ? "push" : "unshift"](map);
    },
    removeKeyMap: function(map) {
      var maps = this.state.keyMaps;
      for (var i = 0; i < maps.length; ++i)
        if (maps[i] == map || (typeof maps[i] != "string" && maps[i].name == map)) {
          maps.splice(i, 1);
          return true;
        }
    },

    addOverlay: operation(null, function(spec, options) {
      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
      if (mode.startState) throw new Error("Overlays may not be stateful.");
      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
      this.state.modeGen++;
      regChange(this);
    }),
    removeOverlay: operation(null, function(spec) {
      var overlays = this.state.overlays;
      for (var i = 0; i < overlays.length; ++i) {
        var cur = overlays[i].modeSpec;
        if (cur == spec || typeof spec == "string" && cur.name == spec) {
          overlays.splice(i, 1);
          this.state.modeGen++;
          regChange(this);
          return;
        }
      }
    }),

    indentLine: operation(null, function(n, dir, aggressive) {
      if (typeof dir != "string" && typeof dir != "number") {
        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
        else dir = dir ? "add" : "subtract";
      }
      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
    }),
    indentSelection: operation(null, function(how) {
      var sel = this.doc.sel;
      if (posEq(sel.from, sel.to)) return indentLine(this, sel.from.line, how);
      var e = sel.to.line - (sel.to.ch ? 0 : 1);
      for (var i = sel.from.line; i <= e; ++i) indentLine(this, i, how);
    }),

    // Fetch the parser token for a given character. Useful for hacks
    // that want to inspect the mode state (say, for completion).
    getTokenAt: function(pos, precise) {
      var doc = this.doc;
      pos = clipPos(doc, pos);
      var state = getStateBefore(this, pos.line, precise), mode = this.doc.mode;
      var line = getLine(doc, pos.line);
      var stream = new StringStream(line.text, this.options.tabSize);
      while (stream.pos < pos.ch && !stream.eol()) {
        stream.start = stream.pos;
        var style = mode.token(stream, state);
      }
      return {start: stream.start,
              end: stream.pos,
              string: stream.current(),
              className: style || null, // Deprecated, use 'type' instead
              type: style || null,
              state: state};
    },

    getTokenTypeAt: function(pos) {
      pos = clipPos(this.doc, pos);
      var styles = getLineStyles(this, getLine(this.doc, pos.line));
      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
      if (ch == 0) return styles[2];
      for (;;) {
        var mid = (before + after) >> 1;
        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
        else return styles[mid * 2 + 2];
      }
    },

    getModeAt: function(pos) {
      var mode = this.doc.mode;
      if (!mode.innerMode) return mode;
      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
    },

    getHelper: function(pos, type) {
      if (!helpers.hasOwnProperty(type)) return;
      var help = helpers[type], mode = this.getModeAt(pos);
      return mode[type] && help[mode[type]] ||
        mode.helperType && help[mode.helperType] ||
        help[mode.name];
    },

    getStateAfter: function(line, precise) {
      var doc = this.doc;
      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
      return getStateBefore(this, line + 1, precise);
    },

    cursorCoords: function(start, mode) {
      var pos, sel = this.doc.sel;
      if (start == null) pos = sel.head;
      else if (typeof start == "object") pos = clipPos(this.doc, start);
      else pos = start ? sel.from : sel.to;
      return cursorCoords(this, pos, mode || "page");
    },

    charCoords: function(pos, mode) {
      return charCoords(this, clipPos(this.doc, pos), mode || "page");
    },

    coordsChar: function(coords, mode) {
      coords = fromCoordSystem(this, coords, mode || "page");
      return coordsChar(this, coords.left, coords.top);
    },

    lineAtHeight: function(height, mode) {
      height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
      return lineAtHeight(this.doc, height + this.display.viewOffset);
    },
    heightAtLine: function(line, mode) {
      var end = false, last = this.doc.first + this.doc.size - 1;
      if (line < this.doc.first) line = this.doc.first;
      else if (line > last) { line = last; end = true; }
      var lineObj = getLine(this.doc, line);
      return intoCoordSystem(this, getLine(this.doc, line), {top: 0, left: 0}, mode || "page").top +
        (end ? lineObj.height : 0);
    },

    defaultTextHeight: function() { return textHeight(this.display); },
    defaultCharWidth: function() { return charWidth(this.display); },

    setGutterMarker: operation(null, function(line, gutterID, value) {
      return changeLine(this, line, function(line) {
        var markers = line.gutterMarkers || (line.gutterMarkers = {});
        markers[gutterID] = value;
        if (!value && isEmpty(markers)) line.gutterMarkers = null;
        return true;
      });
    }),

    clearGutter: operation(null, function(gutterID) {
      var cm = this, doc = cm.doc, i = doc.first;
      doc.iter(function(line) {
        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
          line.gutterMarkers[gutterID] = null;
          regChange(cm, i, i + 1);
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
        }
        ++i;
      });
    }),

    addLineClass: operation(null, function(handle, where, cls) {
      return changeLine(this, handle, function(line) {
        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
        if (!line[prop]) line[prop] = cls;
        else if (new RegExp("(?:^|\\s)" + cls + "(?:$|\\s)").test(line[prop])) return false;
        else line[prop] += " " + cls;
        return true;
      });
    }),

    removeLineClass: operation(null, function(handle, where, cls) {
      return changeLine(this, handle, function(line) {
        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
        var cur = line[prop];
        if (!cur) return false;
        else if (cls == null) line[prop] = null;
        else {
          var found = cur.match(new RegExp("(?:^|\\s+)" + cls + "(?:$|\\s+)"));
          if (!found) return false;
          var end = found.index + found[0].length;
          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
        }
        return true;
      });
    }),

    addLineWidget: operation(null, function(handle, node, options) {
      return addLineWidget(this, handle, node, options);
    }),

    removeLineWidget: function(widget) { widget.clear(); },

    lineInfo: function(line) {
      if (typeof line == "number") {
        if (!isLine(this.doc, line)) return null;
        var n = line;
        line = getLine(this.doc, line);
        if (!line) return null;
      } else {
        var n = lineNo(line);
        if (n == null) return null;
      }
      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
              widgets: line.widgets};
    },

    getViewport: function() { return {from: this.display.showingFrom, to: this.display.showingTo};},

    addWidget: function(pos, node, scroll, vert, horiz) {
      var display = this.display;
      pos = cursorCoords(this, clipPos(this.doc, pos));
      var top = pos.bottom, left = pos.left;
      node.style.position = "absolute";
      display.sizer.appendChild(node);
      if (vert == "over") {
        top = pos.top;
      } else if (vert == "above" || vert == "near") {
        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
        // Default to positioning above (if specified and possible); otherwise default to positioning below
        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
          top = pos.top - node.offsetHeight;
        else if (pos.bottom + node.offsetHeight <= vspace)
          top = pos.bottom;
        if (left + node.offsetWidth > hspace)
          left = hspace - node.offsetWidth;
      }
      node.style.top = top + "px";
      node.style.left = node.style.right = "";
      if (horiz == "right") {
        left = display.sizer.clientWidth - node.offsetWidth;
        node.style.right = "0px";
      } else {
        if (horiz == "left") left = 0;
        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
        node.style.left = left + "px";
      }
      if (scroll)
        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
    },

    triggerOnKeyDown: operation(null, onKeyDown),

    execCommand: function(cmd) {return commands[cmd](this);},

    findPosH: function(from, amount, unit, visually) {
      var dir = 1;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        cur = findPosH(this.doc, cur, dir, unit, visually);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveH: operation(null, function(dir, unit) {
      var sel = this.doc.sel, pos;
      if (sel.shift || sel.extend || posEq(sel.from, sel.to))
        pos = findPosH(this.doc, sel.head, dir, unit, this.options.rtlMoveVisually);
      else
        pos = dir < 0 ? sel.from : sel.to;
      extendSelection(this.doc, pos, pos, dir);
    }),

    deleteH: operation(null, function(dir, unit) {
      var sel = this.doc.sel;
      if (!posEq(sel.from, sel.to)) replaceRange(this.doc, "", sel.from, sel.to, "+delete");
      else replaceRange(this.doc, "", sel.from, findPosH(this.doc, sel.head, dir, unit, false), "+delete");
      this.curOp.userSelChange = true;
    }),

    findPosV: function(from, amount, unit, goalColumn) {
      var dir = 1, x = goalColumn;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        var coords = cursorCoords(this, cur, "div");
        if (x == null) x = coords.left;
        else coords.left = x;
        cur = findPosV(this, coords, dir, unit);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveV: operation(null, function(dir, unit) {
      var sel = this.doc.sel;
      var pos = cursorCoords(this, sel.head, "div");
      if (sel.goalColumn != null) pos.left = sel.goalColumn;
      var target = findPosV(this, pos, dir, unit);

      if (unit == "page") addToScrollPos(this, 0, charCoords(this, target, "div").top - pos.top);
      extendSelection(this.doc, target, target, dir);
      sel.goalColumn = pos.left;
    }),

    toggleOverwrite: function(value) {
      if (value != null && value == this.state.overwrite) return;
      if (this.state.overwrite = !this.state.overwrite)
        this.display.cursor.className += " CodeMirror-overwrite";
      else
        this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", "");
    },
    hasFocus: function() { return this.state.focused; },

    scrollTo: operation(null, function(x, y) {
      updateScrollPos(this, x, y);
    }),
    getScrollInfo: function() {
      var scroller = this.display.scroller, co = scrollerCutOff;
      return {left: scroller.scrollLeft, top: scroller.scrollTop,
              height: scroller.scrollHeight - co, width: scroller.scrollWidth - co,
              clientHeight: scroller.clientHeight - co, clientWidth: scroller.clientWidth - co};
    },

    scrollIntoView: operation(null, function(pos, margin) {
      if (typeof pos == "number") pos = Pos(pos, 0);
      if (!margin) margin = 0;
      var coords = pos;

      if (!pos || pos.line != null) {
        this.curOp.scrollToPos = pos ? clipPos(this.doc, pos) : this.doc.sel.head;
        this.curOp.scrollToPosMargin = margin;
        coords = cursorCoords(this, this.curOp.scrollToPos);
      }
      var sPos = calculateScrollPos(this, coords.left, coords.top - margin, coords.right, coords.bottom + margin);
      updateScrollPos(this, sPos.scrollLeft, sPos.scrollTop);
    }),

    setSize: operation(null, function(width, height) {
      function interpret(val) {
        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
      }
      if (width != null) this.display.wrapper.style.width = interpret(width);
      if (height != null) this.display.wrapper.style.height = interpret(height);
      if (this.options.lineWrapping)
        this.display.measureLineCache.length = this.display.measureLineCachePos = 0;
      this.curOp.forceUpdate = true;
    }),

    operation: function(f){return runInOp(this, f);},

    refresh: operation(null, function() {
      var badHeight = this.display.cachedTextHeight == null;
      clearCaches(this);
      updateScrollPos(this, this.doc.scrollLeft, this.doc.scrollTop);
      regChange(this);
      if (badHeight) estimateLineHeights(this);
    }),

    swapDoc: operation(null, function(doc) {
      var old = this.doc;
      old.cm = null;
      attachDoc(this, doc);
      clearCaches(this);
      resetInput(this, true);
      updateScrollPos(this, doc.scrollLeft, doc.scrollTop);
      return old;
    }),

    getInputField: function(){return this.display.input;},
    getWrapperElement: function(){return this.display.wrapper;},
    getScrollerElement: function(){return this.display.scroller;},
    getGutterElement: function(){return this.display.gutters;}
  };
  eventMixin(CodeMirror);

  // OPTION DEFAULTS

  var optionHandlers = CodeMirror.optionHandlers = {};

  // The default configuration options.
  var defaults = CodeMirror.defaults = {};

  function option(name, deflt, handle, notOnInit) {
    CodeMirror.defaults[name] = deflt;
    if (handle) optionHandlers[name] =
      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
  }

  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};

  // These two are, on init, called from the constructor because they
  // have to be initialized before the editor can start at all.
  option("value", "", function(cm, val) {
    cm.setValue(val);
  }, true);
  option("mode", null, function(cm, val) {
    cm.doc.modeOption = val;
    loadMode(cm);
  }, true);

  option("indentUnit", 2, loadMode, true);
  option("indentWithTabs", false);
  option("smartIndent", true);
  option("tabSize", 4, function(cm) {
    loadMode(cm);
    clearCaches(cm);
    regChange(cm);
  }, true);
  option("electricChars", true);
  option("rtlMoveVisually", !windows);

  option("theme", "default", function(cm) {
    themeChanged(cm);
    guttersChanged(cm);
  }, true);
  option("keyMap", "default", keyMapChanged);
  option("extraKeys", null);

  option("onKeyEvent", null);
  option("onDragEvent", null);

  option("lineWrapping", false, wrappingChanged, true);
  option("gutters", [], function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("fixedGutter", true, function(cm, val) {
    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
    cm.refresh();
  }, true);
  option("coverGutterNextToScrollbar", false, updateScrollbars, true);
  option("lineNumbers", false, function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("firstLineNumber", 1, guttersChanged, true);
  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
  option("showCursorWhenSelecting", false, updateSelection, true);

  option("readOnly", false, function(cm, val) {
    if (val == "nocursor") {onBlur(cm); cm.display.input.blur();}
    else if (!val) resetInput(cm, true);
  });
  option("dragDrop", true);

  option("cursorBlinkRate", 530);
  option("cursorScrollMargin", 0);
  option("cursorHeight", 1);
  option("workTime", 100);
  option("workDelay", 100);
  option("flattenSpans", true);
  option("pollInterval", 100);
  option("undoDepth", 40, function(cm, val){cm.doc.history.undoDepth = val;});
  option("historyEventDelay", 500);
  option("viewportMargin", 10, function(cm){cm.refresh();}, true);
  option("maxHighlightLength", 10000, function(cm){loadMode(cm); cm.refresh();}, true);
  option("crudeMeasuringFrom", 10000);
  option("moveInputWithCursor", true, function(cm, val) {
    if (!val) cm.display.inputDiv.style.top = cm.display.inputDiv.style.left = 0;
  });

  option("tabindex", null, function(cm, val) {
    cm.display.input.tabIndex = val || "";
  });
  option("autofocus", null);

  // MODE DEFINITION AND QUERYING

  // Known modes, by name and by MIME
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

  CodeMirror.defineMode = function(name, mode) {
    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
    if (arguments.length > 2) {
      mode.dependencies = [];
      for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i]);
    }
    modes[name] = mode;
  };

  CodeMirror.defineMIME = function(mime, spec) {
    mimeModes[mime] = spec;
  };

  CodeMirror.resolveMode = function(spec) {
    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
      spec = mimeModes[spec];
    } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
      var found = mimeModes[spec.name];
      spec = createObj(found, spec);
      spec.name = found.name;
    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
      return CodeMirror.resolveMode("application/xml");
    }
    if (typeof spec == "string") return {name: spec};
    else return spec || {name: "null"};
  };

  CodeMirror.getMode = function(options, spec) {
    var spec = CodeMirror.resolveMode(spec);
    var mfactory = modes[spec.name];
    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
    var modeObj = mfactory(options, spec);
    if (modeExtensions.hasOwnProperty(spec.name)) {
      var exts = modeExtensions[spec.name];
      for (var prop in exts) {
        if (!exts.hasOwnProperty(prop)) continue;
        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
        modeObj[prop] = exts[prop];
      }
    }
    modeObj.name = spec.name;

    return modeObj;
  };

  CodeMirror.defineMode("null", function() {
    return {token: function(stream) {stream.skipToEnd();}};
  });
  CodeMirror.defineMIME("text/plain", "null");

  var modeExtensions = CodeMirror.modeExtensions = {};
  CodeMirror.extendMode = function(mode, properties) {
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
    copyObj(properties, exts);
  };

  // EXTENSIONS

  CodeMirror.defineExtension = function(name, func) {
    CodeMirror.prototype[name] = func;
  };
  CodeMirror.defineDocExtension = function(name, func) {
    Doc.prototype[name] = func;
  };
  CodeMirror.defineOption = option;

  var initHooks = [];
  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};

  var helpers = CodeMirror.helpers = {};
  CodeMirror.registerHelper = function(type, name, value) {
    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {};
    helpers[type][name] = value;
  };

  // UTILITIES

  CodeMirror.isWordChar = isWordChar;

  // MODE STATE HANDLING

  // Utility functions for working with state. Exported because modes
  // sometimes need to do this.
  function copyState(mode, state) {
    if (state === true) return state;
    if (mode.copyState) return mode.copyState(state);
    var nstate = {};
    for (var n in state) {
      var val = state[n];
      if (val instanceof Array) val = val.concat([]);
      nstate[n] = val;
    }
    return nstate;
  }
  CodeMirror.copyState = copyState;

  function startState(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
  }
  CodeMirror.startState = startState;

  CodeMirror.innerMode = function(mode, state) {
    while (mode.innerMode) {
      var info = mode.innerMode(state);
      if (!info || info.mode == mode) break;
      state = info.state;
      mode = info.mode;
    }
    return info || {mode: mode, state: state};
  };

  // STANDARD COMMANDS

  var commands = CodeMirror.commands = {
    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()));},
    killLine: function(cm) {
      var from = cm.getCursor(true), to = cm.getCursor(false), sel = !posEq(from, to);
      if (!sel && cm.getLine(from.line).length == from.ch)
        cm.replaceRange("", from, Pos(from.line + 1, 0), "+delete");
      else cm.replaceRange("", from, sel ? to : Pos(from.line), "+delete");
    },
    deleteLine: function(cm) {
      var l = cm.getCursor().line;
      cm.replaceRange("", Pos(l, 0), Pos(l), "+delete");
    },
    delLineLeft: function(cm) {
      var cur = cm.getCursor();
      cm.replaceRange("", Pos(cur.line, 0), cur, "+delete");
    },
    undo: function(cm) {cm.undo();},
    redo: function(cm) {cm.redo();},
    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
    goLineStart: function(cm) {
      cm.extendSelection(lineStart(cm, cm.getCursor().line));
    },
    goLineStartSmart: function(cm) {
      var cur = cm.getCursor(), start = lineStart(cm, cur.line);
      var line = cm.getLineHandle(start.line);
      var order = getOrder(line);
      if (!order || order[0].level == 0) {
        var firstNonWS = Math.max(0, line.text.search(/\S/));
        var inWS = cur.line == start.line && cur.ch <= firstNonWS && cur.ch;
        cm.extendSelection(Pos(start.line, inWS ? 0 : firstNonWS));
      } else cm.extendSelection(start);
    },
    goLineEnd: function(cm) {
      cm.extendSelection(lineEnd(cm, cm.getCursor().line));
    },
    goLineRight: function(cm) {
      var top = cm.charCoords(cm.getCursor(), "div").top + 5;
      cm.extendSelection(cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div"));
    },
    goLineLeft: function(cm) {
      var top = cm.charCoords(cm.getCursor(), "div").top + 5;
      cm.extendSelection(cm.coordsChar({left: 0, top: top}, "div"));
    },
    goLineUp: function(cm) {cm.moveV(-1, "line");},
    goLineDown: function(cm) {cm.moveV(1, "line");},
    goPageUp: function(cm) {cm.moveV(-1, "page");},
    goPageDown: function(cm) {cm.moveV(1, "page");},
    goCharLeft: function(cm) {cm.moveH(-1, "char");},
    goCharRight: function(cm) {cm.moveH(1, "char");},
    goColumnLeft: function(cm) {cm.moveH(-1, "column");},
    goColumnRight: function(cm) {cm.moveH(1, "column");},
    goWordLeft: function(cm) {cm.moveH(-1, "word");},
    goGroupRight: function(cm) {cm.moveH(1, "group");},
    goGroupLeft: function(cm) {cm.moveH(-1, "group");},
    goWordRight: function(cm) {cm.moveH(1, "word");},
    delCharBefore: function(cm) {cm.deleteH(-1, "char");},
    delCharAfter: function(cm) {cm.deleteH(1, "char");},
    delWordBefore: function(cm) {cm.deleteH(-1, "word");},
    delWordAfter: function(cm) {cm.deleteH(1, "word");},
    delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
    delGroupAfter: function(cm) {cm.deleteH(1, "group");},
    indentAuto: function(cm) {cm.indentSelection("smart");},
    indentMore: function(cm) {cm.indentSelection("add");},
    indentLess: function(cm) {cm.indentSelection("subtract");},
    insertTab: function(cm) {cm.replaceSelection("\t", "end", "+input");},
    defaultTab: function(cm) {
      if (cm.somethingSelected()) cm.indentSelection("add");
      else cm.replaceSelection("\t", "end", "+input");
    },
    transposeChars: function(cm) {
      var cur = cm.getCursor(), line = cm.getLine(cur.line);
      if (cur.ch > 0 && cur.ch < line.length - 1)
        cm.replaceRange(line.charAt(cur.ch) + line.charAt(cur.ch - 1),
                        Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1));
    },
    newlineAndIndent: function(cm) {
      operation(cm, function() {
        cm.replaceSelection("\n", "end", "+input");
        cm.indentLine(cm.getCursor().line, null, true);
      })();
    },
    toggleOverwrite: function(cm) {cm.toggleOverwrite();}
  };

  // STANDARD KEYMAPS

  var keyMap = CodeMirror.keyMap = {};
  keyMap.basic = {
    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
    "Tab": "defaultTab", "Shift-Tab": "indentAuto",
    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite"
  };
  // Note that the save and find-related commands aren't defined by
  // default. Unknown commands are simply ignored.
  keyMap.pcDefault = {
    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
    "Ctrl-Home": "goDocStart", "Alt-Up": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Down": "goDocEnd",
    "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
    "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
    fallthrough: "basic"
  };
  keyMap.macDefault = {
    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
    "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
    "Alt-Right": "goGroupRight", "Cmd-Left": "goLineStart", "Cmd-Right": "goLineEnd", "Alt-Backspace": "delGroupBefore",
    "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
    "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delLineLeft",
    fallthrough: ["basic", "emacsy"]
  };
  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
  keyMap.emacsy = {
    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
  };

  // KEYMAP DISPATCH

  function getKeyMap(val) {
    if (typeof val == "string") return keyMap[val];
    else return val;
  }

  function lookupKey(name, maps, handle) {
    function lookup(map) {
      map = getKeyMap(map);
      var found = map[name];
      if (found === false) return "stop";
      if (found != null && handle(found)) return true;
      if (map.nofallthrough) return "stop";

      var fallthrough = map.fallthrough;
      if (fallthrough == null) return false;
      if (Object.prototype.toString.call(fallthrough) != "[object Array]")
        return lookup(fallthrough);
      for (var i = 0, e = fallthrough.length; i < e; ++i) {
        var done = lookup(fallthrough[i]);
        if (done) return done;
      }
      return false;
    }

    for (var i = 0; i < maps.length; ++i) {
      var done = lookup(maps[i]);
      if (done) return done != "stop";
    }
  }
  function isModifierKey(event) {
    var name = keyNames[event.keyCode];
    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
  }
  function keyName(event, noShift) {
    if (opera && event.keyCode == 34 && event["char"]) return false;
    var name = keyNames[event.keyCode];
    if (name == null || event.altGraphKey) return false;
    if (event.altKey) name = "Alt-" + name;
    if (flipCtrlCmd ? event.metaKey : event.ctrlKey) name = "Ctrl-" + name;
    if (flipCtrlCmd ? event.ctrlKey : event.metaKey) name = "Cmd-" + name;
    if (!noShift && event.shiftKey) name = "Shift-" + name;
    return name;
  }
  CodeMirror.lookupKey = lookupKey;
  CodeMirror.isModifierKey = isModifierKey;
  CodeMirror.keyName = keyName;

  // FROMTEXTAREA

  CodeMirror.fromTextArea = function(textarea, options) {
    if (!options) options = {};
    options.value = textarea.value;
    if (!options.tabindex && textarea.tabindex)
      options.tabindex = textarea.tabindex;
    if (!options.placeholder && textarea.placeholder)
      options.placeholder = textarea.placeholder;
    // Set autofocus to true if this textarea is focused, or if it has
    // autofocus and no other element is focused.
    if (options.autofocus == null) {
      var hasFocus = document.body;
      // doc.activeElement occasionally throws on IE
      try { hasFocus = document.activeElement; } catch(e) {}
      options.autofocus = hasFocus == textarea ||
        textarea.getAttribute("autofocus") != null && hasFocus == document.body;
    }

    function save() {textarea.value = cm.getValue();}
    if (textarea.form) {
      on(textarea.form, "submit", save);
      // Deplorable hack to make the submit method do the right thing.
      if (!options.leaveSubmitMethodAlone) {
        var form = textarea.form, realSubmit = form.submit;
        try {
          var wrappedSubmit = form.submit = function() {
            save();
            form.submit = realSubmit;
            form.submit();
            form.submit = wrappedSubmit;
          };
        } catch(e) {}
      }
    }

    textarea.style.display = "none";
    var cm = CodeMirror(function(node) {
      textarea.parentNode.insertBefore(node, textarea.nextSibling);
    }, options);
    cm.save = save;
    cm.getTextArea = function() { return textarea; };
    cm.toTextArea = function() {
      save();
      textarea.parentNode.removeChild(cm.getWrapperElement());
      textarea.style.display = "";
      if (textarea.form) {
        off(textarea.form, "submit", save);
        if (typeof textarea.form.submit == "function")
          textarea.form.submit = realSubmit;
      }
    };
    return cm;
  };

  // STRING STREAM

  // Fed to the mode parsers, provides helper functions to make
  // parsers more succinct.

  // The character stream used by a mode's parser.
  function StringStream(string, tabSize) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
  }

  StringStream.prototype = {
    eol: function() {return this.pos >= this.string.length;},
    sol: function() {return this.pos == 0;},
    peek: function() {return this.string.charAt(this.pos) || undefined;},
    next: function() {
      if (this.pos < this.string.length)
        return this.string.charAt(this.pos++);
    },
    eat: function(match) {
      var ch = this.string.charAt(this.pos);
      if (typeof match == "string") var ok = ch == match;
      else var ok = ch && (match.test ? match.test(ch) : match(ch));
      if (ok) {++this.pos; return ch;}
    },
    eatWhile: function(match) {
      var start = this.pos;
      while (this.eat(match)){}
      return this.pos > start;
    },
    eatSpace: function() {
      var start = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
      return this.pos > start;
    },
    skipToEnd: function() {this.pos = this.string.length;},
    skipTo: function(ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {this.pos = found; return true;}
    },
    backUp: function(n) {this.pos -= n;},
    column: function() {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue;
    },
    indentation: function() {return countColumn(this.string, null, this.tabSize);},
    match: function(pattern, consume, caseInsensitive) {
      if (typeof pattern == "string") {
        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
        var substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) == cased(pattern)) {
          if (consume !== false) this.pos += pattern.length;
          return true;
        }
      } else {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) return null;
        if (match && consume !== false) this.pos += match[0].length;
        return match;
      }
    },
    current: function(){return this.string.slice(this.start, this.pos);}
  };
  CodeMirror.StringStream = StringStream;

  // TEXTMARKERS

  function TextMarker(doc, type) {
    this.lines = [];
    this.type = type;
    this.doc = doc;
  }
  CodeMirror.TextMarker = TextMarker;
  eventMixin(TextMarker);

  TextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    var cm = this.doc.cm, withOp = cm && !cm.curOp;
    if (withOp) startOperation(cm);
    if (hasHandler(this, "clear")) {
      var found = this.find();
      if (found) signalLater(this, "clear", found.from, found.to);
    }
    var min = null, max = null;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.to != null) max = lineNo(line);
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
      if (span.from != null)
        min = lineNo(line);
      else if (this.collapsed && !lineIsHidden(this.doc, line) && cm)
        updateLineHeight(line, textHeight(cm.display));
    }
    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
      var visual = visualLine(cm.doc, this.lines[i]), len = lineLength(cm.doc, visual);
      if (len > cm.display.maxLineLength) {
        cm.display.maxLine = visual;
        cm.display.maxLineLength = len;
        cm.display.maxLineChanged = true;
      }
    }

    if (min != null && cm) regChange(cm, min, max + 1);
    this.lines.length = 0;
    this.explicitlyCleared = true;
    if (this.atomic && this.doc.cantEdit) {
      this.doc.cantEdit = false;
      if (cm) reCheckSelection(cm);
    }
    if (withOp) endOperation(cm);
  };

  TextMarker.prototype.find = function() {
    var from, to;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.from != null || span.to != null) {
        var found = lineNo(line);
        if (span.from != null) from = Pos(found, span.from);
        if (span.to != null) to = Pos(found, span.to);
      }
    }
    if (this.type == "bookmark") return from;
    return from && {from: from, to: to};
  };

  TextMarker.prototype.changed = function() {
    var pos = this.find(), cm = this.doc.cm;
    if (!pos || !cm) return;
    if (this.type != "bookmark") pos = pos.from;
    var line = getLine(this.doc, pos.line);
    clearCachedMeasurement(cm, line);
    if (pos.line >= cm.display.showingFrom && pos.line < cm.display.showingTo) {
      for (var node = cm.display.lineDiv.firstChild; node; node = node.nextSibling) if (node.lineObj == line) {
        if (node.offsetHeight != line.height) updateLineHeight(line, node.offsetHeight);
        break;
      }
      runInOp(cm, function() {
        cm.curOp.selectionChanged = cm.curOp.forceUpdate = cm.curOp.updateMaxLine = true;
      });
    }
  };

  TextMarker.prototype.attachLine = function(line) {
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
    }
    this.lines.push(line);
  };
  TextMarker.prototype.detachLine = function(line) {
    this.lines.splice(indexOf(this.lines, line), 1);
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
    }
  };

  function markText(doc, from, to, options, type) {
    if (options && options.shared) return markTextShared(doc, from, to, options, type);
    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

    var marker = new TextMarker(doc, type);
    if (type == "range" && !posLess(from, to)) return marker;
    if (options) copyObj(options, marker);
    if (marker.replacedWith) {
      marker.collapsed = true;
      marker.replacedWith = elt("span", [marker.replacedWith], "CodeMirror-widget");
      if (!options.handleMouseEvents) marker.replacedWith.ignoreEvents = true;
    }
    if (marker.collapsed) sawCollapsedSpans = true;

    if (marker.addToHistory)
      addToHistory(doc, {from: from, to: to, origin: "markText"},
                   {head: doc.sel.head, anchor: doc.sel.anchor}, NaN);

    var curLine = from.line, size = 0, collapsedAtStart, collapsedAtEnd, cm = doc.cm, updateMaxLine;
    doc.iter(curLine, to.line + 1, function(line) {
      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(doc, line) == cm.display.maxLine)
        updateMaxLine = true;
      var span = {from: null, to: null, marker: marker};
      size += line.text.length;
      if (curLine == from.line) {span.from = from.ch; size -= from.ch;}
      if (curLine == to.line) {span.to = to.ch; size -= line.text.length - to.ch;}
      if (marker.collapsed) {
        if (curLine == to.line) collapsedAtEnd = collapsedSpanAt(line, to.ch);
        if (curLine == from.line) collapsedAtStart = collapsedSpanAt(line, from.ch);
        else updateLineHeight(line, 0);
      }
      addMarkedSpan(line, span);
      ++curLine;
    });
    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
    });

    if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });

    if (marker.readOnly) {
      sawReadOnlySpans = true;
      if (doc.history.done.length || doc.history.undone.length)
        doc.clearHistory();
    }
    if (marker.collapsed) {
      if (collapsedAtStart != collapsedAtEnd)
        throw new Error("Inserting collapsed marker overlapping an existing one");
      marker.size = size;
      marker.atomic = true;
    }
    if (cm) {
      if (updateMaxLine) cm.curOp.updateMaxLine = true;
      if (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.collapsed)
        regChange(cm, from.line, to.line + 1);
      if (marker.atomic) reCheckSelection(cm);
    }
    return marker;
  }

  // SHARED TEXTMARKERS

  function SharedTextMarker(markers, primary) {
    this.markers = markers;
    this.primary = primary;
    for (var i = 0, me = this; i < markers.length; ++i) {
      markers[i].parent = this;
      on(markers[i], "clear", function(){me.clear();});
    }
  }
  CodeMirror.SharedTextMarker = SharedTextMarker;
  eventMixin(SharedTextMarker);

  SharedTextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    this.explicitlyCleared = true;
    for (var i = 0; i < this.markers.length; ++i)
      this.markers[i].clear();
    signalLater(this, "clear");
  };
  SharedTextMarker.prototype.find = function() {
    return this.primary.find();
  };

  function markTextShared(doc, from, to, options, type) {
    options = copyObj(options);
    options.shared = false;
    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
    var widget = options.replacedWith;
    linkedDocs(doc, function(doc) {
      if (widget) options.replacedWith = widget.cloneNode(true);
      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
      for (var i = 0; i < doc.linked.length; ++i)
        if (doc.linked[i].isParent) return;
      primary = lst(markers);
    });
    return new SharedTextMarker(markers, primary);
  }

  // TEXTMARKER SPANS

  function getMarkedSpanFor(spans, marker) {
    if (spans) for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.marker == marker) return span;
    }
  }
  function removeMarkedSpan(spans, span) {
    for (var r, i = 0; i < spans.length; ++i)
      if (spans[i] != span) (r || (r = [])).push(spans[i]);
    return r;
  }
  function addMarkedSpan(line, span) {
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
    span.marker.attachLine(line);
  }

  function markedSpansBefore(old, startCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
      if (startsBefore || marker.type == "bookmark" && span.from == startCh && (!isInsert || !span.marker.insertLeft)) {
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
        (nw || (nw = [])).push({from: span.from,
                                to: endsAfter ? null : span.to,
                                marker: marker});
      }
    }
    return nw;
  }

  function markedSpansAfter(old, endCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
      if (endsAfter || marker.type == "bookmark" && span.from == endCh && (!isInsert || span.marker.insertLeft)) {
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
        (nw || (nw = [])).push({from: startsBefore ? null : span.from - endCh,
                                to: span.to == null ? null : span.to - endCh,
                                marker: marker});
      }
    }
    return nw;
  }

  function stretchSpansOverChange(doc, change) {
    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
    if (!oldFirst && !oldLast) return null;

    var startCh = change.from.ch, endCh = change.to.ch, isInsert = posEq(change.from, change.to);
    // Get the spans that 'stick out' on both sides
    var first = markedSpansBefore(oldFirst, startCh, isInsert);
    var last = markedSpansAfter(oldLast, endCh, isInsert);

    // Next, merge those two ends
    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
    if (first) {
      // Fix up .to properties of first
      for (var i = 0; i < first.length; ++i) {
        var span = first[i];
        if (span.to == null) {
          var found = getMarkedSpanFor(last, span.marker);
          if (!found) span.to = startCh;
          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
        }
      }
    }
    if (last) {
      // Fix up .from in last (or move them into first in case of sameLine)
      for (var i = 0; i < last.length; ++i) {
        var span = last[i];
        if (span.to != null) span.to += offset;
        if (span.from == null) {
          var found = getMarkedSpanFor(first, span.marker);
          if (!found) {
            span.from = offset;
            if (sameLine) (first || (first = [])).push(span);
          }
        } else {
          span.from += offset;
          if (sameLine) (first || (first = [])).push(span);
        }
      }
    }
    if (sameLine && first) {
      // Make sure we didn't create any zero-length spans
      for (var i = 0; i < first.length; ++i)
        if (first[i].from != null && first[i].from == first[i].to && first[i].marker.type != "bookmark")
          first.splice(i--, 1);
      if (!first.length) first = null;
    }

    var newMarkers = [first];
    if (!sameLine) {
      // Fill gap with whole-line-spans
      var gap = change.text.length - 2, gapMarkers;
      if (gap > 0 && first)
        for (var i = 0; i < first.length; ++i)
          if (first[i].to == null)
            (gapMarkers || (gapMarkers = [])).push({from: null, to: null, marker: first[i].marker});
      for (var i = 0; i < gap; ++i)
        newMarkers.push(gapMarkers);
      newMarkers.push(last);
    }
    return newMarkers;
  }

  function mergeOldSpans(doc, change) {
    var old = getOldSpans(doc, change);
    var stretched = stretchSpansOverChange(doc, change);
    if (!old) return stretched;
    if (!stretched) return old;

    for (var i = 0; i < old.length; ++i) {
      var oldCur = old[i], stretchCur = stretched[i];
      if (oldCur && stretchCur) {
        spans: for (var j = 0; j < stretchCur.length; ++j) {
          var span = stretchCur[j];
          for (var k = 0; k < oldCur.length; ++k)
            if (oldCur[k].marker == span.marker) continue spans;
          oldCur.push(span);
        }
      } else if (stretchCur) {
        old[i] = stretchCur;
      }
    }
    return old;
  }

  function removeReadOnlyRanges(doc, from, to) {
    var markers = null;
    doc.iter(from.line, to.line + 1, function(line) {
      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
        var mark = line.markedSpans[i].marker;
        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
          (markers || (markers = [])).push(mark);
      }
    });
    if (!markers) return null;
    var parts = [{from: from, to: to}];
    for (var i = 0; i < markers.length; ++i) {
      var mk = markers[i], m = mk.find();
      for (var j = 0; j < parts.length; ++j) {
        var p = parts[j];
        if (posLess(p.to, m.from) || posLess(m.to, p.from)) continue;
        var newParts = [j, 1];
        if (posLess(p.from, m.from) || !mk.inclusiveLeft && posEq(p.from, m.from))
          newParts.push({from: p.from, to: m.from});
        if (posLess(m.to, p.to) || !mk.inclusiveRight && posEq(p.to, m.to))
          newParts.push({from: m.to, to: p.to});
        parts.splice.apply(parts, newParts);
        j += newParts.length - 1;
      }
    }
    return parts;
  }

  function collapsedSpanAt(line, ch) {
    var sps = sawCollapsedSpans && line.markedSpans, found;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if ((sp.from == null || sp.from < ch) &&
          (sp.to == null || sp.to > ch) &&
          (!found || found.width < sp.marker.width))
        found = sp.marker;
    }
    return found;
  }
  function collapsedSpanAtStart(line) { return collapsedSpanAt(line, -1); }
  function collapsedSpanAtEnd(line) { return collapsedSpanAt(line, line.text.length + 1); }

  function visualLine(doc, line) {
    var merged;
    while (merged = collapsedSpanAtStart(line))
      line = getLine(doc, merged.find().from.line);
    return line;
  }

  function lineIsHidden(doc, line) {
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if (sp.from == null) return true;
      if (sp.marker.replacedWith) continue;
      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
        return true;
    }
  }
  function lineIsHiddenInner(doc, line, span) {
    if (span.to == null) {
      var end = span.marker.find().to, endLine = getLine(doc, end.line);
      return lineIsHiddenInner(doc, endLine, getMarkedSpanFor(endLine.markedSpans, span.marker));
    }
    if (span.marker.inclusiveRight && span.to == line.text.length)
      return true;
    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
      sp = line.markedSpans[i];
      if (sp.marker.collapsed && !sp.marker.replacedWith && sp.from == span.to &&
          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
          lineIsHiddenInner(doc, line, sp)) return true;
    }
  }

  function detachMarkedSpans(line) {
    var spans = line.markedSpans;
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.detachLine(line);
    line.markedSpans = null;
  }

  function attachMarkedSpans(line, spans) {
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.attachLine(line);
    line.markedSpans = spans;
  }

  // LINE WIDGETS

  var LineWidget = CodeMirror.LineWidget = function(cm, node, options) {
    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
      this[opt] = options[opt];
    this.cm = cm;
    this.node = node;
  };
  eventMixin(LineWidget);
  function widgetOperation(f) {
    return function() {
      var withOp = !this.cm.curOp;
      if (withOp) startOperation(this.cm);
      try {var result = f.apply(this, arguments);}
      finally {if (withOp) endOperation(this.cm);}
      return result;
    };
  }
  LineWidget.prototype.clear = widgetOperation(function() {
    var ws = this.line.widgets, no = lineNo(this.line);
    if (no == null || !ws) return;
    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
    if (!ws.length) this.line.widgets = null;
    var aboveVisible = heightAtLine(this.cm, this.line) < this.cm.doc.scrollTop;
    updateLineHeight(this.line, Math.max(0, this.line.height - widgetHeight(this)));
    if (aboveVisible) addToScrollPos(this.cm, 0, -this.height);
    regChange(this.cm, no, no + 1);
  });
  LineWidget.prototype.changed = widgetOperation(function() {
    var oldH = this.height;
    this.height = null;
    var diff = widgetHeight(this) - oldH;
    if (!diff) return;
    updateLineHeight(this.line, this.line.height + diff);
    var no = lineNo(this.line);
    regChange(this.cm, no, no + 1);
  });

  function widgetHeight(widget) {
    if (widget.height != null) return widget.height;
    if (!widget.node.parentNode || widget.node.parentNode.nodeType != 1)
      removeChildrenAndAdd(widget.cm.display.measure, elt("div", [widget.node], null, "position: relative"));
    return widget.height = widget.node.offsetHeight;
  }

  function addLineWidget(cm, handle, node, options) {
    var widget = new LineWidget(cm, node, options);
    if (widget.noHScroll) cm.display.alignWidgets = true;
    changeLine(cm, handle, function(line) {
      var widgets = line.widgets || (line.widgets = []);
      if (widget.insertAt == null) widgets.push(widget);
      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
      widget.line = line;
      if (!lineIsHidden(cm.doc, line) || widget.showIfHidden) {
        var aboveVisible = heightAtLine(cm, line) < cm.doc.scrollTop;
        updateLineHeight(line, line.height + widgetHeight(widget));
        if (aboveVisible) addToScrollPos(cm, 0, widget.height);
      }
      return true;
    });
    return widget;
  }

  // LINE DATA STRUCTURE

  // Line objects. These hold state related to a line, including
  // highlighting info (the styles array).
  var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
    this.text = text;
    attachMarkedSpans(this, markedSpans);
    this.height = estimateHeight ? estimateHeight(this) : 1;
  };
  eventMixin(Line);

  function updateLine(line, text, markedSpans, estimateHeight) {
    line.text = text;
    if (line.stateAfter) line.stateAfter = null;
    if (line.styles) line.styles = null;
    if (line.order != null) line.order = null;
    detachMarkedSpans(line);
    attachMarkedSpans(line, markedSpans);
    var estHeight = estimateHeight ? estimateHeight(line) : 1;
    if (estHeight != line.height) updateLineHeight(line, estHeight);
  }

  function cleanUpLine(line) {
    line.parent = null;
    detachMarkedSpans(line);
  }

  // Run the given mode's parser over a line, update the styles
  // array, which contains alternating fragments of text and CSS
  // classes.
  function runMode(cm, text, mode, state, f) {
    var flattenSpans = mode.flattenSpans;
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
    var curStart = 0, curStyle = null;
    var stream = new StringStream(text, cm.options.tabSize), style;
    if (text == "" && mode.blankLine) mode.blankLine(state);
    while (!stream.eol()) {
      if (stream.pos > cm.options.maxHighlightLength) {
        flattenSpans = false;
        stream.pos = text.length;
        style = null;
      } else {
        style = mode.token(stream, state);
      }
      if (!flattenSpans || curStyle != style) {
        if (curStart < stream.start) f(stream.start, curStyle);
        curStart = stream.start; curStyle = style;
      }
      stream.start = stream.pos;
    }
    while (curStart < stream.pos) {
      // Webkit seems to refuse to render text nodes longer than 57444 characters
      var pos = Math.min(stream.pos, curStart + 50000);
      f(pos, curStyle);
      curStart = pos;
    }
  }

  function highlightLine(cm, line, state) {
    // A styles array always starts with a number identifying the
    // mode/overlays that it is based on (for easy invalidation).
    var st = [cm.state.modeGen];
    // Compute the base array of styles
    runMode(cm, line.text, cm.doc.mode, state, function(end, style) {st.push(end, style);});

    // Run overlays, adjust style array.
    for (var o = 0; o < cm.state.overlays.length; ++o) {
      var overlay = cm.state.overlays[o], i = 1, at = 0;
      runMode(cm, line.text, overlay.mode, true, function(end, style) {
        var start = i;
        // Ensure there's a token end at the current position, and that i points at it
        while (at < end) {
          var i_end = st[i];
          if (i_end > end)
            st.splice(i, 1, end, st[i+1], i_end);
          i += 2;
          at = Math.min(end, i_end);
        }
        if (!style) return;
        if (overlay.opaque) {
          st.splice(start, i - start, end, style);
          i = start + 2;
        } else {
          for (; start < i; start += 2) {
            var cur = st[start+1];
            st[start+1] = cur ? cur + " " + style : style;
          }
        }
      });
    }

    return st;
  }

  function getLineStyles(cm, line) {
    if (!line.styles || line.styles[0] != cm.state.modeGen)
      line.styles = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));
    return line.styles;
  }

  // Lightweight form of highlight -- proceed over this line and
  // update state, but don't save a style array.
  function processLine(cm, line, state) {
    var mode = cm.doc.mode;
    var stream = new StringStream(line.text, cm.options.tabSize);
    if (line.text == "" && mode.blankLine) mode.blankLine(state);
    while (!stream.eol() && stream.pos <= cm.options.maxHighlightLength) {
      mode.token(stream, state);
      stream.start = stream.pos;
    }
  }

  var styleToClassCache = {};
  function interpretTokenStyle(style, builder) {
    if (!style) return null;
    for (;;) {
      var lineClass = style.match(/(?:^|\s)line-(background-)?(\S+)/);
      if (!lineClass) break;
      style = style.slice(0, lineClass.index) + style.slice(lineClass.index + lineClass[0].length);
      var prop = lineClass[1] ? "bgClass" : "textClass";
      if (builder[prop] == null)
        builder[prop] = lineClass[2];
      else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(builder[prop]))
        builder[prop] += " " + lineClass[2];
    }
    return styleToClassCache[style] ||
      (styleToClassCache[style] = "cm-" + style.replace(/ +/g, " cm-"));
  }

  function buildLineContent(cm, realLine, measure, copyWidgets) {
    var merged, line = realLine, empty = true;
    while (merged = collapsedSpanAtStart(line))
      line = getLine(cm.doc, merged.find().from.line);

    var builder = {pre: elt("pre"), col: 0, pos: 0,
                   measure: null, measuredSomething: false, cm: cm,
                   copyWidgets: copyWidgets};

    do {
      if (line.text) empty = false;
      builder.measure = line == realLine && measure;
      builder.pos = 0;
      builder.addToken = builder.measure ? buildTokenMeasure : buildToken;
      if ((ie || webkit) && cm.getOption("lineWrapping"))
        builder.addToken = buildTokenSplitSpaces(builder.addToken);
      var next = insertLineContent(line, builder, getLineStyles(cm, line));
      if (measure && line == realLine && !builder.measuredSomething) {
        measure[0] = builder.pre.appendChild(zeroWidthElement(cm.display.measure));
        builder.measuredSomething = true;
      }
      if (next) line = getLine(cm.doc, next.to.line);
    } while (next);

    if (measure && !builder.measuredSomething && !measure[0])
      measure[0] = builder.pre.appendChild(empty ? elt("span", "\u00a0") : zeroWidthElement(cm.display.measure));
    if (!builder.pre.firstChild && !lineIsHidden(cm.doc, realLine))
      builder.pre.appendChild(document.createTextNode("\u00a0"));

    var order;
    // Work around problem with the reported dimensions of single-char
    // direction spans on IE (issue #1129). See also the comment in
    // cursorCoords.
    if (measure && ie && (order = getOrder(line))) {
      var l = order.length - 1;
      if (order[l].from == order[l].to) --l;
      var last = order[l], prev = order[l - 1];
      if (last.from + 1 == last.to && prev && last.level < prev.level) {
        var span = measure[builder.pos - 1];
        if (span) span.parentNode.insertBefore(span.measureRight = zeroWidthElement(cm.display.measure),
                                               span.nextSibling);
      }
    }

    var textClass = builder.textClass ? builder.textClass + " " + (realLine.textClass || "") : realLine.textClass;
    if (textClass) builder.pre.className = textClass;

    signal(cm, "renderLine", cm, realLine, builder.pre);
    return builder;
  }

  var tokenSpecialChars = /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\uFEFF]/g;
  function buildToken(builder, text, style, startStyle, endStyle, title) {
    if (!text) return;
    if (!tokenSpecialChars.test(text)) {
      builder.col += text.length;
      var content = document.createTextNode(text);
    } else {
      var content = document.createDocumentFragment(), pos = 0;
      while (true) {
        tokenSpecialChars.lastIndex = pos;
        var m = tokenSpecialChars.exec(text);
        var skipped = m ? m.index - pos : text.length - pos;
        if (skipped) {
          content.appendChild(document.createTextNode(text.slice(pos, pos + skipped)));
          builder.col += skipped;
        }
        if (!m) break;
        pos += skipped + 1;
        if (m[0] == "\t") {
          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
          content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
          builder.col += tabWidth;
        } else {
          var token = elt("span", "\u2022", "cm-invalidchar");
          token.title = "\\u" + m[0].charCodeAt(0).toString(16);
          content.appendChild(token);
          builder.col += 1;
        }
      }
    }
    if (style || startStyle || endStyle || builder.measure) {
      var fullStyle = style || "";
      if (startStyle) fullStyle += startStyle;
      if (endStyle) fullStyle += endStyle;
      var token = elt("span", [content], fullStyle);
      if (title) token.title = title;
      return builder.pre.appendChild(token);
    }
    builder.pre.appendChild(content);
  }

  function buildTokenMeasure(builder, text, style, startStyle, endStyle) {
    var wrapping = builder.cm.options.lineWrapping;
    for (var i = 0; i < text.length; ++i) {
      var ch = text.charAt(i), start = i == 0;
      if (ch >= "\ud800" && ch < "\udbff" && i < text.length - 1) {
        ch = text.slice(i, i + 2);
        ++i;
      } else if (i && wrapping && spanAffectsWrapping(text, i)) {
        builder.pre.appendChild(elt("wbr"));
      }
      var old = builder.measure[builder.pos];
      var span = builder.measure[builder.pos] =
        buildToken(builder, ch, style,
                   start && startStyle, i == text.length - 1 && endStyle);
      if (old) span.leftSide = old.leftSide || old;
      // In IE single-space nodes wrap differently than spaces
      // embedded in larger text nodes, except when set to
      // white-space: normal (issue #1268).
      if (ie && wrapping && ch == " " && i && !/\s/.test(text.charAt(i - 1)) &&
          i < text.length - 1 && !/\s/.test(text.charAt(i + 1)))
        span.style.whiteSpace = "normal";
      builder.pos += ch.length;
    }
    if (text.length) builder.measuredSomething = true;
  }

  function buildTokenSplitSpaces(inner) {
    function split(old) {
      var out = " ";
      for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : "\u00a0";
      out += " ";
      return out;
    }
    return function(builder, text, style, startStyle, endStyle, title) {
      return inner(builder, text.replace(/ {3,}/, split), style, startStyle, endStyle, title);
    };
  }

  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
    var widget = !ignoreWidget && marker.replacedWith;
    if (widget) {
      if (builder.copyWidgets) widget = widget.cloneNode(true);
      builder.pre.appendChild(widget);
      if (builder.measure) {
        if (size) {
          builder.measure[builder.pos] = widget;
        } else {
          var elt = zeroWidthElement(builder.cm.display.measure);
          if (marker.type == "bookmark" && !marker.insertLeft)
            builder.measure[builder.pos] = builder.pre.appendChild(elt);
          else if (builder.measure[builder.pos])
            return;
          else
            builder.measure[builder.pos] = builder.pre.insertBefore(elt, widget);
        }
        builder.measuredSomething = true;
      }
    }
    builder.pos += size;
  }

  // Outputs a number of spans to make up a line, taking highlighting
  // and marked text into account.
  function insertLineContent(line, builder, styles) {
    var spans = line.markedSpans, allText = line.text, at = 0;
    if (!spans) {
      for (var i = 1; i < styles.length; i+=2)
        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder));
      return;
    }

    var len = allText.length, pos = 0, i = 1, text = "", style;
    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
    for (;;) {
      if (nextChange == pos) { // Update current marker set
        spanStyle = spanEndStyle = spanStartStyle = title = "";
        collapsed = null; nextChange = Infinity;
        var foundBookmarks = [];
        for (var j = 0; j < spans.length; ++j) {
          var sp = spans[j], m = sp.marker;
          if (sp.from <= pos && (sp.to == null || sp.to > pos)) {
            if (sp.to != null && nextChange > sp.to) { nextChange = sp.to; spanEndStyle = ""; }
            if (m.className) spanStyle += " " + m.className;
            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
            if (m.endStyle && sp.to == nextChange) spanEndStyle += " " + m.endStyle;
            if (m.title && !title) title = m.title;
            if (m.collapsed && (!collapsed || collapsed.marker.size < m.size))
              collapsed = sp;
          } else if (sp.from > pos && nextChange > sp.from) {
            nextChange = sp.from;
          }
          if (m.type == "bookmark" && sp.from == pos && m.replacedWith) foundBookmarks.push(m);
        }
        if (collapsed && (collapsed.from || 0) == pos) {
          buildCollapsedSpan(builder, (collapsed.to == null ? len : collapsed.to) - pos,
                             collapsed.marker, collapsed.from == null);
          if (collapsed.to == null) return collapsed.marker.find();
        }
        if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
      }
      if (pos >= len) break;

      var upto = Math.min(len, nextChange);
      while (true) {
        if (text) {
          var end = pos + text.length;
          if (!collapsed) {
            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title);
          }
          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
          pos = end;
          spanStartStyle = "";
        }
        text = allText.slice(at, at = styles[i++]);
        style = interpretTokenStyle(styles[i++], builder);
      }
    }
  }

  // DOCUMENT DATA STRUCTURE

  function updateDoc(doc, change, markedSpans, selAfter, estimateHeight) {
    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
    function update(line, text, spans) {
      updateLine(line, text, spans, estimateHeight);
      signalLater(line, "change", line, change);
    }

    var from = change.from, to = change.to, text = change.text;
    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

    // First adjust the line structure
    if (from.ch == 0 && to.ch == 0 && lastText == "") {
      // This is a whole-line replace. Treated specially to make
      // sure line objects move the way they are supposed to.
      for (var i = 0, e = text.length - 1, added = []; i < e; ++i)
        added.push(new Line(text[i], spansFor(i), estimateHeight));
      update(lastLine, lastLine.text, lastSpans);
      if (nlines) doc.remove(from.line, nlines);
      if (added.length) doc.insert(from.line, added);
    } else if (firstLine == lastLine) {
      if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
      } else {
        for (var added = [], i = 1, e = text.length - 1; i < e; ++i)
          added.push(new Line(text[i], spansFor(i), estimateHeight));
        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        doc.insert(from.line + 1, added);
      }
    } else if (text.length == 1) {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
      doc.remove(from.line + 1, nlines);
    } else {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
      for (var i = 1, e = text.length - 1, added = []; i < e; ++i)
        added.push(new Line(text[i], spansFor(i), estimateHeight));
      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
      doc.insert(from.line + 1, added);
    }

    signalLater(doc, "change", doc, change);
    setSelection(doc, selAfter.anchor, selAfter.head, null, true);
  }

  function LeafChunk(lines) {
    this.lines = lines;
    this.parent = null;
    for (var i = 0, e = lines.length, height = 0; i < e; ++i) {
      lines[i].parent = this;
      height += lines[i].height;
    }
    this.height = height;
  }

  LeafChunk.prototype = {
    chunkSize: function() { return this.lines.length; },
    removeInner: function(at, n) {
      for (var i = at, e = at + n; i < e; ++i) {
        var line = this.lines[i];
        this.height -= line.height;
        cleanUpLine(line);
        signalLater(line, "delete");
      }
      this.lines.splice(at, n);
    },
    collapse: function(lines) {
      lines.splice.apply(lines, [lines.length, 0].concat(this.lines));
    },
    insertInner: function(at, lines, height) {
      this.height += height;
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
      for (var i = 0, e = lines.length; i < e; ++i) lines[i].parent = this;
    },
    iterN: function(at, n, op) {
      for (var e = at + n; at < e; ++at)
        if (op(this.lines[at])) return true;
    }
  };

  function BranchChunk(children) {
    this.children = children;
    var size = 0, height = 0;
    for (var i = 0, e = children.length; i < e; ++i) {
      var ch = children[i];
      size += ch.chunkSize(); height += ch.height;
      ch.parent = this;
    }
    this.size = size;
    this.height = height;
    this.parent = null;
  }

  BranchChunk.prototype = {
    chunkSize: function() { return this.size; },
    removeInner: function(at, n) {
      this.size -= n;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var rm = Math.min(n, sz - at), oldHeight = child.height;
          child.removeInner(at, rm);
          this.height -= oldHeight - child.height;
          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
          if ((n -= rm) == 0) break;
          at = 0;
        } else at -= sz;
      }
      if (this.size - n < 25) {
        var lines = [];
        this.collapse(lines);
        this.children = [new LeafChunk(lines)];
        this.children[0].parent = this;
      }
    },
    collapse: function(lines) {
      for (var i = 0, e = this.children.length; i < e; ++i) this.children[i].collapse(lines);
    },
    insertInner: function(at, lines, height) {
      this.size += lines.length;
      this.height += height;
      for (var i = 0, e = this.children.length; i < e; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at <= sz) {
          child.insertInner(at, lines, height);
          if (child.lines && child.lines.length > 50) {
            while (child.lines.length > 50) {
              var spilled = child.lines.splice(child.lines.length - 25, 25);
              var newleaf = new LeafChunk(spilled);
              child.height -= newleaf.height;
              this.children.splice(i + 1, 0, newleaf);
              newleaf.parent = this;
            }
            this.maybeSpill();
          }
          break;
        }
        at -= sz;
      }
    },
    maybeSpill: function() {
      if (this.children.length <= 10) return;
      var me = this;
      do {
        var spilled = me.children.splice(me.children.length - 5, 5);
        var sibling = new BranchChunk(spilled);
        if (!me.parent) { // Become the parent node
          var copy = new BranchChunk(me.children);
          copy.parent = me;
          me.children = [copy, sibling];
          me = copy;
        } else {
          me.size -= sibling.size;
          me.height -= sibling.height;
          var myIndex = indexOf(me.parent.children, me);
          me.parent.children.splice(myIndex + 1, 0, sibling);
        }
        sibling.parent = me.parent;
      } while (me.children.length > 10);
      me.parent.maybeSpill();
    },
    iterN: function(at, n, op) {
      for (var i = 0, e = this.children.length; i < e; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var used = Math.min(n, sz - at);
          if (child.iterN(at, used, op)) return true;
          if ((n -= used) == 0) break;
          at = 0;
        } else at -= sz;
      }
    }
  };

  var nextDocId = 0;
  var Doc = CodeMirror.Doc = function(text, mode, firstLine) {
    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
    if (firstLine == null) firstLine = 0;

    BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
    this.first = firstLine;
    this.scrollTop = this.scrollLeft = 0;
    this.cantEdit = false;
    this.history = makeHistory();
    this.cleanGeneration = 1;
    this.frontier = firstLine;
    var start = Pos(firstLine, 0);
    this.sel = {from: start, to: start, head: start, anchor: start, shift: false, extend: false, goalColumn: null};
    this.id = ++nextDocId;
    this.modeOption = mode;

    if (typeof text == "string") text = splitLines(text);
    updateDoc(this, {from: start, to: start, text: text}, null, {head: start, anchor: start});
  };

  Doc.prototype = createObj(BranchChunk.prototype, {
    constructor: Doc,
    iter: function(from, to, op) {
      if (op) this.iterN(from - this.first, to - from, op);
      else this.iterN(this.first, this.first + this.size, from);
    },

    insert: function(at, lines) {
      var height = 0;
      for (var i = 0, e = lines.length; i < e; ++i) height += lines[i].height;
      this.insertInner(at - this.first, lines, height);
    },
    remove: function(at, n) { this.removeInner(at - this.first, n); },

    getValue: function(lineSep) {
      var lines = getLines(this, this.first, this.first + this.size);
      if (lineSep === false) return lines;
      return lines.join(lineSep || "\n");
    },
    setValue: function(code) {
      var top = Pos(this.first, 0), last = this.first + this.size - 1;
      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
                        text: splitLines(code), origin: "setValue"},
                 {head: top, anchor: top}, true);
    },
    replaceRange: function(code, from, to, origin) {
      from = clipPos(this, from);
      to = to ? clipPos(this, to) : from;
      replaceRange(this, code, from, to, origin);
    },
    getRange: function(from, to, lineSep) {
      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
      if (lineSep === false) return lines;
      return lines.join(lineSep || "\n");
    },

    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},
    setLine: function(line, text) {
      if (isLine(this, line))
        replaceRange(this, text, Pos(line, 0), clipPos(this, Pos(line)));
    },
    removeLine: function(line) {
      if (line) replaceRange(this, "", clipPos(this, Pos(line - 1)), clipPos(this, Pos(line)));
      else replaceRange(this, "", Pos(0, 0), clipPos(this, Pos(1, 0)));
    },

    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
    getLineNumber: function(line) {return lineNo(line);},

    getLineHandleVisualStart: function(line) {
      if (typeof line == "number") line = getLine(this, line);
      return visualLine(this, line);
    },

    lineCount: function() {return this.size;},
    firstLine: function() {return this.first;},
    lastLine: function() {return this.first + this.size - 1;},

    clipPos: function(pos) {return clipPos(this, pos);},

    getCursor: function(start) {
      var sel = this.sel, pos;
      if (start == null || start == "head") pos = sel.head;
      else if (start == "anchor") pos = sel.anchor;
      else if (start == "end" || start === false) pos = sel.to;
      else pos = sel.from;
      return copyPos(pos);
    },
    somethingSelected: function() {return !posEq(this.sel.head, this.sel.anchor);},

    setCursor: docOperation(function(line, ch, extend) {
      var pos = clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line);
      if (extend) extendSelection(this, pos);
      else setSelection(this, pos, pos);
    }),
    setSelection: docOperation(function(anchor, head, bias) {
      setSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), bias);
    }),
    extendSelection: docOperation(function(from, to, bias) {
      extendSelection(this, clipPos(this, from), to && clipPos(this, to), bias);
    }),

    getSelection: function(lineSep) {return this.getRange(this.sel.from, this.sel.to, lineSep);},
    replaceSelection: function(code, collapse, origin) {
      makeChange(this, {from: this.sel.from, to: this.sel.to, text: splitLines(code), origin: origin}, collapse || "around");
    },
    undo: docOperation(function() {makeChangeFromHistory(this, "undo");}),
    redo: docOperation(function() {makeChangeFromHistory(this, "redo");}),

    setExtending: function(val) {this.sel.extend = val;},

    historySize: function() {
      var hist = this.history;
      return {undo: hist.done.length, redo: hist.undone.length};
    },
    clearHistory: function() {this.history = makeHistory(this.history.maxGeneration);},

    markClean: function() {
      this.cleanGeneration = this.changeGeneration();
    },
    changeGeneration: function() {
      this.history.lastOp = this.history.lastOrigin = null;
      return this.history.generation;
    },
    isClean: function (gen) {
      return this.history.generation == (gen || this.cleanGeneration);
    },

    getHistory: function() {
      return {done: copyHistoryArray(this.history.done),
              undone: copyHistoryArray(this.history.undone)};
    },
    setHistory: function(histData) {
      var hist = this.history = makeHistory(this.history.maxGeneration);
      hist.done = histData.done.slice(0);
      hist.undone = histData.undone.slice(0);
    },

    markText: function(from, to, options) {
      return markText(this, clipPos(this, from), clipPos(this, to), options, "range");
    },
    setBookmark: function(pos, options) {
      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
                      insertLeft: options && options.insertLeft};
      pos = clipPos(this, pos);
      return markText(this, pos, pos, realOpts, "bookmark");
    },
    findMarksAt: function(pos) {
      pos = clipPos(this, pos);
      var markers = [], spans = getLine(this, pos.line).markedSpans;
      if (spans) for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if ((span.from == null || span.from <= pos.ch) &&
            (span.to == null || span.to >= pos.ch))
          markers.push(span.marker.parent || span.marker);
      }
      return markers;
    },
    getAllMarks: function() {
      var markers = [];
      this.iter(function(line) {
        var sps = line.markedSpans;
        if (sps) for (var i = 0; i < sps.length; ++i)
          if (sps[i].from != null) markers.push(sps[i].marker);
      });
      return markers;
    },

    posFromIndex: function(off) {
      var ch, lineNo = this.first;
      this.iter(function(line) {
        var sz = line.text.length + 1;
        if (sz > off) { ch = off; return true; }
        off -= sz;
        ++lineNo;
      });
      return clipPos(this, Pos(lineNo, ch));
    },
    indexFromPos: function (coords) {
      coords = clipPos(this, coords);
      var index = coords.ch;
      if (coords.line < this.first || coords.ch < 0) return 0;
      this.iter(this.first, coords.line, function (line) {
        index += line.text.length + 1;
      });
      return index;
    },

    copy: function(copyHistory) {
      var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
      doc.sel = {from: this.sel.from, to: this.sel.to, head: this.sel.head, anchor: this.sel.anchor,
                 shift: this.sel.shift, extend: false, goalColumn: this.sel.goalColumn};
      if (copyHistory) {
        doc.history.undoDepth = this.history.undoDepth;
        doc.setHistory(this.getHistory());
      }
      return doc;
    },

    linkedDoc: function(options) {
      if (!options) options = {};
      var from = this.first, to = this.first + this.size;
      if (options.from != null && options.from > from) from = options.from;
      if (options.to != null && options.to < to) to = options.to;
      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
      if (options.sharedHist) copy.history = this.history;
      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
      return copy;
    },
    unlinkDoc: function(other) {
      if (other instanceof CodeMirror) other = other.doc;
      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
        var link = this.linked[i];
        if (link.doc != other) continue;
        this.linked.splice(i, 1);
        other.unlinkDoc(this);
        break;
      }
      // If the histories were shared, split them again
      if (other.history == this.history) {
        var splitIds = [other.id];
        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
        other.history = makeHistory();
        other.history.done = copyHistoryArray(this.history.done, splitIds);
        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
      }
    },
    iterLinkedDocs: function(f) {linkedDocs(this, f);},

    getMode: function() {return this.mode;},
    getEditor: function() {return this.cm;}
  });

  Doc.prototype.eachLine = Doc.prototype.iter;

  // The Doc methods that should be available on CodeMirror instances
  var dontDelegate = "iter insert remove copy getEditor".split(" ");
  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
    CodeMirror.prototype[prop] = (function(method) {
      return function() {return method.apply(this.doc, arguments);};
    })(Doc.prototype[prop]);

  eventMixin(Doc);

  function linkedDocs(doc, f, sharedHistOnly) {
    function propagate(doc, skip, sharedHist) {
      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
        var rel = doc.linked[i];
        if (rel.doc == skip) continue;
        var shared = sharedHist && rel.sharedHist;
        if (sharedHistOnly && !shared) continue;
        f(rel.doc, shared);
        propagate(rel.doc, doc, shared);
      }
    }
    propagate(doc, null, true);
  }

  function attachDoc(cm, doc) {
    if (doc.cm) throw new Error("This document is already in use.");
    cm.doc = doc;
    doc.cm = cm;
    estimateLineHeights(cm);
    loadMode(cm);
    if (!cm.options.lineWrapping) computeMaxLength(cm);
    cm.options.mode = doc.modeOption;
    regChange(cm);
  }

  // LINE UTILITIES

  function getLine(chunk, n) {
    n -= chunk.first;
    while (!chunk.lines) {
      for (var i = 0;; ++i) {
        var child = chunk.children[i], sz = child.chunkSize();
        if (n < sz) { chunk = child; break; }
        n -= sz;
      }
    }
    return chunk.lines[n];
  }

  function getBetween(doc, start, end) {
    var out = [], n = start.line;
    doc.iter(start.line, end.line + 1, function(line) {
      var text = line.text;
      if (n == end.line) text = text.slice(0, end.ch);
      if (n == start.line) text = text.slice(start.ch);
      out.push(text);
      ++n;
    });
    return out;
  }
  function getLines(doc, from, to) {
    var out = [];
    doc.iter(from, to, function(line) { out.push(line.text); });
    return out;
  }

  function updateLineHeight(line, height) {
    var diff = height - line.height;
    for (var n = line; n; n = n.parent) n.height += diff;
  }

  function lineNo(line) {
    if (line.parent == null) return null;
    var cur = line.parent, no = indexOf(cur.lines, line);
    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
      for (var i = 0;; ++i) {
        if (chunk.children[i] == cur) break;
        no += chunk.children[i].chunkSize();
      }
    }
    return no + cur.first;
  }

  function lineAtHeight(chunk, h) {
    var n = chunk.first;
    outer: do {
      for (var i = 0, e = chunk.children.length; i < e; ++i) {
        var child = chunk.children[i], ch = child.height;
        if (h < ch) { chunk = child; continue outer; }
        h -= ch;
        n += child.chunkSize();
      }
      return n;
    } while (!chunk.lines);
    for (var i = 0, e = chunk.lines.length; i < e; ++i) {
      var line = chunk.lines[i], lh = line.height;
      if (h < lh) break;
      h -= lh;
    }
    return n + i;
  }

  function heightAtLine(cm, lineObj) {
    lineObj = visualLine(cm.doc, lineObj);

    var h = 0, chunk = lineObj.parent;
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i];
      if (line == lineObj) break;
      else h += line.height;
    }
    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
      for (var i = 0; i < p.children.length; ++i) {
        var cur = p.children[i];
        if (cur == chunk) break;
        else h += cur.height;
      }
    }
    return h;
  }

  function getOrder(line) {
    var order = line.order;
    if (order == null) order = line.order = bidiOrdering(line.text);
    return order;
  }

  // HISTORY

  function makeHistory(startGen) {
    return {
      // Arrays of history events. Doing something adds an event to
      // done and clears undo. Undoing moves events from done to
      // undone, redoing moves them in the other direction.
      done: [], undone: [], undoDepth: Infinity,
      // Used to track when changes can be merged into a single undo
      // event
      lastTime: 0, lastOp: null, lastOrigin: null,
      // Used by the isClean() method
      generation: startGen || 1, maxGeneration: startGen || 1
    };
  }

  function attachLocalSpans(doc, change, from, to) {
    var existing = change["spans_" + doc.id], n = 0;
    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
      if (line.markedSpans)
        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
      ++n;
    });
  }

  function historyChangeFromChange(doc, change) {
    var from = { line: change.from.line, ch: change.from.ch };
    var histChange = {from: from, to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
    return histChange;
  }

  function addToHistory(doc, change, selAfter, opId) {
    var hist = doc.history;
    hist.undone.length = 0;
    var time = +new Date, cur = lst(hist.done);

    if (cur &&
        (hist.lastOp == opId ||
         hist.lastOrigin == change.origin && change.origin &&
         ((change.origin.charAt(0) == "+" && doc.cm && hist.lastTime > time - doc.cm.options.historyEventDelay) ||
          change.origin.charAt(0) == "*"))) {
      // Merge this change into the last event
      var last = lst(cur.changes);
      if (posEq(change.from, change.to) && posEq(change.from, last.to)) {
        // Optimized case for simple insertion -- don't want to add
        // new changesets for every character typed
        last.to = changeEnd(change);
      } else {
        // Add new sub-event
        cur.changes.push(historyChangeFromChange(doc, change));
      }
      cur.anchorAfter = selAfter.anchor; cur.headAfter = selAfter.head;
    } else {
      // Can not be merged, start a new event.
      cur = {changes: [historyChangeFromChange(doc, change)],
             generation: hist.generation,
             anchorBefore: doc.sel.anchor, headBefore: doc.sel.head,
             anchorAfter: selAfter.anchor, headAfter: selAfter.head};
      hist.done.push(cur);
      hist.generation = ++hist.maxGeneration;
      while (hist.done.length > hist.undoDepth)
        hist.done.shift();
    }
    hist.lastTime = time;
    hist.lastOp = opId;
    hist.lastOrigin = change.origin;
  }

  function removeClearedSpans(spans) {
    if (!spans) return null;
    for (var i = 0, out; i < spans.length; ++i) {
      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
      else if (out) out.push(spans[i]);
    }
    return !out ? spans : out.length ? out : null;
  }

  function getOldSpans(doc, change) {
    var found = change["spans_" + doc.id];
    if (!found) return null;
    for (var i = 0, nw = []; i < change.text.length; ++i)
      nw.push(removeClearedSpans(found[i]));
    return nw;
  }

  // Used both to provide a JSON-safe object in .getHistory, and, when
  // detaching a document, to split the history in two
  function copyHistoryArray(events, newGroup) {
    for (var i = 0, copy = []; i < events.length; ++i) {
      var event = events[i], changes = event.changes, newChanges = [];
      copy.push({changes: newChanges, anchorBefore: event.anchorBefore, headBefore: event.headBefore,
                 anchorAfter: event.anchorAfter, headAfter: event.headAfter});
      for (var j = 0; j < changes.length; ++j) {
        var change = changes[j], m;
        newChanges.push({from: change.from, to: change.to, text: change.text});
        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
          if (indexOf(newGroup, Number(m[1])) > -1) {
            lst(newChanges)[prop] = change[prop];
            delete change[prop];
          }
        }
      }
    }
    return copy;
  }

  // Rebasing/resetting history to deal with externally-sourced changes

  function rebaseHistSel(pos, from, to, diff) {
    if (to < pos.line) {
      pos.line += diff;
    } else if (from < pos.line) {
      pos.line = from;
      pos.ch = 0;
    }
  }

  // Tries to rebase an array of history events given a change in the
  // document. If the change touches the same lines as the event, the
  // event, and everything 'behind' it, is discarded. If the change is
  // before the event, the event's positions are updated. Uses a
  // copy-on-write scheme for the positions, to avoid having to
  // reallocate them all on every rebase, but also avoid problems with
  // shared position objects being unsafely updated.
  function rebaseHistArray(array, from, to, diff) {
    for (var i = 0; i < array.length; ++i) {
      var sub = array[i], ok = true;
      for (var j = 0; j < sub.changes.length; ++j) {
        var cur = sub.changes[j];
        if (!sub.copied) { cur.from = copyPos(cur.from); cur.to = copyPos(cur.to); }
        if (to < cur.from.line) {
          cur.from.line += diff;
          cur.to.line += diff;
        } else if (from <= cur.to.line) {
          ok = false;
          break;
        }
      }
      if (!sub.copied) {
        sub.anchorBefore = copyPos(sub.anchorBefore); sub.headBefore = copyPos(sub.headBefore);
        sub.anchorAfter = copyPos(sub.anchorAfter); sub.readAfter = copyPos(sub.headAfter);
        sub.copied = true;
      }
      if (!ok) {
        array.splice(0, i + 1);
        i = 0;
      } else {
        rebaseHistSel(sub.anchorBefore); rebaseHistSel(sub.headBefore);
        rebaseHistSel(sub.anchorAfter); rebaseHistSel(sub.headAfter);
      }
    }
  }

  function rebaseHist(hist, change) {
    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
    rebaseHistArray(hist.done, from, to, diff);
    rebaseHistArray(hist.undone, from, to, diff);
  }

  // EVENT OPERATORS

  function stopMethod() {e_stop(this);}
  // Ensure an event has a stop method.
  function addStop(event) {
    if (!event.stop) event.stop = stopMethod;
    return event;
  }

  function e_preventDefault(e) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }
  function e_stopPropagation(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }
  function e_defaultPrevented(e) {
    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
  }
  function e_stop(e) {e_preventDefault(e); e_stopPropagation(e);}
  CodeMirror.e_stop = e_stop;
  CodeMirror.e_preventDefault = e_preventDefault;
  CodeMirror.e_stopPropagation = e_stopPropagation;

  function e_target(e) {return e.target || e.srcElement;}
  function e_button(e) {
    var b = e.which;
    if (b == null) {
      if (e.button & 1) b = 1;
      else if (e.button & 2) b = 3;
      else if (e.button & 4) b = 2;
    }
    if (mac && e.ctrlKey && b == 1) b = 3;
    return b;
  }

  // EVENT HANDLING

  function on(emitter, type, f) {
    if (emitter.addEventListener)
      emitter.addEventListener(type, f, false);
    else if (emitter.attachEvent)
      emitter.attachEvent("on" + type, f);
    else {
      var map = emitter._handlers || (emitter._handlers = {});
      var arr = map[type] || (map[type] = []);
      arr.push(f);
    }
  }

  function off(emitter, type, f) {
    if (emitter.removeEventListener)
      emitter.removeEventListener(type, f, false);
    else if (emitter.detachEvent)
      emitter.detachEvent("on" + type, f);
    else {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      for (var i = 0; i < arr.length; ++i)
        if (arr[i] == f) { arr.splice(i, 1); break; }
    }
  }

  function signal(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
  }

  var delayedCallbacks, delayedCallbackDepth = 0;
  function signalLater(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    if (!delayedCallbacks) {
      ++delayedCallbackDepth;
      delayedCallbacks = [];
      setTimeout(fireDelayed, 0);
    }
    function bnd(f) {return function(){f.apply(null, args);};};
    for (var i = 0; i < arr.length; ++i)
      delayedCallbacks.push(bnd(arr[i]));
  }

  function signalDOMEvent(cm, e, override) {
    signal(cm, override || e.type, cm, e);
    return e_defaultPrevented(e) || e.codemirrorIgnore;
  }

  function fireDelayed() {
    --delayedCallbackDepth;
    var delayed = delayedCallbacks;
    delayedCallbacks = null;
    for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  function hasHandler(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    return arr && arr.length > 0;
  }

  CodeMirror.on = on; CodeMirror.off = off; CodeMirror.signal = signal;

  function eventMixin(ctor) {
    ctor.prototype.on = function(type, f) {on(this, type, f);};
    ctor.prototype.off = function(type, f) {off(this, type, f);};
  }

  // MISC UTILITIES

  // Number of pixels added to scroller and sizer to hide scrollbar
  var scrollerCutOff = 30;

  // Returned or thrown by various protocols to signal 'I'm not
  // handling this'.
  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};

  function Delayed() {this.id = null;}
  Delayed.prototype = {set: function(ms, f) {clearTimeout(this.id); this.id = setTimeout(f, ms);}};

  // Counts the column offset in a string, taking tabs into account.
  // Used mostly to find indentation.
  function countColumn(string, end, tabSize, startIndex, startValue) {
    if (end == null) {
      end = string.search(/[^\s\u00a0]/);
      if (end == -1) end = string.length;
    }
    for (var i = startIndex || 0, n = startValue || 0; i < end; ++i) {
      if (string.charAt(i) == "\t") n += tabSize - (n % tabSize);
      else ++n;
    }
    return n;
  }
  CodeMirror.countColumn = countColumn;

  var spaceStrs = [""];
  function spaceStr(n) {
    while (spaceStrs.length <= n)
      spaceStrs.push(lst(spaceStrs) + " ");
    return spaceStrs[n];
  }

  function lst(arr) { return arr[arr.length-1]; }

  function selectInput(node) {
    if (ios) { // Mobile Safari apparently has a bug where select() is broken.
      node.selectionStart = 0;
      node.selectionEnd = node.value.length;
    } else {
      // Suppress mysterious IE10 errors
      try { node.select(); }
      catch(_e) {}
    }
  }

  function indexOf(collection, elt) {
    if (collection.indexOf) return collection.indexOf(elt);
    for (var i = 0, e = collection.length; i < e; ++i)
      if (collection[i] == elt) return i;
    return -1;
  }

  function createObj(base, props) {
    function Obj() {}
    Obj.prototype = base;
    var inst = new Obj();
    if (props) copyObj(props, inst);
    return inst;
  }

  function copyObj(obj, target) {
    if (!target) target = {};
    for (var prop in obj) if (obj.hasOwnProperty(prop)) target[prop] = obj[prop];
    return target;
  }

  function emptyArray(size) {
    for (var a = [], i = 0; i < size; ++i) a.push(undefined);
    return a;
  }

  function bind(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){return f.apply(null, args);};
  }

  var nonASCIISingleCaseWordChar = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  function isWordChar(ch) {
    return /\w/.test(ch) || ch > "\x80" &&
      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
  }

  function isEmpty(obj) {
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
    return true;
  }

  var isExtendingChar = /[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff]/;

  // DOM UTILITIES

  function elt(tag, content, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.style.cssText = style;
    if (typeof content == "string") setTextContent(e, content);
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
    return e;
  }

  function removeChildren(e) {
    for (var count = e.childNodes.length; count > 0; --count)
      e.removeChild(e.firstChild);
    return e;
  }

  function removeChildrenAndAdd(parent, e) {
    return removeChildren(parent).appendChild(e);
  }

  function setTextContent(e, str) {
    if (ie_lt9) {
      e.innerHTML = "";
      e.appendChild(document.createTextNode(str));
    } else e.textContent = str;
  }

  function getRect(node) {
    return node.getBoundingClientRect();
  }
  CodeMirror.replaceGetRect = function(f) { getRect = f; };

  // FEATURE DETECTION

  // Detect drag-and-drop
  var dragAndDrop = function() {
    // There is *some* kind of drag-and-drop support in IE6-8, but I
    // couldn't get it to work yet.
    if (ie_lt9) return false;
    var div = elt('div');
    return "draggable" in div || "dragDrop" in div;
  }();

  // For a reason I have yet to figure out, some browsers disallow
  // word wrapping between certain characters *only* if a new inline
  // element is started between them. This makes it hard to reliably
  // measure the position of things, since that requires inserting an
  // extra span. This terribly fragile set of tests matches the
  // character combinations that suffer from this phenomenon on the
  // various browsers.
  function spanAffectsWrapping() { return false; }
  if (gecko) // Only for "$'"
    spanAffectsWrapping = function(str, i) {
      return str.charCodeAt(i - 1) == 36 && str.charCodeAt(i) == 39;
    };
  else if (safari && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent))
    spanAffectsWrapping = function(str, i) {
      return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(str.slice(i - 1, i + 1));
    };
  else if (webkit && /Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent))
    spanAffectsWrapping = function(str, i) {
      var code = str.charCodeAt(i - 1);
      return code >= 8208 && code <= 8212;
    };
  else if (webkit)
    spanAffectsWrapping = function(str, i) {
      if (i > 1 && str.charCodeAt(i - 1) == 45) {
        if (/\w/.test(str.charAt(i - 2)) && /[^\-?\.]/.test(str.charAt(i))) return true;
        if (i > 2 && /[\d\.,]/.test(str.charAt(i - 2)) && /[\d\.,]/.test(str.charAt(i))) return false;
      }
      return /[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|…[\w~`@#$%\^&*(_=+{[><]/.test(str.slice(i - 1, i + 1));
    };

  var knownScrollbarWidth;
  function scrollbarWidth(measure) {
    if (knownScrollbarWidth != null) return knownScrollbarWidth;
    var test = elt("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
    removeChildrenAndAdd(measure, test);
    if (test.offsetWidth)
      knownScrollbarWidth = test.offsetHeight - test.clientHeight;
    return knownScrollbarWidth || 0;
  }

  var zwspSupported;
  function zeroWidthElement(measure) {
    if (zwspSupported == null) {
      var test = elt("span", "\u200b");
      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
      if (measure.firstChild.offsetHeight != 0)
        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !ie_lt8;
    }
    if (zwspSupported) return elt("span", "\u200b");
    else return elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
  }

  // See if "".split is the broken IE version, if so, provide an
  // alternative way to split lines.
  var splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
    var pos = 0, result = [], l = string.length;
    while (pos <= l) {
      var nl = string.indexOf("\n", pos);
      if (nl == -1) nl = string.length;
      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
      var rt = line.indexOf("\r");
      if (rt != -1) {
        result.push(line.slice(0, rt));
        pos += rt + 1;
      } else {
        result.push(line);
        pos = nl + 1;
      }
    }
    return result;
  } : function(string){return string.split(/\r\n?|\n/);};
  CodeMirror.splitLines = splitLines;

  var hasSelection = window.getSelection ? function(te) {
    try { return te.selectionStart != te.selectionEnd; }
    catch(e) { return false; }
  } : function(te) {
    try {var range = te.ownerDocument.selection.createRange();}
    catch(e) {}
    if (!range || range.parentElement() != te) return false;
    return range.compareEndPoints("StartToEnd", range) != 0;
  };

  var hasCopyEvent = (function() {
    var e = elt("div");
    if ("oncopy" in e) return true;
    e.setAttribute("oncopy", "return;");
    return typeof e.oncopy == 'function';
  })();

  // KEY NAMING

  var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
                  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
                  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
                  46: "Delete", 59: ";", 91: "Mod", 92: "Mod", 93: "Mod", 109: "-", 107: "=", 127: "Delete",
                  186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
                  221: "]", 222: "'", 63276: "PageUp", 63277: "PageDown", 63275: "End", 63273: "Home",
                  63234: "Left", 63232: "Up", 63235: "Right", 63233: "Down", 63302: "Insert", 63272: "Delete"};
  CodeMirror.keyNames = keyNames;
  (function() {
    // Number keys
    for (var i = 0; i < 10; i++) keyNames[i + 48] = String(i);
    // Alphabetic keys
    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
    // Function keys
    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
  })();

  // BIDI HELPERS

  function iterateBidiSections(order, from, to, f) {
    if (!order) return f(from, to, "ltr");
    var found = false;
    for (var i = 0; i < order.length; ++i) {
      var part = order[i];
      if (part.from < to && part.to > from || from == to && part.to == from) {
        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
        found = true;
      }
    }
    if (!found) f(from, to, "ltr");
  }

  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }

  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
  function lineRight(line) {
    var order = getOrder(line);
    if (!order) return line.text.length;
    return bidiRight(lst(order));
  }

  function lineStart(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLine(cm.doc, line);
    if (visual != line) lineN = lineNo(visual);
    var order = getOrder(visual);
    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
    return Pos(lineN, ch);
  }
  function lineEnd(cm, lineN) {
    var merged, line;
    while (merged = collapsedSpanAtEnd(line = getLine(cm.doc, lineN)))
      lineN = merged.find().to.line;
    var order = getOrder(line);
    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
    return Pos(lineN, ch);
  }

  function compareBidiLevel(order, a, b) {
    var linedir = order[0].level;
    if (a == linedir) return true;
    if (b == linedir) return false;
    return a < b;
  }
  var bidiOther;
  function getBidiPartAt(order, pos) {
    for (var i = 0, found; i < order.length; ++i) {
      var cur = order[i];
      if (cur.from < pos && cur.to > pos) { bidiOther = null; return i; }
      if (cur.from == pos || cur.to == pos) {
        if (found == null) {
          found = i;
        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
          bidiOther = found;
          return i;
        } else {
          bidiOther = i;
          return found;
        }
      }
    }
    bidiOther = null;
    return found;
  }

  function moveInLine(line, pos, dir, byUnit) {
    if (!byUnit) return pos + dir;
    do pos += dir;
    while (pos > 0 && isExtendingChar.test(line.text.charAt(pos)));
    return pos;
  }

  // This is somewhat involved. It is needed in order to move
  // 'visually' through bi-directional text -- i.e., pressing left
  // should make the cursor go left, even when in RTL text. The
  // tricky part is the 'jumps', where RTL and LTR text touch each
  // other. This often requires the cursor offset to move more than
  // one unit, in order to visually move one unit.
  function moveVisually(line, start, dir, byUnit) {
    var bidi = getOrder(line);
    if (!bidi) return moveLogically(line, start, dir, byUnit);
    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

    for (;;) {
      if (target > part.from && target < part.to) return target;
      if (target == part.from || target == part.to) {
        if (getBidiPartAt(bidi, target) == pos) return target;
        part = bidi[pos += dir];
        return (dir > 0) == part.level % 2 ? part.to : part.from;
      } else {
        part = bidi[pos += dir];
        if (!part) return null;
        if ((dir > 0) == part.level % 2)
          target = moveInLine(line, part.to, -1, byUnit);
        else
          target = moveInLine(line, part.from, 1, byUnit);
      }
    }
  }

  function moveLogically(line, start, dir, byUnit) {
    var target = start + dir;
    if (byUnit) while (target > 0 && isExtendingChar.test(line.text.charAt(target))) target += dir;
    return target < 0 || target > line.text.length ? null : target;
  }

  // Bidirectional ordering algorithm
  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
  // that this (partially) implements.

  // One-char codes used for character types:
  // L (L):   Left-to-Right
  // R (R):   Right-to-Left
  // r (AL):  Right-to-Left Arabic
  // 1 (EN):  European Number
  // + (ES):  European Number Separator
  // % (ET):  European Number Terminator
  // n (AN):  Arabic Number
  // , (CS):  Common Number Separator
  // m (NSM): Non-Spacing Mark
  // b (BN):  Boundary Neutral
  // s (B):   Paragraph Separator
  // t (S):   Segment Separator
  // w (WS):  Whitespace
  // N (ON):  Other Neutrals

  // Returns null if characters are ordered as they appear
  // (left-to-right), or an array of sections ({from, to, level}
  // objects) in the order in which they occur visually.
  var bidiOrdering = (function() {
    // Character types for codepoints 0 to 0xff
    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL";
    // Character types for codepoints 0x600 to 0x6ff
    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr";
    function charType(code) {
      if (code <= 0xff) return lowTypes.charAt(code);
      else if (0x590 <= code && code <= 0x5f4) return "R";
      else if (0x600 <= code && code <= 0x6ff) return arabicTypes.charAt(code - 0x600);
      else if (0x700 <= code && code <= 0x8ac) return "r";
      else return "L";
    }

    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
    // Browsers seem to always treat the boundaries of block elements as being L.
    var outerType = "L";

    return function(str) {
      if (!bidiRE.test(str)) return false;
      var len = str.length, types = [];
      for (var i = 0, type; i < len; ++i)
        types.push(type = charType(str.charCodeAt(i)));

      // W1. Examine each non-spacing mark (NSM) in the level run, and
      // change the type of the NSM to the type of the previous
      // character. If the NSM is at the start of the level run, it will
      // get the type of sor.
      for (var i = 0, prev = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "m") types[i] = prev;
        else prev = type;
      }

      // W2. Search backwards from each instance of a European number
      // until the first strong type (R, L, AL, or sor) is found. If an
      // AL is found, change the type of the European number to Arabic
      // number.
      // W3. Change all ALs to R.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "1" && cur == "r") types[i] = "n";
        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
      }

      // W4. A single European separator between two European numbers
      // changes to a European number. A single common separator between
      // two numbers of the same type changes to that type.
      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
        var type = types[i];
        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
        else if (type == "," && prev == types[i+1] &&
                 (prev == "1" || prev == "n")) types[i] = prev;
        prev = type;
      }

      // W5. A sequence of European terminators adjacent to European
      // numbers changes to all European numbers.
      // W6. Otherwise, separators and terminators change to Other
      // Neutral.
      for (var i = 0; i < len; ++i) {
        var type = types[i];
        if (type == ",") types[i] = "N";
        else if (type == "%") {
          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
          var replace = (i && types[i-1] == "!") || (end < len - 1 && types[end] == "1") ? "1" : "N";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // W7. Search backwards from each instance of a European number
      // until the first strong type (R, L, or sor) is found. If an L is
      // found, then change the type of the European number to L.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (cur == "L" && type == "1") types[i] = "L";
        else if (isStrong.test(type)) cur = type;
      }

      // N1. A sequence of neutrals takes the direction of the
      // surrounding strong text if the text on both sides has the same
      // direction. European and Arabic numbers act as if they were R in
      // terms of their influence on neutrals. Start-of-level-run (sor)
      // and end-of-level-run (eor) are used at level run boundaries.
      // N2. Any remaining neutrals take the embedding direction.
      for (var i = 0; i < len; ++i) {
        if (isNeutral.test(types[i])) {
          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
          var before = (i ? types[i-1] : outerType) == "L";
          var after = (end < len - 1 ? types[end] : outerType) == "L";
          var replace = before || after ? "L" : "R";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // Here we depart from the documented algorithm, in order to avoid
      // building up an actual levels array. Since there are only three
      // levels (0, 1, 2) in an implementation that doesn't take
      // explicit embedding into account, we can build up the order on
      // the fly, without following the level-based algorithm.
      var order = [], m;
      for (var i = 0; i < len;) {
        if (countsAsLeft.test(types[i])) {
          var start = i;
          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
          order.push({from: start, to: i, level: 0});
        } else {
          var pos = i, at = order.length;
          for (++i; i < len && types[i] != "L"; ++i) {}
          for (var j = pos; j < i;) {
            if (countsAsNum.test(types[j])) {
              if (pos < j) order.splice(at, 0, {from: pos, to: j, level: 1});
              var nstart = j;
              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
              order.splice(at, 0, {from: nstart, to: j, level: 2});
              pos = j;
            } else ++j;
          }
          if (pos < i) order.splice(at, 0, {from: pos, to: i, level: 1});
        }
      }
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
        order[0].from = m[0].length;
        order.unshift({from: 0, to: m[0].length, level: 0});
      }
      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
        lst(order).to -= m[0].length;
        order.push({from: len - m[0].length, to: len, level: 0});
      }
      if (order[0].level != lst(order).level)
        order.push({from: len, to: len, level: order[0].level});

      return order;
    };
  })();

  // THE END

  CodeMirror.version = "3.18.1";

  return CodeMirror;
})();
;
/*! ============================================================
 * bootstrapSwitch v1.8 by Larentis Mattia @SpiritualGuru
 * http://www.larentis.eu/
 *
 * Enhanced for radiobuttons by Stein, Peter @BdMdesigN
 * http://www.bdmdesign.org/
 *
 * Project site:
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

!function ($) {
  "use strict";

  $.fn['bootstrapSwitch'] = function (method) {
    var inputSelector = 'input[type!="hidden"]';
    var methods = {
      init: function () {
        return this.each(function () {
            var $element = $(this)
              , $div
              , $switchLeft
              , $switchRight
              , $label
              , $form = $element.closest('form')
              , myClasses = ""
              , classes = $element.attr('class')
              , color
              , moving
              , onLabel = "ON"
              , offLabel = "OFF"
              , icon = false
              , textLabel = false;

            $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
              if (classes.indexOf(el) >= 0)
                myClasses = el;
            });

            $element.addClass('has-switch');

            if ($element.data('on') !== undefined)
              color = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined)
              onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined)
              offLabel = $element.data('off-label');

            if ($element.data('label-icon') !== undefined)
              icon = $element.data('label-icon');

            if ($element.data('text-label') !== undefined)
              textLabel = $element.data('text-label');

            $switchLeft = $('<span>')
              .addClass("switch-left")
              .addClass(myClasses)
              .addClass(color)
              .html(onLabel);

            color = '';
            if ($element.data('off') !== undefined)
              color = "switch-" + $element.data('off');

            $switchRight = $('<span>')
              .addClass("switch-right")
              .addClass(myClasses)
              .addClass(color)
              .html(offLabel);

            $label = $('<label>')
              .html("&nbsp;")
              .addClass(myClasses)
              .attr('for', $element.find(inputSelector).attr('id'));

            if (icon) {
              $label.html('<i class="icon ' + icon + '"></i>');
            }

            if (textLabel) {
              $label.html('' + textLabel + '');
            }

            $div = $element.find(inputSelector).wrap($('<div>')).parent().data('animated', false);

            if ($element.data('animated') !== false)
              $div.addClass('switch-animate').data('animated', true);

            $div
              .append($switchLeft)
              .append($label)
              .append($switchRight);

            $element.find('>div').addClass(
              $element.find(inputSelector).is(':checked') ? 'switch-on' : 'switch-off'
            );

            if ($element.find(inputSelector).is(':disabled'))
              $(this).addClass('deactivate');

            var changeStatus = function ($this) {
              if ($element.parent('label').is('.label-change-switch')) {

              } else {
                $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
              }
            };

            $element.on('keydown', function (e) {
              if (e.keyCode === 32) {
                e.stopImmediatePropagation();
                e.preventDefault();
                changeStatus($(e.target).find('span:first'));
              }
            });

            $switchLeft.on('click', function (e) {
              changeStatus($(this));
            });

            $switchRight.on('click', function (e) {
              changeStatus($(this));
            });

            $element.find(inputSelector).on('change', function (e, skipOnChange) {
              var $this = $(this)
                , $element = $this.parent()
                , thisState = $this.is(':checked')
                , state = $element.is('.switch-off');

              e.preventDefault();

              $element.css('left', '');

              if (state === thisState) {

                if (thisState)
                  $element.removeClass('switch-off').addClass('switch-on');
                else $element.removeClass('switch-on').addClass('switch-off');

                if ($element.data('animated') !== false)
                  $element.addClass("switch-animate");

                if (typeof skipOnChange === 'boolean' && skipOnChange)
                  return;

                $element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
              }
            });

            $element.find('label').on('mousedown touchstart', function (e) {
              var $this = $(this);
              moving = false;

              e.preventDefault();
              e.stopImmediatePropagation();

              $this.closest('div').removeClass('switch-animate');

              if ($this.closest('.has-switch').is('.deactivate')) {
                $this.unbind('click');
              } else if ($this.closest('.switch-on').parent().is('.radio-no-uncheck')) {
                $this.unbind('click');
              } else {
                $this.on('mousemove touchmove', function (e) {
                  var $element = $(this).closest('.make-switch')
                    , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
                    , percent = (relativeX / $element.width()) * 100
                    , left = 25
                    , right = 75;

                  moving = true;

                  if (percent < left)
                    percent = left;
                  else if (percent > right)
                    percent = right;

                  $element.find('>div').css('left', (percent - right) + "%")
                });

                $this.on('click touchend', function (e) {
                  var $this = $(this)
                    , $myInputBox = $this.siblings('input');

                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $this.unbind('mouseleave');

                  if (moving)
                    $myInputBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                  else
                    $myInputBox.prop("checked", !$myInputBox.is(":checked"));

                  moving = false;
                  $myInputBox.trigger('change');
                });

                $this.on('mouseleave', function (e) {
                  var $this = $(this)
                    , $myInputBox = $this.siblings('input');

                  e.preventDefault();
                  e.stopImmediatePropagation();

                  $this.unbind('mouseleave mousemove');
                  $this.trigger('mouseup');

                  $myInputBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                });

                $this.on('mouseup', function (e) {
                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $(this).trigger('mouseleave');
                });
              }
            });

            if ($form.data('bootstrapSwitch') !== 'injected') {
              $form.bind('reset', function () {
                setTimeout(function () {
                  $form.find('.make-switch').each(function () {
                    var $input = $(this).find(inputSelector);

                    $input.prop('checked', $input.is(':checked')).trigger('change');
                  });
                }, 1);
              });
              $form.data('bootstrapSwitch', 'injected');
            }
          }
        );
      },
      toggleActivation: function () {
        var $this = $(this);

        $this.toggleClass('deactivate');
        $this.find(inputSelector).prop('disabled', $this.is('.deactivate'));
      },
      isActive: function () {
        return !$(this).hasClass('deactivate');
      },
      setActive: function (active) {
        var $this = $(this);

        if (active) {
          $this.removeClass('deactivate');
          $this.find(inputSelector).removeAttr('disabled');
        }
        else {
          $this.addClass('deactivate');
          $this.find(inputSelector).attr('disabled', 'disabled');
        }
      },
      toggleState: function (skipOnChange) {
        var $input = $(this).find(':checkbox');
        $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
      },
      toggleRadioState: function (skipOnChange) {
        var $radioinput = $(this).find(':radio');
        $radioinput.not(':checked').prop('checked', !$radioinput.is(':checked')).trigger('change', skipOnChange);
      },
      toggleRadioStateAllowUncheck: function (uncheck, skipOnChange) {
        var $radioinput = $(this).find(':radio');
        if (uncheck) {
          $radioinput.not(':checked').trigger('change', skipOnChange);
        }
        else {
          $radioinput.not(':checked').prop('checked', !$radioinput.is(':checked')).trigger('change', skipOnChange);
        }
      },
      setState: function (value, skipOnChange) {
        $(this).find(inputSelector).prop('checked', value).trigger('change', skipOnChange);
      },
      setOnLabel: function (value) {
        var $switchLeft = $(this).find(".switch-left");
        $switchLeft.html(value);
      },
      setOffLabel: function (value) {
        var $switchRight = $(this).find(".switch-right");
        $switchRight.html(value);
      },
      setOnClass: function (value) {
        var $switchLeft = $(this).find(".switch-left");
        var color = '';
        if (value !== undefined) {
          if ($(this).attr('data-on') !== undefined) {
            color = "switch-" + $(this).attr('data-on')
          }
          $switchLeft.removeClass(color);
          color = "switch-" + value;
          $switchLeft.addClass(color);
        }
      },
      setOffClass: function (value) {
        var $switchRight = $(this).find(".switch-right");
        var color = '';
        if (value !== undefined) {
          if ($(this).attr('data-off') !== undefined) {
            color = "switch-" + $(this).attr('data-off')
          }
          $switchRight.removeClass(color);
          color = "switch-" + value;
          $switchRight.addClass(color);
        }
      },
      setAnimated: function (value) {
        var $element = $(this).find(inputSelector).parent();
        if (value === undefined) value = false;
        $element.data('animated', value);
        $element.attr('data-animated', value);

        if ($element.data('animated') !== false) {
          $element.addClass("switch-animate");
        } else {
          $element.removeClass("switch-animate");
        }
      },
      setSizeClass: function (value) {
        var $element = $(this);
        var $switchLeft = $element.find(".switch-left");
        var $switchRight = $element.find(".switch-right");
        var $label = $element.find("label");
        $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
          if (el !== value) {
            $switchLeft.removeClass(el);
            $switchRight.removeClass(el);
            $label.removeClass(el);
          } else {
            $switchLeft.addClass(el);
            $switchRight.addClass(el);
            $label.addClass(el);
          }
        });
      },
      status: function () {
        return $(this).find(inputSelector).is(':checked');
      },
      destroy: function () {
        var $element = $(this)
          , $div = $element.find('div')
          , $form = $element.closest('form')
          , $inputbox;

        $div.find(':not(input)').remove();

        $inputbox = $div.children();
        $inputbox.unwrap().unwrap();

        $inputbox.unbind('change');

        if ($form) {
          $form.unbind('reset');
          $form.removeData('bootstrapSwitch');
        }

        return $inputbox;
      }
    };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };
}(jQuery);

(function ($) {
  $(function () {
    $('.make-switch')['bootstrapSwitch']();
  });
})(jQuery);
;
d3=function(){function n(n){return null!=n&&!isNaN(n)}function t(n){return n.length}function e(n){for(var t=1;n*t%1;)t*=10;return t}function r(n,t){try{for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}catch(r){n.prototype=t}}function i(){}function u(){}function a(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function o(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.substring(1);for(var e=0,r=Ca.length;r>e;++e){var i=Ca[e]+t;if(i in n)return i}}function c(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}function l(n){return Array.prototype.slice.call(n)}function s(){}function f(){}function h(n){function t(){for(var t,r=e,i=-1,u=r.length;++i<u;)(t=r[i].on)&&t.apply(this,arguments);return n}var e=[],r=new i;return t.on=function(t,i){var u,a=r.get(t);return arguments.length<2?a&&a.on:(a&&(a.on=null,e=e.slice(0,u=e.indexOf(a)).concat(e.slice(u+1)),r.remove(t)),i&&e.push(r.set(t,{on:i})),n)},t}function g(){ya.event.preventDefault()}function p(){for(var n,t=ya.event;n=t.sourceEvent;)t=n;return t}function m(n){for(var t=new f,e=0,r=arguments.length;++e<r;)t[arguments[e]]=h(t);return t.of=function(e,r){return function(i){try{var u=i.sourceEvent=ya.event;i.target=n,ya.event=i,t[i.type].apply(e,r)}finally{ya.event=u}}},t}function d(n){return La(n,Ya),n}function v(n){return"function"==typeof n?n:function(){return Ha(n,this)}}function y(n){return"function"==typeof n?n:function(){return Fa(n,this)}}function M(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function i(){this.setAttribute(n,t)}function u(){this.setAttributeNS(n.space,n.local,t)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ya.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?o:a:n.local?u:i}function x(n){return n.trim().replace(/\s+/g," ")}function b(n){return new RegExp("(?:^|\\s+)"+ya.requote(n)+"(?:\\s+|$)","g")}function _(n,t){function e(){for(var e=-1;++e<i;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<i;)n[e](this,r)}n=n.trim().split(/\s+/).map(w);var i=n.length;return"function"==typeof t?r:e}function w(n){var t=b(n);return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n);var i=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",x(i+" "+n))):e.setAttribute("class",x(i.replace(t," ")))}}function S(n,t,e){function r(){this.style.removeProperty(n)}function i(){this.style.setProperty(n,t,e)}function u(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?u:i}function E(n,t){function e(){delete this[n]}function r(){this[n]=t}function i(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?i:r}function k(n){return"function"==typeof n?n:(n=ya.ns.qualify(n)).local?function(){return Ma.createElementNS(n.space,n.local)}:function(){return Ma.createElementNS(this.namespaceURI,n)}}function A(n){return{__data__:n}}function N(n){return function(){return Oa(this,n)}}function q(n){return arguments.length||(n=ya.ascending),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function T(n,t){for(var e=0,r=n.length;r>e;e++)for(var i,u=n[e],a=0,o=u.length;o>a;a++)(i=u[a])&&t(i,a,e);return n}function C(n){return La(n,Ua),n}function z(n){var t,e;return function(r,i,u){var a,o=n[u].update,c=o.length;for(u!=e&&(e=u,t=0),i>=t&&(t=i+1);!(a=o[t])&&++t<c;);return a}}function D(n,t,e){function r(){var t=this[a];t&&(this.removeEventListener(n,t,t.$),delete this[a])}function i(){var i=c(t,za(arguments));r.call(this),this.addEventListener(n,this[a]=i,i.$=e),i._=t}function u(){var t,e=new RegExp("^__on([^.]+)"+ya.requote(n)+"$");for(var r in this)if(t=r.match(e)){var i=this[r];this.removeEventListener(t[1],i,i.$),delete this[r]}}var a="__on"+n,o=n.indexOf("."),c=j;o>0&&(n=n.substring(0,o));var l=Va.get(n);return l&&(n=l,c=L),o?t?i:r:t?s:u}function j(n,t){return function(e){var r=ya.event;ya.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ya.event=r}}}function L(n,t){var e=j(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function H(){var n=".dragsuppress-"+ ++Za,t="touchmove"+n,e="selectstart"+n,r="dragstart"+n,i="click"+n,u=ya.select(ba).on(t,g).on(e,g).on(r,g),a=xa.style,o=a[Xa];return a[Xa]="none",function(t){function e(){u.on(i,null)}u.on(n,null),a[Xa]=o,t&&(u.on(i,function(){g(),e()},!0),setTimeout(e,0))}}function F(n,t){var e=n.ownerSVGElement||n;if(e.createSVGPoint){var r=e.createSVGPoint();if(0>Ba&&(ba.scrollX||ba.scrollY)){e=ya.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var i=e[0][0].getScreenCTM();Ba=!(i.f||i.e),e.remove()}return Ba?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}var u=n.getBoundingClientRect();return[t.clientX-u.left-n.clientLeft,t.clientY-u.top-n.clientTop]}function P(){}function O(n,t,e){return new Y(n,t,e)}function Y(n,t,e){this.h=n,this.s=t,this.l=e}function R(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?u+(a-u)*n/60:180>n?a:240>n?u+(a-u)*(240-n)/60:u}function i(n){return Math.round(255*r(n))}var u,a;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,a=.5>=e?e*(1+t):e+t-e*t,u=2*e-a,at(i(n+120),i(n),i(n-120))}function U(n){return n>0?1:0>n?-1:0}function I(n){return n>1?0:-1>n?Ka:Math.acos(n)}function V(n){return n>1?Ka/2:-1>n?-Ka/2:Math.asin(n)}function X(n){return(Math.exp(n)-Math.exp(-n))/2}function Z(n){return(Math.exp(n)+Math.exp(-n))/2}function B(n){return(n=Math.sin(n/2))*n}function $(n,t,e){return new W(n,t,e)}function W(n,t,e){this.h=n,this.c=t,this.l=e}function J(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),G(e,Math.cos(n*=to)*t,Math.sin(n)*t)}function G(n,t,e){return new K(n,t,e)}function K(n,t,e){this.l=n,this.a=t,this.b=e}function Q(n,t,e){var r=(n+16)/116,i=r+t/500,u=r-e/200;return i=tt(i)*uo,r=tt(r)*ao,u=tt(u)*oo,at(rt(3.2404542*i-1.5371385*r-.4985314*u),rt(-.969266*i+1.8760108*r+.041556*u),rt(.0556434*i-.2040259*r+1.0572252*u))}function nt(n,t,e){return n>0?$(Math.atan2(e,t)*eo,Math.sqrt(t*t+e*e),n):$(0/0,0/0,n)}function tt(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function et(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function rt(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function it(n){return at(n>>16,255&n>>8,255&n)}function ut(n){return it(n)+""}function at(n,t,e){return new ot(n,t,e)}function ot(n,t,e){this.r=n,this.g=t,this.b=e}function ct(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function lt(n,t,e){var r,i,u,a=0,o=0,c=0;if(r=/([a-z]+)\((.*)\)/i.exec(n))switch(i=r[2].split(","),r[1]){case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100);case"rgb":return t(gt(i[0]),gt(i[1]),gt(i[2]))}return(u=so.get(n))?t(u.r,u.g,u.b):(null!=n&&"#"===n.charAt(0)&&(4===n.length?(a=n.charAt(1),a+=a,o=n.charAt(2),o+=o,c=n.charAt(3),c+=c):7===n.length&&(a=n.substring(1,3),o=n.substring(3,5),c=n.substring(5,7)),a=parseInt(a,16),o=parseInt(o,16),c=parseInt(c,16)),t(a,o,c))}function st(n,t,e){var r,i,u=Math.min(n/=255,t/=255,e/=255),a=Math.max(n,t,e),o=a-u,c=(a+u)/2;return o?(i=.5>c?o/(a+u):o/(2-a-u),r=n==a?(t-e)/o+(e>t?6:0):t==a?(e-n)/o+2:(n-t)/o+4,r*=60):(r=0/0,i=c>0&&1>c?0:r),O(r,i,c)}function ft(n,t,e){n=ht(n),t=ht(t),e=ht(e);var r=et((.4124564*n+.3575761*t+.1804375*e)/uo),i=et((.2126729*n+.7151522*t+.072175*e)/ao),u=et((.0193339*n+.119192*t+.9503041*e)/oo);return G(116*i-16,500*(r-i),200*(i-u))}function ht(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function gt(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function pt(n){return"function"==typeof n?n:function(){return n}}function mt(n){return n}function dt(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),vt(t,e,n,r)}}function vt(n,t,e,r){function i(){var n,t=c.status;if(!t&&c.responseText||t>=200&&300>t||304===t){try{n=e.call(u,c)}catch(r){return a.error.call(u,r),void 0}a.load.call(u,n)}else a.error.call(u,c)}var u={},a=ya.dispatch("progress","load","error"),o={},c=new XMLHttpRequest,l=null;return!ba.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(n)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=i:c.onreadystatechange=function(){c.readyState>3&&i()},c.onprogress=function(n){var t=ya.event;ya.event=n;try{a.progress.call(u,c)}finally{ya.event=t}},u.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?o[n]:(null==t?delete o[n]:o[n]=t+"",u)},u.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",u):t},u.responseType=function(n){return arguments.length?(l=n,u):l},u.response=function(n){return e=n,u},["get","post"].forEach(function(n){u[n]=function(){return u.send.apply(u,[n].concat(za(arguments)))}}),u.send=function(e,r,i){if(2===arguments.length&&"function"==typeof r&&(i=r,r=null),c.open(e,n,!0),null==t||"accept"in o||(o.accept=t+",*/*"),c.setRequestHeader)for(var a in o)c.setRequestHeader(a,o[a]);return null!=t&&c.overrideMimeType&&c.overrideMimeType(t),null!=l&&(c.responseType=l),null!=i&&u.on("error",i).on("load",function(n){i(null,n)}),c.send(null==r?null:r),u},u.abort=function(){return c.abort(),u},ya.rebind(u,a,"on"),null==r?u:u.get(yt(r))}function yt(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Mt(){var n=bt(),t=_t()-n;t>24?(isFinite(t)&&(clearTimeout(po),po=setTimeout(Mt,t)),go=0):(go=1,vo(Mt))}function xt(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now()),mo.callback=n,mo.time=e+t}function bt(){var n=Date.now();for(mo=fo;mo;)n>=mo.time&&(mo.flush=mo.callback(n-mo.time)),mo=mo.next;return n}function _t(){for(var n,t=fo,e=1/0;t;)t.flush?t=n?n.next=t.next:fo=t.next:(t.time<e&&(e=t.time),t=(n=t).next);return ho=n,e}function wt(n,t){var e=Math.pow(10,3*Math.abs(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function St(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Et(n){return n+""}function kt(){}function At(n,t,e){var r=e.s=n+t,i=r-n,u=r-i;e.t=n-u+(t-i)}function Nt(n,t){n&&qo.hasOwnProperty(n.type)&&qo[n.type](n,t)}function qt(n,t,e){var r,i=-1,u=n.length-e;for(t.lineStart();++i<u;)r=n[i],t.point(r[0],r[1]);t.lineEnd()}function Tt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)qt(n[e],t,1);t.polygonEnd()}function Ct(){function n(n,t){n*=to,t=t*to/2+Ka/4;var e=n-r,a=Math.cos(t),o=Math.sin(t),c=u*o,l=i*a+c*Math.cos(e),s=c*Math.sin(e);Co.add(Math.atan2(s,l)),r=n,i=a,u=o}var t,e,r,i,u;zo.point=function(a,o){zo.point=n,r=(t=a)*to,i=Math.cos(o=(e=o)*to/2+Ka/4),u=Math.sin(o)},zo.lineEnd=function(){n(t,e)}}function zt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function Dt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function jt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Lt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function Ht(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function Ft(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function Pt(n){return[Math.atan2(n[1],n[0]),V(n[2])]}function Ot(n,t){return Math.abs(n[0]-t[0])<Qa&&Math.abs(n[1]-t[1])<Qa}function Yt(n,t){n*=to;var e=Math.cos(t*=to);Rt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function Rt(n,t,e){++Do,Lo+=(n-Lo)/Do,Ho+=(t-Ho)/Do,Fo+=(e-Fo)/Do}function Ut(){function n(n,i){n*=to;var u=Math.cos(i*=to),a=u*Math.cos(n),o=u*Math.sin(n),c=Math.sin(i),l=Math.atan2(Math.sqrt((l=e*c-r*o)*l+(l=r*a-t*c)*l+(l=t*o-e*a)*l),t*a+e*o+r*c);jo+=l,Po+=l*(t+(t=a)),Oo+=l*(e+(e=o)),Yo+=l*(r+(r=c)),Rt(t,e,r)}var t,e,r;Vo.point=function(i,u){i*=to;var a=Math.cos(u*=to);t=a*Math.cos(i),e=a*Math.sin(i),r=Math.sin(u),Vo.point=n,Rt(t,e,r)}}function It(){Vo.point=Yt}function Vt(){function n(n,t){n*=to;var e=Math.cos(t*=to),a=e*Math.cos(n),o=e*Math.sin(n),c=Math.sin(t),l=i*c-u*o,s=u*a-r*c,f=r*o-i*a,h=Math.sqrt(l*l+s*s+f*f),g=r*a+i*o+u*c,p=h&&-I(g)/h,m=Math.atan2(h,g);Ro+=p*l,Uo+=p*s,Io+=p*f,jo+=m,Po+=m*(r+(r=a)),Oo+=m*(i+(i=o)),Yo+=m*(u+(u=c)),Rt(r,i,u)}var t,e,r,i,u;Vo.point=function(a,o){t=a,e=o,Vo.point=n,a*=to;var c=Math.cos(o*=to);r=c*Math.cos(a),i=c*Math.sin(a),u=Math.sin(o),Rt(r,i,u)},Vo.lineEnd=function(){n(t,e),Vo.lineEnd=It,Vo.point=Yt}}function Xt(){return!0}function Zt(n,t,e,r,i){var u=[],a=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Ot(e,r)){i.lineStart();for(var o=0;t>o;++o)i.point((e=n[o])[0],e[1]);return i.lineEnd(),void 0}var c={point:e,points:n,other:null,visited:!1,entry:!0,subject:!0},l={point:e,points:[e],other:c,visited:!1,entry:!1,subject:!1};c.other=l,u.push(c),a.push(l),c={point:r,points:[r],other:null,visited:!1,entry:!1,subject:!0},l={point:r,points:[r],other:c,visited:!1,entry:!0,subject:!1},c.other=l,u.push(c),a.push(l)}}),a.sort(t),Bt(u),Bt(a),u.length){if(e)for(var o=1,c=!e(a[0].point),l=a.length;l>o;++o)a[o].entry=c=!c;for(var s,f,h,g=u[0];;){for(s=g;s.visited;)if((s=s.next)===g)return;f=s.points,i.lineStart();do{if(s.visited=s.other.visited=!0,s.entry){if(s.subject)for(var o=0;o<f.length;o++)i.point((h=f[o])[0],h[1]);else r(s.point,s.next.point,1,i);s=s.next}else{if(s.subject){f=s.prev.points;for(var o=f.length;--o>=0;)i.point((h=f[o])[0],h[1])}else r(s.point,s.prev.point,-1,i);s=s.prev}s=s.other,f=s.points}while(!s.visited);i.lineEnd()}}}function Bt(n){if(t=n.length){for(var t,e,r=0,i=n[0];++r<t;)i.next=e=n[r],e.prev=i,i=e;i.next=e=n[0],e.prev=i}}function $t(n,t,e,r){return function(i){function u(t,e){n(t,e)&&i.point(t,e)}function a(n,t){m.point(n,t)}function o(){d.point=a,m.lineStart()}function c(){d.point=u,m.lineEnd()}function l(n,t){y.point(n,t),p.push([n,t])}function s(){y.lineStart(),p=[]}function f(){l(p[0][0],p[0][1]),y.lineEnd();var n,t=y.clean(),e=v.buffer(),r=e.length;if(p.pop(),g.push(p),p=null,r){if(1&t){n=e[0];var u,r=n.length-1,a=-1;for(i.lineStart();++a<r;)i.point((u=n[a])[0],u[1]);return i.lineEnd(),void 0}r>1&&2&t&&e.push(e.pop().concat(e.shift())),h.push(e.filter(Wt))}}var h,g,p,m=t(i),d={point:u,lineStart:o,lineEnd:c,polygonStart:function(){d.point=l,d.lineStart=s,d.lineEnd=f,h=[],g=[],i.polygonStart()},polygonEnd:function(){d.point=u,d.lineStart=o,d.lineEnd=c,h=ya.merge(h),h.length?Zt(h,Gt,null,e,i):r(g)&&(i.lineStart(),e(null,null,1,i),i.lineEnd()),i.polygonEnd(),h=g=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},v=Jt(),y=t(v);return d}}function Wt(n){return n.length>1}function Jt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:s,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Gt(n,t){return((n=n.point)[0]<0?n[1]-Ka/2-Qa:Ka/2-n[1])-((t=t.point)[0]<0?t[1]-Ka/2-Qa:Ka/2-t[1])}function Kt(n,t){var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],u=0,a=!1,o=!1,c=0;Co.reset();for(var l=0,s=t.length;s>l;++l){var f=t[l],h=f.length;if(h){for(var g=f[0],p=g[0],m=g[1]/2+Ka/4,d=Math.sin(m),v=Math.cos(m),y=1;;){y===h&&(y=0),n=f[y];var M=n[0],x=n[1]/2+Ka/4,b=Math.sin(x),_=Math.cos(x),w=M-p,S=Math.abs(w)>Ka,E=d*b;if(Co.add(Math.atan2(E*Math.sin(w),v*_+E*Math.cos(w))),Math.abs(x)<Qa&&(o=!0),u+=S?w+(w>=0?2:-2)*Ka:w,S^p>=e^M>=e){var k=jt(zt(g),zt(n));Ft(k);var A=jt(i,k);Ft(A);var N=(S^w>=0?-1:1)*V(A[2]);r>N&&(c+=S^w>=0?1:-1)}if(!y++)break;p=M,d=b,v=_,g=n}Math.abs(u)>Qa&&(a=!0)}}return(!o&&!a&&0>Co||-Qa>u)^1&c}function Qt(n){var t,e=0/0,r=0/0,i=0/0;return{lineStart:function(){n.lineStart(),t=1},point:function(u,a){var o=u>0?Ka:-Ka,c=Math.abs(u-e);Math.abs(c-Ka)<Qa?(n.point(e,r=(r+a)/2>0?Ka/2:-Ka/2),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(o,r),n.point(u,r),t=0):i!==o&&c>=Ka&&(Math.abs(e-i)<Qa&&(e-=i*Qa),Math.abs(u-o)<Qa&&(u-=o*Qa),r=ne(e,r,u,a),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(o,r),t=0),n.point(e=u,r=a),i=o},lineEnd:function(){n.lineEnd(),e=r=0/0},clean:function(){return 2-t}}}function ne(n,t,e,r){var i,u,a=Math.sin(n-e);return Math.abs(a)>Qa?Math.atan((Math.sin(t)*(u=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*u*a)):(t+r)/2}function te(n,t,e,r){var i;if(null==n)i=e*Ka/2,r.point(-Ka,i),r.point(0,i),r.point(Ka,i),r.point(Ka,0),r.point(Ka,-i),r.point(0,-i),r.point(-Ka,-i),r.point(-Ka,0),r.point(-Ka,i);else if(Math.abs(n[0]-t[0])>Qa){var u=(n[0]<t[0]?1:-1)*Ka;i=e*u/2,r.point(-u,i),r.point(0,i),r.point(u,i)}else r.point(t[0],t[1])}function ee(n){return Kt(Zo,n)}function re(n){function t(n,t){return Math.cos(n)*Math.cos(t)>a}function e(n){var e,u,a,c,s;return{lineStart:function(){c=a=!1,s=1},point:function(f,h){var g,p=[f,h],m=t(f,h),d=o?m?0:i(f,h):m?i(f+(0>f?Ka:-Ka),h):0;if(!e&&(c=a=m)&&n.lineStart(),m!==a&&(g=r(e,p),(Ot(e,g)||Ot(p,g))&&(p[0]+=Qa,p[1]+=Qa,m=t(p[0],p[1]))),m!==a)s=0,m?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(l&&e&&o^m){var v;d&u||!(v=r(p,e,!0))||(s=0,o?(n.lineStart(),n.point(v[0][0],v[0][1]),n.point(v[1][0],v[1][1]),n.lineEnd()):(n.point(v[1][0],v[1][1]),n.lineEnd(),n.lineStart(),n.point(v[0][0],v[0][1])))}!m||e&&Ot(e,p)||n.point(p[0],p[1]),e=p,a=m,u=d},lineEnd:function(){a&&n.lineEnd(),e=null},clean:function(){return s|(c&&a)<<1}}}function r(n,t,e){var r=zt(n),i=zt(t),u=[1,0,0],o=jt(r,i),c=Dt(o,o),l=o[0],s=c-l*l;if(!s)return!e&&n;var f=a*c/s,h=-a*l/s,g=jt(u,o),p=Ht(u,f),m=Ht(o,h);Lt(p,m);var d=g,v=Dt(p,d),y=Dt(d,d),M=v*v-y*(Dt(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=Ht(d,(-v-x)/y);if(Lt(b,p),b=Pt(b),!e)return b;var _,w=n[0],S=t[0],E=n[1],k=t[1];w>S&&(_=w,w=S,S=_);var A=S-w,N=Math.abs(A-Ka)<Qa,q=N||Qa>A;if(!N&&E>k&&(_=E,E=k,k=_),q?N?E+k>0^b[1]<(Math.abs(b[0]-w)<Qa?E:k):E<=b[1]&&b[1]<=k:A>Ka^(w<=b[0]&&b[0]<=S)){var T=Ht(d,(-v+x)/y);return Lt(T,p),[b,Pt(T)]}}}function i(t,e){var r=o?n:Ka-n,i=0;return-r>t?i|=1:t>r&&(i|=2),-r>e?i|=4:e>r&&(i|=8),i}function u(n){return Kt(c,n)}var a=Math.cos(n),o=a>0,c=[n,0],l=Math.abs(a)>Qa,s=Ne(n,6*to);return $t(t,e,s,u)}function ie(n,t,e,r){function i(r,i){return Math.abs(r[0]-n)<Qa?i>0?0:3:Math.abs(r[0]-e)<Qa?i>0?2:1:Math.abs(r[1]-t)<Qa?i>0?1:0:i>0?3:2}function u(n,t){return a(n.point,t.point)}function a(n,t){var e=i(n,1),r=i(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}function o(i,u){var a=u[0]-i[0],o=u[1]-i[1],c=[0,1];return Math.abs(a)<Qa&&Math.abs(o)<Qa?n<=i[0]&&i[0]<=e&&t<=i[1]&&i[1]<=r:ue(n-i[0],a,c)&&ue(i[0]-e,-a,c)&&ue(t-i[1],o,c)&&ue(i[1]-r,-o,c)?(c[1]<1&&(u[0]=i[0]+c[1]*a,u[1]=i[1]+c[1]*o),c[0]>0&&(i[0]+=c[0]*a,i[1]+=c[0]*o),!0):!1}return function(c){function l(u){var a=i(u,-1),o=s([0===a||3===a?n:e,a>1?r:t]);return o}function s(n){for(var t=0,e=M.length,r=n[1],i=0;e>i;++i)for(var u,a=1,o=M[i],c=o.length,l=o[0];c>a;++a)u=o[a],l[1]<=r?u[1]>r&&f(l,u,n)>0&&++t:u[1]<=r&&f(l,u,n)<0&&--t,l=u;return 0!==t}function f(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(e[0]-n[0])*(t[1]-n[1])}function h(u,o,c,l){var s=0,f=0;if(null==u||(s=i(u,c))!==(f=i(o,c))||a(u,o)<0^c>0){do l.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+c+4)%4)!==f)}else l.point(o[0],o[1])}function g(i,u){return i>=n&&e>=i&&u>=t&&r>=u}function p(n,t){g(n,t)&&c.point(n,t)}function m(){T.point=v,M&&M.push(x=[]),A=!0,k=!1,S=E=0/0}function d(){y&&(v(b,_),w&&k&&q.rejoin(),y.push(q.buffer())),T.point=p,k&&c.lineEnd()}function v(n,t){n=Math.max(-Bo,Math.min(Bo,n)),t=Math.max(-Bo,Math.min(Bo,t));var e=g(n,t);if(M&&x.push([n,t]),A)b=n,_=t,w=e,A=!1,e&&(c.lineStart(),c.point(n,t));else if(e&&k)c.point(n,t);else{var r=[S,E],i=[n,t];o(r,i)?(k||(c.lineStart(),c.point(r[0],r[1])),c.point(i[0],i[1]),e||c.lineEnd()):e&&(c.lineStart(),c.point(n,t))}S=n,E=t,k=e}var y,M,x,b,_,w,S,E,k,A,N=c,q=Jt(),T={point:p,lineStart:m,lineEnd:d,polygonStart:function(){c=q,y=[],M=[]},polygonEnd:function(){c=N,(y=ya.merge(y)).length?(c.polygonStart(),Zt(y,u,l,h,c),c.polygonEnd()):s([n,t])&&(c.polygonStart(),c.lineStart(),h(null,null,1,c),c.lineEnd(),c.polygonEnd()),y=M=x=null}};return T}}function ue(n,t,e){if(Math.abs(t)<Qa)return 0>=n;var r=n/t;if(t>0){if(r>e[1])return!1;r>e[0]&&(e[0]=r)}else{if(r<e[0])return!1;r<e[1]&&(e[1]=r)}return!0}function ae(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function oe(n){var t=0,e=Ka/3,r=be(n),i=r(t,e);return i.parallels=function(n){return arguments.length?r(t=n[0]*Ka/180,e=n[1]*Ka/180):[180*(t/Ka),180*(e/Ka)]},i}function ce(n,t){function e(n,t){var e=Math.sqrt(u-2*i*Math.sin(t))/i;return[e*Math.sin(n*=i),a-e*Math.cos(n)]}var r=Math.sin(n),i=(r+Math.sin(t))/2,u=1+r*(2*i-r),a=Math.sqrt(u)/i;return e.invert=function(n,t){var e=a-t;return[Math.atan2(n,e)/i,V((u-(n*n+e*e)*i*i)/(2*i))]},e}function le(){function n(n,t){Wo+=i*n-r*t,r=n,i=t}var t,e,r,i;nc.point=function(u,a){nc.point=n,t=r=u,e=i=a},nc.lineEnd=function(){n(t,e)}}function se(n,t){Jo>n&&(Jo=n),n>Ko&&(Ko=n),Go>t&&(Go=t),t>Qo&&(Qo=t)}function fe(){function n(n,t){a.push("M",n,",",t,u)}function t(n,t){a.push("M",n,",",t),o.point=e}function e(n,t){a.push("L",n,",",t)}function r(){o.point=n}function i(){a.push("Z")}var u=he(4.5),a=[],o={point:n,lineStart:function(){o.point=t},lineEnd:r,polygonStart:function(){o.lineEnd=i},polygonEnd:function(){o.lineEnd=r,o.point=n},pointRadius:function(n){return u=he(n),o},result:function(){if(a.length){var n=a.join("");return a=[],n}}};return o}function he(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function ge(n,t){Lo+=n,Ho+=t,++Fo}function pe(){function n(n,r){var i=n-t,u=r-e,a=Math.sqrt(i*i+u*u);Po+=a*(t+n)/2,Oo+=a*(e+r)/2,Yo+=a,ge(t=n,e=r)}var t,e;ec.point=function(r,i){ec.point=n,ge(t=r,e=i)}}function me(){ec.point=ge}function de(){function n(n,t){var e=n-r,u=t-i,a=Math.sqrt(e*e+u*u);Po+=a*(r+n)/2,Oo+=a*(i+t)/2,Yo+=a,a=i*n-r*t,Ro+=a*(r+n),Uo+=a*(i+t),Io+=3*a,ge(r=n,i=t)}var t,e,r,i;ec.point=function(u,a){ec.point=n,ge(t=r=u,e=i=a)},ec.lineEnd=function(){n(t,e)}}function ve(n){function t(t,e){n.moveTo(t,e),n.arc(t,e,a,0,2*Ka)}function e(t,e){n.moveTo(t,e),o.point=r}function r(t,e){n.lineTo(t,e)}function i(){o.point=t}function u(){n.closePath()}var a=4.5,o={point:t,lineStart:function(){o.point=e},lineEnd:i,polygonStart:function(){o.lineEnd=u},polygonEnd:function(){o.lineEnd=i,o.point=t},pointRadius:function(n){return a=n,o},result:s};return o}function ye(n){function t(t){function r(e,r){e=n(e,r),t.point(e[0],e[1])}function i(){M=0/0,S.point=a,t.lineStart()}function a(r,i){var a=zt([r,i]),o=n(r,i);e(M,x,y,b,_,w,M=o[0],x=o[1],y=r,b=a[0],_=a[1],w=a[2],u,t),t.point(M,x)}function o(){S.point=r,t.lineEnd()}function c(){i(),S.point=l,S.lineEnd=s}function l(n,t){a(f=n,h=t),g=M,p=x,m=b,d=_,v=w,S.point=a}function s(){e(M,x,y,b,_,w,g,p,f,m,d,v,u,t),S.lineEnd=o,o()}var f,h,g,p,m,d,v,y,M,x,b,_,w,S={point:r,lineStart:i,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=c},polygonEnd:function(){t.polygonEnd(),S.lineStart=i}};return S}function e(t,u,a,o,c,l,s,f,h,g,p,m,d,v){var y=s-t,M=f-u,x=y*y+M*M;if(x>4*r&&d--){var b=o+g,_=c+p,w=l+m,S=Math.sqrt(b*b+_*_+w*w),E=Math.asin(w/=S),k=Math.abs(Math.abs(w)-1)<Qa?(a+h)/2:Math.atan2(_,b),A=n(k,E),N=A[0],q=A[1],T=N-t,C=q-u,z=M*T-y*C;(z*z/x>r||Math.abs((y*T+M*C)/x-.5)>.3||i>o*g+c*p+l*m)&&(e(t,u,a,o,c,l,N,q,k,b/=S,_/=S,w,d,v),v.point(N,q),e(N,q,k,b,_,w,s,f,h,g,p,m,d,v))}}var r=.5,i=Math.cos(30*to),u=16;return t.precision=function(n){return arguments.length?(u=(r=n*n)>0&&16,t):Math.sqrt(r)},t}function Me(n){var t=ye(function(t,e){return n([t*eo,e*eo])});return function(n){return n=t(n),{point:function(t,e){n.point(t*to,e*to)},sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}}function xe(n){return be(function(){return n})()}function be(n){function t(n){return n=o(n[0]*to,n[1]*to),[n[0]*h+c,l-n[1]*h]}function e(n){return n=o.invert((n[0]-c)/h,(l-n[1])/h),n&&[n[0]*eo,n[1]*eo]}function r(){o=ae(a=Se(v,y,M),u);var n=u(m,d);return c=g-n[0]*h,l=p+n[1]*h,i()}function i(){return s&&(s.valid=!1,s=null),t}var u,a,o,c,l,s,f=ye(function(n,t){return n=u(n,t),[n[0]*h+c,l-n[1]*h]}),h=150,g=480,p=250,m=0,d=0,v=0,y=0,M=0,x=Xo,b=mt,_=null,w=null;return t.stream=function(n){return s&&(s.valid=!1),s=_e(a,x(f(b(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(x=null==n?(_=n,Xo):re((_=+n)*to),i()):_},t.clipExtent=function(n){return arguments.length?(w=n,b=null==n?mt:ie(n[0][0],n[0][1],n[1][0],n[1][1]),i()):w},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(m=n[0]%360*to,d=n[1]%360*to,r()):[m*eo,d*eo]},t.rotate=function(n){return arguments.length?(v=n[0]%360*to,y=n[1]%360*to,M=n.length>2?n[2]%360*to:0,r()):[v*eo,y*eo,M*eo]},ya.rebind(t,f,"precision"),function(){return u=n.apply(this,arguments),t.invert=u.invert&&e,r()}}function _e(n,t){return{point:function(e,r){r=n(e*to,r*to),e=r[0],t.point(e>Ka?e-2*Ka:-Ka>e?e+2*Ka:e,r[1])},sphere:function(){t.sphere()},lineStart:function(){t.lineStart()},lineEnd:function(){t.lineEnd()},polygonStart:function(){t.polygonStart()},polygonEnd:function(){t.polygonEnd()}}}function we(n,t){return[n,t]}function Se(n,t,e){return n?t||e?ae(ke(n),Ae(t,e)):ke(n):t||e?Ae(t,e):we}function Ee(n){return function(t,e){return t+=n,[t>Ka?t-2*Ka:-Ka>t?t+2*Ka:t,e]}}function ke(n){var t=Ee(n);return t.invert=Ee(-n),t}function Ae(n,t){function e(n,t){var e=Math.cos(t),o=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*r+o*i;return[Math.atan2(c*u-s*a,o*r-l*i),V(s*u+c*a)]}var r=Math.cos(n),i=Math.sin(n),u=Math.cos(t),a=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),o=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*u-c*a;return[Math.atan2(c*u+l*a,o*r+s*i),V(s*r-o*i)]},e}function Ne(n,t){var e=Math.cos(n),r=Math.sin(n);return function(i,u,a,o){null!=i?(i=qe(e,i),u=qe(e,u),(a>0?u>i:i>u)&&(i+=2*a*Ka)):(i=n+2*a*Ka,u=n);for(var c,l=a*t,s=i;a>0?s>u:u>s;s-=l)o.point((c=Pt([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],c[1])}}function qe(n,t){var e=zt(t);e[0]-=n,Ft(e);var r=I(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Qa)%(2*Math.PI)}function Te(n,t,e){var r=ya.range(n,t-Qa,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function Ce(n,t,e){var r=ya.range(n,t-Qa,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function ze(n){return n.source}function De(n){return n.target}function je(n,t,e,r){var i=Math.cos(t),u=Math.sin(t),a=Math.cos(r),o=Math.sin(r),c=i*Math.cos(n),l=i*Math.sin(n),s=a*Math.cos(e),f=a*Math.sin(e),h=2*Math.asin(Math.sqrt(B(r-t)+i*a*B(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*c+t*s,i=e*l+t*f,a=e*u+t*o;return[Math.atan2(i,r)*eo,Math.atan2(a,Math.sqrt(r*r+i*i))*eo]}:function(){return[n*eo,t*eo]};return p.distance=h,p}function Le(){function n(n,i){var u=Math.sin(i*=to),a=Math.cos(i),o=Math.abs((n*=to)-t),c=Math.cos(o);rc+=Math.atan2(Math.sqrt((o=a*Math.sin(o))*o+(o=r*u-e*a*c)*o),e*u+r*a*c),t=n,e=u,r=a}var t,e,r;ic.point=function(i,u){t=i*to,e=Math.sin(u*=to),r=Math.cos(u),ic.point=n},ic.lineEnd=function(){ic.point=ic.lineEnd=s}}function He(n,t){function e(t,e){var r=Math.cos(t),i=Math.cos(e),u=n(r*i);return[u*i*Math.sin(t),u*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),i=t(r),u=Math.sin(i),a=Math.cos(i);return[Math.atan2(n*u,r*a),Math.asin(r&&e*u/r)]},e}function Fe(n,t){function e(n,t){var e=Math.abs(Math.abs(t)-Ka/2)<Qa?0:a/Math.pow(i(t),u);return[e*Math.sin(u*n),a-e*Math.cos(u*n)]}var r=Math.cos(n),i=function(n){return Math.tan(Ka/4+n/2)},u=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(i(t)/i(n)),a=r*Math.pow(i(n),u)/u;return u?(e.invert=function(n,t){var e=a-t,r=U(u)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/u,2*Math.atan(Math.pow(a/r,1/u))-Ka/2]},e):Oe}function Pe(n,t){function e(n,t){var e=u-t;return[e*Math.sin(i*n),u-e*Math.cos(i*n)]}var r=Math.cos(n),i=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),u=r/i+n;return Math.abs(i)<Qa?we:(e.invert=function(n,t){var e=u-t;return[Math.atan2(n,e)/i,u-U(i)*Math.sqrt(n*n+e*e)]},e)}function Oe(n,t){return[n,Math.log(Math.tan(Ka/4+t/2))]}function Ye(n){var t,e=xe(n),r=e.scale,i=e.translate,u=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=i.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var a=u.apply(e,arguments);if(a===e){if(t=null==n){var o=Ka*r(),c=i();u([[c[0]-o,c[1]-o],[c[0]+o,c[1]+o]])}}else t&&(a=null);return a},e.clipExtent(null)}function Re(n,t){var e=Math.cos(t)*Math.sin(n);return[Math.log((1+e)/(1-e))/2,Math.atan2(Math.tan(t),Math.cos(n))]}function Ue(n){function t(t){function a(){l.push("M",u(n(s),o))}for(var c,l=[],s=[],f=-1,h=t.length,g=pt(e),p=pt(r);++f<h;)i.call(this,c=t[f],f)?s.push([+g.call(this,c,f),+p.call(this,c,f)]):s.length&&(a(),s=[]);return s.length&&a(),l.length?l.join(""):null}var e=Ie,r=Ve,i=Xt,u=Xe,a=u.key,o=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(i=n,t):i},t.interpolate=function(n){return arguments.length?(a="function"==typeof n?u=n:(u=sc.get(n)||Xe).key,t):a},t.tension=function(n){return arguments.length?(o=n,t):o},t}function Ie(n){return n[0]}function Ve(n){return n[1]}function Xe(n){return n.join("L")}function Ze(n){return Xe(n)+"Z"}function Be(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&i.push("H",r[0]),i.join("")}function $e(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0]);return i.join("")}function We(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1]);return i.join("")}function Je(n,t){return n.length<4?Xe(n):n[1]+Qe(n.slice(1,n.length-1),nr(n,t))}function Ge(n,t){return n.length<3?Xe(n):n[0]+Qe((n.push(n[0]),n),nr([n[n.length-2]].concat(n,[n[1]]),t))}function Ke(n,t){return n.length<3?Xe(n):n[0]+Qe(n,nr(n,t))}function Qe(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Xe(n);var e=n.length!=t.length,r="",i=n[0],u=n[1],a=t[0],o=a,c=1;if(e&&(r+="Q"+(u[0]-2*a[0]/3)+","+(u[1]-2*a[1]/3)+","+u[0]+","+u[1],i=n[1],c=2),t.length>1){o=t[1],u=n[c],c++,r+="C"+(i[0]+a[0])+","+(i[1]+a[1])+","+(u[0]-o[0])+","+(u[1]-o[1])+","+u[0]+","+u[1];for(var l=2;l<t.length;l++,c++)u=n[c],o=t[l],r+="S"+(u[0]-o[0])+","+(u[1]-o[1])+","+u[0]+","+u[1]}if(e){var s=n[c];r+="Q"+(u[0]+2*o[0]/3)+","+(u[1]+2*o[1]/3)+","+s[0]+","+s[1]}return r}function nr(n,t){for(var e,r=[],i=(1-t)/2,u=n[0],a=n[1],o=1,c=n.length;++o<c;)e=u,u=a,a=n[o],r.push([i*(a[0]-e[0]),i*(a[1]-e[1])]);return r}function tr(n){if(n.length<3)return Xe(n);var t=1,e=n.length,r=n[0],i=r[0],u=r[1],a=[i,i,i,(r=n[1])[0]],o=[u,u,u,r[1]],c=[i,",",u,"L",ur(gc,a),",",ur(gc,o)];for(n.push(n[e-1]);++t<=e;)r=n[t],a.shift(),a.push(r[0]),o.shift(),o.push(r[1]),ar(c,a,o);return n.pop(),c.push("L",r),c.join("")}function er(n){if(n.length<4)return Xe(n);for(var t,e=[],r=-1,i=n.length,u=[0],a=[0];++r<3;)t=n[r],u.push(t[0]),a.push(t[1]);for(e.push(ur(gc,u)+","+ur(gc,a)),--r;++r<i;)t=n[r],u.shift(),u.push(t[0]),a.shift(),a.push(t[1]),ar(e,u,a);return e.join("")}function rr(n){for(var t,e,r=-1,i=n.length,u=i+4,a=[],o=[];++r<4;)e=n[r%i],a.push(e[0]),o.push(e[1]);for(t=[ur(gc,a),",",ur(gc,o)],--r;++r<u;)e=n[r%i],a.shift(),a.push(e[0]),o.shift(),o.push(e[1]),ar(t,a,o);return t.join("")}function ir(n,t){var e=n.length-1;if(e)for(var r,i,u=n[0][0],a=n[0][1],o=n[e][0]-u,c=n[e][1]-a,l=-1;++l<=e;)r=n[l],i=l/e,r[0]=t*r[0]+(1-t)*(u+i*o),r[1]=t*r[1]+(1-t)*(a+i*c);return tr(n)}function ur(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]
}function ar(n,t,e){n.push("C",ur(fc,t),",",ur(fc,e),",",ur(hc,t),",",ur(hc,e),",",ur(gc,t),",",ur(gc,e))}function or(n,t){return(t[1]-n[1])/(t[0]-n[0])}function cr(n){for(var t=0,e=n.length-1,r=[],i=n[0],u=n[1],a=r[0]=or(i,u);++t<e;)r[t]=(a+(a=or(i=u,u=n[t+1])))/2;return r[t]=a,r}function lr(n){for(var t,e,r,i,u=[],a=cr(n),o=-1,c=n.length-1;++o<c;)t=or(n[o],n[o+1]),Math.abs(t)<1e-6?a[o]=a[o+1]=0:(e=a[o]/t,r=a[o+1]/t,i=e*e+r*r,i>9&&(i=3*t/Math.sqrt(i),a[o]=i*e,a[o+1]=i*r));for(o=-1;++o<=c;)i=(n[Math.min(c,o+1)][0]-n[Math.max(0,o-1)][0])/(6*(1+a[o]*a[o])),u.push([i||0,a[o]*i||0]);return u}function sr(n){return n.length<3?Xe(n):n[0]+Qe(n,lr(n))}function fr(n,t,e,r){var i,u,a,o,c,l,s;return i=r[n],u=i[0],a=i[1],i=r[t],o=i[0],c=i[1],i=r[e],l=i[0],s=i[1],(s-a)*(o-u)-(c-a)*(l-u)>0}function hr(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function gr(n,t,e,r){var i=n[0],u=e[0],a=t[0]-i,o=r[0]-u,c=n[1],l=e[1],s=t[1]-c,f=r[1]-l,h=(o*(c-l)-f*(i-u))/(f*a-o*s);return[i+h*a,c+h*s]}function pr(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function mr(n,t){var e={list:n.map(function(n,t){return{index:t,x:n[0],y:n[1]}}).sort(function(n,t){return n.y<t.y?-1:n.y>t.y?1:n.x<t.x?-1:n.x>t.x?1:0}),bottomSite:null},r={list:[],leftEnd:null,rightEnd:null,init:function(){r.leftEnd=r.createHalfEdge(null,"l"),r.rightEnd=r.createHalfEdge(null,"l"),r.leftEnd.r=r.rightEnd,r.rightEnd.l=r.leftEnd,r.list.unshift(r.leftEnd,r.rightEnd)},createHalfEdge:function(n,t){return{edge:n,side:t,vertex:null,l:null,r:null}},insert:function(n,t){t.l=n,t.r=n.r,n.r.l=t,n.r=t},leftBound:function(n){var t=r.leftEnd;do t=t.r;while(t!=r.rightEnd&&i.rightOf(t,n));return t=t.l},del:function(n){n.l.r=n.r,n.r.l=n.l,n.edge=null},right:function(n){return n.r},left:function(n){return n.l},leftRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[n.side]},rightRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[mc[n.side]]}},i={bisect:function(n,t){var e={region:{l:n,r:t},ep:{l:null,r:null}},r=t.x-n.x,i=t.y-n.y,u=r>0?r:-r,a=i>0?i:-i;return e.c=n.x*r+n.y*i+.5*(r*r+i*i),u>a?(e.a=1,e.b=i/r,e.c/=r):(e.b=1,e.a=r/i,e.c/=i),e},intersect:function(n,t){var e=n.edge,r=t.edge;if(!e||!r||e.region.r==r.region.r)return null;var i=e.a*r.b-e.b*r.a;if(Math.abs(i)<1e-10)return null;var u,a,o=(e.c*r.b-r.c*e.b)/i,c=(r.c*e.a-e.c*r.a)/i,l=e.region.r,s=r.region.r;l.y<s.y||l.y==s.y&&l.x<s.x?(u=n,a=e):(u=t,a=r);var f=o>=a.region.r.x;return f&&"l"===u.side||!f&&"r"===u.side?null:{x:o,y:c}},rightOf:function(n,t){var e=n.edge,r=e.region.r,i=t.x>r.x;if(i&&"l"===n.side)return 1;if(!i&&"r"===n.side)return 0;if(1===e.a){var u=t.y-r.y,a=t.x-r.x,o=0,c=0;if(!i&&e.b<0||i&&e.b>=0?c=o=u>=e.b*a:(c=t.x+t.y*e.b>e.c,e.b<0&&(c=!c),c||(o=1)),!o){var l=r.x-e.region.l.x;c=e.b*(a*a-u*u)<l*u*(1+2*a/l+e.b*e.b),e.b<0&&(c=!c)}}else{var s=e.c-e.a*t.x,f=t.y-s,h=t.x-r.x,g=s-r.y;c=f*f>h*h+g*g}return"l"===n.side?c:!c},endPoint:function(n,e,r){n.ep[e]=r,n.ep[mc[e]]&&t(n)},distance:function(n,t){var e=n.x-t.x,r=n.y-t.y;return Math.sqrt(e*e+r*r)}},u={list:[],insert:function(n,t,e){n.vertex=t,n.ystar=t.y+e;for(var r=0,i=u.list,a=i.length;a>r;r++){var o=i[r];if(!(n.ystar>o.ystar||n.ystar==o.ystar&&t.x>o.vertex.x))break}i.splice(r,0,n)},del:function(n){for(var t=0,e=u.list,r=e.length;r>t&&e[t]!=n;++t);e.splice(t,1)},empty:function(){return 0===u.list.length},nextEvent:function(n){for(var t=0,e=u.list,r=e.length;r>t;++t)if(e[t]==n)return e[t+1];return null},min:function(){var n=u.list[0];return{x:n.vertex.x,y:n.ystar}},extractMin:function(){return u.list.shift()}};r.init(),e.bottomSite=e.list.shift();for(var a,o,c,l,s,f,h,g,p,m,d,v,y,M=e.list.shift();;)if(u.empty()||(a=u.min()),M&&(u.empty()||M.y<a.y||M.y==a.y&&M.x<a.x))o=r.leftBound(M),c=r.right(o),h=r.rightRegion(o),v=i.bisect(h,M),f=r.createHalfEdge(v,"l"),r.insert(o,f),m=i.intersect(o,f),m&&(u.del(o),u.insert(o,m,i.distance(m,M))),o=f,f=r.createHalfEdge(v,"r"),r.insert(o,f),m=i.intersect(f,c),m&&u.insert(f,m,i.distance(m,M)),M=e.list.shift();else{if(u.empty())break;o=u.extractMin(),l=r.left(o),c=r.right(o),s=r.right(c),h=r.leftRegion(o),g=r.rightRegion(c),d=o.vertex,i.endPoint(o.edge,o.side,d),i.endPoint(c.edge,c.side,d),r.del(o),u.del(c),r.del(c),y="l",h.y>g.y&&(p=h,h=g,g=p,y="r"),v=i.bisect(h,g),f=r.createHalfEdge(v,y),r.insert(l,f),i.endPoint(v,mc[y],d),m=i.intersect(l,f),m&&(u.del(l),u.insert(l,m,i.distance(m,h))),m=i.intersect(f,s),m&&u.insert(f,m,i.distance(m,h))}for(o=r.right(r.leftEnd);o!=r.rightEnd;o=r.right(o))t(o.edge)}function dr(n){return n.x}function vr(n){return n.y}function yr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function Mr(n,t,e,r,i,u){if(!n(t,e,r,i,u)){var a=.5*(e+i),o=.5*(r+u),c=t.nodes;c[0]&&Mr(n,c[0],e,r,a,o),c[1]&&Mr(n,c[1],a,r,i,o),c[2]&&Mr(n,c[2],e,o,a,u),c[3]&&Mr(n,c[3],a,o,i,u)}}function xr(n,t){n=ya.rgb(n),t=ya.rgb(t);var e=n.r,r=n.g,i=n.b,u=t.r-e,a=t.g-r,o=t.b-i;return function(n){return"#"+ct(Math.round(e+u*n))+ct(Math.round(r+a*n))+ct(Math.round(i+o*n))}}function br(n,t){var e,r={},i={};for(e in n)e in t?r[e]=Sr(n[e],t[e]):i[e]=n[e];for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n);return i}}function _r(n,t){return t-=n=+n,function(e){return n+t*e}}function wr(n,t){var e,r,i,u,a,o=0,c=0,l=[],s=[];for(n+="",t+="",dc.lastIndex=0,r=0;e=dc.exec(t);++r)e.index&&l.push(t.substring(o,c=e.index)),s.push({i:l.length,x:e[0]}),l.push(null),o=dc.lastIndex;for(o<t.length&&l.push(t.substring(o)),r=0,u=s.length;(e=dc.exec(n))&&u>r;++r)if(a=s[r],a.x==e[0]){if(a.i)if(null==l[a.i+1])for(l[a.i-1]+=a.x,l.splice(a.i,1),i=r+1;u>i;++i)s[i].i--;else for(l[a.i-1]+=a.x+l[a.i+1],l.splice(a.i,2),i=r+1;u>i;++i)s[i].i-=2;else if(null==l[a.i+1])l[a.i]=a.x;else for(l[a.i]=a.x+l[a.i+1],l.splice(a.i+1,1),i=r+1;u>i;++i)s[i].i--;s.splice(r,1),u--,r--}else a.x=_r(parseFloat(e[0]),parseFloat(a.x));for(;u>r;)a=s.pop(),null==l[a.i+1]?l[a.i]=a.x:(l[a.i]=a.x+l[a.i+1],l.splice(a.i+1,1)),u--;return 1===l.length?null==l[0]?(a=s[0].x,function(n){return a(n)+""}):function(){return t}:function(n){for(r=0;u>r;++r)l[(a=s[r]).i]=a.x(n);return l.join("")}}function Sr(n,t){for(var e,r=ya.interpolators.length;--r>=0&&!(e=ya.interpolators[r](n,t)););return e}function Er(n,t){var e,r=[],i=[],u=n.length,a=t.length,o=Math.min(n.length,t.length);for(e=0;o>e;++e)r.push(Sr(n[e],t[e]));for(;u>e;++e)i[e]=n[e];for(;a>e;++e)i[e]=t[e];return function(n){for(e=0;o>e;++e)i[e]=r[e](n);return i}}function kr(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function Ar(n){return function(t){return 1-n(1-t)}}function Nr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function qr(n){return n*n}function Tr(n){return n*n*n}function Cr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function zr(n){return function(t){return Math.pow(t,n)}}function Dr(n){return 1-Math.cos(n*Ka/2)}function jr(n){return Math.pow(2,10*(n-1))}function Lr(n){return 1-Math.sqrt(1-n*n)}function Hr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/(2*Ka)*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,10*-r)*Math.sin(2*(r-e)*Ka/t)}}function Fr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Pr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Or(n,t){n=ya.hcl(n),t=ya.hcl(t);var e=n.h,r=n.c,i=n.l,u=t.h-e,a=t.c-r,o=t.l-i;return isNaN(a)&&(a=0,r=isNaN(r)?t.c:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return J(e+u*n,r+a*n,i+o*n)+""}}function Yr(n,t){n=ya.hsl(n),t=ya.hsl(t);var e=n.h,r=n.s,i=n.l,u=t.h-e,a=t.s-r,o=t.l-i;return isNaN(a)&&(a=0,r=isNaN(r)?t.s:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return R(e+u*n,r+a*n,i+o*n)+""}}function Rr(n,t){n=ya.lab(n),t=ya.lab(t);var e=n.l,r=n.a,i=n.b,u=t.l-e,a=t.a-r,o=t.b-i;return function(n){return Q(e+u*n,r+a*n,i+o*n)+""}}function Ur(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Ir(n){var t=[n.a,n.b],e=[n.c,n.d],r=Xr(t),i=Vr(t,e),u=Xr(Zr(e,t,-i))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*eo,this.translate=[n.e,n.f],this.scale=[r,u],this.skew=u?Math.atan2(i,u)*eo:0}function Vr(n,t){return n[0]*t[0]+n[1]*t[1]}function Xr(n){var t=Math.sqrt(Vr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Zr(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Br(n,t){var e,r=[],i=[],u=ya.transform(n),a=ya.transform(t),o=u.translate,c=a.translate,l=u.rotate,s=a.rotate,f=u.skew,h=a.skew,g=u.scale,p=a.scale;return o[0]!=c[0]||o[1]!=c[1]?(r.push("translate(",null,",",null,")"),i.push({i:1,x:_r(o[0],c[0])},{i:3,x:_r(o[1],c[1])})):c[0]||c[1]?r.push("translate("+c+")"):r.push(""),l!=s?(l-s>180?s+=360:s-l>180&&(l+=360),i.push({i:r.push(r.pop()+"rotate(",null,")")-2,x:_r(l,s)})):s&&r.push(r.pop()+"rotate("+s+")"),f!=h?i.push({i:r.push(r.pop()+"skewX(",null,")")-2,x:_r(f,h)}):h&&r.push(r.pop()+"skewX("+h+")"),g[0]!=p[0]||g[1]!=p[1]?(e=r.push(r.pop()+"scale(",null,",",null,")"),i.push({i:e-4,x:_r(g[0],p[0])},{i:e-2,x:_r(g[1],p[1])})):(1!=p[0]||1!=p[1])&&r.push(r.pop()+"scale("+p+")"),e=i.length,function(n){for(var t,u=-1;++u<e;)r[(t=i[u]).i]=t.x(n);return r.join("")}}function $r(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return(e-n)*t}}function Wr(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return Math.max(0,Math.min(1,(e-n)*t))}}function Jr(n){for(var t=n.source,e=n.target,r=Kr(t,e),i=[t];t!==r;)t=t.parent,i.push(t);for(var u=i.length;e!==r;)i.splice(u,0,e),e=e.parent;return i}function Gr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Kr(n,t){if(n===t)return n;for(var e=Gr(n),r=Gr(t),i=e.pop(),u=r.pop(),a=null;i===u;)a=i,i=e.pop(),u=r.pop();return a}function Qr(n){n.fixed|=2}function ni(n){n.fixed&=-7}function ti(n){n.fixed|=4,n.px=n.x,n.py=n.y}function ei(n){n.fixed&=-5}function ri(n,t,e){var r=0,i=0;if(n.charge=0,!n.leaf)for(var u,a=n.nodes,o=a.length,c=-1;++c<o;)u=a[c],null!=u&&(ri(u,t,e),n.charge+=u.charge,r+=u.charge*u.cx,i+=u.charge*u.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var l=t*e[n.point.index];n.charge+=n.pointCharge=l,r+=l*n.point.x,i+=l*n.point.y}n.cx=r/n.charge,n.cy=i/n.charge}function ii(n,t){return ya.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=ci,n}function ui(n){return n.children}function ai(n){return n.value}function oi(n,t){return t.value-n.value}function ci(n){return ya.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function li(n){return n.x}function si(n){return n.y}function fi(n,t,e){n.y0=t,n.y=e}function hi(n){return ya.range(n.length)}function gi(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function pi(n){for(var t,e=1,r=0,i=n[0][1],u=n.length;u>e;++e)(t=n[e][1])>i&&(r=e,i=t);return r}function mi(n){return n.reduce(di,0)}function di(n,t){return n+t[1]}function vi(n,t){return yi(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function yi(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,u=[];++e<=t;)u[e]=i*e+r;return u}function Mi(n){return[ya.min(n),ya.max(n)]}function xi(n,t){return n.parent==t.parent?1:2}function bi(n){var t=n.children;return t&&t.length?t[0]:n._tree.thread}function _i(n){var t,e=n.children;return e&&(t=e.length)?e[t-1]:n._tree.thread}function wi(n,t){var e=n.children;if(e&&(i=e.length))for(var r,i,u=-1;++u<i;)t(r=wi(e[u],t),n)>0&&(n=r);return n}function Si(n,t){return n.x-t.x}function Ei(n,t){return t.x-n.x}function ki(n,t){return n.depth-t.depth}function Ai(n,t){function e(n,r){var i=n.children;if(i&&(a=i.length))for(var u,a,o=null,c=-1;++c<a;)u=i[c],e(u,o),o=u;t(n,r)}e(n,null)}function Ni(n){for(var t,e=0,r=0,i=n.children,u=i.length;--u>=0;)t=i[u]._tree,t.prelim+=e,t.mod+=e,e+=t.shift+(r+=t.change)}function qi(n,t,e){n=n._tree,t=t._tree;var r=e/(t.number-n.number);n.change+=r,t.change-=r,t.shift+=e,t.prelim+=e,t.mod+=e}function Ti(n,t,e){return n._tree.ancestor.parent==t.parent?n._tree.ancestor:e}function Ci(n,t){return n.value-t.value}function zi(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Di(n,t){n._pack_next=t,t._pack_prev=n}function ji(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r;return.999*i*i>e*e+r*r}function Li(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(l=e.length)){var e,r,i,u,a,o,c,l,s=1/0,f=-1/0,h=1/0,g=-1/0;if(e.forEach(Hi),r=e[0],r.x=-r.r,r.y=0,t(r),l>1&&(i=e[1],i.x=i.r,i.y=0,t(i),l>2))for(u=e[2],Oi(r,i,u),t(u),zi(r,u),r._pack_prev=u,zi(u,i),i=r._pack_next,a=3;l>a;a++){Oi(r,i,u=e[a]);var p=0,m=1,d=1;for(o=i._pack_next;o!==i;o=o._pack_next,m++)if(ji(o,u)){p=1;break}if(1==p)for(c=r._pack_prev;c!==o._pack_prev&&!ji(c,u);c=c._pack_prev,d++);p?(d>m||m==d&&i.r<r.r?Di(r,i=o):Di(r=c,i),a--):(zi(r,u),i=u,t(u))}var v=(s+f)/2,y=(h+g)/2,M=0;for(a=0;l>a;a++)u=e[a],u.x-=v,u.y-=y,M=Math.max(M,u.r+Math.sqrt(u.x*u.x+u.y*u.y));n.r=M,e.forEach(Fi)}}function Hi(n){n._pack_next=n._pack_prev=n}function Fi(n){delete n._pack_next,delete n._pack_prev}function Pi(n,t,e,r){var i=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,i)for(var u=-1,a=i.length;++u<a;)Pi(i[u],t,e,r)}function Oi(n,t,e){var r=n.r+e.r,i=t.x-n.x,u=t.y-n.y;if(r&&(i||u)){var a=t.r+e.r,o=i*i+u*u;a*=a,r*=r;var c=.5+(r-a)/(2*o),l=Math.sqrt(Math.max(0,2*a*(r+o)-(r-=o)*r-a*a))/(2*o);e.x=n.x+c*i+l*u,e.y=n.y+c*u-l*i}else e.x=n.x+r,e.y=n.y}function Yi(n){return 1+ya.max(n,function(n){return n.y})}function Ri(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Ui(n){var t=n.children;return t&&t.length?Ui(t[0]):n}function Ii(n){var t,e=n.children;return e&&(t=e.length)?Ii(e[t-1]):n}function Vi(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Xi(n,t){var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],u=n.dy-t[0]-t[2];return 0>i&&(e+=i/2,i=0),0>u&&(r+=u/2,u=0),{x:e,y:r,dx:i,dy:u}}function Zi(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Bi(n){return n.rangeExtent?n.rangeExtent():Zi(n.range())}function $i(n,t,e,r){var i=e(n[0],n[1]),u=r(t[0],t[1]);return function(n){return u(i(n))}}function Wi(n,t){var e,r=0,i=n.length-1,u=n[r],a=n[i];return u>a&&(e=r,r=i,i=e,e=u,u=a,a=e),n[r]=t.floor(u),n[i]=t.ceil(a),n}function Ji(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:kc}function Gi(n,t,e,r){var i=[],u=[],a=0,o=Math.min(n.length,t.length)-1;for(n[o]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<=o;)i.push(e(n[a-1],n[a])),u.push(r(t[a-1],t[a]));return function(t){var e=ya.bisect(n,t,1,o)-1;return u[e](i[e](t))}}function Ki(n,t,e,r){function i(){var i=Math.min(n.length,t.length)>2?Gi:$i,c=r?Wr:$r;return a=i(n,t,c,e),o=i(t,n,c,Sr),u}function u(n){return a(n)}var a,o;return u.invert=function(n){return o(n)},u.domain=function(t){return arguments.length?(n=t.map(Number),i()):n},u.range=function(n){return arguments.length?(t=n,i()):t},u.rangeRound=function(n){return u.range(n).interpolate(Ur)},u.clamp=function(n){return arguments.length?(r=n,i()):r},u.interpolate=function(n){return arguments.length?(e=n,i()):e},u.ticks=function(t){return ru(n,t)},u.tickFormat=function(t,e){return iu(n,t,e)},u.nice=function(t){return nu(n,t),i()},u.copy=function(){return Ki(n,t,e,r)},i()}function Qi(n,t){return ya.rebind(n,t,"range","rangeRound","interpolate","clamp")}function nu(n,t){return Wi(n,Ji(t?eu(n,t)[2]:tu(n)))}function tu(n){var t=Zi(n),e=t[1]-t[0];return Math.pow(10,Math.round(Math.log(e)/Math.LN10)-1)}function eu(n,t){var e=Zi(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),u=t/r*i;return.15>=u?i*=10:.35>=u?i*=5:.75>=u&&(i*=2),e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}function ru(n,t){return ya.range.apply(ya,eu(n,t))}function iu(n,t,e){var r=-Math.floor(Math.log(eu(n,t)[2])/Math.LN10+.01);return ya.format(e?e.replace(wo,function(n,t,e,i,u,a,o,c,l,s){return[t,e,i,u,a,o,c,l||"."+(r-2*("%"===s)),s].join("")}):",."+r+"f")}function uu(n,t,e,r){function i(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function u(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function a(t){return n(i(t))}return a.invert=function(t){return u(n.invert(t))},a.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(i)),a):r},a.base=function(e){return arguments.length?(t=+e,n.domain(r.map(i)),a):t},a.nice=function(){var t=Wi(r.map(i),e?Math:Nc);return n.domain(t),r=t.map(u),a},a.ticks=function(){var n=Zi(r),a=[],o=n[0],c=n[1],l=Math.floor(i(o)),s=Math.ceil(i(c)),f=t%1?2:t;if(isFinite(s-l)){if(e){for(;s>l;l++)for(var h=1;f>h;h++)a.push(u(l)*h);a.push(u(l))}else for(a.push(u(l));l++<s;)for(var h=f-1;h>0;h--)a.push(u(l)*h);for(l=0;a[l]<o;l++);for(s=a.length;a[s-1]>c;s--);a=a.slice(l,s)}return a},a.tickFormat=function(n,t){if(!arguments.length)return Ac;arguments.length<2?t=Ac:"function"!=typeof t&&(t=ya.format(t));var r,o=Math.max(.1,n/a.ticks().length),c=e?(r=1e-12,Math.ceil):(r=-1e-12,Math.floor);return function(n){return n/u(c(i(n)+r))<=o?t(n):""}},a.copy=function(){return uu(n.copy(),t,e,r)},Qi(a,n)}function au(n,t,e){function r(t){return n(i(t))}var i=ou(t),u=ou(1/t);return r.invert=function(t){return u(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(i)),r):e},r.ticks=function(n){return ru(e,n)},r.tickFormat=function(n,t){return iu(e,n,t)},r.nice=function(n){return r.domain(nu(e,n))},r.exponent=function(a){return arguments.length?(i=ou(t=a),u=ou(1/t),n.domain(e.map(i)),r):t},r.copy=function(){return au(n.copy(),t,e)},Qi(r,n)}function ou(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function cu(n,t){function e(t){return a[((u.get(t)||u.set(t,n.push(t)))-1)%a.length]}function r(t,e){return ya.range(n.length).map(function(n){return t+e*n})}var u,a,o;return e.domain=function(r){if(!arguments.length)return n;n=[],u=new i;for(var a,o=-1,c=r.length;++o<c;)u.has(a=r[o])||u.set(a,n.push(a));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(a=n,o=0,t={t:"range",a:arguments},e):a},e.rangePoints=function(i,u){arguments.length<2&&(u=0);var c=i[0],l=i[1],s=(l-c)/(Math.max(1,n.length-1)+u);return a=r(n.length<2?(c+l)/2:c+s*u/2,s),o=0,t={t:"rangePoints",a:arguments},e},e.rangeBands=function(i,u,c){arguments.length<2&&(u=0),arguments.length<3&&(c=u);var l=i[1]<i[0],s=i[l-0],f=i[1-l],h=(f-s)/(n.length-u+2*c);return a=r(s+h*c,h),l&&a.reverse(),o=h*(1-u),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(i,u,c){arguments.length<2&&(u=0),arguments.length<3&&(c=u);var l=i[1]<i[0],s=i[l-0],f=i[1-l],h=Math.floor((f-s)/(n.length-u+2*c)),g=f-s-(n.length-u)*h;return a=r(s+Math.round(g/2),h),l&&a.reverse(),o=Math.round(h*(1-u)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Zi(t.a[0])},e.copy=function(){return cu(n,t)},e.domain(n)}function lu(n,t){function e(){var e=0,u=t.length;for(i=[];++e<u;)i[e-1]=ya.quantile(n,e/u);return r}function r(n){return isNaN(n=+n)?void 0:t[ya.bisect(i,n)]}var i;return r.domain=function(t){return arguments.length?(n=t.filter(function(n){return!isNaN(n)}).sort(ya.ascending),e()):n},r.range=function(n){return arguments.length?(t=n,e()):t},r.quantiles=function(){return i},r.invertExtent=function(e){return e=t.indexOf(e),0>e?[0/0,0/0]:[e>0?i[e-1]:n[0],e<i.length?i[e]:n[n.length-1]]},r.copy=function(){return lu(n,t)},e()}function su(n,t,e){function r(t){return e[Math.max(0,Math.min(a,Math.floor(u*(t-n))))]}function i(){return u=e.length/(t-n),a=e.length-1,r}var u,a;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],i()):[n,t]},r.range=function(n){return arguments.length?(e=n,i()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?0/0:t/u+n,[t,t+1/u]},r.copy=function(){return su(n,t,e)},i()}function fu(n,t){function e(e){return e>=e?t[ya.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return fu(n,t)},e}function hu(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return ru(n,t)},t.tickFormat=function(t,e){return iu(n,t,e)},t.copy=function(){return hu(n)},t}function gu(n){return n.innerRadius}function pu(n){return n.outerRadius}function mu(n){return n.startAngle}function du(n){return n.endAngle}function vu(n){for(var t,e,r,i=-1,u=n.length;++i<u;)t=n[i],e=t[0],r=t[1]+Dc,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function yu(n){function t(t){function c(){m.push("M",o(n(v),f),s,l(n(d.reverse()),f),"Z")}for(var h,g,p,m=[],d=[],v=[],y=-1,M=t.length,x=pt(e),b=pt(i),_=e===r?function(){return g}:pt(r),w=i===u?function(){return p}:pt(u);++y<M;)a.call(this,h=t[y],y)?(d.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),v.push([+_.call(this,h,y),+w.call(this,h,y)])):d.length&&(c(),d=[],v=[]);return d.length&&c(),m.length?m.join(""):null}var e=Ie,r=Ie,i=0,u=Ve,a=Xt,o=Xe,c=o.key,l=o,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(i=u=n,t):u},t.y0=function(n){return arguments.length?(i=n,t):i},t.y1=function(n){return arguments.length?(u=n,t):u},t.defined=function(n){return arguments.length?(a=n,t):a},t.interpolate=function(n){return arguments.length?(c="function"==typeof n?o=n:(o=sc.get(n)||Xe).key,l=o.reverse||o,s=o.closed?"M":"L",t):c},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Mu(n){return n.radius}function xu(n){return[n.x,n.y]}function bu(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]+Dc;return[e*Math.cos(r),e*Math.sin(r)]}}function _u(){return 64}function wu(){return"circle"}function Su(n){var t=Math.sqrt(n/Ka);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Eu(n,t){return La(n,Yc),n.id=t,n}function ku(n,t,e,r){var i=n.id;return T(n,"function"==typeof e?function(n,u,a){n.__transition__[i].tween.set(t,r(e.call(n,n.__data__,u,a)))}:(e=r(e),function(n){n.__transition__[i].tween.set(t,e)}))}function Au(n){return null==n&&(n=""),function(){this.textContent=n}}function Nu(n,t,e,r){var u=n.__transition__||(n.__transition__={active:0,count:0}),a=u[e];if(!a){var o=r.time;a=u[e]={tween:new i,time:o,ease:r.ease,delay:r.delay,duration:r.duration},++u.count,ya.timer(function(r){function i(r){return u.active>e?l():(u.active=e,a.event&&a.event.start.call(n,s,t),a.tween.forEach(function(e,r){(r=r.call(n,s,t))&&p.push(r)}),c(r)?1:(xt(c,0,o),void 0))}function c(r){if(u.active!==e)return l();for(var i=(r-h)/g,o=f(i),c=p.length;c>0;)p[--c].call(n,o);return i>=1?(l(),a.event&&a.event.end.call(n,s,t),1):void 0}function l(){return--u.count?delete u[e]:delete n.__transition__,1}var s=n.__data__,f=a.ease,h=a.delay,g=a.duration,p=[];return r>=h?i(r):(xt(i,h,o),void 0)},0,o)}}function qu(n,t){n.attr("transform",function(n){return"translate("+t(n)+",0)"})}function Tu(n,t){n.attr("transform",function(n){return"translate(0,"+t(n)+")"})}function Cu(n,t,e){if(r=[],e&&t.length>1){for(var r,i,u,a=Zi(n.domain()),o=-1,c=t.length,l=(t[1]-t[0])/++e;++o<c;)for(i=e;--i>0;)(u=+t[o]-i*l)>=a[0]&&r.push(u);for(--o,i=0;++i<e&&(u=+t[o]+i*l)<a[1];)r.push(u)}return r}function zu(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function Du(n,t,e){function r(t){var e=n(t),r=u(e,1);return r-t>t-e?e:r}function i(e){return t(e=n(new Zc(e-1)),1),e}function u(n,e){return t(n=new Zc(+n),e),n}function a(n,r,u){var a=i(n),o=[];if(u>1)for(;r>a;)e(a)%u||o.push(new Date(+a)),t(a,1);else for(;r>a;)o.push(new Date(+a)),t(a,1);return o}function o(n,t,e){try{Zc=zu;var r=new zu;return r._=n,a(r,t,e)}finally{Zc=Date}}n.floor=n,n.round=r,n.ceil=i,n.offset=u,n.range=a;var c=n.utc=ju(n);return c.floor=c,c.round=ju(r),c.ceil=ju(i),c.offset=ju(u),c.range=o,n}function ju(n){return function(t,e){try{Zc=zu;var r=new zu;return r._=t,n(r,e)._}finally{Zc=Date}}}function Lu(n,t,e,r){for(var i,u,a=0,o=t.length,c=e.length;o>a;){if(r>=c)return-1;if(i=t.charCodeAt(a++),37===i){if(u=gl[t.charAt(a++)],!u||(r=u(n,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function Hu(n){return new RegExp("^(?:"+n.map(ya.requote).join("|")+")","i")}function Fu(n){for(var t=new i,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function Pu(n,t,e){var r=0>n?"-":"",i=(r?-n:n)+"",u=i.length;return r+(e>u?new Array(e-u+1).join(t)+i:i)}function Ou(n,t,e){il.lastIndex=0;var r=il.exec(t.substring(e));return r?(n.w=ul.get(r[0].toLowerCase()),e+r[0].length):-1}function Yu(n,t,e){el.lastIndex=0;var r=el.exec(t.substring(e));return r?(n.w=rl.get(r[0].toLowerCase()),e+r[0].length):-1}function Ru(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Uu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e));return r?(n.U=+r[0],e+r[0].length):-1}function Iu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e));return r?(n.W=+r[0],e+r[0].length):-1}function Vu(n,t,e){cl.lastIndex=0;var r=cl.exec(t.substring(e));return r?(n.m=ll.get(r[0].toLowerCase()),e+r[0].length):-1}function Xu(n,t,e){al.lastIndex=0;var r=al.exec(t.substring(e));return r?(n.m=ol.get(r[0].toLowerCase()),e+r[0].length):-1}function Zu(n,t,e){return Lu(n,hl.c.toString(),t,e)}function Bu(n,t,e){return Lu(n,hl.x.toString(),t,e)}function $u(n,t,e){return Lu(n,hl.X.toString(),t,e)}function Wu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Ju(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.y=Gu(+r[0]),e+r[0].length):-1}function Gu(n){return n+(n>68?1900:2e3)}function Ku(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function Qu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function na(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function ta(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ea(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function ra(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ia(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ua(n,t,e){var r=ml.get(t.substring(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}function aa(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=~~(Math.abs(t)/60),i=Math.abs(t)%60;return e+Pu(r,"0",2)+Pu(i,"0",2)}function oa(n,t,e){sl.lastIndex=0;var r=sl.exec(t.substring(e,e+1));return r?e+r[0].length:-1}function ca(n){return n.toISOString()}function la(n,t,e){function r(t){return n(t)}return r.invert=function(t){return sa(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(sa)},r.nice=function(n){return r.domain(Wi(r.domain(),n))},r.ticks=function(e,i){var u=Zi(r.domain());if("function"!=typeof e){var a=u[1]-u[0],o=a/e,c=ya.bisect(vl,o);if(c==vl.length)return t.year(u,e);if(!c)return n.ticks(e).map(sa);o/vl[c-1]<vl[c]/o&&--c,e=t[c],i=e[1],e=e[0].range}return e(u[0],new Date(+u[1]+1),i)},r.tickFormat=function(){return e},r.copy=function(){return la(n.copy(),t,e)},Qi(r,n)}function sa(n){return new Date(n)}function fa(n){return function(t){for(var e=n.length-1,r=n[e];!r[1](t);)r=n[--e];return r[0](t)}}function ha(n){var t=new Date(n,0,1);return t.setFullYear(n),t}function ga(n){var t=n.getFullYear(),e=ha(t),r=ha(t+1);return t+(n-e)/(r-e)}function pa(n){var t=new Date(Date.UTC(n,0,1));return t.setUTCFullYear(n),t}function ma(n){var t=n.getUTCFullYear(),e=pa(t),r=pa(t+1);return t+(n-e)/(r-e)}function da(n){return JSON.parse(n.responseText)}function va(n){var t=Ma.createRange();return t.selectNode(Ma.body),t.createContextualFragment(n.responseText)}var ya={version:"3.2.8"};Date.now||(Date.now=function(){return+new Date});var Ma=document,xa=Ma.documentElement,ba=window;try{Ma.createElement("div").style.setProperty("opacity",0,"")}catch(_a){var wa=ba.Element.prototype,Sa=wa.setAttribute,Ea=wa.setAttributeNS,ka=ba.CSSStyleDeclaration.prototype,Aa=ka.setProperty;wa.setAttribute=function(n,t){Sa.call(this,n,t+"")},wa.setAttributeNS=function(n,t,e){Ea.call(this,n,t,e+"")},ka.setProperty=function(n,t,e){Aa.call(this,n,t+"",e)}}ya.ascending=function(n,t){return t>n?-1:n>t?1:n>=t?0:0/0},ya.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:0/0},ya.min=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u&&!(null!=(e=n[i])&&e>=e);)e=void 0;for(;++i<u;)null!=(r=n[i])&&e>r&&(e=r)}else{for(;++i<u&&!(null!=(e=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<u;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e},ya.max=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u&&!(null!=(e=n[i])&&e>=e);)e=void 0;for(;++i<u;)null!=(r=n[i])&&r>e&&(e=r)}else{for(;++i<u&&!(null!=(e=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<u;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e},ya.extent=function(n,t){var e,r,i,u=-1,a=n.length;if(1===arguments.length){for(;++u<a&&!(null!=(e=i=n[u])&&e>=e);)e=i=void 0;for(;++u<a;)null!=(r=n[u])&&(e>r&&(e=r),r>i&&(i=r))}else{for(;++u<a&&!(null!=(e=i=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<a;)null!=(r=t.call(n,n[u],u))&&(e>r&&(e=r),r>i&&(i=r))}return[e,i]},ya.sum=function(n,t){var e,r=0,i=n.length,u=-1;if(1===arguments.length)for(;++u<i;)isNaN(e=+n[u])||(r+=e);else for(;++u<i;)isNaN(e=+t.call(n,n[u],u))||(r+=e);return r},ya.mean=function(t,e){var r,i=t.length,u=0,a=-1,o=0;if(1===arguments.length)for(;++a<i;)n(r=t[a])&&(u+=(r-u)/++o);else for(;++a<i;)n(r=e.call(t,t[a],a))&&(u+=(r-u)/++o);return o?u:void 0},ya.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],u=e-r;return u?i+u*(n[r]-i):i},ya.median=function(t,e){return arguments.length>1&&(t=t.map(e)),t=t.filter(n),t.length?ya.quantile(t.sort(ya.ascending),.5):void 0},ya.bisector=function(n){return{left:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;n.call(t,t[u],u)<e?r=u+1:i=u}return r},right:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;e<n.call(t,t[u],u)?i=u:r=u+1}return r}}};var Na=ya.bisector(function(n){return n});ya.bisectLeft=Na.left,ya.bisect=ya.bisectRight=Na.right,ya.shuffle=function(n){for(var t,e,r=n.length;r;)e=0|Math.random()*r--,t=n[r],n[r]=n[e],n[e]=t;return n},ya.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},ya.zip=function(){if(!(i=arguments.length))return[];for(var n=-1,e=ya.min(arguments,t),r=new Array(e);++n<e;)for(var i,u=-1,a=r[n]=new Array(i);++u<i;)a[u]=arguments[u][n];return r},ya.transpose=function(n){return ya.zip.apply(ya,n)},ya.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ya.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ya.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ya.merge=function(n){return Array.prototype.concat.apply([],n)},ya.range=function(n,t,r){if(arguments.length<3&&(r=1,arguments.length<2&&(t=n,n=0)),1/0===(t-n)/r)throw new Error("infinite range");var i,u=[],a=e(Math.abs(r)),o=-1;if(n*=a,t*=a,r*=a,0>r)for(;(i=n+r*++o)>t;)u.push(i/a);else for(;(i=n+r*++o)<t;)u.push(i/a);return u},ya.map=function(n){var t=new i;if(n instanceof i)n.forEach(function(n,e){t.set(n,e)});else for(var e in n)t.set(e,n[e]);return t},r(i,{has:function(n){return qa+n in this},get:function(n){return this[qa+n]},set:function(n,t){return this[qa+n]=t},remove:function(n){return n=qa+n,n in this&&delete this[n]},keys:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},values:function(){var n=[];return this.forEach(function(t,e){n.push(e)}),n},entries:function(){var n=[];
return this.forEach(function(t,e){n.push({key:t,value:e})}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Ta&&n.call(this,t.substring(1),this[t])}});var qa="\0",Ta=qa.charCodeAt(0);ya.nest=function(){function n(t,o,c){if(c>=a.length)return r?r.call(u,o):e?o.sort(e):o;for(var l,s,f,h,g=-1,p=o.length,m=a[c++],d=new i;++g<p;)(h=d.get(l=m(s=o[g])))?h.push(s):d.set(l,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,c))}):(s={},f=function(e,r){s[e]=n(t,r,c)}),d.forEach(f),s}function t(n,e){if(e>=a.length)return n;var r=[],i=o[e++];return n.forEach(function(n,i){r.push({key:n,values:t(i,e)})}),i?r.sort(function(n,t){return i(n.key,t.key)}):r}var e,r,u={},a=[],o=[];return u.map=function(t,e){return n(e,t,0)},u.entries=function(e){return t(n(ya.map,e,0),0)},u.key=function(n){return a.push(n),u},u.sortKeys=function(n){return o[a.length-1]=n,u},u.sortValues=function(n){return e=n,u},u.rollup=function(n){return r=n,u},u},ya.set=function(n){var t=new u;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},r(u,{has:function(n){return qa+n in this},add:function(n){return this[qa+n]=!0,n},remove:function(n){return n=qa+n,n in this&&delete this[n]},values:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Ta&&n.call(this,t.substring(1))}}),ya.behavior={},ya.rebind=function(n,t){for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=a(n,t,t[e]);return n};var Ca=["webkit","ms","moz","Moz","o","O"],za=l;try{za(xa.childNodes)[0].nodeType}catch(Da){za=c}ya.dispatch=function(){for(var n=new f,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=h(n);return n},f.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.substring(e+1),n=n.substring(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ya.event=null,ya.requote=function(n){return n.replace(ja,"\\$&")};var ja=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,La={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},Ha=function(n,t){return t.querySelector(n)},Fa=function(n,t){return t.querySelectorAll(n)},Pa=xa[o(xa,"matchesSelector")],Oa=function(n,t){return Pa.call(n,t)};"function"==typeof Sizzle&&(Ha=function(n,t){return Sizzle(n,t)[0]||null},Fa=function(n,t){return Sizzle.uniqueSort(Sizzle(n,t))},Oa=Sizzle.matchesSelector),ya.selection=function(){return Ia};var Ya=ya.selection.prototype=[];Ya.select=function(n){var t,e,r,i,u=[];n=v(n);for(var a=-1,o=this.length;++a<o;){u.push(t=[]),t.parentNode=(r=this[a]).parentNode;for(var c=-1,l=r.length;++c<l;)(i=r[c])?(t.push(e=n.call(i,i.__data__,c,a)),e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return d(u)},Ya.selectAll=function(n){var t,e,r=[];n=y(n);for(var i=-1,u=this.length;++i<u;)for(var a=this[i],o=-1,c=a.length;++o<c;)(e=a[o])&&(r.push(t=za(n.call(e,e.__data__,o,i))),t.parentNode=e);return d(r)};var Ra={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ya.ns={prefix:Ra,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&(e=n.substring(0,t),n=n.substring(t+1)),Ra.hasOwnProperty(e)?{space:Ra[e],local:n}:n}},Ya.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ya.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(M(t,n[t]));return this}return this.each(M(n,t))},Ya.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=n.trim().split(/^|\s+/g)).length,i=-1;if(t=e.classList){for(;++i<r;)if(!t.contains(n[i]))return!1}else for(t=e.getAttribute("class");++i<r;)if(!b(n[i]).test(t))return!1;return!0}for(t in n)this.each(_(t,n[t]));return this}return this.each(_(n,t))},Ya.style=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t="");for(e in n)this.each(S(e,n[e],t));return this}if(2>r)return ba.getComputedStyle(this.node(),null).getPropertyValue(n);e=""}return this.each(S(n,t,e))},Ya.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(E(t,n[t]));return this}return this.each(E(n,t))},Ya.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Ya.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Ya.append=function(n){return n=k(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Ya.insert=function(n,t){return n=k(n),t=v(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments))})},Ya.remove=function(){return this.each(function(){var n=this.parentNode;n&&n.removeChild(this)})},Ya.data=function(n,t){function e(n,e){var r,u,a,o=n.length,f=e.length,h=Math.min(o,f),g=new Array(f),p=new Array(f),m=new Array(o);if(t){var d,v=new i,y=new i,M=[];for(r=-1;++r<o;)d=t.call(u=n[r],u.__data__,r),v.has(d)?m[r]=u:v.set(d,u),M.push(d);for(r=-1;++r<f;)d=t.call(e,a=e[r],r),(u=v.get(d))?(g[r]=u,u.__data__=a):y.has(d)||(p[r]=A(a)),y.set(d,a),v.remove(d);for(r=-1;++r<o;)v.has(M[r])&&(m[r]=n[r])}else{for(r=-1;++r<h;)u=n[r],a=e[r],u?(u.__data__=a,g[r]=u):p[r]=A(a);for(;f>r;++r)p[r]=A(e[r]);for(;o>r;++r)m[r]=n[r]}p.update=g,p.parentNode=g.parentNode=m.parentNode=n.parentNode,c.push(p),l.push(g),s.push(m)}var r,u,a=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++a<o;)(u=r[a])&&(n[a]=u.__data__);return n}var c=C([]),l=d([]),s=d([]);if("function"==typeof n)for(;++a<o;)e(r=this[a],n.call(r,r.parentNode.__data__,a));else for(;++a<o;)e(r=this[a],n);return l.enter=function(){return c},l.exit=function(){return s},l},Ya.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Ya.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=N(n));for(var u=0,a=this.length;a>u;u++){i.push(t=[]),t.parentNode=(e=this[u]).parentNode;for(var o=0,c=e.length;c>o;o++)(r=e[o])&&n.call(r,r.__data__,o)&&t.push(r)}return d(i)},Ya.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,u=r[i];--i>=0;)(e=r[i])&&(u&&u!==e.nextSibling&&u.parentNode.insertBefore(e,u),u=e);return this},Ya.sort=function(n){n=q.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Ya.each=function(n){return T(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Ya.call=function(n){var t=za(arguments);return n.apply(t[0]=this,t),this},Ya.empty=function(){return!this.node()},Ya.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,i=e.length;i>r;r++){var u=e[r];if(u)return u}return null},Ya.size=function(){var n=0;return this.each(function(){++n}),n};var Ua=[];ya.selection.enter=C,ya.selection.enter.prototype=Ua,Ua.append=Ya.append,Ua.empty=Ya.empty,Ua.node=Ya.node,Ua.call=Ya.call,Ua.size=Ya.size,Ua.select=function(n){for(var t,e,r,i,u,a=[],o=-1,c=this.length;++o<c;){r=(i=this[o]).update,a.push(t=[]),t.parentNode=i.parentNode;for(var l=-1,s=i.length;++l<s;)(u=i[l])?(t.push(r[l]=e=n.call(i.parentNode,u.__data__,l,o)),e.__data__=u.__data__):t.push(null)}return d(a)},Ua.insert=function(n,t){return arguments.length<2&&(t=z(this)),Ya.insert.call(this,n,t)},Ya.transition=function(){for(var n,t,e=Hc||++Rc,r=[],i=Fc||{time:Date.now(),ease:Cr,delay:0,duration:250},u=-1,a=this.length;++u<a;){r.push(n=[]);for(var o=this[u],c=-1,l=o.length;++c<l;)(t=o[c])&&Nu(t,c,e,i),n.push(t)}return Eu(r,e)},ya.select=function(n){var t=["string"==typeof n?Ha(n,Ma):n];return t.parentNode=xa,d([t])},ya.selectAll=function(n){var t=za("string"==typeof n?Fa(n,Ma):n);return t.parentNode=xa,d([t])};var Ia=ya.select(xa);Ya.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(D(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(D(n,t,e))};var Va=ya.map({mouseenter:"mouseover",mouseleave:"mouseout"});Va.forEach(function(n){"on"+n in Ma&&Va.remove(n)});var Xa=o(xa.style,"userSelect"),Za=0;ya.mouse=function(n){return F(n,p())};var Ba=/WebKit/.test(ba.navigator.userAgent)?-1:0;ya.touches=function(n,t){return arguments.length<2&&(t=p().touches),t?za(t).map(function(t){var e=F(n,t);return e.identifier=t.identifier,e}):[]},ya.behavior.drag=function(){function n(){this.on("mousedown.drag",a).on("touchstart.drag",o)}function t(){return ya.event.changedTouches[0].identifier}function e(n,t){return ya.touches(n).filter(function(n){return n.identifier===t})[0]}function r(n,t,e,r){return function(){function a(){if(!s)return o();var n=t(s,g),e=n[0]-m[0],r=n[1]-m[1];d|=e|r,m=n,f({type:"drag",x:n[0]+c[0],y:n[1]+c[1],dx:e,dy:r})}function o(){v.on(e+"."+p,null).on(r+"."+p,null),y(d&&ya.event.target===h),f({type:"dragend"})}var c,l=this,s=l.parentNode,f=i.of(l,arguments),h=ya.event.target,g=n(),p=null==g?"drag":"drag-"+g,m=t(s,g),d=0,v=ya.select(ba).on(e+"."+p,a).on(r+"."+p,o),y=H();u?(c=u.apply(l,arguments),c=[c.x-m[0],c.y-m[1]]):c=[0,0],f({type:"dragstart"})}}var i=m(n,"drag","dragstart","dragend"),u=null,a=r(s,ya.mouse,"mousemove","mouseup"),o=r(t,e,"touchmove","touchend");return n.origin=function(t){return arguments.length?(u=t,n):u},ya.rebind(n,i,"on")},ya.behavior.zoom=function(){function n(){this.on(w,o).on(Ja+".zoom",l).on(S,s).on("dblclick.zoom",f).on(k,c)}function t(n){return[(n[0]-x[0])/b,(n[1]-x[1])/b]}function e(n){return[n[0]*b+x[0],n[1]*b+x[1]]}function r(n){b=Math.max(_[0],Math.min(_[1],n))}function i(n,t){t=e(t),x[0]+=n[0]-t[0],x[1]+=n[1]-t[1]}function u(){v&&v.domain(d.range().map(function(n){return(n-x[0])/b}).map(d.invert)),M&&M.domain(y.range().map(function(n){return(n-x[1])/b}).map(y.invert))}function a(n){u(),n({type:"zoom",scale:b,translate:x})}function o(){function n(){c=1,i(ya.mouse(r),f),a(u)}function e(){l.on(S,ba===r?s:null).on(E,null),h(c&&ya.event.target===o)}var r=this,u=q.of(r,arguments),o=ya.event.target,c=0,l=ya.select(ba).on(S,n).on(E,e),f=t(ya.mouse(r)),h=H()}function c(){function n(){var n=ya.touches(h);return f=b,s={},n.forEach(function(n){s[n.identifier]=t(n)}),n}function e(){var t=Date.now(),e=n();if(1===e.length){if(500>t-p){var u=e[0],o=s[u.identifier];r(2*b),i(u,o),g(),a(m)}p=t}else if(e.length>1){var u=e[0],c=e[1],l=u[0]-c[0],f=u[1]-c[1];d=l*l+f*f}}function u(){var n=ya.touches(h),t=n[0],e=s[t.identifier];if(u=n[1]){var u,o=s[u.identifier],c=ya.event.scale;if(null==c){var l=(l=u[0]-t[0])*l+(l=u[1]-t[1])*l;c=d&&Math.sqrt(l/d)}t=[(t[0]+u[0])/2,(t[1]+u[1])/2],e=[(e[0]+o[0])/2,(e[1]+o[1])/2],r(c*f)}p=null,i(t,e),a(m)}function l(){ya.event.touches.length?n():(v.on(A,null).on(N,null),y.on(w,o).on(k,c),M())}var s,f,h=this,m=q.of(h,arguments),d=0,v=ya.select(ba).on(A,u).on(N,l),y=ya.select(h).on(w,null).on(k,e),M=H();e()}function l(){g(),h||(h=t(ya.mouse(this))),r(Math.pow(2,.002*$a())*b),i(ya.mouse(this),h),a(q.of(this,arguments))}function s(){h=null}function f(){var n=ya.mouse(this),e=t(n),u=Math.log(b)/Math.LN2;r(Math.pow(2,ya.event.shiftKey?Math.ceil(u)-1:Math.floor(u)+1)),i(n,e),a(q.of(this,arguments))}var h,p,d,v,y,M,x=[0,0],b=1,_=Wa,w="mousedown.zoom",S="mousemove.zoom",E="mouseup.zoom",k="touchstart.zoom",A="touchmove.zoom",N="touchend.zoom",q=m(n,"zoom");return n.translate=function(t){return arguments.length?(x=t.map(Number),u(),n):x},n.scale=function(t){return arguments.length?(b=+t,u(),n):b},n.scaleExtent=function(t){return arguments.length?(_=null==t?Wa:t.map(Number),n):_},n.x=function(t){return arguments.length?(v=t,d=t.copy(),x=[0,0],b=1,n):v},n.y=function(t){return arguments.length?(M=t,y=t.copy(),x=[0,0],b=1,n):M},ya.rebind(n,q,"on")};var $a,Wa=[0,1/0],Ja="onwheel"in Ma?($a=function(){return-ya.event.deltaY*(ya.event.deltaMode?120:1)},"wheel"):"onmousewheel"in Ma?($a=function(){return ya.event.wheelDelta},"mousewheel"):($a=function(){return-ya.event.detail},"MozMousePixelScroll");P.prototype.toString=function(){return this.rgb()+""},ya.hsl=function(n,t,e){return 1===arguments.length?n instanceof Y?O(n.h,n.s,n.l):lt(""+n,st,O):O(+n,+t,+e)};var Ga=Y.prototype=new P;Ga.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),O(this.h,this.s,this.l/n)},Ga.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),O(this.h,this.s,n*this.l)},Ga.rgb=function(){return R(this.h,this.s,this.l)};var Ka=Math.PI,Qa=1e-6,no=Qa*Qa,to=Ka/180,eo=180/Ka;ya.hcl=function(n,t,e){return 1===arguments.length?n instanceof W?$(n.h,n.c,n.l):n instanceof K?nt(n.l,n.a,n.b):nt((n=ft((n=ya.rgb(n)).r,n.g,n.b)).l,n.a,n.b):$(+n,+t,+e)};var ro=W.prototype=new P;ro.brighter=function(n){return $(this.h,this.c,Math.min(100,this.l+io*(arguments.length?n:1)))},ro.darker=function(n){return $(this.h,this.c,Math.max(0,this.l-io*(arguments.length?n:1)))},ro.rgb=function(){return J(this.h,this.c,this.l).rgb()},ya.lab=function(n,t,e){return 1===arguments.length?n instanceof K?G(n.l,n.a,n.b):n instanceof W?J(n.l,n.c,n.h):ft((n=ya.rgb(n)).r,n.g,n.b):G(+n,+t,+e)};var io=18,uo=.95047,ao=1,oo=1.08883,co=K.prototype=new P;co.brighter=function(n){return G(Math.min(100,this.l+io*(arguments.length?n:1)),this.a,this.b)},co.darker=function(n){return G(Math.max(0,this.l-io*(arguments.length?n:1)),this.a,this.b)},co.rgb=function(){return Q(this.l,this.a,this.b)},ya.rgb=function(n,t,e){return 1===arguments.length?n instanceof ot?at(n.r,n.g,n.b):lt(""+n,at,R):at(~~n,~~t,~~e)};var lo=ot.prototype=new P;lo.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30;return t||e||r?(t&&i>t&&(t=i),e&&i>e&&(e=i),r&&i>r&&(r=i),at(Math.min(255,~~(t/n)),Math.min(255,~~(e/n)),Math.min(255,~~(r/n)))):at(i,i,i)},lo.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),at(~~(n*this.r),~~(n*this.g),~~(n*this.b))},lo.hsl=function(){return st(this.r,this.g,this.b)},lo.toString=function(){return"#"+ct(this.r)+ct(this.g)+ct(this.b)};var so=ya.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});so.forEach(function(n,t){so.set(n,it(t))}),ya.functor=pt,ya.xhr=dt(mt),ya.dsv=function(n,t){function e(n,e,u){arguments.length<3&&(u=e,e=null);var a=ya.xhr(n,t,u);return a.row=function(n){return arguments.length?a.response(null==(e=n)?r:i(n)):e},a.row(e)}function r(n){return e.parse(n.responseText)}function i(n){return function(t){return e.parse(t.responseText,n)}}function a(t){return t.map(o).join(n)}function o(n){return c.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var c=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var i=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(i(n),e)}:i})},e.parseRows=function(n,t){function e(){if(s>=c)return a;if(i)return i=!1,u;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(i=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(i=!0),n.substring(t+1,e).replace(/""/g,'"')}for(;c>s;){var r=n.charCodeAt(s++),o=1;if(10===r)i=!0;else if(13===r)i=!0,10===n.charCodeAt(s)&&(++s,++o);else if(r!==l)continue;return n.substring(t,s-o)}return n.substring(t)}for(var r,i,u={},a={},o=[],c=n.length,s=0,f=0;(r=e())!==a;){for(var h=[];r!==u&&r!==a;)h.push(r),r=e();(!t||(h=t(h,f++)))&&o.push(h)}return o},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new u,i=[];return t.forEach(function(n){for(var t in n)r.has(t)||i.push(r.add(t))}),[i.map(o).join(n)].concat(t.map(function(t){return i.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(a).join("\n")},e},ya.csv=ya.dsv(",","text/csv"),ya.tsv=ya.dsv("	","text/tab-separated-values");var fo,ho,go,po,mo,vo=ba[o(ba,"requestAnimationFrame")]||function(n){setTimeout(n,17)};ya.timer=function(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var i=e+t,u={callback:n,time:i,next:null};ho?ho.next=u:fo=u,ho=u,go||(po=clearTimeout(po),go=1,vo(Mt))},ya.timer.flush=function(){bt(),_t()};var yo=".",Mo=",",xo=[3,3],bo="$",_o=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(wt);ya.formatPrefix=function(n,t){var e=0;return n&&(0>n&&(n*=-1),t&&(n=ya.round(n,St(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((0>=e?e+1:e-1)/3)))),_o[8+e/3]},ya.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)},ya.format=function(n){var t=wo.exec(n),e=t[1]||" ",r=t[2]||">",i=t[3]||"",u=t[4]||"",a=t[5],o=+t[6],c=t[7],l=t[8],s=t[9],f=1,h="",g=!1;switch(l&&(l=+l.substring(1)),(a||"0"===e&&"="===r)&&(a=e="0",r="=",c&&(o-=Math.floor((o-1)/4))),s){case"n":c=!0,s="g";break;case"%":f=100,h="%",s="f";break;case"p":f=100,h="%",s="r";break;case"b":case"o":case"x":case"X":"#"===u&&(u="0"+s.toLowerCase());case"c":case"d":g=!0,l=0;break;case"s":f=-1,s="r"}"#"===u?u="":"$"===u&&(u=bo),"r"!=s||l||(s="g"),null!=l&&("g"==s?l=Math.max(1,Math.min(21,l)):("e"==s||"f"==s)&&(l=Math.max(0,Math.min(20,l)))),s=So.get(s)||Et;var p=a&&c;return function(n){if(g&&n%1)return"";var t=0>n||0===n&&0>1/n?(n=-n,"-"):i;if(0>f){var m=ya.formatPrefix(n,l);n=m.scale(n),h=m.symbol}else n*=f;n=s(n,l);var d=n.lastIndexOf("."),v=0>d?n:n.substring(0,d),y=0>d?"":yo+n.substring(d+1);!a&&c&&(v=Eo(v));var M=u.length+v.length+y.length+(p?0:t.length),x=o>M?new Array(M=o-M+1).join(e):"";return p&&(v=Eo(x+v)),t+=u,n=v+y,("<"===r?t+n+x:">"===r?x+t+n:"^"===r?x.substring(0,M>>=1)+t+n+x.substring(M):t+(p?n:x+n))+h}};var wo=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,So=ya.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ya.round(n,St(n,t))).toFixed(Math.max(0,Math.min(20,St(n*(1+1e-15),t))))}}),Eo=mt;if(xo){var ko=xo.length;Eo=function(n){for(var t=n.length,e=[],r=0,i=xo[0];t>0&&i>0;)e.push(n.substring(t-=i,t+i)),i=xo[r=(r+1)%ko];return e.reverse().join(Mo)}}ya.geo={},kt.prototype={s:0,t:0,add:function(n){At(n,this.t,Ao),At(Ao.s,this.s,this),this.s?this.t+=Ao.t:this.s=Ao.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var Ao=new kt;ya.geo.stream=function(n,t){n&&No.hasOwnProperty(n.type)?No[n.type](n,t):Nt(n,t)};var No={Feature:function(n,t){Nt(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,i=e.length;++r<i;)Nt(e[r].geometry,t)}},qo={Sphere:function(n,t){t.sphere()},Point:function(n,t){var e=n.coordinates;t.point(e[0],e[1])},MultiPoint:function(n,t){for(var e,r=n.coordinates,i=-1,u=r.length;++i<u;)e=r[i],t.point(e[0],e[1])},LineString:function(n,t){qt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)qt(e[r],t,0)},Polygon:function(n,t){Tt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)Tt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,i=e.length;++r<i;)Nt(e[r],t)}};ya.geo.area=function(n){return To=0,ya.geo.stream(n,zo),To};var To,Co=new kt,zo={sphere:function(){To+=4*Ka},point:s,lineStart:s,lineEnd:s,polygonStart:function(){Co.reset(),zo.lineStart=Ct},polygonEnd:function(){var n=2*Co;To+=0>n?4*Ka+n:n,zo.lineStart=zo.lineEnd=zo.point=s}};ya.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=zt([t*to,e*to]);if(v){var i=jt(v,r),u=[i[1],-i[0],0],a=jt(u,i);Ft(a),a=Pt(a);var c=t-p,l=c>0?1:-1,m=a[0]*eo*l,d=Math.abs(c)>180;if(d^(m>l*p&&l*t>m)){var y=a[1]*eo;y>g&&(g=y)}else if(m=(m+360)%360-180,d^(m>l*p&&l*t>m)){var y=-a[1]*eo;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);d?p>t?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t)}else n(t,e);v=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,v=null}function i(n,e){if(v){var r=n-p;y+=Math.abs(r)>180?r+(r>0?360:-360):r}else m=n,d=e;zo.point(n,e),t(n,e)}function u(){zo.lineStart()}function a(){i(m,d),zo.lineEnd(),Math.abs(y)>Qa&&(s=-(h=180)),x[0]=s,x[1]=h,v=null}function o(n,t){return(t-=n)<0?t+360:t}function c(n,t){return n[0]-t[0]}function l(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,m,d,v,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=i,b.lineStart=u,b.lineEnd=a,y=0,zo.polygonStart()},polygonEnd:function(){zo.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>Co?(s=-(h=180),f=-(g=90)):y>Qa?g=90:-Qa>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],ya.geo.stream(n,b);var t=M.length;if(t){M.sort(c);for(var e,r=1,i=M[0],u=[i];t>r;++r)e=M[r],l(e[0],i)||l(e[1],i)?(o(i[0],e[1])>o(i[0],i[1])&&(i[1]=e[1]),o(e[0],i[1])>o(i[0],i[1])&&(i[0]=e[0])):u.push(i=e);for(var a,e,p=-1/0,t=u.length-1,r=0,i=u[t];t>=r;i=e,++r)e=u[r],(a=o(i[1],e[0]))>p&&(p=a,s=e[0],h=i[1])}return M=x=null,1/0===s||1/0===f?[[0/0,0/0],[0/0,0/0]]:[[s,f],[h,g]]}}(),ya.geo.centroid=function(n){Do=jo=Lo=Ho=Fo=Po=Oo=Yo=Ro=Uo=Io=0,ya.geo.stream(n,Vo);var t=Ro,e=Uo,r=Io,i=t*t+e*e+r*r;return no>i&&(t=Po,e=Oo,r=Yo,Qa>jo&&(t=Lo,e=Ho,r=Fo),i=t*t+e*e+r*r,no>i)?[0/0,0/0]:[Math.atan2(e,t)*eo,V(r/Math.sqrt(i))*eo]};var Do,jo,Lo,Ho,Fo,Po,Oo,Yo,Ro,Uo,Io,Vo={sphere:s,point:Yt,lineStart:Ut,lineEnd:It,polygonStart:function(){Vo.lineStart=Vt},polygonEnd:function(){Vo.lineStart=Ut}},Xo=$t(Xt,Qt,te,ee),Zo=[-Ka,0],Bo=1e9;(ya.geo.conicEqualArea=function(){return oe(ce)}).raw=ce,ya.geo.albers=function(){return ya.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ya.geo.albersUsa=function(){function n(n){var u=n[0],a=n[1];return t=null,e(u,a),t||(r(u,a),t)||i(u,a),t}var t,e,r,i,u=ya.geo.albers(),a=ya.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),o=ya.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),c={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=u.scale(),e=u.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t;return(i>=.12&&.234>i&&r>=-.425&&-.214>r?a:i>=.166&&.234>i&&r>=-.214&&-.115>r?o:u).invert(n)},n.stream=function(n){var t=u.stream(n),e=a.stream(n),r=o.stream(n);return{point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(u.precision(t),a.precision(t),o.precision(t),n):u.precision()},n.scale=function(t){return arguments.length?(u.scale(t),a.scale(.35*t),o.scale(t),n.translate(u.translate())):u.scale()},n.translate=function(t){if(!arguments.length)return u.translate();var l=u.scale(),s=+t[0],f=+t[1];return e=u.translate(t).clipExtent([[s-.455*l,f-.238*l],[s+.455*l,f+.238*l]]).stream(c).point,r=a.translate([s-.307*l,f+.201*l]).clipExtent([[s-.425*l+Qa,f+.12*l+Qa],[s-.214*l-Qa,f+.234*l-Qa]]).stream(c).point,i=o.translate([s-.205*l,f+.212*l]).clipExtent([[s-.214*l+Qa,f+.166*l+Qa],[s-.115*l-Qa,f+.234*l-Qa]]).stream(c).point,n},n.scale(1070)};var $o,Wo,Jo,Go,Ko,Qo,nc={point:s,lineStart:s,lineEnd:s,polygonStart:function(){Wo=0,nc.lineStart=le},polygonEnd:function(){nc.lineStart=nc.lineEnd=nc.point=s,$o+=Math.abs(Wo/2)}},tc={point:se,lineStart:s,lineEnd:s,polygonStart:s,polygonEnd:s},ec={point:ge,lineStart:pe,lineEnd:me,polygonStart:function(){ec.lineStart=de},polygonEnd:function(){ec.point=ge,ec.lineStart=pe,ec.lineEnd=me}};ya.geo.path=function(){function n(n){return n&&("function"==typeof o&&u.pointRadius(+o.apply(this,arguments)),a&&a.valid||(a=i(u)),ya.geo.stream(n,a)),u.result()}function t(){return a=null,n}var e,r,i,u,a,o=4.5;return n.area=function(n){return $o=0,ya.geo.stream(n,i(nc)),$o},n.centroid=function(n){return Lo=Ho=Fo=Po=Oo=Yo=Ro=Uo=Io=0,ya.geo.stream(n,i(ec)),Io?[Ro/Io,Uo/Io]:Yo?[Po/Yo,Oo/Yo]:Fo?[Lo/Fo,Ho/Fo]:[0/0,0/0]},n.bounds=function(n){return Ko=Qo=-(Jo=Go=1/0),ya.geo.stream(n,i(tc)),[[Jo,Go],[Ko,Qo]]},n.projection=function(n){return arguments.length?(i=(e=n)?n.stream||Me(n):mt,t()):e},n.context=function(n){return arguments.length?(u=null==(r=n)?new fe:new ve(n),"function"!=typeof o&&u.pointRadius(o),t()):r},n.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(u.pointRadius(+t),+t),n):o},n.projection(ya.geo.albersUsa()).context(null)},ya.geo.projection=xe,ya.geo.projectionMutator=be,(ya.geo.equirectangular=function(){return xe(we)}).raw=we.invert=we,ya.geo.rotation=function(n){function t(t){return t=n(t[0]*to,t[1]*to),t[0]*=eo,t[1]*=eo,t}return n=Se(n[0]%360*to,n[1]*to,n.length>2?n[2]*to:0),t.invert=function(t){return t=n.invert(t[0]*to,t[1]*to),t[0]*=eo,t[1]*=eo,t},t},ya.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=Se(-n[0]*to,-n[1]*to,0).invert,i=[];return e(null,null,1,{point:function(n,e){i.push(n=t(n,e)),n[0]*=eo,n[1]*=eo}}),{type:"Polygon",coordinates:[i]}}var t,e,r=[0,0],i=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=Ne((t=+r)*to,i*to),n):t},n.precision=function(r){return arguments.length?(e=Ne(t*to,(i=+r)*to),n):i},n.angle(90)},ya.geo.distance=function(n,t){var e,r=(t[0]-n[0])*to,i=n[1]*to,u=t[1]*to,a=Math.sin(r),o=Math.cos(r),c=Math.sin(i),l=Math.cos(i),s=Math.sin(u),f=Math.cos(u);return Math.atan2(Math.sqrt((e=f*a)*e+(e=l*s-c*f*o)*e),c*s+l*f*o)},ya.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ya.range(Math.ceil(u/d)*d,i,d).map(h).concat(ya.range(Math.ceil(l/v)*v,c,v).map(g)).concat(ya.range(Math.ceil(r/p)*p,e,p).filter(function(n){return Math.abs(n%d)>Qa}).map(s)).concat(ya.range(Math.ceil(o/m)*m,a,m).filter(function(n){return Math.abs(n%v)>Qa}).map(f))}var e,r,i,u,a,o,c,l,s,f,h,g,p=10,m=p,d=90,v=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(u).concat(g(c).slice(1),h(i).reverse().slice(1),g(l).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(u=+t[0][0],i=+t[1][0],l=+t[0][1],c=+t[1][1],u>i&&(t=u,u=i,i=t),l>c&&(t=l,l=c,c=t),n.precision(y)):[[u,l],[i,c]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],o=+t[0][1],a=+t[1][1],r>e&&(t=r,r=e,e=t),o>a&&(t=o,o=a,a=t),n.precision(y)):[[r,o],[e,a]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],v=+t[1],n):[d,v]},n.minorStep=function(t){return arguments.length?(p=+t[0],m=+t[1],n):[p,m]},n.precision=function(t){return arguments.length?(y=+t,s=Te(o,a,90),f=Ce(r,e,y),h=Te(l,c,90),g=Ce(u,i,y),n):y},n.majorExtent([[-180,-90+Qa],[180,90-Qa]]).minorExtent([[-180,-80-Qa],[180,80+Qa]])},ya.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}var t,e,r=ze,i=De;return n.distance=function(){return ya.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(i=t,e="function"==typeof t?null:t,n):i},n.precision=function(){return arguments.length?n:0},n},ya.geo.interpolate=function(n,t){return je(n[0]*to,n[1]*to,t[0]*to,t[1]*to)},ya.geo.length=function(n){return rc=0,ya.geo.stream(n,ic),rc};var rc,ic={sphere:s,point:s,lineStart:Le,lineEnd:s,polygonStart:s,polygonEnd:s},uc=He(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ya.geo.azimuthalEqualArea=function(){return xe(uc)}).raw=uc;var ac=He(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},mt);(ya.geo.azimuthalEquidistant=function(){return xe(ac)}).raw=ac,(ya.geo.conicConformal=function(){return oe(Fe)}).raw=Fe,(ya.geo.conicEquidistant=function(){return oe(Pe)}).raw=Pe;var oc=He(function(n){return 1/n},Math.atan);(ya.geo.gnomonic=function(){return xe(oc)}).raw=oc,Oe.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ka/2]},(ya.geo.mercator=function(){return Ye(Oe)}).raw=Oe;var cc=He(function(){return 1},Math.asin);(ya.geo.orthographic=function(){return xe(cc)}).raw=cc;var lc=He(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ya.geo.stereographic=function(){return xe(lc)}).raw=lc,Re.invert=function(n,t){return[Math.atan2(X(n),Math.cos(t)),V(Math.sin(t)/Z(n))]},(ya.geo.transverseMercator=function(){return Ye(Re)}).raw=Re,ya.geom={},ya.svg={},ya.svg.line=function(){return Ue(mt)};var sc=ya.map({linear:Xe,"linear-closed":Ze,step:Be,"step-before":$e,"step-after":We,basis:tr,"basis-open":er,"basis-closed":rr,bundle:ir,cardinal:Ke,"cardinal-open":Je,"cardinal-closed":Ge,monotone:sr});
sc.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var fc=[0,2/3,1/3,0],hc=[0,1/3,2/3,0],gc=[0,1/6,2/3,1/6];ya.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,i,u,a,o,c,l,s,f,h,g,p,m=pt(e),d=pt(r),v=n.length,y=v-1,M=[],x=[],b=0;if(m===Ie&&r===Ve)t=n;else for(u=0,t=[];v>u;++u)t.push([+m.call(this,i=n[u],u),+d.call(this,i,u)]);for(u=1;v>u;++u)(t[u][1]<t[b][1]||t[u][1]==t[b][1]&&t[u][0]<t[b][0])&&(b=u);for(u=0;v>u;++u)u!==b&&(c=t[u][1]-t[b][1],o=t[u][0]-t[b][0],M.push({angle:Math.atan2(c,o),index:u}));for(M.sort(function(n,t){return n.angle-t.angle}),g=M[0].angle,h=M[0].index,f=0,u=1;y>u;++u){if(a=M[u].index,g==M[u].angle){if(o=t[h][0]-t[b][0],c=t[h][1]-t[b][1],l=t[a][0]-t[b][0],s=t[a][1]-t[b][1],o*o+c*c>=l*l+s*s){M[u].index=-1;continue}M[f].index=-1}g=M[u].angle,f=u,h=a}for(x.push(b),u=0,a=0;2>u;++a)M[a].index>-1&&(x.push(M[a].index),u++);for(p=x.length;y>a;++a)if(!(M[a].index<0)){for(;!fr(x[p-2],x[p-1],M[a].index,t);)--p;x[p++]=M[a].index}var _=[];for(u=p-1;u>=0;--u)_.push(n[x[u]]);return _}var e=Ie,r=Ve;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ya.geom.polygon=function(n){return La(n,pc),n};var pc=ya.geom.polygon.prototype=[];pc.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},pc.centroid=function(n){var t,e,r=-1,i=this.length,u=0,a=0,o=this[i-1];for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=o,o=this[r],e=t[0]*o[1]-o[0]*t[1],u+=(t[0]+o[0])*e,a+=(t[1]+o[1])*e;return[u*n,a*n]},pc.clip=function(n){for(var t,e,r,i,u,a,o=pr(n),c=-1,l=this.length-pr(this),s=this[l-1];++c<l;){for(t=n.slice(),n.length=0,i=this[c],u=t[(r=t.length-o)-1],e=-1;++e<r;)a=t[e],hr(a,s,i)?(hr(u,s,i)||n.push(gr(u,a,s,i)),n.push(a)):hr(u,s,i)&&n.push(gr(u,a,s,i)),u=a;o&&n.push(n[0]),s=i}return n},ya.geom.delaunay=function(n){var t=n.map(function(){return[]}),e=[];return mr(n,function(e){t[e.region.l.index].push(n[e.region.r.index])}),t.forEach(function(t,r){var i=n[r],u=i[0],a=i[1];t.forEach(function(n){n.angle=Math.atan2(n[0]-u,n[1]-a)}),t.sort(function(n,t){return n.angle-t.angle});for(var o=0,c=t.length-1;c>o;o++)e.push([i,t[o],t[o+1]])}),e},ya.geom.voronoi=function(n){function t(n){var t,u,a,o=n.map(function(){return[]}),c=pt(e),l=pt(r),s=n.length,f=1e6;if(c===Ie&&l===Ve)t=n;else for(t=new Array(s),a=0;s>a;++a)t[a]=[+c.call(this,u=n[a],a),+l.call(this,u,a)];if(mr(t,function(n){var t,e,r,i,u,a;1===n.a&&n.b>=0?(t=n.ep.r,e=n.ep.l):(t=n.ep.l,e=n.ep.r),1===n.a?(u=t?t.y:-f,r=n.c-n.b*u,a=e?e.y:f,i=n.c-n.b*a):(r=t?t.x:-f,u=n.c-n.a*r,i=e?e.x:f,a=n.c-n.a*i);var c=[r,u],l=[i,a];o[n.region.l.index].push(c,l),o[n.region.r.index].push(c,l)}),o=o.map(function(n,e){var r=t[e][0],i=t[e][1],u=n.map(function(n){return Math.atan2(n[0]-r,n[1]-i)}),a=ya.range(n.length).sort(function(n,t){return u[n]-u[t]});return a.filter(function(n,t){return!t||u[n]-u[a[t-1]]>Qa}).map(function(t){return n[t]})}),o.forEach(function(n,e){var r=n.length;if(!r)return n.push([-f,-f],[-f,f],[f,f],[f,-f]);if(!(r>2)){var i=t[e],u=n[0],a=n[1],o=i[0],c=i[1],l=u[0],s=u[1],h=a[0],g=a[1],p=Math.abs(h-l),m=g-s;if(Math.abs(m)<Qa){var d=s>c?-f:f;n.push([-f,d],[f,d])}else if(Qa>p){var v=l>o?-f:f;n.push([v,-f],[v,f])}else{var d=(l-o)*(g-s)>(h-l)*(s-c)?f:-f,y=Math.abs(m)-p;Math.abs(y)<Qa?n.push([0>m?d:-d,d]):(y>0&&(d*=-1),n.push([-f,d],[f,d]))}}}),i)for(a=0;s>a;++a)i.clip(o[a]);for(a=0;s>a;++a)o[a].point=n[a];return o}var e=Ie,r=Ve,i=null;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.clipExtent=function(n){if(!arguments.length)return i&&[i[0],i[2]];if(null==n)i=null;else{var e=+n[0][0],r=+n[0][1],u=+n[1][0],a=+n[1][1];i=ya.geom.polygon([[e,r],[e,a],[u,a],[u,r]])}return t},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):i&&i[2]},t.links=function(n){var t,i,u,a=n.map(function(){return[]}),o=[],c=pt(e),l=pt(r),s=n.length;if(c===Ie&&l===Ve)t=n;else for(t=new Array(s),u=0;s>u;++u)t[u]=[+c.call(this,i=n[u],u),+l.call(this,i,u)];return mr(t,function(t){var e=t.region.l.index,r=t.region.r.index;a[e][r]||(a[e][r]=a[r][e]=!0,o.push({source:n[e],target:n[r]}))}),o},t.triangles=function(n){if(e===Ie&&r===Ve)return ya.geom.delaunay(n);for(var t,i=new Array(c),u=pt(e),a=pt(r),o=-1,c=n.length;++o<c;)(i[o]=[+u.call(this,t=n[o],o),+a.call(this,t,o)]).data=t;return ya.geom.delaunay(i).map(function(n){return n.map(function(n){return n.data})})},t)};var mc={l:"r",r:"l"};ya.geom.quadtree=function(n,t,e,r,i){function u(n){function u(n,t,e,r,i,u,a,o){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var c=n.x,s=n.y;if(null!=c)if(Math.abs(c-e)+Math.abs(s-r)<.01)l(n,t,e,r,i,u,a,o);else{var f=n.point;n.x=n.y=n.point=null,l(n,f,c,s,i,u,a,o),l(n,t,e,r,i,u,a,o)}else n.x=e,n.y=r,n.point=t}else l(n,t,e,r,i,u,a,o)}function l(n,t,e,r,i,a,o,c){var l=.5*(i+o),s=.5*(a+c),f=e>=l,h=r>=s,g=(h<<1)+f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=yr()),f?i=l:o=l,h?a=s:c=s,u(n,t,e,r,i,a,o,c)}var s,f,h,g,p,m,d,v,y,M=pt(o),x=pt(c);if(null!=t)m=t,d=e,v=r,y=i;else if(v=y=-(m=d=1/0),f=[],h=[],p=n.length,a)for(g=0;p>g;++g)s=n[g],s.x<m&&(m=s.x),s.y<d&&(d=s.y),s.x>v&&(v=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);m>b&&(m=b),d>_&&(d=_),b>v&&(v=b),_>y&&(y=_),f.push(b),h.push(_)}var w=v-m,S=y-d;w>S?y=d+w:v=m+S;var E=yr();if(E.add=function(n){u(E,n,+M(n,++g),+x(n,g),m,d,v,y)},E.visit=function(n){Mr(n,E,m,d,v,y)},g=-1,null==t){for(;++g<p;)u(E,n[g],f[g],h[g],m,d,v,y);--g}else n.forEach(E.add);return f=h=n=s=null,E}var a,o=Ie,c=Ve;return(a=arguments.length)?(o=dr,c=vr,3===a&&(i=e,r=t,e=t=0),u(n)):(u.x=function(n){return arguments.length?(o=n,u):o},u.y=function(n){return arguments.length?(c=n,u):c},u.extent=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],i=+n[1][1]),u):null==t?null:[[t,e],[r,i]]},u.size=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=e=0,r=+n[0],i=+n[1]),u):null==t?null:[r-t,i-e]},u)},ya.interpolateRgb=xr,ya.interpolateObject=br,ya.interpolateNumber=_r,ya.interpolateString=wr;var dc=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;ya.interpolate=Sr,ya.interpolators=[function(n,t){var e=typeof t;return("string"===e?so.has(t)||/^(#|rgb\(|hsl\()/.test(t)?xr:wr:t instanceof P?xr:"object"===e?Array.isArray(t)?Er:br:_r)(n,t)}],ya.interpolateArray=Er;var vc=function(){return mt},yc=ya.map({linear:vc,poly:zr,quad:function(){return qr},cubic:function(){return Tr},sin:function(){return Dr},exp:function(){return jr},circle:function(){return Lr},elastic:Hr,back:Fr,bounce:function(){return Pr}}),Mc=ya.map({"in":mt,out:Ar,"in-out":Nr,"out-in":function(n){return Nr(Ar(n))}});ya.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.substring(0,t):n,r=t>=0?n.substring(t+1):"in";return e=yc.get(e)||vc,r=Mc.get(r)||mt,kr(r(e.apply(null,Array.prototype.slice.call(arguments,1))))},ya.interpolateHcl=Or,ya.interpolateHsl=Yr,ya.interpolateLab=Rr,ya.interpolateRound=Ur,ya.transform=function(n){var t=Ma.createElementNS(ya.ns.prefix.svg,"g");return(ya.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Ir(e?e.matrix:xc)})(n)},Ir.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var xc={a:1,b:0,c:0,d:1,e:0,f:0};ya.interpolateTransform=Br,ya.layout={},ya.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Jr(n[e]));return t}},ya.layout.chord=function(){function n(){var n,l,f,h,g,p={},m=[],d=ya.range(u),v=[];for(e=[],r=[],n=0,h=-1;++h<u;){for(l=0,g=-1;++g<u;)l+=i[h][g];m.push(l),v.push(ya.range(u)),n+=l}for(a&&d.sort(function(n,t){return a(m[n],m[t])}),o&&v.forEach(function(n,t){n.sort(function(n,e){return o(i[t][n],i[t][e])})}),n=(2*Ka-s*u)/n,l=0,h=-1;++h<u;){for(f=l,g=-1;++g<u;){var y=d[h],M=v[y][g],x=i[y][M],b=l,_=l+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:l,value:(l-f)/n},l+=s}for(h=-1;++h<u;)for(g=h-1;++g<u;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}c&&t()}function t(){e.sort(function(n,t){return c((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,i,u,a,o,c,l={},s=0;return l.matrix=function(n){return arguments.length?(u=(i=n)&&i.length,e=r=null,l):i},l.padding=function(n){return arguments.length?(s=n,e=r=null,l):s},l.sortGroups=function(n){return arguments.length?(a=n,e=r=null,l):a},l.sortSubgroups=function(n){return arguments.length?(o=n,e=null,l):o},l.sortChords=function(n){return arguments.length?(c=n,e&&t(),l):c},l.chords=function(){return e||n(),e},l.groups=function(){return r||n(),r},l},ya.layout.force=function(){function n(n){return function(t,e,r,i){if(t.point!==n){var u=t.cx-n.x,a=t.cy-n.y,o=1/Math.sqrt(u*u+a*a);if(m>(i-e)*o){var c=t.charge*o*o;return n.px-=u*c,n.py-=a*c,!0}if(t.point&&isFinite(o)){var c=t.pointCharge*o*o;n.px-=u*c,n.py-=a*c}}return!t.charge}}function t(n){n.px=ya.event.x,n.py=ya.event.y,o.resume()}var e,r,i,u,a,o={},c=ya.dispatch("start","tick","end"),l=[1,1],s=.9,f=bc,h=_c,g=-30,p=.1,m=.8,d=[],v=[];return o.tick=function(){if((r*=.99)<.005)return c.end({type:"end",alpha:r=0}),!0;var t,e,o,f,h,m,y,M,x,b=d.length,_=v.length;for(e=0;_>e;++e)o=v[e],f=o.source,h=o.target,M=h.x-f.x,x=h.y-f.y,(m=M*M+x*x)&&(m=r*u[e]*((m=Math.sqrt(m))-i[e])/m,M*=m,x*=m,h.x-=M*(y=f.weight/(h.weight+f.weight)),h.y-=x*y,f.x+=M*(y=1-y),f.y+=x*y);if((y=r*p)&&(M=l[0]/2,x=l[1]/2,e=-1,y))for(;++e<b;)o=d[e],o.x+=(M-o.x)*y,o.y+=(x-o.y)*y;if(g)for(ri(t=ya.geom.quadtree(d),r,a),e=-1;++e<b;)(o=d[e]).fixed||t.visit(n(o));for(e=-1;++e<b;)o=d[e],o.fixed?(o.x=o.px,o.y=o.py):(o.x-=(o.px-(o.px=o.x))*s,o.y-=(o.py-(o.py=o.y))*s);c.tick({type:"tick",alpha:r})},o.nodes=function(n){return arguments.length?(d=n,o):d},o.links=function(n){return arguments.length?(v=n,o):v},o.size=function(n){return arguments.length?(l=n,o):l},o.linkDistance=function(n){return arguments.length?(f="function"==typeof n?n:+n,o):f},o.distance=o.linkDistance,o.linkStrength=function(n){return arguments.length?(h="function"==typeof n?n:+n,o):h},o.friction=function(n){return arguments.length?(s=+n,o):s},o.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,o):g},o.gravity=function(n){return arguments.length?(p=+n,o):p},o.theta=function(n){return arguments.length?(m=+n,o):m},o.alpha=function(n){return arguments.length?(n=+n,r?r=n>0?n:0:n>0&&(c.start({type:"start",alpha:r=n}),ya.timer(o.tick)),o):r},o.start=function(){function n(n,r){for(var i,u=t(e),a=-1,o=u.length;++a<o;)if(!isNaN(i=u[a][n]))return i;return Math.random()*r}function t(){if(!c){for(c=[],r=0;p>r;++r)c[r]=[];for(r=0;m>r;++r){var n=v[r];c[n.source.index].push(n.target),c[n.target.index].push(n.source)}}return c[e]}var e,r,c,s,p=d.length,m=v.length,y=l[0],M=l[1];for(e=0;p>e;++e)(s=d[e]).index=e,s.weight=0;for(e=0;m>e;++e)s=v[e],"number"==typeof s.source&&(s.source=d[s.source]),"number"==typeof s.target&&(s.target=d[s.target]),++s.source.weight,++s.target.weight;for(e=0;p>e;++e)s=d[e],isNaN(s.x)&&(s.x=n("x",y)),isNaN(s.y)&&(s.y=n("y",M)),isNaN(s.px)&&(s.px=s.x),isNaN(s.py)&&(s.py=s.y);if(i=[],"function"==typeof f)for(e=0;m>e;++e)i[e]=+f.call(this,v[e],e);else for(e=0;m>e;++e)i[e]=f;if(u=[],"function"==typeof h)for(e=0;m>e;++e)u[e]=+h.call(this,v[e],e);else for(e=0;m>e;++e)u[e]=h;if(a=[],"function"==typeof g)for(e=0;p>e;++e)a[e]=+g.call(this,d[e],e);else for(e=0;p>e;++e)a[e]=g;return o.resume()},o.resume=function(){return o.alpha(.1)},o.stop=function(){return o.alpha(0)},o.drag=function(){return e||(e=ya.behavior.drag().origin(mt).on("dragstart.force",Qr).on("drag.force",t).on("dragend.force",ni)),arguments.length?(this.on("mouseover.force",ti).on("mouseout.force",ei).call(e),void 0):e},ya.rebind(o,c,"on")};var bc=20,_c=1;ya.layout.hierarchy=function(){function n(t,a,o){var c=i.call(e,t,a);if(t.depth=a,o.push(t),c&&(l=c.length)){for(var l,s,f=-1,h=t.children=[],g=0,p=a+1;++f<l;)s=n(c[f],p,o),s.parent=t,h.push(s),g+=s.value;r&&h.sort(r),u&&(t.value=g)}else u&&(t.value=+u.call(e,t,a)||0);return t}function t(n,r){var i=n.children,a=0;if(i&&(o=i.length))for(var o,c=-1,l=r+1;++c<o;)a+=t(i[c],l);else u&&(a=+u.call(e,n,r)||0);return u&&(n.value=a),a}function e(t){var e=[];return n(t,0,e),e}var r=oi,i=ui,u=ai;return e.sort=function(n){return arguments.length?(r=n,e):r},e.children=function(n){return arguments.length?(i=n,e):i},e.value=function(n){return arguments.length?(u=n,e):u},e.revalue=function(n){return t(n,0),n},e},ya.layout.partition=function(){function n(t,e,r,i){var u=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,u&&(a=u.length)){var a,o,c,l=-1;for(r=t.value?r/t.value:0;++l<a;)n(o=u[l],e,c=o.value*r,i),e+=c}}function t(n){var e=n.children,r=0;if(e&&(i=e.length))for(var i,u=-1;++u<i;)r=Math.max(r,t(e[u]));return 1+r}function e(e,u){var a=r.call(this,e,u);return n(a[0],0,i[0],i[1]/t(a[0])),a}var r=ya.layout.hierarchy(),i=[1,1];return e.size=function(n){return arguments.length?(i=n,e):i},ii(e,r)},ya.layout.pie=function(){function n(u){var a=u.map(function(e,r){return+t.call(n,e,r)}),o=+("function"==typeof r?r.apply(this,arguments):r),c=(("function"==typeof i?i.apply(this,arguments):i)-o)/ya.sum(a),l=ya.range(u.length);null!=e&&l.sort(e===wc?function(n,t){return a[t]-a[n]}:function(n,t){return e(u[n],u[t])});var s=[];return l.forEach(function(n){var t;s[n]={data:u[n],value:t=a[n],startAngle:o,endAngle:o+=t*c}}),s}var t=Number,e=wc,r=0,i=2*Ka;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(i=t,n):i},n};var wc={};ya.layout.stack=function(){function n(o,c){var l=o.map(function(e,r){return t.call(n,e,r)}),s=l.map(function(t){return t.map(function(t,e){return[u.call(n,t,e),a.call(n,t,e)]})}),f=e.call(n,s,c);l=ya.permute(l,f),s=ya.permute(s,f);var h,g,p,m=r.call(n,s,c),d=l.length,v=l[0].length;for(g=0;v>g;++g)for(i.call(n,l[0][g],p=m[g],s[0][g][1]),h=1;d>h;++h)i.call(n,l[h][g],p+=s[h-1][g][1],s[h][g][1]);return o}var t=mt,e=hi,r=gi,i=fi,u=li,a=si;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:Sc.get(t)||hi,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:Ec.get(t)||gi,n):r},n.x=function(t){return arguments.length?(u=t,n):u},n.y=function(t){return arguments.length?(a=t,n):a},n.out=function(t){return arguments.length?(i=t,n):i},n};var Sc=ya.map({"inside-out":function(n){var t,e,r=n.length,i=n.map(pi),u=n.map(mi),a=ya.range(r).sort(function(n,t){return i[n]-i[t]}),o=0,c=0,l=[],s=[];for(t=0;r>t;++t)e=a[t],c>o?(o+=u[e],l.push(e)):(c+=u[e],s.push(e));return s.reverse().concat(l)},reverse:function(n){return ya.range(n.length).reverse()},"default":hi}),Ec=ya.map({silhouette:function(n){var t,e,r,i=n.length,u=n[0].length,a=[],o=0,c=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];r>o&&(o=r),a.push(r)}for(e=0;u>e;++e)c[e]=(o-a[e])/2;return c},wiggle:function(n){var t,e,r,i,u,a,o,c,l,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=c=l=0,e=1;h>e;++e){for(t=0,i=0;s>t;++t)i+=n[t][e][1];for(t=0,u=0,o=f[e][0]-f[e-1][0];s>t;++t){for(r=0,a=(n[t][e][1]-n[t][e-1][1])/(2*o);t>r;++r)a+=(n[r][e][1]-n[r][e-1][1])/o;u+=a*n[t][e][1]}g[e]=c-=i?u/i*o:0,l>c&&(l=c)}for(e=0;h>e;++e)g[e]-=l;return g},expand:function(n){var t,e,r,i=n.length,u=n[0].length,a=1/i,o=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];if(r)for(t=0;i>t;t++)n[t][e][1]/=r;else for(t=0;i>t;t++)n[t][e][1]=a}for(e=0;u>e;++e)o[e]=0;return o},zero:gi});ya.layout.histogram=function(){function n(n,u){for(var a,o,c=[],l=n.map(e,this),s=r.call(this,l,u),f=i.call(this,s,l,u),u=-1,h=l.length,g=f.length-1,p=t?1:1/h;++u<g;)a=c[u]=[],a.dx=f[u+1]-(a.x=f[u]),a.y=0;if(g>0)for(u=-1;++u<h;)o=l[u],o>=s[0]&&o<=s[1]&&(a=c[ya.bisect(f,o,1,g)-1],a.y+=p,a.push(n[u]));return c}var t=!0,e=Number,r=Mi,i=vi;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=pt(t),n):r},n.bins=function(t){return arguments.length?(i="number"==typeof t?function(n){return yi(n,t)}:pt(t),n):i},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ya.layout.tree=function(){function n(n,u){function a(n,t){var r=n.children,i=n._tree;if(r&&(u=r.length)){for(var u,o,l,s=r[0],f=s,h=-1;++h<u;)l=r[h],a(l,o),f=c(l,o,f),o=l;Ni(n);var g=.5*(s._tree.prelim+l._tree.prelim);t?(i.prelim=t._tree.prelim+e(n,t),i.mod=i.prelim-g):i.prelim=g}else t&&(i.prelim=t._tree.prelim+e(n,t))}function o(n,t){n.x=n._tree.prelim+t;var e=n.children;if(e&&(r=e.length)){var r,i=-1;for(t+=n._tree.mod;++i<r;)o(e[i],t)}}function c(n,t,r){if(t){for(var i,u=n,a=n,o=t,c=n.parent.children[0],l=u._tree.mod,s=a._tree.mod,f=o._tree.mod,h=c._tree.mod;o=_i(o),u=bi(u),o&&u;)c=bi(c),a=_i(a),a._tree.ancestor=n,i=o._tree.prelim+f-u._tree.prelim-l+e(o,u),i>0&&(qi(Ti(o,n,r),n,i),l+=i,s+=i),f+=o._tree.mod,l+=u._tree.mod,h+=c._tree.mod,s+=a._tree.mod;o&&!_i(a)&&(a._tree.thread=o,a._tree.mod+=f-s),u&&!bi(c)&&(c._tree.thread=u,c._tree.mod+=l-h,r=n)}return r}var l=t.call(this,n,u),s=l[0];Ai(s,function(n,t){n._tree={ancestor:n,prelim:0,mod:0,change:0,shift:0,number:t?t._tree.number+1:0}}),a(s),o(s,-s._tree.prelim);var f=wi(s,Ei),h=wi(s,Si),g=wi(s,ki),p=f.x-e(f,h)/2,m=h.x+e(h,f)/2,d=g.depth||1;return Ai(s,i?function(n){n.x*=r[0],n.y=n.depth*r[1],delete n._tree}:function(n){n.x=(n.x-p)/(m-p)*r[0],n.y=n.depth/d*r[1],delete n._tree}),l}var t=ya.layout.hierarchy().sort(null).value(null),e=xi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ii(n,t)},ya.layout.pack=function(){function n(n,u){var a=e.call(this,n,u),o=a[0],c=i[0],l=i[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(o.x=o.y=0,Ai(o,function(n){n.r=+s(n.value)}),Ai(o,Li),r){var f=r*(t?1:Math.max(2*o.r/c,2*o.r/l))/2;Ai(o,function(n){n.r+=f}),Ai(o,Li),Ai(o,function(n){n.r-=f})}return Pi(o,c/2,l/2,t?1:1/Math.max(2*o.r/c,2*o.r/l)),a}var t,e=ya.layout.hierarchy().sort(Ci),r=0,i=[1,1];return n.size=function(t){return arguments.length?(i=t,n):i},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},ii(n,e)},ya.layout.cluster=function(){function n(n,u){var a,o=t.call(this,n,u),c=o[0],l=0;Ai(c,function(n){var t=n.children;t&&t.length?(n.x=Ri(t),n.y=Yi(t)):(n.x=a?l+=e(n,a):0,n.y=0,a=n)});var s=Ui(c),f=Ii(c),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return Ai(c,i?function(n){n.x=(n.x-c.x)*r[0],n.y=(c.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),o}var t=ya.layout.hierarchy().sort(null).value(null),e=xi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ii(n,t)},ya.layout.treemap=function(){function n(n,t){for(var e,r,i=-1,u=n.length;++i<u;)r=(e=n[i]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var u=e.children;if(u&&u.length){var a,o,c,l=f(e),s=[],h=u.slice(),p=1/0,m="slice"===g?l.dx:"dice"===g?l.dy:"slice-dice"===g?1&e.depth?l.dy:l.dx:Math.min(l.dx,l.dy);for(n(h,l.dx*l.dy/e.value),s.area=0;(c=h.length)>0;)s.push(a=h[c-1]),s.area+=a.area,"squarify"!==g||(o=r(s,m))<=p?(h.pop(),p=o):(s.area-=s.pop().area,i(s,m,l,!1),m=Math.min(l.dx,l.dy),s.length=s.area=0,p=1/0);s.length&&(i(s,m,l,!0),s.length=s.area=0),u.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var u,a=f(t),o=r.slice(),c=[];for(n(o,a.dx*a.dy/t.value),c.area=0;u=o.pop();)c.push(u),c.area+=u.area,null!=u.z&&(i(c,u.z?a.dx:a.dy,a,!o.length),c.length=c.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,i=0,u=1/0,a=-1,o=n.length;++a<o;)(e=n[a].area)&&(u>e&&(u=e),e>i&&(i=e));return r*=r,t*=t,r?Math.max(t*i*p/r,r/(t*u*p)):1/0}function i(n,t,e,r){var i,u=-1,a=n.length,o=e.x,l=e.y,s=t?c(n.area/t):0;if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++u<a;)i=n[u],i.x=o,i.y=l,i.dy=s,o+=i.dx=Math.min(e.x+e.dx-o,s?c(i.area/s):0);i.z=!0,i.dx+=e.x+e.dx-o,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++u<a;)i=n[u],i.x=o,i.y=l,i.dx=s,l+=i.dy=Math.min(e.y+e.dy-l,s?c(i.area/s):0);i.z=!1,i.dy+=e.y+e.dy-l,e.x+=s,e.dx-=s}}function u(r){var i=a||o(r),u=i[0];return u.x=0,u.y=0,u.dx=l[0],u.dy=l[1],a&&o.revalue(u),n([u],u.dx*u.dy/u.value),(a?e:t)(u),h&&(a=i),i}var a,o=ya.layout.hierarchy(),c=Math.round,l=[1,1],s=null,f=Vi,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return u.size=function(n){return arguments.length?(l=n,u):l},u.padding=function(n){function t(t){var e=n.call(u,t,t.depth);return null==e?Vi(t):Xi(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Xi(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Vi:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,u},u.round=function(n){return arguments.length?(c=n?Math.round:Number,u):c!=Number},u.sticky=function(n){return arguments.length?(h=n,a=null,u):h},u.ratio=function(n){return arguments.length?(p=n,u):p},u.mode=function(n){return arguments.length?(g=n+"",u):g},ii(u,o)},ya.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,i;do e=2*Math.random()-1,r=2*Math.random()-1,i=e*e+r*r;while(!i||i>1);return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){var n=ya.random.normal.apply(ya,arguments);return function(){return Math.exp(n())}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t/n}}},ya.scale={};var kc={floor:mt,ceil:mt};ya.scale.linear=function(){return Ki([0,1],[0,1],Sr,!1)},ya.scale.log=function(){return uu(ya.scale.linear().domain([0,1]),10,!0,[1,10])};var Ac=ya.format(".0e"),Nc={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};ya.scale.pow=function(){return au(ya.scale.linear(),1,[0,1])},ya.scale.sqrt=function(){return ya.scale.pow().exponent(.5)},ya.scale.ordinal=function(){return cu([],{t:"range",a:[[]]})},ya.scale.category10=function(){return ya.scale.ordinal().range(qc)},ya.scale.category20=function(){return ya.scale.ordinal().range(Tc)},ya.scale.category20b=function(){return ya.scale.ordinal().range(Cc)},ya.scale.category20c=function(){return ya.scale.ordinal().range(zc)};var qc=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(ut),Tc=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(ut),Cc=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(ut),zc=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(ut);ya.scale.quantile=function(){return lu([],[])},ya.scale.quantize=function(){return su(0,1,[0,1])},ya.scale.threshold=function(){return fu([.5],[0,1])},ya.scale.identity=function(){return hu([0,1])},ya.svg.arc=function(){function n(){var n=t.apply(this,arguments),u=e.apply(this,arguments),a=r.apply(this,arguments)+Dc,o=i.apply(this,arguments)+Dc,c=(a>o&&(c=a,a=o,o=c),o-a),l=Ka>c?"0":"1",s=Math.cos(a),f=Math.sin(a),h=Math.cos(o),g=Math.sin(o);return c>=jc?n?"M0,"+u+"A"+u+","+u+" 0 1,1 0,"+-u+"A"+u+","+u+" 0 1,1 0,"+u+"M0,"+n+"A"+n+","+n+" 0 1,0 0,"+-n+"A"+n+","+n+" 0 1,0 0,"+n+"Z":"M0,"+u+"A"+u+","+u+" 0 1,1 0,"+-u+"A"+u+","+u+" 0 1,1 0,"+u+"Z":n?"M"+u*s+","+u*f+"A"+u+","+u+" 0 "+l+",1 "+u*h+","+u*g+"L"+n*h+","+n*g+"A"+n+","+n+" 0 "+l+",0 "+n*s+","+n*f+"Z":"M"+u*s+","+u*f+"A"+u+","+u+" 0 "+l+",1 "+u*h+","+u*g+"L0,0"+"Z"}var t=gu,e=pu,r=mu,i=du;return n.innerRadius=function(e){return arguments.length?(t=pt(e),n):t},n.outerRadius=function(t){return arguments.length?(e=pt(t),n):e},n.startAngle=function(t){return arguments.length?(r=pt(t),n):r},n.endAngle=function(t){return arguments.length?(i=pt(t),n):i},n.centroid=function(){var n=(t.apply(this,arguments)+e.apply(this,arguments))/2,u=(r.apply(this,arguments)+i.apply(this,arguments))/2+Dc;return[Math.cos(u)*n,Math.sin(u)*n]},n};var Dc=-Ka/2,jc=2*Ka-1e-6;ya.svg.line.radial=function(){var n=Ue(vu);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},$e.reverse=We,We.reverse=$e,ya.svg.area=function(){return yu(mt)},ya.svg.area.radial=function(){var n=yu(vu);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ya.svg.chord=function(){function n(n,o){var c=t(this,u,n,o),l=t(this,a,n,o);return"M"+c.p0+r(c.r,c.p1,c.a1-c.a0)+(e(c,l)?i(c.r,c.p1,c.r,c.p0):i(c.r,c.p1,l.r,l.p0)+r(l.r,l.p1,l.a1-l.a0)+i(l.r,l.p1,c.r,c.p0))+"Z"}function t(n,t,e,r){var i=t.call(n,e,r),u=o.call(n,i,r),a=c.call(n,i,r)+Dc,s=l.call(n,i,r)+Dc;return{r:u,a0:a,a1:s,p0:[u*Math.cos(a),u*Math.sin(a)],p1:[u*Math.cos(s),u*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Ka)+",1 "+t}function i(n,t,e,r){return"Q 0,0 "+r}var u=ze,a=De,o=Mu,c=mu,l=du;return n.radius=function(t){return arguments.length?(o=pt(t),n):o},n.source=function(t){return arguments.length?(u=pt(t),n):u},n.target=function(t){return arguments.length?(a=pt(t),n):a},n.startAngle=function(t){return arguments.length?(c=pt(t),n):c},n.endAngle=function(t){return arguments.length?(l=pt(t),n):l},n},ya.svg.diagonal=function(){function n(n,i){var u=t.call(this,n,i),a=e.call(this,n,i),o=(u.y+a.y)/2,c=[u,{x:u.x,y:o},{x:a.x,y:o},a];return c=c.map(r),"M"+c[0]+"C"+c[1]+" "+c[2]+" "+c[3]}var t=ze,e=De,r=xu;return n.source=function(e){return arguments.length?(t=pt(e),n):t},n.target=function(t){return arguments.length?(e=pt(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ya.svg.diagonal.radial=function(){var n=ya.svg.diagonal(),t=xu,e=n.projection;return n.projection=function(n){return arguments.length?e(bu(t=n)):t},n},ya.svg.symbol=function(){function n(n,r){return(Lc.get(t.call(this,n,r))||Su)(e.call(this,n,r))}var t=wu,e=_u;return n.type=function(e){return arguments.length?(t=pt(e),n):t},n.size=function(t){return arguments.length?(e=pt(t),n):e},n};var Lc=ya.map({circle:Su,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Oc)),e=t*Oc;return"M0,"+-t+"L"+e+",0"+" 0,"+t+" "+-e+",0"+"Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/Pc),e=t*Pc/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/Pc),e=t*Pc/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ya.svg.symbolTypes=Lc.keys();var Hc,Fc,Pc=Math.sqrt(3),Oc=Math.tan(30*to),Yc=[],Rc=0;Yc.call=Ya.call,Yc.empty=Ya.empty,Yc.node=Ya.node,Yc.size=Ya.size,ya.transition=function(n){return arguments.length?Hc?n.transition():n:Ia.transition()},ya.transition.prototype=Yc,Yc.select=function(n){var t,e,r,i=this.id,u=[];n=v(n);for(var a=-1,o=this.length;++a<o;){u.push(t=[]);for(var c=this[a],l=-1,s=c.length;++l<s;)(r=c[l])&&(e=n.call(r,r.__data__,l,a))?("__data__"in r&&(e.__data__=r.__data__),Nu(e,l,i,r.__transition__[i]),t.push(e)):t.push(null)}return Eu(u,i)},Yc.selectAll=function(n){var t,e,r,i,u,a=this.id,o=[];n=y(n);for(var c=-1,l=this.length;++c<l;)for(var s=this[c],f=-1,h=s.length;++f<h;)if(r=s[f]){u=r.__transition__[a],e=n.call(r,r.__data__,f,c),o.push(t=[]);for(var g=-1,p=e.length;++g<p;)(i=e[g])&&Nu(i,g,a,u),t.push(i)}return Eu(o,a)},Yc.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=N(n));for(var u=0,a=this.length;a>u;u++){i.push(t=[]);for(var e=this[u],o=0,c=e.length;c>o;o++)(r=e[o])&&n.call(r,r.__data__,o)&&t.push(r)}return Eu(i,this.id)},Yc.tween=function(n,t){var e=this.id;return arguments.length<2?this.node().__transition__[e].tween.get(n):T(this,null==t?function(t){t.__transition__[e].tween.remove(n)}:function(r){r.__transition__[e].tween.set(n,t)})},Yc.attr=function(n,t){function e(){this.removeAttribute(o)}function r(){this.removeAttributeNS(o.space,o.local)}function i(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(o);return e!==n&&(t=a(e,n),function(n){this.setAttribute(o,t(n))})})}function u(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(o.space,o.local);return e!==n&&(t=a(e,n),function(n){this.setAttributeNS(o.space,o.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var a="transform"==n?Br:Sr,o=ya.ns.qualify(n);return ku(this,"attr."+n,t,o.local?u:i)},Yc.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(i));return r&&function(n){this.setAttribute(i,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(i.space,i.local));return r&&function(n){this.setAttributeNS(i.space,i.local,r(n))}}var i=ya.ns.qualify(n);return this.tween("attr."+n,i.local?r:e)},Yc.style=function(n,t,e){function r(){this.style.removeProperty(n)}function i(t){return null==t?r:(t+="",function(){var r,i=ba.getComputedStyle(this,null).getPropertyValue(n);return i!==t&&(r=Sr(i,t),function(t){this.style.setProperty(n,r(t),e)})})}var u=arguments.length;if(3>u){if("string"!=typeof n){2>u&&(t="");for(e in n)this.style(e,n[e],t);return this}e=""}return ku(this,"style."+n,t,i)},Yc.styleTween=function(n,t,e){function r(r,i){var u=t.call(this,r,i,ba.getComputedStyle(this,null).getPropertyValue(n));return u&&function(t){this.style.setProperty(n,u(t),e)}}return arguments.length<3&&(e=""),this.tween("style."+n,r)},Yc.text=function(n){return ku(this,"text",n,Au)},Yc.remove=function(){return this.each("end.transition",function(){var n;!this.__transition__&&(n=this.parentNode)&&n.removeChild(this)})},Yc.ease=function(n){var t=this.id;return arguments.length<1?this.node().__transition__[t].ease:("function"!=typeof n&&(n=ya.ease.apply(ya,arguments)),T(this,function(e){e.__transition__[t].ease=n}))},Yc.delay=function(n){var t=this.id;return T(this,"function"==typeof n?function(e,r,i){e.__transition__[t].delay=0|n.call(e,e.__data__,r,i)}:(n|=0,function(e){e.__transition__[t].delay=n}))},Yc.duration=function(n){var t=this.id;return T(this,"function"==typeof n?function(e,r,i){e.__transition__[t].duration=Math.max(1,0|n.call(e,e.__data__,r,i))}:(n=Math.max(1,0|n),function(e){e.__transition__[t].duration=n}))},Yc.each=function(n,t){var e=this.id;if(arguments.length<2){var r=Fc,i=Hc;Hc=e,T(this,function(t,r,i){Fc=t.__transition__[e],n.call(t,t.__data__,r,i)}),Fc=r,Hc=i}else T(this,function(r){var i=r.__transition__[e];(i.event||(i.event=ya.dispatch("start","end"))).on(n,t)});return this},Yc.transition=function(){for(var n,t,e,r,i=this.id,u=++Rc,a=[],o=0,c=this.length;c>o;o++){a.push(n=[]);for(var t=this[o],l=0,s=t.length;s>l;l++)(e=t[l])&&(r=Object.create(e.__transition__[i]),r.delay+=r.duration,Nu(e,l,u,r)),n.push(e)}return Eu(a,u)},ya.svg.axis=function(){function n(n){n.each(function(){var n,f=ya.select(this),h=null==l?e.ticks?e.ticks.apply(e,c):e.domain():l,g=null==t?e.tickFormat?e.tickFormat.apply(e,c):String:t,p=Cu(e,h,s),m=f.selectAll(".tick.minor").data(p,String),d=m.enter().insert("line",".tick").attr("class","tick minor").style("opacity",1e-6),v=ya.transition(m.exit()).style("opacity",1e-6).remove(),y=ya.transition(m).style("opacity",1),M=f.selectAll(".tick.major").data(h,String),x=M.enter().insert("g",".domain").attr("class","tick major").style("opacity",1e-6),b=ya.transition(M.exit()).style("opacity",1e-6).remove(),_=ya.transition(M).style("opacity",1),w=Bi(e),S=f.selectAll(".domain").data([0]),E=(S.enter().append("path").attr("class","domain"),ya.transition(S)),k=e.copy(),A=this.__chart__||k;
this.__chart__=k,x.append("line"),x.append("text");var N=x.select("line"),q=_.select("line"),T=M.select("text").text(g),C=x.select("text"),z=_.select("text");switch(r){case"bottom":n=qu,d.attr("y2",u),y.attr("x2",0).attr("y2",u),N.attr("y2",i),C.attr("y",Math.max(i,0)+o),q.attr("x2",0).attr("y2",i),z.attr("x",0).attr("y",Math.max(i,0)+o),T.attr("dy",".71em").style("text-anchor","middle"),E.attr("d","M"+w[0]+","+a+"V0H"+w[1]+"V"+a);break;case"top":n=qu,d.attr("y2",-u),y.attr("x2",0).attr("y2",-u),N.attr("y2",-i),C.attr("y",-(Math.max(i,0)+o)),q.attr("x2",0).attr("y2",-i),z.attr("x",0).attr("y",-(Math.max(i,0)+o)),T.attr("dy","0em").style("text-anchor","middle"),E.attr("d","M"+w[0]+","+-a+"V0H"+w[1]+"V"+-a);break;case"left":n=Tu,d.attr("x2",-u),y.attr("x2",-u).attr("y2",0),N.attr("x2",-i),C.attr("x",-(Math.max(i,0)+o)),q.attr("x2",-i).attr("y2",0),z.attr("x",-(Math.max(i,0)+o)).attr("y",0),T.attr("dy",".32em").style("text-anchor","end"),E.attr("d","M"+-a+","+w[0]+"H0V"+w[1]+"H"+-a);break;case"right":n=Tu,d.attr("x2",u),y.attr("x2",u).attr("y2",0),N.attr("x2",i),C.attr("x",Math.max(i,0)+o),q.attr("x2",i).attr("y2",0),z.attr("x",Math.max(i,0)+o).attr("y",0),T.attr("dy",".32em").style("text-anchor","start"),E.attr("d","M"+a+","+w[0]+"H0V"+w[1]+"H"+a)}if(e.rangeBand){var D=k.rangeBand()/2,j=function(n){return k(n)+D};x.call(n,j),_.call(n,j)}else x.call(n,A),_.call(n,k),b.call(n,k),d.call(n,A),y.call(n,k),v.call(n,k)})}var t,e=ya.scale.linear(),r=Uc,i=6,u=6,a=6,o=3,c=[10],l=null,s=0;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Ic?t+"":Uc,n):r},n.ticks=function(){return arguments.length?(c=arguments,n):c},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t,e){if(!arguments.length)return i;var r=arguments.length-1;return i=+t,u=r>1?+e:i,a=r>0?+arguments[r]:i,n},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(t){return arguments.length?(s=+t,n):s},n};var Uc="bottom",Ic={top:1,right:1,bottom:1,left:1};ya.svg.brush=function(){function n(u){u.each(function(){var u,a=ya.select(this),s=a.selectAll(".background").data([0]),f=a.selectAll(".extent").data([0]),h=a.selectAll(".resize").data(l,String);a.style("pointer-events","all").on("mousedown.brush",i).on("touchstart.brush",i),s.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),f.enter().append("rect").attr("class","extent").style("cursor","move"),h.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return Vc[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),h.style("display",n.empty()?"none":null),h.exit().remove(),o&&(u=Bi(o),s.attr("x",u[0]).attr("width",u[1]-u[0]),e(a)),c&&(u=Bi(c),s.attr("y",u[0]).attr("height",u[1]-u[0]),r(a)),t(a)})}function t(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+s[+/e$/.test(n)][0]+","+s[+/^s/.test(n)][1]+")"})}function e(n){n.select(".extent").attr("x",s[0][0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",s[1][0]-s[0][0])}function r(n){n.select(".extent").attr("y",s[0][1]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",s[1][1]-s[0][1])}function i(){function i(){var n=ya.event.changedTouches;return n?ya.touches(M,n)[0]:ya.mouse(M)}function l(){32==ya.event.keyCode&&(k||(v=null,N[0]-=s[1][0],N[1]-=s[1][1],k=2),g())}function h(){32==ya.event.keyCode&&2==k&&(N[0]+=s[1][0],N[1]+=s[1][1],k=0,g())}function p(){var n=i(),u=!1;y&&(n[0]+=y[0],n[1]+=y[1]),k||(ya.event.altKey?(v||(v=[(s[0][0]+s[1][0])/2,(s[0][1]+s[1][1])/2]),N[0]=s[+(n[0]<v[0])][0],N[1]=s[+(n[1]<v[1])][1]):v=null),S&&m(n,o,0)&&(e(_),u=!0),E&&m(n,c,1)&&(r(_),u=!0),u&&(t(_),b({type:"brush",mode:k?"move":"resize"}))}function m(n,t,e){var r,i,a=Bi(t),o=a[0],c=a[1],l=N[e],h=s[1][e]-s[0][e];return k&&(o-=l,c-=h+l),r=f[e]?Math.max(o,Math.min(c,n[e])):n[e],k?i=(r+=l)+h:(v&&(l=Math.max(o,Math.min(c,2*v[e]-r))),r>l?(i=r,r=l):i=l),s[0][e]!==r||s[1][e]!==i?(u=null,s[0][e]=r,s[1][e]=i,!0):void 0}function d(){p(),_.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ya.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),A(),b({type:"brushend"})}var v,y,M=this,x=ya.select(ya.event.target),b=a.of(M,arguments),_=ya.select(M),w=x.datum(),S=!/^(n|s)$/.test(w)&&o,E=!/^(e|w)$/.test(w)&&c,k=x.classed("extent"),A=H(),N=i(),q=ya.select(ba).on("keydown.brush",l).on("keyup.brush",h);if(ya.event.changedTouches?q.on("touchmove.brush",p).on("touchend.brush",d):q.on("mousemove.brush",p).on("mouseup.brush",d),k)N[0]=s[0][0]-N[0],N[1]=s[0][1]-N[1];else if(w){var T=+/w$/.test(w),C=+/^n/.test(w);y=[s[1-T][0]-N[0],s[1-C][1]-N[1]],N[0]=s[T][0],N[1]=s[C][1]}else ya.event.altKey&&(v=N.slice());_.style("pointer-events","none").selectAll(".resize").style("display",null),ya.select("body").style("cursor",x.style("cursor")),b({type:"brushstart"}),p()}var u,a=m(n,"brushstart","brush","brushend"),o=null,c=null,l=Xc[0],s=[[0,0],[0,0]],f=[!0,!0];return n.x=function(t){return arguments.length?(o=t,l=Xc[!o<<1|!c],n):o},n.y=function(t){return arguments.length?(c=t,l=Xc[!o<<1|!c],n):c},n.clamp=function(t){return arguments.length?(o&&c?f=[!!t[0],!!t[1]]:(o||c)&&(f[+!o]=!!t),n):o&&c?f:o||c?f[+!o]:null},n.extent=function(t){var e,r,i,a,l;return arguments.length?(u=[[0,0],[0,0]],o&&(e=t[0],r=t[1],c&&(e=e[0],r=r[0]),u[0][0]=e,u[1][0]=r,o.invert&&(e=o(e),r=o(r)),e>r&&(l=e,e=r,r=l),s[0][0]=0|e,s[1][0]=0|r),c&&(i=t[0],a=t[1],o&&(i=i[1],a=a[1]),u[0][1]=i,u[1][1]=a,c.invert&&(i=c(i),a=c(a)),i>a&&(l=i,i=a,a=l),s[0][1]=0|i,s[1][1]=0|a),n):(t=u||s,o&&(e=t[0][0],r=t[1][0],u||(e=s[0][0],r=s[1][0],o.invert&&(e=o.invert(e),r=o.invert(r)),e>r&&(l=e,e=r,r=l))),c&&(i=t[0][1],a=t[1][1],u||(i=s[0][1],a=s[1][1],c.invert&&(i=c.invert(i),a=c.invert(a)),i>a&&(l=i,i=a,a=l))),o&&c?[[e,i],[r,a]]:o?[e,r]:c&&[i,a])},n.clear=function(){return u=null,s[0][0]=s[0][1]=s[1][0]=s[1][1]=0,n},n.empty=function(){return o&&s[0][0]===s[1][0]||c&&s[0][1]===s[1][1]},ya.rebind(n,a,"on")};var Vc={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Xc=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]];ya.time={};var Zc=Date,Bc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];zu.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){$c.setUTCDate.apply(this._,arguments)},setDay:function(){$c.setUTCDay.apply(this._,arguments)},setFullYear:function(){$c.setUTCFullYear.apply(this._,arguments)},setHours:function(){$c.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){$c.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){$c.setUTCMinutes.apply(this._,arguments)},setMonth:function(){$c.setUTCMonth.apply(this._,arguments)},setSeconds:function(){$c.setUTCSeconds.apply(this._,arguments)},setTime:function(){$c.setTime.apply(this._,arguments)}};var $c=Date.prototype,Wc="%a %b %e %X %Y",Jc="%m/%d/%Y",Gc="%H:%M:%S",Kc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Qc=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],nl=["January","February","March","April","May","June","July","August","September","October","November","December"],tl=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];ya.time.year=Du(function(n){return n=ya.time.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ya.time.years=ya.time.year.range,ya.time.years.utc=ya.time.year.utc.range,ya.time.day=Du(function(n){var t=new Zc(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ya.time.days=ya.time.day.range,ya.time.days.utc=ya.time.day.utc.range,ya.time.dayOfYear=function(n){var t=ya.time.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},Bc.forEach(function(n,t){n=n.toLowerCase(),t=7-t;var e=ya.time[n]=Du(function(n){return(n=ya.time.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ya.time.year(n).getDay();return Math.floor((ya.time.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ya.time[n+"s"]=e.range,ya.time[n+"s"].utc=e.utc.range,ya.time[n+"OfYear"]=function(n){var e=ya.time.year(n).getDay();return Math.floor((ya.time.dayOfYear(n)+(e+t)%7)/7)}}),ya.time.week=ya.time.sunday,ya.time.weeks=ya.time.sunday.range,ya.time.weeks.utc=ya.time.sunday.utc.range,ya.time.weekOfYear=ya.time.sundayOfYear,ya.time.format=function(n){function t(t){for(var r,i,u,a=[],o=-1,c=0;++o<e;)37===n.charCodeAt(o)&&(a.push(n.substring(c,o)),null!=(i=fl[r=n.charAt(++o)])&&(r=n.charAt(++o)),(u=hl[r])&&(r=u(t,null==i?"e"===r?" ":"0":i)),a.push(r),c=o+1);return a.push(n.substring(c,o)),a.join("")}var e=n.length;return t.parse=function(t){var e={y:1900,m:0,d:1,H:0,M:0,S:0,L:0},r=Lu(e,n,t,0);if(r!=t.length)return null;"p"in e&&(e.H=e.H%12+12*e.p);var i=new Zc;return"j"in e?i.setFullYear(e.y,0,e.j):"w"in e&&("W"in e||"U"in e)?(i.setFullYear(e.y,0,1),i.setFullYear(e.y,0,"W"in e?(e.w+6)%7+7*e.W-(i.getDay()+5)%7:e.w+7*e.U-(i.getDay()+6)%7)):i.setFullYear(e.y,e.m,e.d),i.setHours(e.H,e.M,e.S,e.L),i},t.toString=function(){return n},t};var el=Hu(Kc),rl=Fu(Kc),il=Hu(Qc),ul=Fu(Qc),al=Hu(nl),ol=Fu(nl),cl=Hu(tl),ll=Fu(tl),sl=/^%/,fl={"-":"",_:" ",0:"0"},hl={a:function(n){return Qc[n.getDay()]},A:function(n){return Kc[n.getDay()]},b:function(n){return tl[n.getMonth()]},B:function(n){return nl[n.getMonth()]},c:ya.time.format(Wc),d:function(n,t){return Pu(n.getDate(),t,2)},e:function(n,t){return Pu(n.getDate(),t,2)},H:function(n,t){return Pu(n.getHours(),t,2)},I:function(n,t){return Pu(n.getHours()%12||12,t,2)},j:function(n,t){return Pu(1+ya.time.dayOfYear(n),t,3)},L:function(n,t){return Pu(n.getMilliseconds(),t,3)},m:function(n,t){return Pu(n.getMonth()+1,t,2)},M:function(n,t){return Pu(n.getMinutes(),t,2)},p:function(n){return n.getHours()>=12?"PM":"AM"},S:function(n,t){return Pu(n.getSeconds(),t,2)},U:function(n,t){return Pu(ya.time.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Pu(ya.time.mondayOfYear(n),t,2)},x:ya.time.format(Jc),X:ya.time.format(Gc),y:function(n,t){return Pu(n.getFullYear()%100,t,2)},Y:function(n,t){return Pu(n.getFullYear()%1e4,t,4)},Z:aa,"%":function(){return"%"}},gl={a:Ou,A:Yu,b:Vu,B:Xu,c:Zu,d:Qu,e:Qu,H:ta,I:ta,j:na,L:ia,m:Ku,M:ea,p:ua,S:ra,U:Uu,w:Ru,W:Iu,x:Bu,X:$u,y:Ju,Y:Wu,"%":oa},pl=/^\s*\d+/,ml=ya.map({am:0,pm:1});ya.time.format.utc=function(n){function t(n){try{Zc=zu;var t=new Zc;return t._=n,e(t)}finally{Zc=Date}}var e=ya.time.format(n);return t.parse=function(n){try{Zc=zu;var t=e.parse(n);return t&&t._}finally{Zc=Date}},t.toString=e.toString,t};var dl=ya.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");ya.time.format.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?ca:dl,ca.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},ca.toString=dl.toString,ya.time.second=Du(function(n){return new Zc(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ya.time.seconds=ya.time.second.range,ya.time.seconds.utc=ya.time.second.utc.range,ya.time.minute=Du(function(n){return new Zc(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ya.time.minutes=ya.time.minute.range,ya.time.minutes.utc=ya.time.minute.utc.range,ya.time.hour=Du(function(n){var t=n.getTimezoneOffset()/60;return new Zc(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ya.time.hours=ya.time.hour.range,ya.time.hours.utc=ya.time.hour.utc.range,ya.time.month=Du(function(n){return n=ya.time.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ya.time.months=ya.time.month.range,ya.time.months.utc=ya.time.month.utc.range;var vl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],yl=[[ya.time.second,1],[ya.time.second,5],[ya.time.second,15],[ya.time.second,30],[ya.time.minute,1],[ya.time.minute,5],[ya.time.minute,15],[ya.time.minute,30],[ya.time.hour,1],[ya.time.hour,3],[ya.time.hour,6],[ya.time.hour,12],[ya.time.day,1],[ya.time.day,2],[ya.time.week,1],[ya.time.month,1],[ya.time.month,3],[ya.time.year,1]],Ml=[[ya.time.format("%Y"),Xt],[ya.time.format("%B"),function(n){return n.getMonth()}],[ya.time.format("%b %d"),function(n){return 1!=n.getDate()}],[ya.time.format("%a %d"),function(n){return n.getDay()&&1!=n.getDate()}],[ya.time.format("%I %p"),function(n){return n.getHours()}],[ya.time.format("%I:%M"),function(n){return n.getMinutes()}],[ya.time.format(":%S"),function(n){return n.getSeconds()}],[ya.time.format(".%L"),function(n){return n.getMilliseconds()}]],xl=ya.scale.linear(),bl=fa(Ml);yl.year=function(n,t){return xl.domain(n.map(ga)).ticks(t).map(ha)},ya.time.scale=function(){return la(ya.scale.linear(),yl,bl)};var _l=yl.map(function(n){return[n[0].utc,n[1]]}),wl=[[ya.time.format.utc("%Y"),Xt],[ya.time.format.utc("%B"),function(n){return n.getUTCMonth()}],[ya.time.format.utc("%b %d"),function(n){return 1!=n.getUTCDate()}],[ya.time.format.utc("%a %d"),function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],[ya.time.format.utc("%I %p"),function(n){return n.getUTCHours()}],[ya.time.format.utc("%I:%M"),function(n){return n.getUTCMinutes()}],[ya.time.format.utc(":%S"),function(n){return n.getUTCSeconds()}],[ya.time.format.utc(".%L"),function(n){return n.getUTCMilliseconds()}]],Sl=fa(wl);return _l.year=function(n,t){return xl.domain(n.map(ma)).ticks(t).map(pa)},ya.time.scale.utc=function(){return la(ya.scale.linear(),_l,Sl)},ya.text=dt(function(n){return n.responseText}),ya.json=function(n,t){return vt(n,"application/json",da,t)},ya.html=function(n,t){return vt(n,"text/html",va,t)},ya.xml=dt(function(n){return n.responseXML}),ya}();;
var Rickshaw={namespace:function(namespace,obj){var parts=namespace.split(".");var parent=Rickshaw;for(var i=1,length=parts.length;i<length;i++){var currentPart=parts[i];parent[currentPart]=parent[currentPart]||{};parent=parent[currentPart]}return parent},keys:function(obj){var keys=[];for(var key in obj)keys.push(key);return keys},extend:function(destination,source){for(var property in source){destination[property]=source[property]}return destination},clone:function(obj){return JSON.parse(JSON.stringify(obj))}};if(typeof module!=="undefined"&&module.exports){var d3=require("d3");module.exports=Rickshaw}(function(globalContext){var _toString=Object.prototype.toString,NULL_TYPE="Null",UNDEFINED_TYPE="Undefined",BOOLEAN_TYPE="Boolean",NUMBER_TYPE="Number",STRING_TYPE="String",OBJECT_TYPE="Object",FUNCTION_CLASS="[object Function]";function isFunction(object){return _toString.call(object)===FUNCTION_CLASS}function extend(destination,source){for(var property in source)if(source.hasOwnProperty(property))destination[property]=source[property];return destination}function keys(object){if(Type(object)!==OBJECT_TYPE){throw new TypeError}var results=[];for(var property in object){if(object.hasOwnProperty(property)){results.push(property)}}return results}function Type(o){switch(o){case null:return NULL_TYPE;case void 0:return UNDEFINED_TYPE}var type=typeof o;switch(type){case"boolean":return BOOLEAN_TYPE;case"number":return NUMBER_TYPE;case"string":return STRING_TYPE}return OBJECT_TYPE}function isUndefined(object){return typeof object==="undefined"}var slice=Array.prototype.slice;function argumentNames(fn){var names=fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g,"").replace(/\s+/g,"").split(",");return names.length==1&&!names[0]?[]:names}function wrap(fn,wrapper){var __method=fn;return function(){var a=update([bind(__method,this)],arguments);return wrapper.apply(this,a)}}function update(array,args){var arrayLength=array.length,length=args.length;while(length--)array[arrayLength+length]=args[length];return array}function merge(array,args){array=slice.call(array,0);return update(array,args)}function bind(fn,context){if(arguments.length<2&&isUndefined(arguments[0]))return this;var __method=fn,args=slice.call(arguments,2);return function(){var a=merge(args,arguments);return __method.apply(context,a)}}var emptyFunction=function(){};var Class=function(){var IS_DONTENUM_BUGGY=function(){for(var p in{toString:1}){if(p==="toString")return false}return true}();function subclass(){}function create(){var parent=null,properties=[].slice.apply(arguments);if(isFunction(properties[0]))parent=properties.shift();function klass(){this.initialize.apply(this,arguments)}extend(klass,Class.Methods);klass.superclass=parent;klass.subclasses=[];if(parent){subclass.prototype=parent.prototype;klass.prototype=new subclass;try{parent.subclasses.push(klass)}catch(e){}}for(var i=0,length=properties.length;i<length;i++)klass.addMethods(properties[i]);if(!klass.prototype.initialize)klass.prototype.initialize=emptyFunction;klass.prototype.constructor=klass;return klass}function addMethods(source){var ancestor=this.superclass&&this.superclass.prototype,properties=keys(source);if(IS_DONTENUM_BUGGY){if(source.toString!=Object.prototype.toString)properties.push("toString");if(source.valueOf!=Object.prototype.valueOf)properties.push("valueOf")}for(var i=0,length=properties.length;i<length;i++){var property=properties[i],value=source[property];if(ancestor&&isFunction(value)&&argumentNames(value)[0]=="$super"){var method=value;value=wrap(function(m){return function(){return ancestor[m].apply(this,arguments)}}(property),method);value.valueOf=bind(method.valueOf,method);value.toString=bind(method.toString,method)}this.prototype[property]=value}return this}return{create:create,Methods:{addMethods:addMethods}}}();if(globalContext.exports){globalContext.exports.Class=Class}else{globalContext.Class=Class}})(Rickshaw);Rickshaw.namespace("Rickshaw.Compat.ClassList");Rickshaw.Compat.ClassList=function(){if(typeof document!=="undefined"&&!("classList"in document.createElement("a"))){(function(view){"use strict";var classListProp="classList",protoProp="prototype",elemCtrProto=(view.HTMLElement||view.Element)[protoProp],objCtr=Object,strTrim=String[protoProp].trim||function(){return this.replace(/^\s+|\s+$/g,"")},arrIndexOf=Array[protoProp].indexOf||function(item){var i=0,len=this.length;for(;i<len;i++){if(i in this&&this[i]===item){return i}}return-1},DOMEx=function(type,message){this.name=type;this.code=DOMException[type];this.message=message},checkTokenAndGetIndex=function(classList,token){if(token===""){throw new DOMEx("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(token)){throw new DOMEx("INVALID_CHARACTER_ERR","String contains an invalid character")}return arrIndexOf.call(classList,token)},ClassList=function(elem){var trimmedClasses=strTrim.call(elem.className),classes=trimmedClasses?trimmedClasses.split(/\s+/):[],i=0,len=classes.length;for(;i<len;i++){this.push(classes[i])}this._updateClassName=function(){elem.className=this.toString()}},classListProto=ClassList[protoProp]=[],classListGetter=function(){return new ClassList(this)};DOMEx[protoProp]=Error[protoProp];classListProto.item=function(i){return this[i]||null};classListProto.contains=function(token){token+="";return checkTokenAndGetIndex(this,token)!==-1};classListProto.add=function(token){token+="";if(checkTokenAndGetIndex(this,token)===-1){this.push(token);this._updateClassName()}};classListProto.remove=function(token){token+="";var index=checkTokenAndGetIndex(this,token);if(index!==-1){this.splice(index,1);this._updateClassName()}};classListProto.toggle=function(token){token+="";if(checkTokenAndGetIndex(this,token)===-1){this.add(token)}else{this.remove(token)}};classListProto.toString=function(){return this.join(" ")};if(objCtr.defineProperty){var classListPropDesc={get:classListGetter,enumerable:true,configurable:true};try{objCtr.defineProperty(elemCtrProto,classListProp,classListPropDesc)}catch(ex){if(ex.number===-2146823252){classListPropDesc.enumerable=false;objCtr.defineProperty(elemCtrProto,classListProp,classListPropDesc)}}}else if(objCtr[protoProp].__defineGetter__){elemCtrProto.__defineGetter__(classListProp,classListGetter)}})(window)}};if(typeof RICKSHAW_NO_COMPAT!=="undefined"&&!RICKSHAW_NO_COMPAT||typeof RICKSHAW_NO_COMPAT==="undefined"){new Rickshaw.Compat.ClassList}Rickshaw.namespace("Rickshaw.Graph");Rickshaw.Graph=function(args){if(!args.element)throw"Rickshaw.Graph needs a reference to an element";this.element=args.element;this.series=args.series;this.defaults={interpolation:"cardinal",offset:"zero",min:undefined,max:undefined,preserve:false};Rickshaw.keys(this.defaults).forEach(function(k){this[k]=args[k]||this.defaults[k]},this);this.window={};this.updateCallbacks=[];var self=this;this.initialize=function(args){this.validateSeries(args.series);this.series.active=function(){return self.series.filter(function(s){return!s.disabled})};this.setSize({width:args.width,height:args.height});this.element.classList.add("rickshaw_graph");this.vis=d3.select(this.element).append("svg:svg").attr("width",this.width).attr("height",this.height);for(var name in Rickshaw.Graph.Renderer){if(!name||!Rickshaw.Graph.Renderer.hasOwnProperty(name))continue;var r=Rickshaw.Graph.Renderer[name];if(!r||!r.prototype||!r.prototype.render)continue;self.registerRenderer(new r({graph:self}))}this.setRenderer(args.renderer||"stack",args);this.discoverRange()};this.validateSeries=function(series){if(!Array.isArray(series)&&!(series instanceof Rickshaw.Series)){var seriesSignature=Object.prototype.toString.apply(series);throw"series is not an array: "+seriesSignature}var pointsCount;series.forEach(function(s){if(!(s instanceof Object)){throw"series element is not an object: "+s}if(!s.data){throw"series has no data: "+JSON.stringify(s)}if(!Array.isArray(s.data)){throw"series data is not an array: "+JSON.stringify(s.data)}var x=s.data[0].x;var y=s.data[0].y;if(typeof x!="number"||typeof y!="number"&&y!==null){throw"x and y properties of points should be numbers instead of "+typeof x+" and "+typeof y}if(s.data.length>=3){if(s.data[2].x<s.data[1].x||s.data[1].x<s.data[0].x||s.data[s.data.length-1].x<s.data[0].x){throw"series data needs to be sorted on x values for series name: "+s.name}}},this)};this.dataDomain=function(){var data=graph.series.map(function(s){return s.data});var min=d3.min(data.map(function(d){return d[0].x}));var max=d3.max(data.map(function(d){return d[d.length-1].x}));return[min,max]};this.discoverRange=function(){var domain=this.renderer.domain();this.x=d3.scale.linear().domain(domain.x).range([0,this.width]);this.y=d3.scale.linear().domain(domain.y).range([this.height,0]);this.y.magnitude=d3.scale.linear().domain([domain.y[0]-domain.y[0],domain.y[1]-domain.y[0]]).range([0,this.height])};this.render=function(){var stackedData=this.stackData();this.discoverRange();this.renderer.render();this.updateCallbacks.forEach(function(callback){callback()})};this.update=this.render;this.stackData=function(){var data=this.series.active().map(function(d){return d.data}).map(function(d){return d.filter(function(d){return this._slice(d)},this)},this);var preserve=this.preserve;if(!preserve){this.series.forEach(function(series){if(series.scale){preserve=true}})}data=preserve?Rickshaw.clone(data):data;this.series.active().forEach(function(series,index){if(series.scale){var seriesData=data[index];if(seriesData){seriesData.forEach(function(d){d.y=series.scale(d.y)})}}});this.stackData.hooks.data.forEach(function(entry){data=entry.f.apply(self,[data])});var stackedData;if(!this.renderer.unstack){this._validateStackable();var layout=d3.layout.stack();layout.offset(self.offset);stackedData=layout(data)}stackedData=stackedData||data;this.stackData.hooks.after.forEach(function(entry){stackedData=entry.f.apply(self,[data])});var i=0;this.series.forEach(function(series){if(series.disabled)return;series.stack=stackedData[i++]});this.stackedData=stackedData;return stackedData};this._validateStackable=function(){var series=this.series;var pointsCount;series.forEach(function(s){pointsCount=pointsCount||s.data.length;if(pointsCount&&s.data.length!=pointsCount){throw"stacked series cannot have differing numbers of points: "+pointsCount+" vs "+s.data.length+"; see Rickshaw.Series.fill()"}},this)};this.stackData.hooks={data:[],after:[]};this._slice=function(d){if(this.window.xMin||this.window.xMax){var isInRange=true;if(this.window.xMin&&d.x<this.window.xMin)isInRange=false;if(this.window.xMax&&d.x>this.window.xMax)isInRange=false;return isInRange}return true};this.onUpdate=function(callback){this.updateCallbacks.push(callback)};this.registerRenderer=function(renderer){this._renderers=this._renderers||{};this._renderers[renderer.name]=renderer};this.configure=function(args){if(args.width||args.height){this.setSize(args)}Rickshaw.keys(this.defaults).forEach(function(k){this[k]=k in args?args[k]:k in this?this[k]:this.defaults[k]},this);this.setRenderer(args.renderer||this.renderer.name,args)};this.setRenderer=function(r,args){if(typeof r=="function"){this.renderer=new r({graph:self});this.registerRenderer(this.renderer)}else{if(!this._renderers[r]){throw"couldn't find renderer "+r}this.renderer=this._renderers[r]}if(typeof args=="object"){this.renderer.configure(args)}};this.setSize=function(args){args=args||{};if(typeof window!==undefined){var style=window.getComputedStyle(this.element,null);var elementWidth=parseInt(style.getPropertyValue("width"),10);var elementHeight=parseInt(style.getPropertyValue("height"),10)}this.width=args.width||elementWidth||400;this.height=args.height||elementHeight||250;this.vis&&this.vis.attr("width",this.width).attr("height",this.height)};this.initialize(args)};Rickshaw.namespace("Rickshaw.Fixtures.Color");Rickshaw.Fixtures.Color=function(){this.schemes={};this.schemes.spectrum14=["#ecb796","#dc8f70","#b2a470","#92875a","#716c49","#d2ed82","#bbe468","#a1d05d","#e7cbe6","#d8aad6","#a888c2","#9dc2d3","#649eb9","#387aa3"].reverse();this.schemes.spectrum2000=["#57306f","#514c76","#646583","#738394","#6b9c7d","#84b665","#a7ca50","#bfe746","#e2f528","#fff726","#ecdd00","#d4b11d","#de8800","#de4800","#c91515","#9a0000","#7b0429","#580839","#31082b"];this.schemes.spectrum2001=["#2f243f","#3c2c55","#4a3768","#565270","#6b6b7c","#72957f","#86ad6e","#a1bc5e","#b8d954","#d3e04e","#ccad2a","#cc8412","#c1521d","#ad3821","#8a1010","#681717","#531e1e","#3d1818","#320a1b"];this.schemes.classic9=["#423d4f","#4a6860","#848f39","#a2b73c","#ddcb53","#c5a32f","#7d5836","#963b20","#7c2626","#491d37","#2f254a"].reverse();this.schemes.httpStatus={503:"#ea5029",502:"#d23f14",500:"#bf3613",410:"#efacea",409:"#e291dc",403:"#f457e8",408:"#e121d2",401:"#b92dae",405:"#f47ceb",404:"#a82a9f",400:"#b263c6",301:"#6fa024",302:"#87c32b",307:"#a0d84c",304:"#28b55c",200:"#1a4f74",206:"#27839f",201:"#52adc9",202:"#7c979f",203:"#a5b8bd",204:"#c1cdd1"};this.schemes.colorwheel=["#b5b6a9","#858772","#785f43","#96557e","#4682b4","#65b9ac","#73c03a","#cb513a"].reverse();this.schemes.cool=["#5e9d2f","#73c03a","#4682b4","#7bc3b8","#a9884e","#c1b266","#a47493","#c09fb5"];this.schemes.munin=["#00cc00","#0066b3","#ff8000","#ffcc00","#330099","#990099","#ccff00","#ff0000","#808080","#008f00","#00487d","#b35a00","#b38f00","#6b006b","#8fb300","#b30000","#bebebe","#80ff80","#80c9ff","#ffc080","#ffe680","#aa80ff","#ee00cc","#ff8080","#666600","#ffbfff","#00ffcc","#cc6699","#999900"]};Rickshaw.namespace("Rickshaw.Fixtures.RandomData");Rickshaw.Fixtures.RandomData=function(timeInterval){var addData;timeInterval=timeInterval||1;var lastRandomValue=200;var timeBase=Math.floor((new Date).getTime()/1e3);this.addData=function(data){var randomValue=Math.random()*100+15+lastRandomValue;var index=data[0].length;var counter=1;data.forEach(function(series){var randomVariance=Math.random()*20;var v=randomValue/25+counter++ +(Math.cos(index*counter*11/960)+2)*15+(Math.cos(index/7)+2)*7+(Math.cos(index/17)+2)*1;series.push({x:index*timeInterval+timeBase,y:v+randomVariance})});lastRandomValue=randomValue*.85};this.removeData=function(data){data.forEach(function(series){series.shift()});timeBase+=timeInterval}};Rickshaw.namespace("Rickshaw.Fixtures.Time");Rickshaw.Fixtures.Time=function(){var tzOffset=(new Date).getTimezoneOffset()*60;var self=this;this.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];this.units=[{name:"decade",seconds:86400*365.25*10,formatter:function(d){return parseInt(d.getUTCFullYear()/10,10)*10}},{name:"year",seconds:86400*365.25,formatter:function(d){return d.getUTCFullYear()}},{name:"month",seconds:86400*30.5,formatter:function(d){return self.months[d.getUTCMonth()]}},{name:"week",seconds:86400*7,formatter:function(d){return self.formatDate(d)}},{name:"day",seconds:86400,formatter:function(d){return d.getUTCDate()}},{name:"6 hour",seconds:3600*6,formatter:function(d){return self.formatTime(d)}},{name:"hour",seconds:3600,formatter:function(d){return self.formatTime(d)}},{name:"15 minute",seconds:60*15,formatter:function(d){return self.formatTime(d)}},{name:"minute",seconds:60,formatter:function(d){return d.getUTCMinutes()}},{name:"15 second",seconds:15,formatter:function(d){return d.getUTCSeconds()+"s"}},{name:"second",seconds:1,formatter:function(d){return d.getUTCSeconds()+"s"}}];this.unit=function(unitName){return this.units.filter(function(unit){return unitName==unit.name}).shift()};this.formatDate=function(d){return d3.time.format("%b %e")(d)};this.formatTime=function(d){return d.toUTCString().match(/(\d+:\d+):/)[1]};this.ceil=function(time,unit){var nearFuture;var rounded;if(unit.name=="month"){nearFuture=new Date((time+unit.seconds-1)*1e3);rounded=new Date(0);rounded.setUTCFullYear(nearFuture.getUTCFullYear());rounded.setUTCMonth(nearFuture.getUTCMonth());rounded.setUTCDate(1);rounded.setUTCHours(0);rounded.setUTCMinutes(0);rounded.setUTCSeconds(0);rounded.setUTCMilliseconds(0);return rounded.getTime()/1e3}if(unit.name=="year"){nearFuture=new Date((time+unit.seconds-1)*1e3);rounded=new Date(0);rounded.setUTCFullYear(nearFuture.getUTCFullYear());rounded.setUTCMonth(0);rounded.setUTCDate(1);rounded.setUTCHours(0);rounded.setUTCMinutes(0);rounded.setUTCSeconds(0);rounded.setUTCMilliseconds(0);return rounded.getTime()/1e3}return Math.ceil(time/unit.seconds)*unit.seconds}};Rickshaw.namespace("Rickshaw.Fixtures.Time.Local");Rickshaw.Fixtures.Time.Local=function(){var tzOffset=(new Date).getTimezoneOffset()*60;var self=this;this.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];this.units=[{name:"decade",seconds:86400*365.25*10,formatter:function(d){return parseInt(d.getFullYear()/10,10)*10}},{name:"year",seconds:86400*365.25,formatter:function(d){return d.getFullYear()}},{name:"month",seconds:86400*30.5,formatter:function(d){return self.months[d.getMonth()]}},{name:"week",seconds:86400*7,formatter:function(d){return self.formatDate(d)}},{name:"day",seconds:86400,formatter:function(d){return d.getDate()}},{name:"6 hour",seconds:3600*6,formatter:function(d){return self.formatTime(d)}},{name:"hour",seconds:3600,formatter:function(d){return self.formatTime(d)}},{name:"15 minute",seconds:60*15,formatter:function(d){return self.formatTime(d)}},{name:"minute",seconds:60,formatter:function(d){return d.getMinutes()}},{name:"15 second",seconds:15,formatter:function(d){return d.getSeconds()+"s"}},{name:"second",seconds:1,formatter:function(d){return d.getSeconds()+"s"}}];this.unit=function(unitName){return this.units.filter(function(unit){return unitName==unit.name}).shift()};this.formatDate=function(d){return d3.time.format("%b %e")(d)};this.formatTime=function(d){return d.toString().match(/(\d+:\d+):/)[1]};this.ceil=function(time,unit){var nearFuture;var rounded;if(unit.name=="day"){nearFuture=new Date((time+unit.seconds-1)*1e3);rounded=new Date(0);rounded.setMilliseconds(0);rounded.setSeconds(0);rounded.setMinutes(0);rounded.setHours(0);rounded.setDate(nearFuture.getDate());rounded.setMonth(nearFuture.getMonth());rounded.setFullYear(nearFuture.getFullYear());return rounded.getTime()/1e3}if(unit.name=="month"){nearFuture=new Date((time+unit.seconds-1)*1e3);rounded=new Date(0);rounded.setMilliseconds(0);rounded.setSeconds(0);rounded.setMinutes(0);rounded.setHours(0);rounded.setDate(1);rounded.setMonth(nearFuture.getMonth());rounded.setFullYear(nearFuture.getFullYear());return rounded.getTime()/1e3}if(unit.name=="year"){nearFuture=new Date((time+unit.seconds-1)*1e3);rounded=new Date(0);rounded.setFullYear(nearFuture.getFullYear());rounded.setMilliseconds(0);rounded.setSeconds(0);rounded.setMinutes(0);rounded.setHours(0);rounded.setDate(1);rounded.setMonth(0);return rounded.getTime()/1e3}return Math.ceil(time/unit.seconds)*unit.seconds}};Rickshaw.namespace("Rickshaw.Fixtures.Number");Rickshaw.Fixtures.Number.formatKMBT=function(y){var abs_y=Math.abs(y);if(abs_y>=1e12){return y/1e12+"T"}else if(abs_y>=1e9){return y/1e9+"B"}else if(abs_y>=1e6){return y/1e6+"M"}else if(abs_y>=1e3){return y/1e3+"K"}else if(abs_y<1&&y>0){return y.toFixed(2)}else if(abs_y===0){return""}else{return y}};Rickshaw.Fixtures.Number.formatBase1024KMGTP=function(y){var abs_y=Math.abs(y);if(abs_y>=0x4000000000000){return y/0x4000000000000+"P"}else if(abs_y>=1099511627776){return y/1099511627776+"T"}else if(abs_y>=1073741824){return y/1073741824+"G"}else if(abs_y>=1048576){return y/1048576+"M"}else if(abs_y>=1024){return y/1024+"K"}else if(abs_y<1&&y>0){return y.toFixed(2)}else if(abs_y===0){return""}else{return y}};Rickshaw.namespace("Rickshaw.Color.Palette");Rickshaw.Color.Palette=function(args){var color=new Rickshaw.Fixtures.Color;args=args||{};this.schemes={};this.scheme=color.schemes[args.scheme]||args.scheme||color.schemes.colorwheel;this.runningIndex=0;this.generatorIndex=0;if(args.interpolatedStopCount){var schemeCount=this.scheme.length-1;var i,j,scheme=[];for(i=0;i<schemeCount;i++){scheme.push(this.scheme[i]);var generator=d3.interpolateHsl(this.scheme[i],this.scheme[i+1]);for(j=1;j<args.interpolatedStopCount;j++){scheme.push(generator(1/args.interpolatedStopCount*j))}}scheme.push(this.scheme[this.scheme.length-1]);this.scheme=scheme}this.rotateCount=this.scheme.length;this.color=function(key){return this.scheme[key]||this.scheme[this.runningIndex++]||this.interpolateColor()||"#808080"};this.interpolateColor=function(){if(!Array.isArray(this.scheme))return;var color;if(this.generatorIndex==this.rotateCount*2-1){color=d3.interpolateHsl(this.scheme[this.generatorIndex],this.scheme[0])(.5);this.generatorIndex=0;this.rotateCount*=2}else{color=d3.interpolateHsl(this.scheme[this.generatorIndex],this.scheme[this.generatorIndex+1])(.5);this.generatorIndex++}this.scheme.push(color);return color}};Rickshaw.namespace("Rickshaw.Graph.Ajax");Rickshaw.Graph.Ajax=Rickshaw.Class.create({initialize:function(args){this.dataURL=args.dataURL;this.onData=args.onData||function(d){return d};this.onComplete=args.onComplete||function(){};this.onError=args.onError||function(){};this.args=args;this.request()},request:function(){$.ajax({url:this.dataURL,dataType:"json",success:this.success.bind(this),error:this.error.bind(this)})},error:function(){console.log("error loading dataURL: "+this.dataURL);this.onError(this)},success:function(data,status){data=this.onData(data);this.args.series=this._splice({data:data,series:this.args.series});this.graph=this.graph||new Rickshaw.Graph(this.args);this.graph.render();this.onComplete(this)},_splice:function(args){var data=args.data;var series=args.series;if(!args.series)return data;series.forEach(function(s){var seriesKey=s.key||s.name;if(!seriesKey)throw"series needs a key or a name";data.forEach(function(d){var dataKey=d.key||d.name;if(!dataKey)throw"data needs a key or a name";if(seriesKey==dataKey){var properties=["color","name","data"];properties.forEach(function(p){if(d[p])s[p]=d[p]})}})});return series}});Rickshaw.namespace("Rickshaw.Graph.Annotate");Rickshaw.Graph.Annotate=function(args){var graph=this.graph=args.graph;this.elements={timeline:args.element};var self=this;this.data={};this.elements.timeline.classList.add("rickshaw_annotation_timeline");this.add=function(time,content,end_time){self.data[time]=self.data[time]||{boxes:[]};self.data[time].boxes.push({content:content,end:end_time})};this.update=function(){Rickshaw.keys(self.data).forEach(function(time){var annotation=self.data[time];var left=self.graph.x(time);if(left<0||left>self.graph.x.range()[1]){if(annotation.element){annotation.line.classList.add("offscreen");annotation.element.style.display="none"}annotation.boxes.forEach(function(box){if(box.rangeElement)box.rangeElement.classList.add("offscreen")});return}if(!annotation.element){var element=annotation.element=document.createElement("div");element.classList.add("annotation");this.elements.timeline.appendChild(element);element.addEventListener("click",function(e){element.classList.toggle("active");annotation.line.classList.toggle("active");annotation.boxes.forEach(function(box){if(box.rangeElement)box.rangeElement.classList.toggle("active")})},false)}annotation.element.style.left=left+"px";annotation.element.style.display="block";annotation.boxes.forEach(function(box){var element=box.element;if(!element){element=box.element=document.createElement("div");element.classList.add("content");element.innerHTML=box.content;annotation.element.appendChild(element);annotation.line=document.createElement("div");annotation.line.classList.add("annotation_line");self.graph.element.appendChild(annotation.line);if(box.end){box.rangeElement=document.createElement("div");box.rangeElement.classList.add("annotation_range");self.graph.element.appendChild(box.rangeElement)}}if(box.end){var annotationRangeStart=left;var annotationRangeEnd=Math.min(self.graph.x(box.end),self.graph.x.range()[1]);if(annotationRangeStart>annotationRangeEnd){annotationRangeEnd=left;annotationRangeStart=Math.max(self.graph.x(box.end),self.graph.x.range()[0])}var annotationRangeWidth=annotationRangeEnd-annotationRangeStart;box.rangeElement.style.left=annotationRangeStart+"px";box.rangeElement.style.width=annotationRangeWidth+"px";box.rangeElement.classList.remove("offscreen")}annotation.line.classList.remove("offscreen");annotation.line.style.left=left+"px"})},this)};this.graph.onUpdate(function(){self.update()})};Rickshaw.namespace("Rickshaw.Graph.Axis.Time");Rickshaw.Graph.Axis.Time=function(args){var self=this;this.graph=args.graph;this.elements=[];this.ticksTreatment=args.ticksTreatment||"plain";this.fixedTimeUnit=args.timeUnit;var time=args.timeFixture||new Rickshaw.Fixtures.Time;this.appropriateTimeUnit=function(){var unit;var units=time.units;var domain=this.graph.x.domain();var rangeSeconds=domain[1]-domain[0];units.forEach(function(u){if(Math.floor(rangeSeconds/u.seconds)>=2){unit=unit||u}});return unit||time.units[time.units.length-1]};this.tickOffsets=function(){var domain=this.graph.x.domain();var unit=this.fixedTimeUnit||this.appropriateTimeUnit();var count=Math.ceil((domain[1]-domain[0])/unit.seconds);var runningTick=domain[0];var offsets=[];for(var i=0;i<count;i++){var tickValue=time.ceil(runningTick,unit);runningTick=tickValue+unit.seconds/2;offsets.push({value:tickValue,unit:unit})}return offsets};this.render=function(){this.elements.forEach(function(e){e.parentNode.removeChild(e)});this.elements=[];var offsets=this.tickOffsets();offsets.forEach(function(o){if(self.graph.x(o.value)>self.graph.x.range()[1])return;var element=document.createElement("div");element.style.left=self.graph.x(o.value)+"px";element.classList.add("x_tick");element.classList.add(self.ticksTreatment);var title=document.createElement("div");title.classList.add("title");title.innerHTML=o.unit.formatter(new Date(o.value*1e3));element.appendChild(title);self.graph.element.appendChild(element);self.elements.push(element)})};this.graph.onUpdate(function(){self.render()})};Rickshaw.namespace("Rickshaw.Graph.Axis.X");Rickshaw.Graph.Axis.X=function(args){var self=this;var berthRate=.1;this.initialize=function(args){this.graph=args.graph;this.orientation=args.orientation||"top";this.pixelsPerTick=args.pixelsPerTick||75;if(args.ticks)this.staticTicks=args.ticks;this.tickSize=args.tickSize||4;this.ticksTreatment=args.ticksTreatment||"plain";if(args.element){this.element=args.element;this._discoverSize(args.element,args);this.vis=d3.select(args.element).append("svg:svg").attr("height",this.height).attr("width",this.width).attr("class","rickshaw_graph x_axis_d3");this.element=this.vis[0][0];this.element.style.position="relative";this.setSize({width:args.width,height:args.height})}else{this.vis=this.graph.vis}this.graph.onUpdate(function(){self.render()})};this.setSize=function(args){args=args||{};if(!this.element)return;this._discoverSize(this.element.parentNode,args);this.vis.attr("height",this.height).attr("width",this.width*(1+berthRate));var berth=Math.floor(this.width*berthRate/2);this.element.style.left=-1*berth+"px"};this.render=function(){if(this.graph.width!==this._renderWidth)this.setSize({auto:true});var axis=d3.svg.axis().scale(this.graph.x).orient(this.orientation);axis.tickFormat(args.tickFormat||function(x){return x});this.ticks=this.staticTicks||Math.floor(this.graph.width/this.pixelsPerTick);var berth=Math.floor(this.width*berthRate/2)||0;var transform;if(this.orientation=="top"){var yOffset=this.height||this.graph.height;transform="translate("+berth+","+yOffset+")"}else{transform="translate("+berth+", 0)"}if(this.element){this.vis.selectAll("*").remove()}this.vis.append("svg:g").attr("class",["x_ticks_d3",this.ticksTreatment].join(" ")).attr("transform",transform).call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize));var gridSize=(this.orientation=="bottom"?1:-1)*this.graph.height;this.graph.vis.append("svg:g").attr("class","x_grid_d3").call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(gridSize));this._renderHeight=this.graph.height};this._discoverSize=function(element,args){if(typeof window!=="undefined"){var style=window.getComputedStyle(element,null);var elementHeight=parseInt(style.getPropertyValue("height"),10);if(!args.auto){var elementWidth=parseInt(style.getPropertyValue("width"),10)}}this.width=(args.width||elementWidth||this.graph.width)*(1+berthRate);this.height=args.height||elementHeight||40};this.initialize(args)};Rickshaw.namespace("Rickshaw.Graph.Axis.Y");Rickshaw.Graph.Axis.Y=Rickshaw.Class.create({initialize:function(args){this.graph=args.graph;this.orientation=args.orientation||"right";this.pixelsPerTick=args.pixelsPerTick||75;if(args.ticks)this.staticTicks=args.ticks;this.tickSize=args.tickSize||4;this.ticksTreatment=args.ticksTreatment||"plain";this.tickFormat=args.tickFormat||function(y){return y};this.berthRate=.1;if(args.element){this.element=args.element;this.vis=d3.select(args.element).append("svg:svg").attr("class","rickshaw_graph y_axis");this.element=this.vis[0][0];this.element.style.position="relative";this.setSize({width:args.width,height:args.height})}else{this.vis=this.graph.vis}var self=this;this.graph.onUpdate(function(){self.render()})},setSize:function(args){args=args||{};if(!this.element)return;if(typeof window!=="undefined"){var style=window.getComputedStyle(this.element.parentNode,null);var elementWidth=parseInt(style.getPropertyValue("width"),10);if(!args.auto){var elementHeight=parseInt(style.getPropertyValue("height"),10)}}this.width=args.width||elementWidth||this.graph.width*this.berthRate;this.height=args.height||elementHeight||this.graph.height;this.vis.attr("width",this.width).attr("height",this.height*(1+this.berthRate));var berth=this.height*this.berthRate;if(this.orientation=="left"){this.element.style.top=-1*berth+"px"}},render:function(){if(this.graph.height!==this._renderHeight)this.setSize({auto:true});this.ticks=this.staticTicks||Math.floor(this.graph.height/this.pixelsPerTick);var axis=this._drawAxis(this.graph.y);this._drawGrid(axis);this._renderHeight=this.graph.height},_drawAxis:function(scale){var axis=d3.svg.axis().scale(scale).orient(this.orientation);axis.tickFormat(this.tickFormat);if(this.orientation=="left"){var berth=this.height*this.berthRate;var transform="translate("+this.width+", "+berth+")"}if(this.element){this.vis.selectAll("*").remove()}this.vis.append("svg:g").attr("class",["y_ticks",this.ticksTreatment].join(" ")).attr("transform",transform).call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize));return axis},_drawGrid:function(axis){var gridSize=(this.orientation=="right"?1:-1)*this.graph.width;this.graph.vis.append("svg:g").attr("class","y_grid").call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(gridSize))}});Rickshaw.namespace("Rickshaw.Graph.Axis.Y.Scaled");Rickshaw.Graph.Axis.Y.Scaled=Rickshaw.Class.create(Rickshaw.Graph.Axis.Y,{initialize:function($super,args){if(typeof args.scale==="undefined"){throw new Error("Scaled requires scale")}this.scale=args.scale;if(typeof args.grid==="undefined"){this.grid=true}else{this.grid=args.grid}$super(args)},_drawAxis:function($super,scale){var adjustedScale=this.scale.copy().range(scale.range());return $super(adjustedScale)},_drawGrid:function($super,axis){if(this.grid){$super(axis)}}});Rickshaw.namespace("Rickshaw.Graph.Behavior.Series.Highlight");Rickshaw.Graph.Behavior.Series.Highlight=function(args){this.graph=args.graph;this.legend=args.legend;var self=this;var colorSafe={};var activeLine=null;var disabledColor=args.disabledColor||function(seriesColor){return d3.interpolateRgb(seriesColor,d3.rgb("#d8d8d8"))(.8).toString()};this.addHighlightEvents=function(l){l.element.addEventListener("mouseover",function(e){if(activeLine)return;else activeLine=l;self.legend.lines.forEach(function(line,index){if(l===line){if(index>0&&self.graph.renderer.unstack&&(line.series.renderer?line.series.renderer.unstack:true)){var seriesIndex=self.graph.series.length-index-1;line.originalIndex=seriesIndex;
var series=self.graph.series.splice(seriesIndex,1)[0];self.graph.series.push(series)}return}colorSafe[line.series.name]=colorSafe[line.series.name]||line.series.color;line.series.color=disabledColor(line.series.color)});self.graph.update()},false);l.element.addEventListener("mouseout",function(e){if(!activeLine)return;else activeLine=null;self.legend.lines.forEach(function(line){if(l===line&&line.hasOwnProperty("originalIndex")){var series=self.graph.series.pop();self.graph.series.splice(line.originalIndex,0,series);delete line.originalIndex}if(colorSafe[line.series.name]){line.series.color=colorSafe[line.series.name]}});self.graph.update()},false)};if(this.legend){this.legend.lines.forEach(function(l){self.addHighlightEvents(l)})}};Rickshaw.namespace("Rickshaw.Graph.Behavior.Series.Order");Rickshaw.Graph.Behavior.Series.Order=function(args){this.graph=args.graph;this.legend=args.legend;var self=this;if(typeof window.$=="undefined"){throw"couldn't find jQuery at window.$"}if(typeof window.$.ui=="undefined"){throw"couldn't find jQuery UI at window.$.ui"}$(function(){$(self.legend.list).sortable({containment:"parent",tolerance:"pointer",update:function(event,ui){var series=[];$(self.legend.list).find("li").each(function(index,item){if(!item.series)return;series.push(item.series)});for(var i=self.graph.series.length-1;i>=0;i--){self.graph.series[i]=series.shift()}self.graph.update()}});$(self.legend.list).disableSelection()});this.graph.onUpdate(function(){var h=window.getComputedStyle(self.legend.element).height;self.legend.element.style.height=h})};Rickshaw.namespace("Rickshaw.Graph.Behavior.Series.Toggle");Rickshaw.Graph.Behavior.Series.Toggle=function(args){this.graph=args.graph;this.legend=args.legend;var self=this;this.addAnchor=function(line){var anchor=document.createElement("a");anchor.innerHTML="&#10004;";anchor.classList.add("action");line.element.insertBefore(anchor,line.element.firstChild);anchor.onclick=function(e){if(line.series.disabled){line.series.enable();line.element.classList.remove("disabled")}else{if(this.graph.series.filter(function(s){return!s.disabled}).length<=1)return;line.series.disable();line.element.classList.add("disabled")}}.bind(this);var label=line.element.getElementsByTagName("span")[0];label.onclick=function(e){var disableAllOtherLines=line.series.disabled;if(!disableAllOtherLines){for(var i=0;i<self.legend.lines.length;i++){var l=self.legend.lines[i];if(line.series===l.series){}else if(l.series.disabled){}else{disableAllOtherLines=true;break}}}if(disableAllOtherLines){line.series.enable();line.element.classList.remove("disabled");self.legend.lines.forEach(function(l){if(line.series===l.series){}else{l.series.disable();l.element.classList.add("disabled")}})}else{self.legend.lines.forEach(function(l){l.series.enable();l.element.classList.remove("disabled")})}}};if(this.legend){if(typeof $!="undefined"&&$(this.legend.list).sortable){$(this.legend.list).sortable({start:function(event,ui){ui.item.bind("no.onclick",function(event){event.preventDefault()})},stop:function(event,ui){setTimeout(function(){ui.item.unbind("no.onclick")},250)}})}this.legend.lines.forEach(function(l){self.addAnchor(l)})}this._addBehavior=function(){this.graph.series.forEach(function(s){s.disable=function(){if(self.graph.series.length<=1){throw"only one series left"}s.disabled=true;self.graph.update()};s.enable=function(){s.disabled=false;self.graph.update()}})};this._addBehavior();this.updateBehaviour=function(){this._addBehavior()}};Rickshaw.namespace("Rickshaw.Graph.HoverDetail");Rickshaw.Graph.HoverDetail=Rickshaw.Class.create({initialize:function(args){var graph=this.graph=args.graph;this.xFormatter=args.xFormatter||function(x){return new Date(x*1e3).toUTCString()};this.yFormatter=args.yFormatter||function(y){return y===null?y:y.toFixed(2)};var element=this.element=document.createElement("div");element.className="detail";this.visible=true;graph.element.appendChild(element);this.lastEvent=null;this._addListeners();this.onShow=args.onShow;this.onHide=args.onHide;this.onRender=args.onRender;this.formatter=args.formatter||this.formatter},formatter:function(series,x,y,formattedX,formattedY,d){return series.name+":&nbsp;"+formattedY},update:function(e){e=e||this.lastEvent;if(!e)return;this.lastEvent=e;if(!e.target.nodeName.match(/^(path|svg|rect|circle)$/))return;var graph=this.graph;var eventX=e.offsetX||e.layerX;var eventY=e.offsetY||e.layerY;var j=0;var points=[];var nearestPoint;this.graph.series.active().forEach(function(series){var data=this.graph.stackedData[j++];if(!data.length)return;var domainX=graph.x.invert(eventX);var domainIndexScale=d3.scale.linear().domain([data[0].x,data.slice(-1)[0].x]).range([0,data.length-1]);var approximateIndex=Math.round(domainIndexScale(domainX));if(approximateIndex==data.length-1)approximateIndex--;var dataIndex=Math.min(approximateIndex||0,data.length-1);for(var i=approximateIndex;i<data.length-1;){if(!data[i]||!data[i+1])break;if(data[i].x<=domainX&&data[i+1].x>domainX){dataIndex=Math.abs(domainX-data[i].x)<Math.abs(domainX-data[i+1].x)?i:i+1;break}if(data[i+1].x<=domainX){i++}else{i--}}if(dataIndex<0)dataIndex=0;var value=data[dataIndex];var distance=Math.sqrt(Math.pow(Math.abs(graph.x(value.x)-eventX),2)+Math.pow(Math.abs(graph.y(value.y+value.y0)-eventY),2));var xFormatter=series.xFormatter||this.xFormatter;var yFormatter=series.yFormatter||this.yFormatter;var point={formattedXValue:xFormatter(value.x),formattedYValue:yFormatter(series.scale?series.scale.invert(value.y):value.y),series:series,value:value,distance:distance,order:j,name:series.name};if(!nearestPoint||distance<nearestPoint.distance){nearestPoint=point}points.push(point)},this);if(!nearestPoint)return;nearestPoint.active=true;var domainX=nearestPoint.value.x;var formattedXValue=nearestPoint.formattedXValue;this.element.innerHTML="";this.element.style.left=graph.x(domainX)+"px";this.visible&&this.render({points:points,detail:points,mouseX:eventX,mouseY:eventY,formattedXValue:formattedXValue,domainX:domainX})},hide:function(){this.visible=false;this.element.classList.add("inactive");if(typeof this.onHide=="function"){this.onHide()}},show:function(){this.visible=true;this.element.classList.remove("inactive");if(typeof this.onShow=="function"){this.onShow()}},render:function(args){var graph=this.graph;var points=args.points;var point=points.filter(function(p){return p.active}).shift();if(point.value.y===null)return;var formattedXValue=point.formattedXValue;var formattedYValue=point.formattedYValue;this.element.innerHTML="";this.element.style.left=graph.x(point.value.x)+"px";var xLabel=document.createElement("div");xLabel.className="x_label";xLabel.innerHTML=formattedXValue;this.element.appendChild(xLabel);var item=document.createElement("div");item.className="item";var series=point.series;var actualY=series.scale?series.scale.invert(point.value.y):point.value.y;item.innerHTML=this.formatter(series,point.value.x,actualY,formattedXValue,formattedYValue,point);item.style.top=this.graph.y(point.value.y0+point.value.y)+"px";this.element.appendChild(item);var dot=document.createElement("div");dot.className="dot";dot.style.top=item.style.top;dot.style.borderColor=series.color;this.element.appendChild(dot);if(point.active){item.className="item active";dot.className="dot active"}this.show();if(typeof this.onRender=="function"){this.onRender(args)}},_addListeners:function(){this.graph.element.addEventListener("mousemove",function(e){this.visible=true;this.update(e)}.bind(this),false);this.graph.onUpdate(function(){this.update()}.bind(this));this.graph.element.addEventListener("mouseout",function(e){if(e.relatedTarget&&!(e.relatedTarget.compareDocumentPosition(this.graph.element)&Node.DOCUMENT_POSITION_CONTAINS)){this.hide()}}.bind(this),false)}});Rickshaw.namespace("Rickshaw.Graph.JSONP");Rickshaw.Graph.JSONP=Rickshaw.Class.create(Rickshaw.Graph.Ajax,{request:function(){$.ajax({url:this.dataURL,dataType:"jsonp",success:this.success.bind(this),error:this.error.bind(this)})}});Rickshaw.namespace("Rickshaw.Graph.Legend");Rickshaw.Graph.Legend=function(args){var element=this.element=args.element;var graph=this.graph=args.graph;var self=this;element.classList.add("rickshaw_legend");var list=this.list=document.createElement("ul");element.appendChild(list);var series=graph.series.map(function(s){return s});if(!args.naturalOrder){series=series.reverse()}this.lines=[];this.addLine=function(series){var line=document.createElement("li");line.className="line";if(series.disabled){line.className+=" disabled"}var swatch=document.createElement("div");swatch.className="swatch";swatch.style.backgroundColor=series.color;line.appendChild(swatch);var label=document.createElement("span");label.className="label";label.innerHTML=series.name;line.appendChild(label);list.appendChild(line);line.series=series;if(series.noLegend){line.style.display="none"}var _line={element:line,series:series};if(self.shelving){self.shelving.addAnchor(_line);self.shelving.updateBehaviour()}if(self.highlighter){self.highlighter.addHighlightEvents(_line)}self.lines.push(_line)};series.forEach(function(s){self.addLine(s)});graph.onUpdate(function(){})};Rickshaw.namespace("Rickshaw.Graph.RangeSlider");Rickshaw.Graph.RangeSlider=Rickshaw.Class.create({initialize:function(args){var element=this.element=args.element;var graph=this.graph=args.graph;this.build();graph.onUpdate(function(){this.update()}.bind(this))},build:function(){var element=this.element;var graph=this.graph;var domain=graph.dataDomain();$(function(){$(element).slider({range:true,min:domain[0],max:domain[1],values:[domain[0],domain[1]],slide:function(event,ui){if(ui.values[1]<=ui.values[0])return;graph.window.xMin=ui.values[0];graph.window.xMax=ui.values[1];graph.update();var domain=graph.dataDomain();if(domain[0]==ui.values[0]){graph.window.xMin=undefined}if(domain[1]==ui.values[1]){graph.window.xMax=undefined}}})});element[0].style.width=graph.width+"px"},update:function(){var element=this.element;var graph=this.graph;var values=$(element).slider("option","values");var domain=graph.dataDomain();$(element).slider("option","min",domain[0]);$(element).slider("option","max",domain[1]);if(graph.window.xMin==null){values[0]=domain[0]}if(graph.window.xMax==null){values[1]=domain[1]}$(element).slider("option","values",values)}});Rickshaw.namespace("Rickshaw.Graph.Renderer");Rickshaw.Graph.Renderer=Rickshaw.Class.create({initialize:function(args){this.graph=args.graph;this.tension=args.tension||this.tension;this.graph.unstacker=this.graph.unstacker||new Rickshaw.Graph.Unstacker({graph:this.graph});this.configure(args)},seriesPathFactory:function(){},seriesStrokeFactory:function(){},defaults:function(){return{tension:.8,strokeWidth:2,unstack:true,padding:{top:.01,right:0,bottom:.01,left:0},stroke:false,fill:false}},domain:function(data){var stackedData=data||this.graph.stackedData||this.graph.stackData();var firstPoint=stackedData[0][0];if(firstPoint===undefined){return{x:[null,null],y:[null,null]}}var xMin=firstPoint.x;var xMax=firstPoint.x;var yMin=firstPoint.y+firstPoint.y0;var yMax=firstPoint.y+firstPoint.y0;stackedData.forEach(function(series){series.forEach(function(d){if(d.y==null)return;var y=d.y+d.y0;if(y<yMin)yMin=y;if(y>yMax)yMax=y});if(series[0].x<xMin)xMin=series[0].x;if(series[series.length-1].x>xMax)xMax=series[series.length-1].x});xMin-=(xMax-xMin)*this.padding.left;xMax+=(xMax-xMin)*this.padding.right;yMin=this.graph.min==="auto"?yMin:this.graph.min||0;yMax=this.graph.max===undefined?yMax:this.graph.max;if(this.graph.min==="auto"||yMin<0){yMin-=(yMax-yMin)*this.padding.bottom}if(this.graph.max===undefined){yMax+=(yMax-yMin)*this.padding.top}return{x:[xMin,xMax],y:[yMin,yMax]}},render:function(args){args=args||{};var graph=this.graph;var series=args.series||graph.series;var vis=args.vis||graph.vis;vis.selectAll("*").remove();var data=series.filter(function(s){return!s.disabled}).map(function(s){return s.stack});var nodes=vis.selectAll("path").data(data).enter().append("svg:path").attr("d",this.seriesPathFactory());var i=0;series.forEach(function(series){if(series.disabled)return;series.path=nodes[0][i++];this._styleSeries(series)},this)},_styleSeries:function(series){var fill=this.fill?series.color:"none";var stroke=this.stroke?series.color:"none";series.path.setAttribute("fill",fill);series.path.setAttribute("stroke",stroke);series.path.setAttribute("stroke-width",this.strokeWidth);series.path.setAttribute("class",series.className)},configure:function(args){args=args||{};Rickshaw.keys(this.defaults()).forEach(function(key){if(!args.hasOwnProperty(key)){this[key]=this[key]||this.graph[key]||this.defaults()[key];return}if(typeof this.defaults()[key]=="object"){Rickshaw.keys(this.defaults()[key]).forEach(function(k){this[key][k]=args[key][k]!==undefined?args[key][k]:this[key][k]!==undefined?this[key][k]:this.defaults()[key][k]},this)}else{this[key]=args[key]!==undefined?args[key]:this[key]!==undefined?this[key]:this.graph[key]!==undefined?this.graph[key]:this.defaults()[key]}},this)},setStrokeWidth:function(strokeWidth){if(strokeWidth!==undefined){this.strokeWidth=strokeWidth}},setTension:function(tension){if(tension!==undefined){this.tension=tension}}});Rickshaw.namespace("Rickshaw.Graph.Renderer.Line");Rickshaw.Graph.Renderer.Line=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"line",defaults:function($super){return Rickshaw.extend($super(),{unstack:true,fill:false,stroke:true})},seriesPathFactory:function(){var graph=this.graph;var factory=d3.svg.line().x(function(d){return graph.x(d.x)}).y(function(d){return graph.y(d.y)}).interpolate(this.graph.interpolation).tension(this.tension);factory.defined&&factory.defined(function(d){return d.y!==null});return factory}});Rickshaw.namespace("Rickshaw.Graph.Renderer.Stack");Rickshaw.Graph.Renderer.Stack=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"stack",defaults:function($super){return Rickshaw.extend($super(),{fill:true,stroke:false,unstack:false})},seriesPathFactory:function(){var graph=this.graph;var factory=d3.svg.area().x(function(d){return graph.x(d.x)}).y0(function(d){return graph.y(d.y0)}).y1(function(d){return graph.y(d.y+d.y0)}).interpolate(this.graph.interpolation).tension(this.tension);factory.defined&&factory.defined(function(d){return d.y!==null});return factory}});Rickshaw.namespace("Rickshaw.Graph.Renderer.Bar");Rickshaw.Graph.Renderer.Bar=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"bar",defaults:function($super){var defaults=Rickshaw.extend($super(),{gapSize:.05,unstack:false});delete defaults.tension;return defaults},initialize:function($super,args){args=args||{};this.gapSize=args.gapSize||this.gapSize;$super(args)},domain:function($super){var domain=$super();var frequentInterval=this._frequentInterval(this.graph.stackedData.slice(-1).shift());domain.x[1]+=Number(frequentInterval.magnitude);return domain},barWidth:function(series){var frequentInterval=this._frequentInterval(series.stack);var barWidth=this.graph.x(series.stack[0].x+frequentInterval.magnitude*(1-this.gapSize));return barWidth},render:function(args){args=args||{};var graph=this.graph;var series=args.series||graph.series;var vis=args.vis||graph.vis;vis.selectAll("*").remove();var barWidth=this.barWidth(series[0]);var barXOffset=0;var activeSeriesCount=series.filter(function(s){return!s.disabled}).length;var seriesBarWidth=this.unstack?barWidth/activeSeriesCount:barWidth;var transform=function(d){var matrix=[1,0,0,d.y<0?-1:1,0,d.y<0?graph.y.magnitude(Math.abs(d.y))*2:0];return"matrix("+matrix.join(",")+")"};series.forEach(function(series){if(series.disabled)return;var barWidth=this.barWidth(series);var nodes=vis.selectAll("path").data(series.stack.filter(function(d){return d.y!==null})).enter().append("svg:rect").attr("x",function(d){return graph.x(d.x)+barXOffset}).attr("y",function(d){return graph.y(d.y0+Math.abs(d.y))*(d.y<0?-1:1)}).attr("width",seriesBarWidth).attr("height",function(d){return graph.y.magnitude(Math.abs(d.y))}).attr("transform",transform);Array.prototype.forEach.call(nodes[0],function(n){n.setAttribute("fill",series.color)});if(this.unstack)barXOffset+=seriesBarWidth},this)},_frequentInterval:function(data){var intervalCounts={};for(var i=0;i<data.length-1;i++){var interval=data[i+1].x-data[i].x;intervalCounts[interval]=intervalCounts[interval]||0;intervalCounts[interval]++}var frequentInterval={count:0,magnitude:1};Rickshaw.keys(intervalCounts).forEach(function(i){if(frequentInterval.count<intervalCounts[i]){frequentInterval={count:intervalCounts[i],magnitude:i}}});return frequentInterval}});Rickshaw.namespace("Rickshaw.Graph.Renderer.Area");Rickshaw.Graph.Renderer.Area=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"area",defaults:function($super){return Rickshaw.extend($super(),{unstack:false,fill:false,stroke:false})},seriesPathFactory:function(){var graph=this.graph;var factory=d3.svg.area().x(function(d){return graph.x(d.x)}).y0(function(d){return graph.y(d.y0)}).y1(function(d){return graph.y(d.y+d.y0)}).interpolate(graph.interpolation).tension(this.tension);factory.defined&&factory.defined(function(d){return d.y!==null});return factory},seriesStrokeFactory:function(){var graph=this.graph;var factory=d3.svg.line().x(function(d){return graph.x(d.x)}).y(function(d){return graph.y(d.y+d.y0)}).interpolate(graph.interpolation).tension(this.tension);factory.defined&&factory.defined(function(d){return d.y!==null});return factory},render:function(){var graph=this.graph;graph.vis.selectAll("*").remove();var method=this.unstack?"append":"insert";var nodes=graph.vis.selectAll("path").data(this.graph.stackedData).enter()[method]("svg:g","g");nodes.append("svg:path").attr("d",this.seriesPathFactory()).attr("class","area");if(this.stroke){nodes.append("svg:path").attr("d",this.seriesStrokeFactory()).attr("class","line")}var i=0;graph.series.forEach(function(series){if(series.disabled)return;series.path=nodes[0][i++];this._styleSeries(series)},this)},_styleSeries:function(series){if(!series.path)return;d3.select(series.path).select(".area").attr("fill",series.color);if(this.stroke){d3.select(series.path).select(".line").attr("fill","none").attr("stroke",series.stroke||d3.interpolateRgb(series.color,"black")(.125)).attr("stroke-width",this.strokeWidth)}if(series.className){series.path.setAttribute("class",series.className)}}});Rickshaw.namespace("Rickshaw.Graph.Renderer.ScatterPlot");Rickshaw.Graph.Renderer.ScatterPlot=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"scatterplot",defaults:function($super){return Rickshaw.extend($super(),{unstack:true,fill:true,stroke:false,padding:{top:.01,right:.01,bottom:.01,left:.01},dotSize:4})},initialize:function($super,args){$super(args)},render:function(args){args=args||{};var graph=this.graph;var series=args.series||graph.series;var vis=args.vis||graph.vis;var dotSize=this.dotSize;vis.selectAll("*").remove();series.forEach(function(series){if(series.disabled)return;var nodes=vis.selectAll("path").data(series.stack.filter(function(d){return d.y!==null})).enter().append("svg:circle").attr("cx",function(d){return graph.x(d.x)}).attr("cy",function(d){return graph.y(d.y)}).attr("r",function(d){return"r"in d?d.r:dotSize});Array.prototype.forEach.call(nodes[0],function(n){n.setAttribute("fill",series.color)})},this)}});Rickshaw.namespace("Rickshaw.Graph.Renderer.Multi");Rickshaw.Graph.Renderer.Multi=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"multi",initialize:function($super,args){$super(args)},defaults:function($super){return Rickshaw.extend($super(),{unstack:true,fill:false,stroke:true})},domain:function($super){this.graph.stackData();var domains=[];var groups=this._groups();this._stack(groups);groups.forEach(function(group){var data=group.series.filter(function(s){return!s.disabled}).map(function(s){return s.stack});if(!data.length)return;var domain=$super(data);domains.push(domain)});var xMin=d3.min(domains.map(function(d){return d.x[0]}));var xMax=d3.max(domains.map(function(d){return d.x[1]}));var yMin=d3.min(domains.map(function(d){return d.y[0]}));var yMax=d3.max(domains.map(function(d){return d.y[1]}));return{x:[xMin,xMax],y:[yMin,yMax]}},_groups:function(){var graph=this.graph;var renderGroups={};graph.series.forEach(function(series){if(series.disabled)return;if(!renderGroups[series.renderer]){var ns="http://www.w3.org/2000/svg";var vis=document.createElementNS(ns,"g");graph.vis[0][0].appendChild(vis);var renderer=graph._renderers[series.renderer];renderGroups[series.renderer]={renderer:renderer,series:[],vis:d3.select(vis)}}renderGroups[series.renderer].series.push(series)},this);var groups=[];Object.keys(renderGroups).forEach(function(key){var group=renderGroups[key];groups.push(group)});return groups},_stack:function(groups){groups.forEach(function(group){var series=group.series.filter(function(series){return!series.disabled});var data=series.map(function(series){return series.stack});if(!group.renderer.unstack){var layout=d3.layout.stack();var stackedData=Rickshaw.clone(layout(data));series.forEach(function(series,index){series._stack=Rickshaw.clone(stackedData[index])})}},this);return groups},render:function(){this.graph.series.forEach(function(series){if(!series.renderer){throw new Error("Each series needs a renderer for graph 'multi' renderer")}});this.graph.vis.selectAll("*").remove();var groups=this._groups();groups=this._stack(groups);groups.forEach(function(group){var series=group.series.filter(function(series){return!series.disabled});group.renderer.render({series:series,vis:group.vis});series.forEach(function(s){s.stack=s._stack||s.stack||s.data})})}});Rickshaw.namespace("Rickshaw.Graph.Renderer.LinePlot");Rickshaw.Graph.Renderer.LinePlot=Rickshaw.Class.create(Rickshaw.Graph.Renderer,{name:"lineplot",defaults:function($super){return Rickshaw.extend($super(),{unstack:true,fill:false,stroke:true,padding:{top:.01,right:.01,bottom:.01,left:.01},dotSize:3,strokeWidth:2})},initialize:function($super,args){$super(args)},seriesPathFactory:function(){var graph=this.graph;var factory=d3.svg.line().x(function(d){return graph.x(d.x)}).y(function(d){return graph.y(d.y)}).interpolate(this.graph.interpolation).tension(this.tension);factory.defined&&factory.defined(function(d){return d.y!==null});return factory},_renderDots:function(){var graph=this.graph;graph.series.forEach(function(series){if(series.disabled)return;var nodes=graph.vis.selectAll("x").data(series.stack.filter(function(d){return d.y!==null})).enter().append("svg:circle").attr("cx",function(d){return graph.x(d.x)}).attr("cy",function(d){return graph.y(d.y)}).attr("r",function(d){return"r"in d?d.r:graph.renderer.dotSize});Array.prototype.forEach.call(nodes[0],function(n){if(!n)return;n.setAttribute("data-color",series.color);n.setAttribute("fill","white");n.setAttribute("stroke",series.color);n.setAttribute("stroke-width",this.strokeWidth)}.bind(this))},this)},_renderLines:function(){var graph=this.graph;var nodes=graph.vis.selectAll("path").data(this.graph.stackedData).enter().append("svg:path").attr("d",this.seriesPathFactory());var i=0;graph.series.forEach(function(series){if(series.disabled)return;series.path=nodes[0][i++];this._styleSeries(series)},this)},render:function(){var graph=this.graph;graph.vis.selectAll("*").remove();this._renderLines();this._renderDots()}});Rickshaw.namespace("Rickshaw.Graph.Smoother");Rickshaw.Graph.Smoother=Rickshaw.Class.create({initialize:function(args){this.graph=args.graph;this.element=args.element;this.aggregationScale=1;this.build();this.graph.stackData.hooks.data.push({name:"smoother",orderPosition:50,f:this.transformer.bind(this)})},build:function(){var self=this;if(this.element){$(function(){$(self.element).slider({min:1,max:100,slide:function(event,ui){self.setScale(ui.value);self.graph.update()}})})}},setScale:function(scale){if(scale<1){throw"scale out of range: "+scale}this.aggregationScale=scale;this.graph.update()},transformer:function(data){if(this.aggregationScale==1)return data;var aggregatedData=[];data.forEach(function(seriesData){var aggregatedSeriesData=[];while(seriesData.length){var avgX=0,avgY=0;var slice=seriesData.splice(0,this.aggregationScale);slice.forEach(function(d){avgX+=d.x/slice.length;avgY+=d.y/slice.length});aggregatedSeriesData.push({x:avgX,y:avgY})}aggregatedData.push(aggregatedSeriesData)}.bind(this));return aggregatedData}});Rickshaw.namespace("Rickshaw.Graph.Unstacker");Rickshaw.Graph.Unstacker=function(args){this.graph=args.graph;var self=this;this.graph.stackData.hooks.after.push({name:"unstacker",f:function(data){if(!self.graph.renderer.unstack)return data;data.forEach(function(seriesData){seriesData.forEach(function(d){d.y0=0})});return data}})};Rickshaw.namespace("Rickshaw.Series");Rickshaw.Series=Rickshaw.Class.create(Array,{initialize:function(data,palette,options){options=options||{};this.palette=new Rickshaw.Color.Palette(palette);this.timeBase=typeof options.timeBase==="undefined"?Math.floor((new Date).getTime()/1e3):options.timeBase;var timeInterval=typeof options.timeInterval=="undefined"?1e3:options.timeInterval;this.setTimeInterval(timeInterval);if(data&&typeof data=="object"&&Array.isArray(data)){data.forEach(function(item){this.addItem(item)},this)}},addItem:function(item){if(typeof item.name==="undefined"){throw"addItem() needs a name"}item.color=item.color||this.palette.color(item.name);item.data=item.data||[];if(item.data.length===0&&this.length&&this.getIndex()>0){this[0].data.forEach(function(plot){item.data.push({x:plot.x,y:0})})}else if(item.data.length===0){item.data.push({x:this.timeBase-(this.timeInterval||0),y:0})}this.push(item);if(this.legend){this.legend.addLine(this.itemByName(item.name))}},addData:function(data,x){var index=this.getIndex();Rickshaw.keys(data).forEach(function(name){if(!this.itemByName(name)){this.addItem({name:name})}},this);this.forEach(function(item){item.data.push({x:x||(index*this.timeInterval||1)+this.timeBase,y:data[item.name]||0})},this)},getIndex:function(){return this[0]&&this[0].data&&this[0].data.length?this[0].data.length:0},itemByName:function(name){for(var i=0;i<this.length;i++){if(this[i].name==name)return this[i]}},setTimeInterval:function(iv){this.timeInterval=iv/1e3},setTimeBase:function(t){this.timeBase=t},dump:function(){var data={timeBase:this.timeBase,timeInterval:this.timeInterval,items:[]};this.forEach(function(item){var newItem={color:item.color,name:item.name,data:[]};item.data.forEach(function(plot){newItem.data.push({x:plot.x,y:plot.y})});data.items.push(newItem)});return data},load:function(data){if(data.timeInterval){this.timeInterval=data.timeInterval}if(data.timeBase){this.timeBase=data.timeBase}if(data.items){data.items.forEach(function(item){this.push(item);if(this.legend){this.legend.addLine(this.itemByName(item.name))}},this)}}});Rickshaw.Series.zeroFill=function(series){Rickshaw.Series.fill(series,0)};Rickshaw.Series.fill=function(series,fill){var x;var i=0;var data=series.map(function(s){return s.data});while(i<Math.max.apply(null,data.map(function(d){return d.length}))){x=Math.min.apply(null,data.filter(function(d){return d[i]}).map(function(d){return d[i].x}));data.forEach(function(d){if(!d[i]||d[i].x!=x){d.splice(i,0,{x:x,y:fill})}});i++}};Rickshaw.namespace("Rickshaw.Series.FixedDuration");Rickshaw.Series.FixedDuration=Rickshaw.Class.create(Rickshaw.Series,{initialize:function(data,palette,options){options=options||{};if(typeof options.timeInterval==="undefined"){throw new Error("FixedDuration series requires timeInterval")}if(typeof options.maxDataPoints==="undefined"){throw new Error("FixedDuration series requires maxDataPoints")}this.palette=new Rickshaw.Color.Palette(palette);this.timeBase=typeof options.timeBase==="undefined"?Math.floor((new Date).getTime()/1e3):options.timeBase;this.setTimeInterval(options.timeInterval);if(this[0]&&this[0].data&&this[0].data.length){this.currentSize=this[0].data.length;this.currentIndex=this[0].data.length}else{this.currentSize=0;this.currentIndex=0}this.maxDataPoints=options.maxDataPoints;if(data&&typeof data=="object"&&Array.isArray(data)){data.forEach(function(item){this.addItem(item)},this);this.currentSize+=1;this.currentIndex+=1}this.timeBase-=(this.maxDataPoints-this.currentSize)*this.timeInterval;if(typeof this.maxDataPoints!=="undefined"&&this.currentSize<this.maxDataPoints){for(var i=this.maxDataPoints-this.currentSize-1;i>0;i--){this.currentSize+=1;this.currentIndex+=1;this.forEach(function(item){item.data.unshift({x:((i-1)*this.timeInterval||1)+this.timeBase,y:0,i:i})},this)}}},addData:function($super,data){$super(data);this.currentSize+=1;this.currentIndex+=1;if(this.maxDataPoints!==undefined){while(this.currentSize>this.maxDataPoints){this.dropData()}}},dropData:function(){this.forEach(function(item){item.data.splice(0,1)});this.currentSize-=1},getIndex:function(){return this.currentIndex}});;
function buildChart(chart, seriesData) {
    // data: Lists of sensor data (each list is a list of values)
    var colors = ['red', 'green', 'blue'];
    var graph = new Rickshaw.Graph({
        element: chart[0],
        renderer: 'line',
        width: $(window).width() - 69,
        height: 200,
        series: seriesData
    });
    graph.render();
    var hoverDetail = new Rickshaw.Graph.HoverDetail({graph: graph});
    return graph;
}
function sensorLatest(sensors, type) {
    return _.last(_.filter(sensors, function (x) {
        return x.type == type;
    }));
}

function biosScriptUrl(x) {
    return document.URL + 'playground/' + x;
}

function createQR(WSUrl) {
    createKey("ws", function (x) {glassSecret = x; $('#qr').html(Mustache.render('<div class="col-md-9"><pre>adb shell \"mkdir -p /sdcard/wearscript && echo \'{{url}}\' > /sdcard/wearscript/qr.txt\"</pre></div><img src="https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl={{url}}&chld=H|4&choe=UTF-8"\>', {url: WSUrl + '/ws/' + x}))}, function () {alert("Could not get ws.  Are you whitelisted on this server?  See the docs for details.")});
}

function pingStatus() {
    var allTimedOut = _.every(_.map($('.pingLabel'), function (x) {
        if ((new Date).getTime() - Number($(x).attr('updateTime')) > 4000) {
            $(x).removeClass('label-success').addClass('label-danger');
            return true;
        }
        return false;
    }));
    _.delay(pingStatus, 500);
}

function lambda(command) {
    ws.send(enc(['lambda', command]));
}

function enc(data) {
    var data_enc = msgpack.pack(data);
    var data_out = new Uint8Array(data_enc.length);
    var i;
    for (i = 0; i < data_enc.length; i++) {
        data_out[i] = data_enc[i];
    }
    return data_out;
}

function connectWebsocket(WSUrl) {
    var url = WSUrl + "/ws";
    console.log('Connecting: ' + url);
    websocket = new ReconnectingWebSocket(url)
    websocket.onopen = function () {
	console.log('checking')
	subscription_cb();
	ws.subscribe('subscriptions', subscription_cb);
    }
    var ws = new WearScriptConnection(websocket, "playground", "0");
    function subscription_cb() {
	if (!ws.exists('glass'))
            $(".scriptel").prop('disabled', true);
        else
            $(".scriptel").prop('disabled', false);
    }
    return ws;
}

function connectOld() {    
    ws.onopen = function () {
        pingStatus();
        function receiveMessage(event) {
            // TODO(brandyn): Check source! (security hazard)
            console.log(event.data);
            var eventData = msgpack.unpack(event.data);
            if (eventData[0] === 'widgetHeight') {
                $('#iframe').attr('height', Number(eventData[1]) + 'px')
            } else {
                ws.send(event.data);
            }
        }
        window.addEventListener("message", receiveMessage, false);
    }
    ws.onclose = function () {
    }
    ws.onmessage = function (event) {
        //var response = JSON.parse(event.data);
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            debug_data = reader.result;
            if (_.has(window, 'iframeWindow')) {
                iframeWindow.postMessage(reader.result, iframeHost);
            }
            var response = msgpack.unpack(reader.result);
            debug_response = response;
            var action = response[0];
            if (action == "version") {
                var version = 0;
                if (response[1] != version) {
                    alert('Incompatible server version: ' + response[1] + ' Expected: ' + version + '.  Bad things may happen...');
                }
            } else if (action == "log") {
                console.log(response[1]);
            } else if (action == 'connections') {
                if (response[1] == 0)
                    $(".scriptel").prop('disabled', true);
                else
                    $(".scriptel").prop('disabled', false);
            } else if (action == 'signScript') {
                var data = JSON.stringify({"public": false, "files": {"wearscript.html": {"content": response[1]}}});
                $.post('https://api.github.com/gists', data, function (result) {console.log(result);$('#script-url').val(result.files['wearscript.html'].raw_url)});
            } else if (action == 'blob') {
                if (_.has(blobHandlers, response[1]))
                    blobHandlers[response[1]](response[2]);
            } else if (action.slice(0, 5) == 'gist_') {
                var cb = gistCallbacks[action];
                if (!_.isUndefined(cb)) {
                    cb(JSON.parse(response[1]));
                }
            } else if (action == "sensors" || action == "image" || action == "pongStatus") {
                var glassID = response[1];
                if (!_.has(glassIdToNum, glassID)) {
                    var glassNum = _.uniqueId('glass-');
                    var cubet = '<div class="ccontainer"><div class="cube"><figure class="front">1</figure><figure class="back">2</figure><figure class="right">3</figure><figure class="left">4</figure><figure class="top">5</figure><figure class="bottom">6</figure></div>'

                    $('#glasses').append(Mustache.render('<div id="{{glassID}}"><img class="image" \><div class="times"></div><div class="charts"></div><span class="pingLabel label label-success" updateTime="{{time}}">Status</span><div class="panel panel-default"><div class="panel-heading">Sensor Values</div><table class="table"><thead><tr><th>#</th><th>Name</th><th>Time</th><th>Values</th><th>Actions</th></tr></thead><tbody class="sensor-data"></tbody></table></div>{{{cube}}}</div>', {glassID: glassNum, cube: cubet, time: (new Date).getTime()}));
                    glassIdToNum[glassID] = glassNum;
	                graphs[glassID] = {};
                }
                var $glass = $('#' + glassIdToNum[glassID]);
                $glass.find('.pingLabel').removeClass('label-danger').addClass('label-success').attr('updateTime', (new Date).getTime());

                if (action == "image") {
                    $glass.find('.image').attr('src', 'data:image/jpeg;base64,' + btoa(response[3]));
                }
                if (action == "sensors") {
                    response_sensor = response;
                    _.each(response[3], function (sensorSamples, sensorName) {
                        var sensorType = response[2][sensorName];
                        var sensorLast = _.last(sensorSamples);
                        if (sensorType == 11) {
                            rotate_cuber($glass.find('.cube'), remap_coordinate_system(getRotationMatrixFromVector(sensorLast[0]), 1, 3));
                        }
                        _.each(sensorSamples, function (x) {
                            addGraphValues(glassID, $glass.find('.chart-' + sensorType), sensorType, x[0], x[1]);
                        });
                        if (!$glass.find('.sensor-' + sensorType).length) {
	                        var $sensorData = $glass.find('.sensor-data');
                            $sensorData.append($('<tr>').attr('class', 'sensor-' + sensorType));
                            $sensorData.html($sensorData.children().sort(function (x, y) {return Number(x.className.split('-')[1]) -Number(y.className.split('-')[1])}));
                        }
                        var $sensor = $glass.find('.sensor-' + sensorType);
                        $sensor.html(Mustache.render('<td>{{type}}</td><td>{{name}}</td><td>{{timestamp}}</td><td>{{valuesStr}}</td><td><button type="button" class="btn btn-primary btn-xs sensor-graph-button" glass="{{glassID}}" name="{{type}}">Graph</button></td>', {valuesStr: sensorLast[0].join(', '), name: sensorName, type: sensorType, glassID: glassID, timestamp: sensorLast[1]}));
                        $sensor.find('.sensor-graph-button').click(sensor_graph_click);
                    });
                }
            }
        })
        reader.readAsBinaryString(event.data);
    }
    return ws;
}
function addGraphValues(glassID, chart, type, ys, timestamp) {
    if (!chart.length)
        return;
    var domains = {'-2': [-1, 1], 1: [-10, 10], 2: [-60, 60], 3: [-180, 360], 4: [-3, 3], 5: [0, 2000], 9: [-10, 10], 10: [-12, 12], 11: [-1, 1]};
    var colors = ['red', 'green', 'blue'];
    var domain = domains[type];
    if (!_.has(graphs[glassID], type) || seriesDatas[type]['0'].data.length > 1000) {
        // Sensor graph
        chart.html('');
        if (_.isUndefined(domain))
            seriesDatas[type] = _.map(ys, function (y, z) {return {data: [{x: timestamp, y: y}], color: colors[z], name: String(z)}});
        else
            seriesDatas[type] = _.map(ys, function (y, z) {return {data: [{x: timestamp, y: y}], color: colors[z], name: String(z), scale: d3.scale.linear().domain(domains[type]).nice()}});
        graphs[glassID][type] = buildChart(chart, seriesDatas[type]);
    } else {
        _.each(ys, function (y, z) {
            seriesDatas[type][z].data.push({x: timestamp, y: y});
        });
        graphs[glassID][type].update();
    }
}

function getRotationMatrixFromVector(rotationVector) {
    var q0;
    var q1 = rotationVector[0];
    var q2 = rotationVector[1];
    var q3 = rotationVector[2];

    R = new Array(16);

    if (rotationVector.length == 4) {
        q0 = rotationVector[3];
    } else {
        q0 = 1 - q1*q1 - q2*q2 - q3*q3;
        q0 = (q0 > 0) ? Math.sqrt(q0) : 0;
    }

    var sq_q1 = 2 * q1 * q1;
    var sq_q2 = 2 * q2 * q2;
    var sq_q3 = 2 * q3 * q3;
    var q1_q2 = 2 * q1 * q2;
    var q3_q0 = 2 * q3 * q0;
    var q1_q3 = 2 * q1 * q3;
    var q2_q0 = 2 * q2 * q0;
    var q2_q3 = 2 * q2 * q3;
    var q1_q0 = 2 * q1 * q0;

    R[0] = 1 - sq_q2 - sq_q3;
    R[1] = q1_q2 - q3_q0;
    R[2] = q1_q3 + q2_q0;
    R[3] = 0.0;
    
    R[4] = q1_q2 + q3_q0;
    R[5] = 1 - sq_q1 - sq_q3;
    R[6] = q2_q3 - q1_q0;
    R[7] = 0.0;
    
    R[8] = q1_q3 - q2_q0;
    R[9] = q2_q3 + q1_q0;
    R[10] = 1 - sq_q1 - sq_q2;
    R[11] = 0.0;
    
    R[12] = R[13] = R[14] = 0.0;
    R[15] = 1.0;

    return R;
}
function remap_coordinate_system(inR, X, Y) {
    // AXIS_X=1, AXIS_Y=2, AXIS_Z=3
    /*
     * X and Y define a rotation matrix 'r':
     *
     *  (X==1)?((X&0x80)?-1:1):0    (X==2)?((X&0x80)?-1:1):0    (X==3)?((X&0x80)?-1:1):0
     *  (Y==1)?((Y&0x80)?-1:1):0    (Y==2)?((Y&0x80)?-1:1):0    (Y==3)?((X&0x80)?-1:1):0
     *                              r[0] ^ r[1]
     *
     * where the 3rd line is the vector product of the first 2 lines
     *
     */
    outR = _.range(16);

    var length = outR.length;
    if (inR.length != length)
        return;   // invalid parameter
    if ((X & 0x7C)!=0 || (Y & 0x7C)!=0)
        return;   // invalid parameter
    if (((X & 0x3)==0) || ((Y & 0x3)==0))
        return;   // no axis specified
    if ((X & 0x3) == (Y & 0x3))
        return;   // same axis specified

    // Z is "the other" axis, its sign is either +/- sign(X)*sign(Y)
    // this can be calculated by exclusive-or'ing X and Y; except for
    // the sign inversion (+/-) which is calculated below.
    var Z = X ^ Y;

    // extract the axis (remove the sign), offset in the range 0 to 2.
    var x = (X & 0x3)-1;
    var y = (Y & 0x3)-1;
    var z = (Z & 0x3)-1;

    // compute the sign of Z (whether it needs to be inverted)
    var axis_y = (z+1)%3;
    var axis_z = (z+2)%3;
    if (((x^axis_y)|(y^axis_z)) != 0)
        Z ^= 0x80;

    var sx = (X>=0x80);
    var sy = (Y>=0x80);
    var sz = (Z>=0x80);

    // Perform R * r, in avoiding actual muls and adds.
    var rowLength = ((length==16)?4:3);
    _.each(_.range(3), function(j){
        var offset = j*rowLength;
        _.each(_.range(3), function(i){
            if (x==i)   outR[offset+i] = sx ? -inR[offset+0] : inR[offset+0];
            if (y==i)   outR[offset+i] = sy ? -inR[offset+1] : inR[offset+1];
            if (z==i)   outR[offset+i] = sz ? -inR[offset+2] : inR[offset+2];
        })
            })

        if (length == 16) {
            outR[3] = outR[7] = outR[11] = outR[12] = outR[13] = outR[14] = 0;
            outR[15] = 1;
        }
    return outR;
}

function transpose_matrix(mat) {
    mat_trans = [];
    _.each(_.range(4), function (i) {
        _.each(_.range(4), function (j) {
            mat_trans.push(mat[j * 4 + i]);
        });
    });
    return mat_trans;
}

function rotate_cuber($cube, mat) {
    var mat_trans = transpose_matrix(mat);
    mat_trans = remap_coordinate_system(mat_trans, 3, 1);
    $cube.css({
        transform: 'matrix3d(' + mat_trans.join(',') + ')',
        "transition-duration": '0s'
    });
}
function sensor_graph_click() {
    var $this = $(this);
    var $glass = $('#' + glassIdToNum[$this.attr('glass')]);
    var type = $this.attr('name');
    if (!$glass.find('.chart-' + type).length) {
        $glass.find('.charts').append($('<div>').attr('class', 'chart-' + type).attr('name', type).attr('title', 'Sensor #' + type));
        $glass.find('.charts').html($glass.find('.charts').children().sort(function (x, y) {return Number($(x).attr('name')) - Number($(y).attr('name'))}));
    }
}
function sendTimelineImage(image) {
    var out = ['sendTimelineImage', image];
    ws.send(enc(out));
}

function createKey(type, success, error) {
    var xhr = $.ajax({url: 'user/key/' + type, type: 'POST', success: success});
    if (!_.isUndefined(error)) {
        xhr.error(error);
    }
}

function urlToHost(url) {
    var pathArray = url.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    return protocol + '//' + host;
}

function simulatorShow() {
    $('#simulateButton').show();
}

function main(WSUrl) {
    glassIdToNum = {};
    graphs = {};
    seriesDatas = {};
    scriptRowDisabled = true;
    blobHandlers = {};
    gistCallbacks = {};
    if ($('#iframe').attr('src').length) {
        iframeWindow = $('#iframe')[0].contentWindow;
        iframeHost = urlToHost($('#iframe').attr('src'));
        $('#iframeRow').css('display', '');
    }

    $(".scriptel").prop('disabled', true);
    $('#qrButton').click(function () {createQR(WSUrl)});
    $('#scriptButton').click(function () {
        ws.publish('glass', 'script', {'glass.html': editor.getValue()});
    });
    $('#scriptSaveButton').click(function () {
        ws.send(enc(['saveScript', editor.getValue(), $('#script-name').val()]));
    });
    $('#scriptUrlButton').click(function () {
        ws.send(enc(['startScriptUrl', $('#script-url').val()]));
    });
    $('#resetButton').click(function () {
        ws.send(enc(['startScript', "<script>function s() {WS.log('Connected')};window.onload=function () {WS.serverConnect('{{WSUrl}}', 's')}</script>"]));
    });
    $('#gistButton').click(function () {
        ws.send(enc(['signScript', editor.getValue()]));
    });
    $('#shutdownButton').click(function () {
        ws.send(enc(['shutdown']));
    });
    $('#buttonAuth').click(function () {
        window.location.replace('auth');
    });
    $('#buttonAuthGH').click(function () {
        window.location.replace('authgh');
    });
    $('#buttonSignout').click(function () {
	window.location.replace("signout");
    });

    $('#buttonSetup').click(function () {
        $.post('setup').error(function () {alert("Could not setup")});
    });

    $('#simulateButton').click(function () {
        $('#simulator').show();
        simulatorUrl = createKey("ws", function (x) {$('#simulation')[0].contentWindow.start(WSUrl + "/ws/glass/" + x)}, function () {alert("Could not get client endpoint")})
    });

    $('#gestureAgain').click(function() {
      onGestureCallback = $("#simulation")[0].contentWindow.WS.getGestureCallbacks()['onGesture'];
      $("#simulation")[0].contentWindow[onGestureCallback]($('#gestures option:selected').text());
    });
    $('.gesture').click( function (e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = $(this).text();
      onGestureCallback = $("#simulation")[0].contentWindow.WS.getGestureCallbacks()['onGesture'];
      console.log('onGestureCallback '+JSON.stringify(onGestureCallback));
      $("#simulation")[0].contentWindow[onGestureCallback](valueSelected);
      console.log('gesture: '+valueSelected);
    });

    editor = CodeMirror.fromTextArea(document.getElementById("script"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        theme: 'default',
        mode: "htmlmixed",
        indentUnit: 4
    });
    function unloadSet(cm, change) {
        editor.off("change", unloadSet);
        window.onbeforeunload = function(e) {
            e = e || window.event;
            var message = "You will lose any unsaved changes.";
            if (e)
                e.returnValue = message;
            return message;
        }
    }
    editor.on("change", unloadSet);
    ws = connectWebsocket(WSUrl);
    var simulation = $('#simulation')[0].contentWindow;
}
;
(function() {
  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) &&
    (document.documentMode == null || document.documentMode < 8);

  var Pos = CodeMirror.Pos;

  var matching = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"};
  function findMatchingBracket(cm, where, strict) {
    var state = cm.state.matchBrackets;
    var maxScanLen = (state && state.maxScanLineLength) || 10000;

    var cur = where || cm.getCursor(), line = cm.getLineHandle(cur.line), pos = cur.ch - 1;
    var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
    if (!match) return null;
    var forward = match.charAt(1) == ">", d = forward ? 1 : -1;
    if (strict && forward != (pos == cur.ch)) return null;
    var style = cm.getTokenTypeAt(Pos(cur.line, pos + 1));

    var stack = [line.text.charAt(pos)], re = /[(){}[\]]/;
    function scan(line, lineNo, start) {
      if (!line.text) return;
      var pos = forward ? 0 : line.text.length - 1, end = forward ? line.text.length : -1;
      if (line.text.length > maxScanLen) return null;
      if (start != null) pos = start + d;
      for (; pos != end; pos += d) {
        var ch = line.text.charAt(pos);
        if (re.test(ch) && cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style) {
          var match = matching[ch];
          if (match.charAt(1) == ">" == forward) stack.push(ch);
          else if (stack.pop() != match.charAt(0)) return {pos: pos, match: false};
          else if (!stack.length) return {pos: pos, match: true};
        }
      }
    }
    for (var i = cur.line, found, e = forward ? Math.min(i + 100, cm.lineCount()) : Math.max(-1, i - 100); i != e; i+=d) {
      if (i == cur.line) found = scan(line, i, pos);
      else found = scan(cm.getLineHandle(i), i);
      if (found) break;
    }
    return {from: Pos(cur.line, pos), to: found && Pos(i, found.pos),
            match: found && found.match, forward: forward};
  }

  function matchBrackets(cm, autoclear) {
    // Disable brace matching in long lines, since it'll cause hugely slow updates
    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
    var found = findMatchingBracket(cm);
    if (!found || cm.getLine(found.from.line).length > maxHighlightLen ||
       found.to && cm.getLine(found.to.line).length > maxHighlightLen)
      return;

    var style = found.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
    var one = cm.markText(found.from, Pos(found.from.line, found.from.ch + 1), {className: style});
    var two = found.to && cm.markText(found.to, Pos(found.to.line, found.to.ch + 1), {className: style});
    // Kludge to work around the IE bug from issue #1193, where text
    // input stops going to the textare whever this fires.
    if (ie_lt8 && cm.state.focused) cm.display.input.focus();
    var clear = function() {
      cm.operation(function() { one.clear(); two && two.clear(); });
    };
    if (autoclear) setTimeout(clear, 800);
    else return clear;
  }

  var currentlyHighlighted = null;
  function doMatchBrackets(cm) {
    cm.operation(function() {
      if (currentlyHighlighted) {currentlyHighlighted(); currentlyHighlighted = null;}
      if (!cm.somethingSelected()) currentlyHighlighted = matchBrackets(cm, false);
    });
  }

  CodeMirror.defineOption("matchBrackets", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init)
      cm.off("cursorActivity", doMatchBrackets);
    if (val) {
      cm.state.matchBrackets = typeof val == "object" ? val : {};
      cm.on("cursorActivity", doMatchBrackets);
    }
  });

  CodeMirror.defineExtension("matchBrackets", function() {matchBrackets(this, true);});
  CodeMirror.defineExtension("findMatchingBracket", function(pos, strict){
    return findMatchingBracket(this, pos, strict);
  });
})();
;
// Because sometimes you need to style the cursor's line.
//
// Adds an option 'styleActiveLine' which, when enabled, gives the
// active line's wrapping <div> the CSS class "CodeMirror-activeline",
// and gives its background <div> the class "CodeMirror-activeline-background".

(function() {
  "use strict";
  var WRAP_CLASS = "CodeMirror-activeline";
  var BACK_CLASS = "CodeMirror-activeline-background";

  CodeMirror.defineOption("styleActiveLine", false, function(cm, val, old) {
    var prev = old && old != CodeMirror.Init;
    if (val && !prev) {
      updateActiveLine(cm);
      cm.on("cursorActivity", updateActiveLine);
    } else if (!val && prev) {
      cm.off("cursorActivity", updateActiveLine);
      clearActiveLine(cm);
      delete cm.state.activeLine;
    }
  });

  function clearActiveLine(cm) {
    if ("activeLine" in cm.state) {
      cm.removeLineClass(cm.state.activeLine, "wrap", WRAP_CLASS);
      cm.removeLineClass(cm.state.activeLine, "background", BACK_CLASS);
    }
  }

  function updateActiveLine(cm) {
    var line = cm.getLineHandleVisualStart(cm.getCursor().line);
    if (cm.state.activeLine == line) return;
    clearActiveLine(cm);
    cm.addLineClass(line, "wrap", WRAP_CLASS);
    cm.addLineClass(line, "background", BACK_CLASS);
    cm.state.activeLine = line;
  }
})();
;
CodeMirror.defineMode("css", function(config, parserConfig) {
  "use strict";

  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit || config.tabSize || 2,
      hooks = parserConfig.hooks || {},
      atMediaTypes = parserConfig.atMediaTypes || {},
      atMediaFeatures = parserConfig.atMediaFeatures || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = !!parserConfig.allowNested,
      type = null;

  function ret(style, tp) { type = tp; return style; }

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (hooks[ch]) {
      // result[0] is style and result[1] is type
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {stream.eatWhile(/[\w\\\-]/); return ret("def", stream.current());}
    else if (ch == "=") ret(null, "compare");
    else if ((ch == "~" || ch == "|") && stream.eat("=")) return ret(null, "compare");
    else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }
    else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    }
    else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    }
    else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    }
    else if (ch === "-") {
      if (/\d/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^[^-]+-/)) {
        return ret("meta", "meta");
      }
    }
    else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    }
    else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    }
    else if (ch == ":") {
      return ret("operator", ch);
    }
    else if (/[;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    }
    else if (ch == "u" && stream.match("rl(")) {
      stream.backUp(1);
      state.tokenize = tokenParenthesized;
      return ret("property", "variable");
    }
    else {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "variable");
    }
  }

  function tokenString(quote, nonInclusive) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped)
          break;
        escaped = !escaped && ch == "\\";
      }
      if (!escaped) {
        if (nonInclusive) stream.backUp(1);
        state.tokenize = tokenBase;
      }
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/\s*[\"\']/, false))
      state.tokenize = tokenString(")", true);
    else
      state.tokenize = tokenBase;
    return ret(null, "(");
  }

  return {
    startState: function(base) {
      return {tokenize: tokenBase,
              baseIndent: base || 0,
              stack: [],
              lastToken: null};
    },

    token: function(stream, state) {

      // Use these terms when applicable (see http://www.xanthir.com/blog/b4E50)
      //
      // rule** or **ruleset:
      // A selector + braces combo, or an at-rule.
      //
      // declaration block:
      // A sequence of declarations.
      //
      // declaration:
      // A property + colon + value combo.
      //
      // property value:
      // The entire value of a property.
      //
      // component value:
      // A single piece of a property value. Like the 5px in
      // text-shadow: 0 0 5px blue;. Can also refer to things that are
      // multiple terms, like the 1-4 terms that make up the background-size
      // portion of the background shorthand.
      //
      // term:
      // The basic unit of author-facing CSS, like a single number (5),
      // dimension (5px), string ("foo"), or function. Officially defined
      //  by the CSS 2.1 grammar (look for the 'term' production)
      //
      //
      // simple selector:
      // A single atomic selector, like a type selector, an attr selector, a
      // class selector, etc.
      //
      // compound selector:
      // One or more simple selectors without a combinator. div.example is
      // compound, div > .example is not.
      //
      // complex selector:
      // One or more compound selectors chained with combinators.
      //
      // combinator:
      // The parts of selectors that express relationships. There are four
      // currently - the space (descendant combinator), the greater-than
      // bracket (child combinator), the plus sign (next sibling combinator),
      // and the tilda (following sibling combinator).
      //
      // sequence of selectors:
      // One or more of the named type of selector chained with commas.

      state.tokenize = state.tokenize || tokenBase;
      if (state.tokenize == tokenBase && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (style && typeof style != "string") style = ret(style[0], style[1]);

      // Changing style returned based on context
      var context = state.stack[state.stack.length-1];
      if (style == "variable") {
        if (type == "variable-definition") state.stack.push("propertyValue");
        return state.lastToken = "variable-2";
      } else if (style == "property") {
        var word = stream.current().toLowerCase();
        if (context == "propertyValue") {
          if (valueKeywords.hasOwnProperty(word)) {
            style = "string-2";
          } else if (colorKeywords.hasOwnProperty(word)) {
            style = "keyword";
          } else {
            style = "variable-2";
          }
        } else if (context == "rule") {
          if (!propertyKeywords.hasOwnProperty(word)) {
            style += " error";
          }
        } else if (context == "block") {
          // if a value is present in both property, value, or color, the order
          // of preference is property -> color -> value
          if (propertyKeywords.hasOwnProperty(word)) {
            style = "property";
          } else if (colorKeywords.hasOwnProperty(word)) {
            style = "keyword";
          } else if (valueKeywords.hasOwnProperty(word)) {
            style = "string-2";
          } else {
            style = "tag";
          }
        } else if (!context || context == "@media{") {
          style = "tag";
        } else if (context == "@media") {
          if (atMediaTypes[stream.current()]) {
            style = "attribute"; // Known attribute
          } else if (/^(only|not)$/.test(word)) {
            style = "keyword";
          } else if (word == "and") {
            style = "error"; // "and" is only allowed in @mediaType
          } else if (atMediaFeatures.hasOwnProperty(word)) {
            style = "error"; // Known property, should be in @mediaType(
          } else {
            // Unknown, expecting keyword or attribute, assuming attribute
            style = "attribute error";
          }
        } else if (context == "@mediaType") {
          if (atMediaTypes.hasOwnProperty(word)) {
            style = "attribute";
          } else if (word == "and") {
            style = "operator";
          } else if (/^(only|not)$/.test(word)) {
            style = "error"; // Only allowed in @media
          } else {
            // Unknown attribute or property, but expecting property (preceded
            // by "and"). Should be in parentheses
            style = "error";
          }
        } else if (context == "@mediaType(") {
          if (propertyKeywords.hasOwnProperty(word)) {
            // do nothing, remains "property"
          } else if (atMediaTypes.hasOwnProperty(word)) {
            style = "error"; // Known property, should be in parentheses
          } else if (word == "and") {
            style = "operator";
          } else if (/^(only|not)$/.test(word)) {
            style = "error"; // Only allowed in @media
          } else {
            style += " error";
          }
        } else if (context == "@import") {
          style = "tag";
        } else {
          style = "error";
        }
      } else if (style == "atom") {
        if(!context || context == "@media{" || context == "block") {
          style = "builtin";
        } else if (context == "propertyValue") {
          if (!/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(stream.current())) {
            style += " error";
          }
        } else {
          style = "error";
        }
      } else if (context == "@media" && type == "{") {
        style = "error";
      }

      // Push/pop context stack
      if (type == "{") {
        if (context == "@media" || context == "@mediaType") {
          state.stack[state.stack.length-1] = "@media{";
        }
        else {
          var newContext = allowNested ? "block" : "rule";
          state.stack.push(newContext);
        }
      }
      else if (type == "}") {
        if (context == "interpolation") style = "operator";
        // Pop off end of array until { is reached
        while(state.stack.length){
          var removed = state.stack.pop();
          if(removed.indexOf("{") > -1){
            break;
          }
        }
      }
      else if (type == "interpolation") state.stack.push("interpolation");
      else if (type == "@media") state.stack.push("@media");
      else if (type == "@import") state.stack.push("@import");
      else if (context == "@media" && /\b(keyword|attribute)\b/.test(style))
        state.stack[state.stack.length-1] = "@mediaType";
      else if (context == "@mediaType" && stream.current() == ",")
        state.stack[state.stack.length-1] = "@media";
      else if (type == "(") {
        if (context == "@media" || context == "@mediaType") {
          // Make sure @mediaType is used to avoid error on {
          state.stack[state.stack.length-1] = "@mediaType";
          state.stack.push("@mediaType(");
        }
        else state.stack.push("(");
      }
      else if (type == ")") {
        // Pop off end of array until ( is reached
        while(state.stack.length){
          var removed = state.stack.pop();
          if(removed.indexOf("(") > -1){
            break;
          }
        }
      }
      else if (type == ":" && state.lastToken == "property") state.stack.push("propertyValue");
      else if (context == "propertyValue" && type == ";") state.stack.pop();
      else if (context == "@import" && type == ";") state.stack.pop();

      return state.lastToken = style;
    },

    indent: function(state, textAfter) {
      var n = state.stack.length;
      if (/^\}/.test(textAfter))
        n -= state.stack[n-1] == "propertyValue" ? 2 : 1;
      return state.baseIndent + n * indentUnit;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    fold: "brace"
  };
});

(function() {
  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i]] = true;
    }
    return keys;
  }

  var atMediaTypes = keySet([
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ]);

  var atMediaFeatures = keySet([
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid"
  ]);

  var propertyKeywords = keySet([
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-iteration-count",
    "animation-name", "animation-play-state", "animation-timing-function",
    "appearance", "azimuth", "backface-visibility", "background",
    "background-attachment", "background-clip", "background-color",
    "background-image", "background-origin", "background-position",
    "background-repeat", "background-size", "baseline-shift", "binding",
    "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
    "bookmark-target", "border", "border-bottom", "border-bottom-color",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "border-bottom-style", "border-bottom-width", "border-collapse",
    "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color",
    "border-left-style", "border-left-width", "border-radius", "border-right",
    "border-right-color", "border-right-style", "border-right-width",
    "border-spacing", "border-style", "border-top", "border-top-color",
    "border-top-left-radius", "border-top-right-radius", "border-top-style",
    "border-top-width", "border-width", "bottom", "box-decoration-break",
    "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
    "caption-side", "clear", "clip", "color", "color-profile", "column-count",
    "column-fill", "column-gap", "column-rule", "column-rule-color",
    "column-rule-style", "column-rule-width", "column-span", "column-width",
    "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
    "cue-after", "cue-before", "cursor", "direction", "display",
    "dominant-baseline", "drop-initial-after-adjust",
    "drop-initial-after-align", "drop-initial-before-adjust",
    "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
    "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
    "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
    "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
    "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
    "font-stretch", "font-style", "font-synthesis", "font-variant",
    "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
    "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
    "font-weight", "grid-cell", "grid-column", "grid-column-align",
    "grid-column-sizing", "grid-column-span", "grid-columns", "grid-flow",
    "grid-row", "grid-row-align", "grid-row-sizing", "grid-row-span",
    "grid-rows", "grid-template", "hanging-punctuation", "height", "hyphens",
    "icon", "image-orientation", "image-rendering", "image-resolution",
    "inline-box-align", "justify-content", "left", "letter-spacing",
    "line-break", "line-height", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top",
    "marker-offset", "marks", "marquee-direction", "marquee-loop",
    "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
    "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index",
    "nav-left", "nav-right", "nav-up", "opacity", "order", "orphans", "outline",
    "outline-color", "outline-offset", "outline-style", "outline-width",
    "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "page", "page-break-after", "page-break-before", "page-break-inside",
    "page-policy", "pause", "pause-after", "pause-before", "perspective",
    "perspective-origin", "pitch", "pitch-range", "play-during", "position",
    "presentation-level", "punctuation-trim", "quotes", "region-break-after",
    "region-break-before", "region-break-inside", "region-fragment",
    "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
    "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
    "ruby-position", "ruby-span", "shape-inside", "shape-outside", "size",
    "speak", "speak-as", "speak-header",
    "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
    "tab-size", "table-layout", "target", "target-name", "target-new",
    "target-position", "text-align", "text-align-last", "text-decoration",
    "text-decoration-color", "text-decoration-line", "text-decoration-skip",
    "text-decoration-style", "text-emphasis", "text-emphasis-color",
    "text-emphasis-position", "text-emphasis-style", "text-height",
    "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
    "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
    "text-wrap", "top", "transform", "transform-origin", "transform-style",
    "transition", "transition-delay", "transition-duration",
    "transition-property", "transition-timing-function", "unicode-bidi",
    "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "word-break",
    "word-spacing", "word-wrap", "z-index", "zoom",
    // SVG-specific
    "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
    "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
    "color-interpolation", "color-interpolation-filters", "color-profile",
    "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
    "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
    "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
    "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
    "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
    "glyph-orientation-vertical", "kerning", "text-anchor", "writing-mode"
  ]);

  var colorKeywords = keySet([
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
    "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
    "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
    "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
    "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
    "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
    "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
    "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
    "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
    "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon",
    "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ]);

  var valueKeywords = keySet([
    "above", "absolute", "activeborder", "activecaption", "afar",
    "after-white-space", "ahead", "alias", "all", "all-scroll", "alternate",
    "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
    "arabic-indic", "armenian", "asterisks", "auto", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "column", "compact", "condensed", "contain", "content",
    "content-box", "context-menu", "continuous", "copy", "cover", "crop",
    "cross", "crosshair", "currentcolor", "cursive", "dashed", "decimal",
    "decimal-leading-zero", "default", "default-button", "destination-atop",
    "destination-in", "destination-out", "destination-over", "devanagari",
    "disc", "discard", "document", "dot-dash", "dot-dot-dash", "dotted",
    "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
    "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
    "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et",
    "ethiopic-halehame-tig", "ew-resize", "expanded", "extra-condensed",
    "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "footnotes",
    "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove",
    "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew",
    "help", "hidden", "hide", "higher", "highlight", "highlighttext",
    "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore",
    "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
    "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
    "inline-block", "inline-table", "inset", "inside", "intrinsic", "invert",
    "italic", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer",
    "landscape", "lao", "large", "larger", "left", "level", "lighter",
    "line-through", "linear", "lines", "list-item", "listbox", "listitem",
    "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
    "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
    "lower-roman", "lowercase", "ltr", "malayalam", "match",
    "media-controls-background", "media-current-time-display",
    "media-fullscreen-button", "media-mute-button", "media-play-button",
    "media-return-to-realtime-button", "media-rewind-button",
    "media-seek-back-button", "media-seek-forward-button", "media-slider",
    "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
    "media-volume-slider-container", "media-volume-sliderthumb", "medium",
    "menu", "menulist", "menulist-button", "menulist-text",
    "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
    "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize",
    "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
    "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
    "ns-resize", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote",
    "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
    "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
    "painted", "page", "paused", "persian", "plus-darker", "plus-lighter", "pointer",
    "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button",
    "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region",
    "relative", "repeat", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba",
    "ridge", "right", "round", "row-resize", "rtl", "run-in", "running",
    "s-resize", "sans-serif", "scroll", "scrollbar", "se-resize", "searchfield",
    "searchfield-cancel-button", "searchfield-decoration",
    "searchfield-results-button", "searchfield-results-decoration",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "single", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke",
    "sub", "subpixel-antialiased", "super", "sw-resize", "table",
    "table-caption", "table-cell", "table-column", "table-column-group",
    "table-footer-group", "table-header-group", "table-row", "table-row-group",
    "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
    "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
    "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
    "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "up",
    "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
    "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
    "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
    "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
    "window", "windowframe", "windowtext", "x-large", "x-small", "xor",
    "xx-large", "xx-small"
  ]);

  function tokenCComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    atMediaTypes: atMediaTypes,
    atMediaFeatures: atMediaFeatures,
    propertyKeywords: propertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    hooks: {
      "<": function(stream, state) {
        function tokenSGMLComment(stream, state) {
          var dashes = 0, ch;
          while ((ch = stream.next()) != null) {
            if (dashes >= 2 && ch == ">") {
              state.tokenize = null;
              break;
            }
            dashes = (ch == "-") ? dashes + 1 : 0;
          }
          return ["comment", "comment"];
        }
        if (stream.eat("!")) {
          state.tokenize = tokenSGMLComment;
          return tokenSGMLComment(stream, state);
        }
      },
      "/": function(stream, state) {
        if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        }
        return false;
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    atMediaTypes: atMediaTypes,
    atMediaFeatures: atMediaFeatures,
    propertyKeywords: propertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    allowNested: true,
    hooks: {
      ":": function(stream) {
        if (stream.match(/\s*{/)) {
          return [null, "{"];
        }
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.peek() == ":") {
          return ["variable", "variable-definition"];
        }
        return ["variable", "variable"];
      },
      ",": function(_stream, state) {
        if (state.stack[state.stack.length - 1] == "propertyValue") {
          return ["operator", ";"];
        }
      },
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "#": function(stream) {
        if (stream.eat("{")) {
          return ["operator", "interpolation"];
        } else {
          stream.eatWhile(/[\w\\\-]/);
          return ["atom", "hash"];
        }
      }
    },
    name: "css"
  });
})();
;
// TODO actually recognize syntax of TypeScript constructs

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonMode = parserConfig.json;
  var isTS = parserConfig.typescript;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this")
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("interface"),
        "class": kw("class"),
        "extends": kw("extends"),
        "constructor": kw("constructor"),

        // scope modifiers
        "public": kw("public"),
        "private": kw("private"),
        "protected": kw("protected"),
        "static": kw("static"),

        "super": kw("super"),

        // types
        "string": type, "number": type, "bool": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;

  function chain(stream, state, f) {
    state.tokenize = f;
    return f(stream, state);
  }

  function nextUntilUnescaped(stream, end) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (next == end && !escaped)
        return false;
      escaped = !escaped && next == "\\";
    }
    return escaped;
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function jsTokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'")
      return chain(stream, state, jsTokenString(ch));
    else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/))
      return ret("number", "number");
    else if (/[\[\]{}\(\),;\:\.]/.test(ch))
      return ret(ch);
    else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    }
    else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    }
    else if (ch == "/") {
      if (stream.eat("*")) {
        return chain(stream, state, jsTokenComment);
      }
      else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      }
      else if (state.lastType == "operator" || state.lastType == "keyword c" ||
               /^[\[{}\(,;:]$/.test(state.lastType)) {
        nextUntilUnescaped(stream, "/");
        stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla
        return ret("regexp", "string-2");
      }
      else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", null, stream.current());
      }
    }
    else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    }
    else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", null, stream.current());
    }
    else {
      stream.eatWhile(/[\w\$_]/);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function jsTokenString(quote) {
    return function(stream, state) {
      if (!nextUntilUnescaped(stream, quote))
        state.tokenize = jsTokenBase;
      return ret("string", "string");
    };
  }

  function jsTokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = jsTokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    if (state.context) {
      cx.marked = "def";
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    return function(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(arguments.callee);
    };
  }

  function statement(type) {
    if (type == "var") return cont(pushlex("vardef"), vardef1, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), expect("("), pushlex(")"), forspec1, expect(")"),
                                   poplex, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), commasep(expressionNoComma, "]"), poplex, maybeop);
    if (type == "{") return cont(pushlex("}"), commasep(objprop, "}"), poplex, maybeop);
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == ";") return;
    if (type == "(") return cont(pushlex(")", "call"), commasep(expressionNoComma, ")"), poplex, me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
    } else if (type == "number" || type == "string") {
      cx.marked = type + " property";
    }
    if (atomicTypes.hasOwnProperty(type)) return cont(expect(":"), expressionNoComma);
  }
  function getterSetter(type) {
    if (type == ":") return cont(expression);
    if (type != "variable") return cont(expect(":"), expression);
    cx.marked = "property";
    return cont(functiondef);
  }
  function commasep(what, end) {
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      else return pass(what, proceed);
    };
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (type == ":") return cont(typedef);
    return pass();
  }
  function typedef(type) {
    if (type == "variable"){cx.marked = "variable-3"; return cont();}
    return pass();
  }
  function vardef1(type, value) {
    if (type == "variable") {
      register(value);
      return isTS ? cont(maybetype, vardef2) : cont(vardef2);
    }
    return pass();
  }
  function vardef2(type, value) {
    if (value == "=") return cont(expressionNoComma, vardef2);
    if (type == ",") return cont(vardef1);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form"), statement, poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef1, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybein);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybein(_type, value) {
    if (value == "in") return cont(expression);
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in") return cont(expression);
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushlex(")"), pushcontext, commasep(funarg, ")"), poplex, statement, popcontext);
  }
  function funarg(type, value) {
    if (type == "variable") {register(value); return isTS ? cont(maybetype) : cont();}
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: jsTokenBase,
        lastType: null,
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        globalVars: parserConfig.globalVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: 0
      };
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
      }
      if (state.tokenize != jsTokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == jsTokenComment) return CodeMirror.Pass;
      if (state.tokenize != jsTokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse || /^else\b/.test(textAfter)) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? 4 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricChars: ":{}",
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",

    helperType: jsonMode ? "json" : "javascript",
    jsonMode: jsonMode
  };
});

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });
;
CodeMirror.defineMode("xml", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var multilineTagIndentFactor = parserConfig.multilineTagIndentFactor || 1;
  var multilineTagIndentPastTag = parserConfig.multilineTagIndentPastTag || true;

  var Kludges = parserConfig.htmlMode ? {
    autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                      'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                      'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                      'track': true, 'wbr': true},
    implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                       'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                       'th': true, 'tr': true},
    contextGrabbers: {
      'dd': {'dd': true, 'dt': true},
      'dt': {'dd': true, 'dt': true},
      'li': {'li': true},
      'option': {'option': true, 'optgroup': true},
      'optgroup': {'optgroup': true},
      'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
            'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
            'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
            'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
            'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
      'rp': {'rp': true, 'rt': true},
      'rt': {'rp': true, 'rt': true},
      'tbody': {'tbody': true, 'tfoot': true},
      'td': {'td': true, 'th': true},
      'tfoot': {'tbody': true},
      'th': {'td': true, 'th': true},
      'thead': {'tbody': true, 'tfoot': true},
      'tr': {'tr': true}
    },
    doNotIndent: {"pre": true},
    allowUnquoted: true,
    allowMissing: true
  } : {
    autoSelfClosers: {},
    implicitlyClosed: {},
    contextGrabbers: {},
    doNotIndent: {},
    allowUnquoted: false,
    allowMissing: false
  };
  var alignCDATA = parserConfig.alignCDATA;

  // Return variables for tokenizers
  var tagName, type;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        var isClose = stream.eat("/");
        tagName = "";
        var c;
        while ((c = stream.eat(/[^\s\u00a0=<>\"\'\/?]/))) tagName += c;
        if (!tagName) return "tag error";
        type = isClose ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      var next = state.tokenize(stream, state);
      return next ? next + " error" : "error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.eatWhile(/[^\s\u00a0=<>\"\']/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    };
  }
  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  var curState, curStream, setStyle;
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) curState.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }

  function pushContext(tagName, startOfLine) {
    var noIndent = Kludges.doNotIndent.hasOwnProperty(tagName) || (curState.context && curState.context.noIndent);
    curState.context = {
      prev: curState.context,
      tagName: tagName,
      indent: curState.indented,
      startOfLine: startOfLine,
      noIndent: noIndent
    };
  }
  function popContext() {
    if (curState.context) curState.context = curState.context.prev;
  }

  function element(type) {
    if (type == "openTag") {
      curState.tagName = tagName;
      curState.tagStart = curStream.column();
      return cont(attributes, endtag(curState.startOfLine));
    } else if (type == "closeTag") {
      var err = false;
      if (curState.context) {
        if (curState.context.tagName != tagName) {
          if (Kludges.implicitlyClosed.hasOwnProperty(curState.context.tagName.toLowerCase())) {
            popContext();
          }
          err = !curState.context || curState.context.tagName != tagName;
        }
      } else {
        err = true;
      }
      if (err) setStyle = "error";
      return cont(endclosetag(err));
    }
    return cont();
  }
  function endtag(startOfLine) {
    return function(type) {
      var tagName = curState.tagName;
      curState.tagName = curState.tagStart = null;
      if (type == "selfcloseTag" ||
          (type == "endTag" && Kludges.autoSelfClosers.hasOwnProperty(tagName.toLowerCase()))) {
        maybePopContext(tagName.toLowerCase());
        return cont();
      }
      if (type == "endTag") {
        maybePopContext(tagName.toLowerCase());
        pushContext(tagName, startOfLine);
        return cont();
      }
      return cont();
    };
  }
  function endclosetag(err) {
    return function(type) {
      if (err) setStyle = "error";
      if (type == "endTag") { popContext(); return cont(); }
      setStyle = "error";
      return cont(arguments.callee);
    };
  }
  function maybePopContext(nextTagName) {
    var parentTagName;
    while (true) {
      if (!curState.context) {
        return;
      }
      parentTagName = curState.context.tagName.toLowerCase();
      if (!Kludges.contextGrabbers.hasOwnProperty(parentTagName) ||
          !Kludges.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext();
    }
  }

  function attributes(type) {
    if (type == "word") {setStyle = "attribute"; return cont(attribute, attributes);}
    if (type == "endTag" || type == "selfcloseTag") return pass();
    setStyle = "error";
    return cont(attributes);
  }
  function attribute(type) {
    if (type == "equals") return cont(attvalue, attributes);
    if (!Kludges.allowMissing) setStyle = "error";
    else if (type == "word") {setStyle = "attribute"; return cont(attribute, attributes);}
    return (type == "endTag" || type == "selfcloseTag") ? pass() : cont();
  }
  function attvalue(type) {
    if (type == "string") return cont(attvaluemaybe);
    if (type == "word" && Kludges.allowUnquoted) {setStyle = "string"; return cont();}
    setStyle = "error";
    return (type == "endTag" || type == "selfCloseTag") ? pass() : cont();
  }
  function attvaluemaybe(type) {
    if (type == "string") return cont(attvaluemaybe);
    else return pass();
  }

  return {
    startState: function() {
      return {tokenize: inText, cc: [], indented: 0, startOfLine: true, tagName: null, tagStart: null, context: null};
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol()) {
        state.startOfLine = true;
        state.indented = stream.indentation();
      }
      if (stream.eatSpace()) return null;

      setStyle = type = tagName = null;
      var style = state.tokenize(stream, state);
      state.type = type;
      if ((style || type) && style != "comment") {
        curState = state; curStream = stream;
        while (true) {
          var comb = state.cc.pop() || element;
          if (comb(type || style)) break;
        }
      }
      state.startOfLine = false;
      if (setStyle)
        style = setStyle == "error" ? style + " error" : setStyle;
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        return state.stringStartCol + 1;
      }
      if ((state.tokenize != inTag && state.tokenize != inText) ||
          context && context.noIndent)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (multilineTagIndentPastTag)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * multilineTagIndentFactor;
      }
      if (alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      if (context && /^<\//.test(textAfter))
        context = context.prev;
      while (context && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return 0;
    },

    electricChars: "/",
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: parserConfig.htmlMode ? "html" : "xml",
    helperType: parserConfig.htmlMode ? "html" : "xml"
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});
;
CodeMirror.defineMode("htmlmixed", function(config, parserConfig) {
  var htmlMode = CodeMirror.getMode(config, {name: "xml", htmlMode: true});
  var cssMode = CodeMirror.getMode(config, "css");

  var scriptTypes = [], scriptTypesConf = parserConfig && parserConfig.scriptTypes;
  scriptTypes.push({matches: /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i,
                    mode: CodeMirror.getMode(config, "javascript")});
  if (scriptTypesConf) for (var i = 0; i < scriptTypesConf.length; ++i) {
    var conf = scriptTypesConf[i];
    scriptTypes.push({matches: conf.matches, mode: conf.mode && CodeMirror.getMode(config, conf.mode)});
  }
  scriptTypes.push({matches: /./,
                    mode: CodeMirror.getMode(config, "text/plain")});

  function html(stream, state) {
    var tagName = state.htmlState.tagName;
    var style = htmlMode.token(stream, state.htmlState);
    if (tagName == "script" && /\btag\b/.test(style) && stream.current() == ">") {
      // Script block: mode to change to depends on type attribute
      var scriptType = stream.string.slice(Math.max(0, stream.pos - 100), stream.pos).match(/\btype\s*=\s*("[^"]+"|'[^']+'|\S+)[^<]*$/i);
      scriptType = scriptType ? scriptType[1] : "";
      if (scriptType && /[\"\']/.test(scriptType.charAt(0))) scriptType = scriptType.slice(1, scriptType.length - 1);
      for (var i = 0; i < scriptTypes.length; ++i) {
        var tp = scriptTypes[i];
        if (typeof tp.matches == "string" ? scriptType == tp.matches : tp.matches.test(scriptType)) {
          if (tp.mode) {
            state.token = script;
            state.localMode = tp.mode;
            state.localState = tp.mode.startState && tp.mode.startState(htmlMode.indent(state.htmlState, ""));
          }
          break;
        }
      }
    } else if (tagName == "style" && /\btag\b/.test(style) && stream.current() == ">") {
      state.token = css;
      state.localMode = cssMode;
      state.localState = cssMode.startState(htmlMode.indent(state.htmlState, ""));
    }
    return style;
  }
  function maybeBackup(stream, pat, style) {
    var cur = stream.current();
    var close = cur.search(pat), m;
    if (close > -1) stream.backUp(cur.length - close);
    else if (m = cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur[0]);
    }
    return style;
  }
  function script(stream, state) {
    if (stream.match(/^<\/\s*script\s*>/i, false)) {
      state.token = html;
      state.localState = state.localMode = null;
      return html(stream, state);
    }
    return maybeBackup(stream, /<\/\s*script\s*>/,
                       state.localMode.token(stream, state.localState));
  }
  function css(stream, state) {
    if (stream.match(/^<\/\s*style\s*>/i, false)) {
      state.token = html;
      state.localState = state.localMode = null;
      return html(stream, state);
    }
    return maybeBackup(stream, /<\/\s*style\s*>/,
                       cssMode.token(stream, state.localState));
  }

  return {
    startState: function() {
      var state = htmlMode.startState();
      return {token: html, localMode: null, localState: null, htmlState: state};
    },

    copyState: function(state) {
      if (state.localState)
        var local = CodeMirror.copyState(state.localMode, state.localState);
      return {token: state.token, localMode: state.localMode, localState: local,
              htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
    },

    token: function(stream, state) {
      return state.token(stream, state);
    },

    indent: function(state, textAfter) {
      if (!state.localMode || /^\s*<\//.test(textAfter))
        return htmlMode.indent(state.htmlState, textAfter);
      else if (state.localMode.indent)
        return state.localMode.indent(state.localState, textAfter);
      else
        return CodeMirror.Pass;
    },

    electricChars: "/{}:",

    innerMode: function(state) {
      return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
    }
  };
}, "xml", "javascript", "css");

CodeMirror.defineMIME("text/html", "htmlmixed");
;
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);;
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
var Mustache;(function(a){if(typeof module!=="undefined"&&module.exports){module.exports=a}else{if(typeof define==="function"){define(a)}else{Mustache=a}}}((function(){var u={};u.name="mustache.js";u.version="0.7.0";u.tags=["{{","}}"];u.Scanner=t;u.Context=r;u.Writer=p;var d=/\s*/;var l=/\s+/;var j=/\S/;var h=/\s*=/;var n=/\s*\}/;var s=/#|\^|\/|>|\{|&|=|!/;function o(x,w){return RegExp.prototype.test.call(x,w)}function g(w){return !o(j,w)}var k=Array.isArray||function(w){return Object.prototype.toString.call(w)==="[object Array]"};function f(w){return w.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var c={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function m(w){return String(w).replace(/[&<>"'\/]/g,function(x){return c[x]})}u.escape=m;function t(w){this.string=w;this.tail=w;this.pos=0}t.prototype.eos=function(){return this.tail===""};t.prototype.scan=function(x){var w=this.tail.match(x);if(w&&w.index===0){this.tail=this.tail.substring(w[0].length);this.pos+=w[0].length;return w[0]}return""};t.prototype.scanUntil=function(x){var w,y=this.tail.search(x);switch(y){case -1:w=this.tail;this.pos+=this.tail.length;this.tail="";break;case 0:w="";break;default:w=this.tail.substring(0,y);this.tail=this.tail.substring(y);this.pos+=y}return w};function r(w,x){this.view=w;this.parent=x;this.clearCache()}r.make=function(w){return(w instanceof r)?w:new r(w)};r.prototype.clearCache=function(){this._cache={}};r.prototype.push=function(w){return new r(w,this)};r.prototype.lookup=function(w){var z=this._cache[w];if(!z){if(w==="."){z=this.view}else{var y=this;while(y){if(w.indexOf(".")>0){var A=w.split("."),x=0;z=y.view;while(z&&x<A.length){z=z[A[x++]]}}else{z=y.view[w]}if(z!=null){break}y=y.parent}}this._cache[w]=z}if(typeof z==="function"){z=z.call(this.view)}return z};function p(){this.clearCache()}p.prototype.clearCache=function(){this._cache={};this._partialCache={}};p.prototype.compile=function(x,w){return this._compile(this._cache,x,x,w)};p.prototype.compilePartial=function(x,y,w){return this._compile(this._partialCache,x,y,w)};p.prototype.render=function(y,w,x){return this.compile(y)(w,x)};p.prototype._compile=function(x,z,B,y){if(!x[z]){var C=u.parse(B,y);var A=e(C);var w=this;x[z]=function(D,F){if(F){if(typeof F==="function"){w._loadPartial=F}else{for(var E in F){w.compilePartial(E,F[E])}}}return A(w,r.make(D),B)}}return x[z]};p.prototype._section=function(w,x,E,D){var C=x.lookup(w);switch(typeof C){case"object":if(k(C)){var y="";for(var z=0,B=C.length;z<B;++z){y+=D(this,x.push(C[z]))}return y}return C?D(this,x.push(C)):"";case"function":var F=this;var A=function(G){return F.render(G,x)};return C.call(x.view,E,A)||"";default:if(C){return D(this,x)}}return""};p.prototype._inverted=function(w,x,z){var y=x.lookup(w);if(!y||(k(y)&&y.length===0)){return z(this,x)}return""};p.prototype._partial=function(w,x){if(!(w in this._partialCache)&&this._loadPartial){this.compilePartial(w,this._loadPartial(w))}var y=this._partialCache[w];return y?y(x):""};p.prototype._name=function(w,x){var y=x.lookup(w);if(typeof y==="function"){y=y.call(x.view)}return(y==null)?"":String(y)};p.prototype._escaped=function(w,x){return u.escape(this._name(w,x))};function i(x){var z=x[3];var w=z;var y;while((y=x[4])&&y.length){x=y[y.length-1];w=x[3]}return[z,w]}function e(y){var w={};function x(A,D,C){if(!w[A]){var B=e(D);w[A]=function(F,E){return B(F,E,C)}}return w[A]}function z(G,E,F){var B="";var D,H;for(var C=0,A=y.length;C<A;++C){D=y[C];switch(D[0]){case"#":H=F.slice.apply(F,i(D));B+=G._section(D[1],E,H,x(C,D[4],F));break;case"^":B+=G._inverted(D[1],E,x(C,D[4],F));break;case">":B+=G._partial(D[1],E);break;case"&":B+=G._name(D[1],E);break;case"name":B+=G._escaped(D[1],E);break;case"text":B+=D[1];break}}return B}return z}function v(B){var w=[];var A=w;var C=[];var y,z;for(var x=0;x<B.length;++x){y=B[x];switch(y[0]){case"#":case"^":y[4]=[];C.push(y);A.push(y);A=y[4];break;case"/":if(C.length===0){throw new Error("Unopened section: "+y[1])}z=C.pop();if(z[1]!==y[1]){throw new Error("Unclosed section: "+z[1])}if(C.length>0){A=C[C.length-1][4]}else{A=w}break;default:A.push(y)}}z=C.pop();if(z){throw new Error("Unclosed section: "+z[1])}return w}function a(z){var y,w;for(var x=0;x<z.length;++x){y=z[x];if(w&&w[0]==="text"&&y[0]==="text"){w[1]+=y[1];w[3]=y[3];z.splice(x--,1)}else{w=y}}}function q(w){if(w.length!==2){throw new Error("Invalid tags: "+w.join(" "))}return[new RegExp(f(w[0])+"\\s*"),new RegExp("\\s*"+f(w[1]))]}u.parse=function(I,K){K=K||u.tags;var J=q(K);var z=new t(I);var G=[],E=[],C=false,L=false;function x(){if(C&&!L){while(E.length){G.splice(E.pop(),1)}}else{E=[]}C=false;L=false}var w,F,H,A;while(!z.eos()){w=z.pos;H=z.scanUntil(J[0]);if(H){for(var B=0,D=H.length;B<D;++B){A=H.charAt(B);if(g(A)){E.push(G.length)}else{L=true}G.push(["text",A,w,w+1]);w+=1;if(A==="\n"){x()}}}w=z.pos;if(!z.scan(J[0])){break}C=true;F=z.scan(s)||"name";z.scan(d);if(F==="="){H=z.scanUntil(h);z.scan(h);z.scanUntil(J[1])}else{if(F==="{"){var y=new RegExp("\\s*"+f("}"+K[1]));H=z.scanUntil(y);z.scan(n);z.scanUntil(J[1]);F="&"}else{H=z.scanUntil(J[1])}}if(!z.scan(J[1])){throw new Error("Unclosed tag at "+z.pos)}G.push([F,H,w,z.pos]);if(F==="name"||F==="{"||F==="&"){L=true}if(F==="="){K=H.split(l);J=q(K)}}a(G);return v(G)};var b=new p();u.clearCache=function(){return b.clearCache()};u.compile=function(x,w){return b.compile(x,w)};u.compilePartial=function(x,y,w){return b.compilePartial(x,y,w)};u.render=function(y,w,x){return b.render(y,w,x)};u.to_html=function(z,x,y,A){var w=u.render(z,x,y);if(typeof A==="function"){A(w)}else{return w}};return u}())));;
function WearScriptConnection(ws, group, device) {
    this.ws = ws;
    this.group = group;
    this.device = device;
    this.groupDevice = group + ':' + device;
    this._channelsInternal = {};
    this.deviceToChannels = {};
    this._externalChannels = {};

    this.exists = function (channel) {
	return channel == 'subscriptions' || this._exists(channel, this._externalChannels).length;
    }

    this.channelsInternal = function() {
	return this._keys(this._channelsInternal);
    }

    this.channelsExternal = function() {
	return this.deviceToChannels;
    }

    this.receive = function (event) {
	a = event;
	console.log('here:' + event)
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            var data = msgpack.unpack(reader.result);
	    console.log('loaded: ' + data)
	    if (data[0] == 'subscriptions') {
		this.deviceToChannels[data[1]] = data[2];
		var externalChannels = [];
		for (var key in this.deviceToChannels) {
		    console.log(key)
		    var value = this.deviceToChannels[key];
		    for (var i = 0; i < value.length; i++) {
			console.log(value[i])
			externalChannels[value[i]] = true;
		    }
		}
		this._externalChannels = externalChannels;
	    }
	    var matches = this._exists(data[0], this._channelsInternal);
	    for (var i = 0; i < matches.length; i++)
		matches[i].apply(null, data);
	}.bind(this));
        reader.readAsBinaryString(event.data);
    }
    ws.onmessage = this.receive.bind(this);

    this._exists = function (channel, container) {
	var channelCur = '';
	var parts = channel.split(':');
	var matches = [];
	for (var i = 0; i < parts.length; i++) {
	    if (container.hasOwnProperty(channelCur))
		matches.push(channelCur);
	    if (!i) {
		channelCur += parts[i];
	    } else {
		channelCur += ':' + parts[i];
	    }
	}
	if (container.hasOwnProperty(channelCur))
	    matches.push(container[channelCur]);
	return matches;
    }
    this.channel = function () {
	return arguments.join(':');
    }

    this.subchannel = function () {
	return self.groupDevice + ':' + arguments.join(':')
    }

    this.ackchannel = function (channel) {
	return channel + ':ACK';
    }

    this._keys = function (obj) {
	var keys = [];
	for (var key in obj) if (obj.hasOwnProperty(key)) keys.push(key);
	return keys;
    }
    
    this.subscribe = function (channel, callback) {
	if (!this._channelsInternal.hasOwnProperty(channel)) {
	    this._channelsInternal[channel] = callback;
	    this.publish('subscriptions', this.groupDevice, this._keys(this._channelsInternal));
	} else {
	    this._channelsInternal[channel] = callback;
	}
	return this;
    }

    this.unsubscribe = function (channel) {
	if (this._channelsInternal.hasOwnProperty(channel)) {
	    delete this._channelsInternal[channel]
	    this.publish('subscriptions', this.groupDevice, this._keys(this._channelsInternal));
	}
	return this;
    }

    this.publish = function () {
	if (!this.exists(arguments[0])) {
	    return this;
	}
	
	this.send.apply(this, arguments);
	return this;
    }

    this.send = function () {
	var data_enc = msgpack.pack(Array.prototype.slice.call(arguments));
	var data_out = new Uint8Array(data_enc.length);
	var i;
	for (i = 0; i < data_enc.length; i++) {
            data_out[i] = data_enc[i];
	}
	this.ws.send(data_out);
    }
}
