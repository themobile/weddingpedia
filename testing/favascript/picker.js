!function(e){"function"==typeof define&&define.amd?define("picker",["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):this.Picker=e(jQuery)}(function(e){function t(i,a,d,u){function f(){return t._.node("div",t._.node("div",t._.node("div",t._.node("div",x.component.nodes(v.open),_.box),_.wrap),_.frame),_.holder)}function l(){b.data(a,x).addClass(_.input).val(b.data("value")?x.get("select",y.format):i.value).on("focus."+v.id+" click."+v.id,g),y.editable||b.on("keydown."+v.id,function(e){var t=e.keyCode,n=/^(8|46)$/.test(t);return 27==t?(x.close(),!1):void((32==t||n||!v.open&&x.component.key[t])&&(e.preventDefault(),e.stopPropagation(),n?x.clear().close():x.open()))}),r(i,{haspopup:!0,expanded:!1,readonly:!1,owns:i.id+"_root"+(x._hidden?" "+x._hidden.id:"")})}function p(){x.$root.on({focusin:function(e){x.$root.removeClass(_.focused),e.stopPropagation()},"mousedown click":function(t){var n=t.target;n!=x.$root.children()[0]&&(t.stopPropagation(),"mousedown"!=t.type||e(n).is(":input")||"OPTION"==n.nodeName||(t.preventDefault(),i.focus()))}}).on("click","[data-pick], [data-nav], [data-clear], [data-close]",function(){var t=e(this),n=t.data(),o=t.hasClass(_.navDisabled)||t.hasClass(_.disabled),r=document.activeElement;r=r&&(r.type||r.href)&&r,(o||r&&!e.contains(x.$root[0],r))&&i.focus(),!o&&n.nav?x.set("highlight",x.component.item.highlight,{nav:n.nav}):!o&&"pick"in n?x.set("select",n.pick).close(!0):n.clear?x.clear().close(!0):n.close&&x.close(!0)}),r(x.$root[0],"hidden",!0)}function m(){var t;y.hiddenName===!0?(t=i.name,i.name=""):(t=["string"==typeof y.hiddenPrefix?y.hiddenPrefix:"","string"==typeof y.hiddenSuffix?y.hiddenSuffix:"_submit"],t=t[0]+i.name+t[1]),x._hidden=e('<input type=hidden name="'+t+'"'+(b.data("value")||i.value?' value="'+x.get("select",y.formatSubmit)+'"':"")+">")[0],b.on("change."+v.id,function(){x._hidden.value=i.value?x.get("select",y.formatSubmit):""}).after(x._hidden)}function g(e){e.stopPropagation(),"focus"==e.type&&x.$root.addClass(_.focused),x.open()}if(!i)return t;var h=!1,v={id:i.id||"P"+Math.abs(~~(Math.random()*new Date))},y=d?e.extend(!0,{},d.defaults,u):u||{},_=e.extend({},t.klasses(),y.klass),b=e(i),k=function(){return this.start()},x=k.prototype={constructor:k,$node:b,start:function(){return v&&v.start?x:(v.methods={},v.start=!0,v.open=!1,v.type=i.type,i.autofocus=i==document.activeElement,i.readOnly=!y.editable,i.id=i.id||v.id,"text"!=i.type&&(i.type="text"),x.component=new d(x,y),x.$root=e(t._.node("div",f(),_.picker,'id="'+i.id+'_root"')),p(),y.formatSubmit&&m(),l(),y.container?e(y.container).append(x.$root):b.after(x.$root),x.on({start:x.component.onStart,render:x.component.onRender,stop:x.component.onStop,open:x.component.onOpen,close:x.component.onClose,set:x.component.onSet}).on({start:y.onStart,render:y.onRender,stop:y.onStop,open:y.onOpen,close:y.onClose,set:y.onSet}),h=n(x.$root.children()[0]),i.autofocus&&x.open(),x.trigger("start").trigger("render"))},render:function(e){return e?x.$root.html(f()):x.$root.find("."+_.box).html(x.component.nodes(v.open)),x.trigger("render")},stop:function(){return v.start?(x.close(),x._hidden&&x._hidden.parentNode.removeChild(x._hidden),x.$root.remove(),b.removeClass(_.input).removeData(a),setTimeout(function(){b.off("."+v.id)},0),i.type=v.type,i.readOnly=!1,x.trigger("stop"),v.methods={},v.start=!1,x):x},open:function(n){return v.open?x:(b.addClass(_.active),r(i,"expanded",!0),setTimeout(function(){x.$root.addClass(_.opened),r(x.$root[0],"hidden",!1)},0),n!==!1&&(v.open=!0,h&&c.css("overflow","hidden").css("padding-right","+="+o()),b.trigger("focus"),s.on("click."+v.id+" focusin."+v.id,function(e){var t=e.target;t!=i&&t!=document&&3!=e.which&&x.close(t===x.$root.children()[0])}).on("keydown."+v.id,function(n){var o=n.keyCode,r=x.component.key[o],a=n.target;27==o?x.close(!0):a!=i||!r&&13!=o?e.contains(x.$root[0],a)&&13==o&&(n.preventDefault(),a.click()):(n.preventDefault(),r?t._.trigger(x.component.key.go,x,[t._.trigger(r)]):x.$root.find("."+_.highlighted).hasClass(_.disabled)||x.set("select",x.component.item.highlight).close())})),x.trigger("open"))},close:function(e){e&&(b.off("focus."+v.id).trigger("focus"),setTimeout(function(){b.on("focus."+v.id,g)},0)),setTimeout(function(){return x.$root.removeClass(_.opened+" "+_.focused),r(x.$root[0],"hidden",!0),b.removeClass(_.active),r(i,"expanded",!1),v.open?(v.open=!1,h&&c.css("overflow","").css("padding-right","-="+o()),s.off("."+v.id),x.trigger("close")):x},0)},clear:function(e){return x.set("clear",null,e)},set:function(t,n,o){var r,i,a=e.isPlainObject(t),d=a?t:{};if(o=a&&e.isPlainObject(n)?n:o||{},t){a||(d[t]=n);for(r in d)i=d[r],r in x.component.item&&(void 0===i&&(i=null),x.component.set(r,i,o)),("select"==r||"clear"==r)&&b.val("clear"==r?"":x.get(r,y.format)).trigger("change");x.render()}return o.muted?x:x.trigger("set",d)},get:function(e,n){if(e=e||"value",null!=v[e])return v[e];if("value"==e)return i.value;if(e in x.component.item){if("string"==typeof n){var o=x.component.get(e);return o?t._.trigger(x.component.formats.toString,x.component,[n,o]):""}return x.component.get(e)}},on:function(t,n,o){var r,i,a=e.isPlainObject(t),d=a?t:{};if(t){a||(d[t]=n);for(r in d)i=d[r],o&&(r="_"+r),v.methods[r]=v.methods[r]||[],v.methods[r].push(i)}return x},off:function(){var e,t,n=arguments;for(e=0,namesCount=n.length;namesCount>e;e+=1)t=n[e],t in v.methods&&delete v.methods[t];return x},trigger:function(e,n){var o=function(e){var o=v.methods[e];o&&o.map(function(e){t._.trigger(e,x,[n])})};return o("_"+e),o(e),x}};return new k}function n(e){var t,n="position";return e.currentStyle?t=e.currentStyle[n]:window.getComputedStyle&&(t=getComputedStyle(e)[n]),"fixed"==t}function o(){if(c.height()<=d.height())return 0;var t=e('<div style="visibility:hidden;width:100px" />').appendTo("body"),n=t[0].offsetWidth;t.css("overflow","scroll");var o=e('<div style="width:100%" />').appendTo(t),r=o[0].offsetWidth;return t.remove(),n-r}function r(t,n,o){if(e.isPlainObject(n))for(var r in n)i(t,r,n[r]);else i(t,n,o)}function i(e,t,n){e.setAttribute(("role"==t?"":"aria-")+t,n)}function a(t,n){e.isPlainObject(t)||(t={attribute:n}),n="";for(var o in t){var r=("role"==o?"":"aria-")+o,i=t[o];n+=null==i?"":r+'="'+t[o]+'"'}return n}var d=e(window),s=e(document),c=e(document.documentElement);return t.klasses=function(e){return e=e||"picker",{picker:e,opened:e+"--opened",focused:e+"--focused",input:e+"__input",active:e+"__input--active",holder:e+"__holder",frame:e+"__frame",wrap:e+"__wrap",box:e+"__box"}},t._={group:function(e){for(var n,o="",r=t._.trigger(e.min,e);r<=t._.trigger(e.max,e,[r]);r+=e.i)n=t._.trigger(e.item,e,[r]),o+=t._.node(e.node,n[0],n[1],n[2]);return o},node:function(t,n,o,r){return n?(n=e.isArray(n)?n.join(""):n,o=o?' class="'+o+'"':"",r=r?" "+r:"","<"+t+o+r+">"+n+"</"+t+">"):""},lead:function(e){return(10>e?"0":"")+e},trigger:function(e,t,n){return"function"==typeof e?e.apply(t,n||[]):e},digits:function(e){return/\d/.test(e[1])?2:1},isDate:function(e){return{}.toString.call(e).indexOf("Date")>-1&&this.isInteger(e.getUTCDate())},isInteger:function(e){return{}.toString.call(e).indexOf("Number")>-1&&e%1===0},ariaAttr:a},t.extend=function(n,o){e.fn[n]=function(r,i){var a=this.data(n);return"picker"==r?a:a&&"string"==typeof r?t._.trigger(a[r],a,[i]):this.each(function(){var i=e(this);i.data(n)||new t(this,n,o,r)})},e.fn[n].defaults=o.defaults},t});