function MediumEditor(e,t){"use strict";return this.init(e,t)}"object"==typeof module&&(module.exports=MediumEditor),function(e,t){"use strict";function i(e,t){var i;if(void 0===e)return t;for(i in t)t.hasOwnProperty(i)&&e.hasOwnProperty(i)===!1&&(e[i]=t[i]);return e}function n(){var t,i,n,o=e.getSelection();if(o.getRangeAt&&o.rangeCount){for(n=[],t=0,i=o.rangeCount;i>t;t+=1)n.push(o.getRangeAt(t));return n}return null}function o(t){var i,n,o=e.getSelection();if(t)for(o.removeAllRanges(),i=0,n=t.length;n>i;i+=1)o.addRange(t[i])}function r(){var e=t.getSelection().anchorNode,i=e&&3===e.nodeType?e.parentNode:e;return i}function a(){var i,n,o,r,a="";if(void 0!==e.getSelection){if(n=e.getSelection(),n.rangeCount){for(r=t.createElement("div"),i=0,o=n.rangeCount;o>i;i+=1)r.appendChild(n.getRangeAt(i).cloneContents());a=r.innerHTML}}else void 0!==t.selection&&"Text"===t.selection.type&&(a=t.selection.createRange().htmlText);return a}function s(e){return!(!e||1!==e.nodeType)}MediumEditor.prototype={defaults:{allowMultiParagraphSelection:!0,anchorInputPlaceholder:"Paste or type a link",anchorPreviewHideDelay:500,buttons:["bold","italic","underline","anchor","header1","header2","quote"],buttonLabels:!1,checkLinkFormat:!1,cleanPastedHTML:!1,delay:0,diffLeft:0,diffTop:-10,disableReturn:!1,disableDoubleReturn:!1,disableToolbar:!1,disableEditing:!1,elementsContainer:!1,firstHeader:"h3",forcePlainText:!0,placeholder:"Type your text",secondHeader:"h4",targetBlank:!1,extensions:{},activeButtonClass:"medium-editor-button-active",firstButtonClass:"medium-editor-button-first",lastButtonClass:"medium-editor-button-last"},isIE:"Microsoft Internet Explorer"===navigator.appName||"Netscape"===navigator.appName&&null!==new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})").exec(navigator.userAgent),init:function(e,n){return this.setElementSelection(e),0!==this.elements.length?(this.parentElements=["p","h1","h2","h3","h4","h5","h6","blockquote","pre"],this.id=t.querySelectorAll(".medium-editor-toolbar").length+1,this.options=i(n,this.defaults),this.setup()):void 0},setup:function(){this.isActive=!0,this.initElements().bindSelect().bindPaste().setPlaceholders().bindWindowActions().passInstance()},initElements:function(){this.updateElementList();var e,i=!1;for(e=0;e<this.elements.length;e+=1)this.options.disableEditing||this.elements[e].getAttribute("data-disable-editing")||this.elements[e].setAttribute("contentEditable",!0),this.elements[e].getAttribute("data-placeholder")||this.elements[e].setAttribute("data-placeholder",this.options.placeholder),this.elements[e].setAttribute("data-medium-element",!0),this.bindParagraphCreation(e).bindReturn(e).bindTab(e),this.options.disableToolbar||this.elements[e].getAttribute("data-disable-toolbar")||(i=!0);return i&&(this.options.elementsContainer||(this.options.elementsContainer=t.body),this.initToolbar().bindButtons().bindAnchorForm().bindAnchorPreview()),this},setElementSelection:function(e){this.elementSelection=e,this.updateElementList()},updateElementList:function(){this.elements="string"==typeof this.elementSelection?t.querySelectorAll(this.elementSelection):this.elementSelection,1===this.elements.nodeType&&(this.elements=[this.elements])},serialize:function(){var e,t,i={};for(e=0;e<this.elements.length;e+=1)t=""!==this.elements[e].id?this.elements[e].id:"element-"+e,i[t]={value:this.elements[e].innerHTML.trim()};return i},callExtensions:function(e){if(!(arguments.length<1)){var t,i,n=Array.prototype.slice.call(arguments,1);for(i in this.options.extensions)this.options.extensions.hasOwnProperty(i)&&(t=this.options.extensions[i],void 0!==t[e]&&t[e].apply(t,n))}},passInstance:function(){var e,t,i=this;for(t in i.options.extensions)i.options.extensions.hasOwnProperty(t)&&(e=i.options.extensions[t],e.parent&&(e.base=i));return i},bindParagraphCreation:function(e){var i=this;return this.elements[e].addEventListener("keypress",function(e){var i,n=r();32===e.which&&(i=n.tagName.toLowerCase(),"a"===i&&t.execCommand("unlink",!1,null))}),this.elements[e].addEventListener("keyup",function(e){var n,o=r();o&&o.getAttribute("data-medium-element")&&0===o.children.length&&!i.options.disableReturn&&!o.getAttribute("data-disable-return")&&t.execCommand("formatBlock",!1,"p"),13===e.which&&(o=r(),n=o.tagName.toLowerCase(),i.options.disableReturn||this.getAttribute("data-disable-return")||"li"===n||i.isListItemChild(o)||(e.shiftKey||t.execCommand("formatBlock",!1,"p"),"a"===n&&t.execCommand("unlink",!1,null)))}),this},isListItemChild:function(e){for(var t=e.parentNode,i=t.tagName.toLowerCase();-1===this.parentElements.indexOf(i)&&"div"!==i;){if("li"===i)return!0;if(t=t.parentNode,!t||!t.tagName)return!1;i=t.tagName.toLowerCase()}return!1},bindReturn:function(e){var t=this;return this.elements[e].addEventListener("keypress",function(e){if(13===e.which)if(t.options.disableReturn||this.getAttribute("data-disable-return"))e.preventDefault();else if(t.options.disableDoubleReturn||this.getAttribute("data-disable-double-return")){var i=r();i&&"\n"===i.innerText&&e.preventDefault()}}),this},bindTab:function(e){return this.elements[e].addEventListener("keydown",function(e){if(9===e.which){var i=r().tagName.toLowerCase();"pre"===i&&(e.preventDefault(),t.execCommand("insertHtml",null,"    "))}}),this},buttonTemplate:function(e){var t=this.getButtonLabels(this.options.buttonLabels),i={bold:'<button class="medium-editor-action medium-editor-action-bold" data-action="bold" data-element="b">'+t.bold+"</button>",italic:'<button class="medium-editor-action medium-editor-action-italic" data-action="italic" data-element="i">'+t.italic+"</button>",underline:'<button class="medium-editor-action medium-editor-action-underline" data-action="underline" data-element="u">'+t.underline+"</button>",strikethrough:'<button class="medium-editor-action medium-editor-action-strikethrough" data-action="strikethrough" data-element="strike"><strike>A</strike></button>',superscript:'<button class="medium-editor-action medium-editor-action-superscript" data-action="superscript" data-element="sup">'+t.superscript+"</button>",subscript:'<button class="medium-editor-action medium-editor-action-subscript" data-action="subscript" data-element="sub">'+t.subscript+"</button>",anchor:'<button class="medium-editor-action medium-editor-action-anchor" data-action="anchor" data-element="a">'+t.anchor+"</button>",image:'<button class="medium-editor-action medium-editor-action-image" data-action="image" data-element="img">'+t.image+"</button>",header1:'<button class="medium-editor-action medium-editor-action-header1" data-action="append-'+this.options.firstHeader+'" data-element="'+this.options.firstHeader+'">'+t.header1+"</button>",header2:'<button class="medium-editor-action medium-editor-action-header2" data-action="append-'+this.options.secondHeader+'" data-element="'+this.options.secondHeader+'">'+t.header2+"</button>",quote:'<button class="medium-editor-action medium-editor-action-quote" data-action="append-blockquote" data-element="blockquote">'+t.quote+"</button>",orderedlist:'<button class="medium-editor-action medium-editor-action-orderedlist" data-action="insertorderedlist" data-element="ol">'+t.orderedlist+"</button>",unorderedlist:'<button class="medium-editor-action medium-editor-action-unorderedlist" data-action="insertunorderedlist" data-element="ul">'+t.unorderedlist+"</button>",pre:'<button class="medium-editor-action medium-editor-action-pre" data-action="append-pre" data-element="pre">'+t.pre+"</button>",indent:'<button class="medium-editor-action medium-editor-action-indent" data-action="indent" data-element="ul">'+t.indent+"</button>",outdent:'<button class="medium-editor-action medium-editor-action-outdent" data-action="outdent" data-element="ul">'+t.outdent+"</button>"};return i[e]||!1},getButtonLabels:function(e){var t,i,n={bold:"<b>B</b>",italic:"<b><i>I</i></b>",underline:"<b><u>U</u></b>",superscript:"<b>x<sup>1</sup></b>",subscript:"<b>x<sub>1</sub></b>",anchor:"<b>#</b>",image:"<b>image</b>",header1:"<b>H1</b>",header2:"<b>H2</b>",quote:"<b>&ldquo;</b>",orderedlist:"<b>1.</b>",unorderedlist:"<b>&bull;</b>",pre:"<b>0101</b>",indent:"<b>&rarr;</b>",outdent:"<b>&larr;</b>"};if("fontawesome"===e?t={bold:'<i class="fa fa-bold"></i>',italic:'<i class="fa fa-italic"></i>',underline:'<i class="fa fa-underline"></i>',superscript:'<i class="fa fa-superscript"></i>',subscript:'<i class="fa fa-subscript"></i>',anchor:'<i class="fa fa-link"></i>',image:'<i class="fa fa-picture-o"></i>',quote:'<i class="fa fa-quote-right"></i>',orderedlist:'<i class="fa fa-list-ol"></i>',unorderedlist:'<i class="fa fa-list-ul"></i>',pre:'<i class="fa fa-code fa-lg"></i>',indent:'<i class="fa fa-indent"></i>',outdent:'<i class="fa fa-outdent"></i>'}:"object"==typeof e&&(t=e),"object"==typeof t)for(i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);return n},initToolbar:function(){return this.toolbar?this:(this.toolbar=this.createToolbar(),this.keepToolbarAlive=!1,this.anchorForm=this.toolbar.querySelector(".medium-editor-toolbar-form-anchor"),this.anchorInput=this.anchorForm.querySelector("input"),this.toolbarActions=this.toolbar.querySelector(".medium-editor-toolbar-actions"),this.anchorPreview=this.createAnchorPreview(),this)},createToolbar:function(){var e=t.createElement("div");return e.id="medium-editor-toolbar-"+this.id,e.className="medium-editor-toolbar",e.appendChild(this.toolbarButtons()),e.appendChild(this.toolbarFormAnchor()),this.options.elementsContainer.appendChild(e),e},toolbarButtons:function(){var e,i,n,o,r=this.options.buttons,a=t.createElement("ul");for(a.id="medium-editor-toolbar-actions",a.className="medium-editor-toolbar-actions clearfix",i=0;i<r.length;i+=1)this.options.extensions.hasOwnProperty(r[i])?(o=this.options.extensions[r[i]],n=void 0!==o.getButton?o.getButton():null):n=this.buttonTemplate(r[i]),n&&(e=t.createElement("li"),s(n)?e.appendChild(n):e.innerHTML=n,a.appendChild(e));return a},toolbarFormAnchor:function(){var e=t.createElement("div"),i=t.createElement("input"),n=t.createElement("a");return n.setAttribute("href","#"),n.innerHTML="&times;",i.setAttribute("type","text"),i.setAttribute("placeholder",this.options.anchorInputPlaceholder),e.className="medium-editor-toolbar-form-anchor",e.id="medium-editor-toolbar-form-anchor",e.appendChild(i),e.appendChild(n),e},bindSelect:function(){var e,i=this,n="";for(this.checkSelectionWrapper=function(e){return e&&i.clickingIntoArchorForm(e)?!1:(clearTimeout(n),void(n=setTimeout(function(){i.checkSelection()},i.options.delay)))},t.documentElement.addEventListener("mouseup",this.checkSelectionWrapper),e=0;e<this.elements.length;e+=1)this.elements[e].addEventListener("keyup",this.checkSelectionWrapper),this.elements[e].addEventListener("blur",this.checkSelectionWrapper);return this},checkSelection:function(){var t,i;return this.keepToolbarAlive===!0||this.options.disableToolbar||(t=e.getSelection(),""===t.toString().trim()||this.options.allowMultiParagraphSelection===!1&&this.hasMultiParagraphs()?this.hideToolbarActions():(i=this.getSelectionElement(),!i||i.getAttribute("data-disable-toolbar")?this.hideToolbarActions():this.checkSelectionElement(t,i))),this},clickingIntoArchorForm:function(e){var t=this;return e.type&&"blur"===e.type.toLowerCase()&&e.relatedTarget&&e.relatedTarget===t.anchorInput?!0:!1},hasMultiParagraphs:function(){var e=a().replace(/<[\S]+><\/[\S]+>/gim,""),t=e.match(/<(p|h[0-6]|blockquote)>([\s\S]*?)<\/(p|h[0-6]|blockquote)>/g);return t?t.length:0},checkSelectionElement:function(e,t){var i;for(this.selection=e,this.selectionRange=this.selection.getRangeAt(0),i=0;i<this.elements.length;i+=1)if(this.elements[i]===t)return void this.setToolbarButtonStates().setToolbarPosition().showToolbarActions();this.hideToolbarActions()},getSelectionElement:function(){var t,i,n,o,r=e.getSelection(),a=function(e){var t=e;try{for(;!t.getAttribute("data-medium-element");)t=t.parentNode}catch(i){return!1}return t};try{t=r.getRangeAt(0),i=t.commonAncestorContainer,n=i.parentNode,o=i.getAttribute("data-medium-element")?i:a(n)}catch(s){o=a(n)}return o},setToolbarPosition:function(){var t=50,i=e.getSelection(),n=i.getRangeAt(0),o=n.getBoundingClientRect(),r=this.options.diffLeft-this.toolbar.offsetWidth/2,a=(o.left+o.right)/2,s=this.toolbar.offsetWidth/2;return o.top<t?(this.toolbar.classList.add("medium-toolbar-arrow-over"),this.toolbar.classList.remove("medium-toolbar-arrow-under"),this.toolbar.style.top=t+o.bottom-this.options.diffTop+e.pageYOffset-this.toolbar.offsetHeight+"px"):(this.toolbar.classList.add("medium-toolbar-arrow-under"),this.toolbar.classList.remove("medium-toolbar-arrow-over"),this.toolbar.style.top=o.top+this.options.diffTop+e.pageYOffset-this.toolbar.offsetHeight+"px"),this.toolbar.style.left=s>a?r+s+"px":e.innerWidth-a<s?e.innerWidth+r-s+"px":r+a+"px",this.hideAnchorPreview(),this},setToolbarButtonStates:function(){var e,t=this.toolbarActions.querySelectorAll("button");for(e=0;e<t.length;e+=1)t[e].classList.remove(this.options.activeButtonClass);return this.checkActiveButtons(),this},checkActiveButtons:function(){for(var e=Array.prototype.slice.call(this.elements),t=this.getSelectedParentElement();void 0!==t.tagName&&-1===this.parentElements.indexOf(t.tagName.toLowerCase)&&(this.activateButton(t.tagName.toLowerCase()),this.callExtensions("checkState",t),-1===e.indexOf(t));)t=t.parentNode},activateButton:function(e){var t=this.toolbar.querySelector('[data-element="'+e+'"]');null!==t&&-1===t.className.indexOf(this.options.activeButtonClass)&&(t.className+=" "+this.options.activeButtonClass)},bindButtons:function(){var e,t=this.toolbar.querySelectorAll("button"),i=this,n=function(e){e.preventDefault(),e.stopPropagation(),void 0===i.selection&&i.checkSelection(),this.className.indexOf(i.options.activeButtonClass)>-1?this.classList.remove(i.options.activeButtonClass):this.className+=" "+i.options.activeButtonClass,this.hasAttribute("data-action")&&i.execAction(this.getAttribute("data-action"),e)};for(e=0;e<t.length;e+=1)t[e].addEventListener("click",n);return this.setFirstAndLastItems(t),this},setFirstAndLastItems:function(e){return e.length>0&&(e[0].className+=" "+this.options.firstButtonClass,e[e.length-1].className+=" "+this.options.lastButtonClass),this},execAction:function(i,n){i.indexOf("append-")>-1?(this.execFormatBlock(i.replace("append-","")),this.setToolbarPosition(),this.setToolbarButtonStates()):"anchor"===i?this.triggerAnchorAction(n):"image"===i?t.execCommand("insertImage",!1,e.getSelection()):(t.execCommand(i,!1,null),this.setToolbarPosition())},rangeSelectsSingleNode:function(e){var t=e.startContainer;return t===e.endContainer&&t.hasChildNodes()&&e.endOffset===e.startOffset+1},getSelectedParentElement:function(){var e=null,t=this.selectionRange;return e=this.rangeSelectsSingleNode(t)?t.startContainer.childNodes[t.startOffset]:3===t.startContainer.nodeType?t.startContainer.parentNode:t.startContainer},triggerAnchorAction:function(){var e=this.getSelectedParentElement();return e.tagName&&"a"===e.tagName.toLowerCase()?t.execCommand("unlink",!1,null):"block"===this.anchorForm.style.display?this.showToolbarActions():this.showAnchorForm(),this},execFormatBlock:function(e){var i=this.getSelectionData(this.selection.anchorNode);if("blockquote"===e&&i.el&&"blockquote"===i.el.parentNode.tagName.toLowerCase())return t.execCommand("outdent",!1,null);if(i.tagName===e&&(e="p"),this.isIE){if("blockquote"===e)return t.execCommand("indent",!1,e);e="<"+e+">"}return t.execCommand("formatBlock",!1,e)},getSelectionData:function(e){var t;for(e&&e.tagName&&(t=e.tagName.toLowerCase());e&&-1===this.parentElements.indexOf(t);)e=e.parentNode,e&&e.tagName&&(t=e.tagName.toLowerCase());return{el:e,tagName:t}},getFirstChild:function(e){for(var t=e.firstChild;null!==t&&1!==t.nodeType;)t=t.nextSibling;return t},hideToolbarActions:function(){this.keepToolbarAlive=!1,void 0!==this.toolbar&&this.toolbar.classList.remove("medium-editor-toolbar-active")},showToolbarActions:function(){var e,t=this;this.anchorForm.style.display="none",this.toolbarActions.style.display="block",this.keepToolbarAlive=!1,clearTimeout(e),e=setTimeout(function(){t.toolbar&&!t.toolbar.classList.contains("medium-editor-toolbar-active")&&t.toolbar.classList.add("medium-editor-toolbar-active")},100)},saveSelection:function(){this.savedSelection=n()},restoreSelection:function(){o(this.savedSelection)},showAnchorForm:function(e){this.toolbarActions.style.display="none",this.saveSelection(),this.anchorForm.style.display="block",this.keepToolbarAlive=!0,this.anchorInput.focus(),this.anchorInput.value=e||""},bindAnchorForm:function(){var e=this.anchorForm.querySelector("a"),t=this;return this.anchorForm.addEventListener("click",function(e){e.stopPropagation()}),this.anchorInput.addEventListener("keyup",function(e){13===e.keyCode&&(e.preventDefault(),t.createLink(this))}),this.anchorInput.addEventListener("click",function(e){e.stopPropagation(),t.keepToolbarAlive=!0}),this.anchorInput.addEventListener("blur",function(){t.keepToolbarAlive=!1,t.checkSelection()}),e.addEventListener("click",function(e){e.preventDefault(),t.showToolbarActions(),o(t.savedSelection)}),this},hideAnchorPreview:function(){this.anchorPreview.classList.remove("medium-editor-anchor-preview-active")},showAnchorPreview:function(t){if(this.anchorPreview.classList.contains("medium-editor-anchor-preview-active"))return!0;var i,n,o,r=this,a=40,s=t.getBoundingClientRect(),l=(s.left+s.right)/2;return r.anchorPreview.querySelector("i").textContent=t.href,i=r.anchorPreview.offsetWidth/2,n=r.options.diffLeft-i,clearTimeout(o),o=setTimeout(function(){r.anchorPreview&&!r.anchorPreview.classList.contains("medium-editor-anchor-preview-active")&&r.anchorPreview.classList.add("medium-editor-anchor-preview-active")},100),r.observeAnchorPreview(t),r.anchorPreview.classList.add("medium-toolbar-arrow-over"),r.anchorPreview.classList.remove("medium-toolbar-arrow-under"),r.anchorPreview.style.top=Math.round(a+s.bottom-r.options.diffTop+e.pageYOffset-r.anchorPreview.offsetHeight)+"px",r.anchorPreview.style.left=i>l?n+i+"px":e.innerWidth-l<i?e.innerWidth+n-i+"px":n+l+"px",this},observeAnchorPreview:function(e){var t=this,i=(new Date).getTime(),n=!0,o=function(){i=(new Date).getTime(),n=!0},r=function(e){e.relatedTarget&&/anchor-preview/.test(e.relatedTarget.className)||(n=!1)},a=setInterval(function(){if(n)return!0;var s=(new Date).getTime()-i;s>t.options.anchorPreviewHideDelay&&(t.hideAnchorPreview(),clearInterval(a),t.anchorPreview.removeEventListener("mouseover",o),t.anchorPreview.removeEventListener("mouseout",r),e.removeEventListener("mouseover",o),e.removeEventListener("mouseout",r))},200);t.anchorPreview.addEventListener("mouseover",o),t.anchorPreview.addEventListener("mouseout",r),e.addEventListener("mouseover",o),e.addEventListener("mouseout",r)},createAnchorPreview:function(){var e=this,i=t.createElement("div");return i.id="medium-editor-anchor-preview-"+this.id,i.className="medium-editor-anchor-preview",i.innerHTML=this.anchorPreviewTemplate(),this.options.elementsContainer.appendChild(i),i.addEventListener("click",function(){e.anchorPreviewClickHandler()}),i},anchorPreviewTemplate:function(){return'<div class="medium-editor-toolbar-anchor-preview" id="medium-editor-toolbar-anchor-preview">    <i class="medium-editor-toolbar-anchor-preview-inner"></i></div>'},anchorPreviewClickHandler:function(){if(this.activeAnchor){var i=this,n=t.createRange(),o=e.getSelection();n.selectNodeContents(i.activeAnchor),o.removeAllRanges(),o.addRange(n),setTimeout(function(){i.activeAnchor&&i.showAnchorForm(i.activeAnchor.href),i.keepToolbarAlive=!1},100+i.options.delay)}this.hideAnchorPreview()},editorAnchorObserver:function(e){var t=this,i=!0,n=function(){i=!1,t.activeAnchor.removeEventListener("mouseout",n)};if(e.target&&"a"===e.target.tagName.toLowerCase()){if(!/href=["']\S+["']/.test(e.target.outerHTML)||/href=["']#\S+["']/.test(e.target.outerHTML))return!0;if(this.toolbar.classList.contains("medium-editor-toolbar-active"))return!0;this.activeAnchor=e.target,this.activeAnchor.addEventListener("mouseout",n),setTimeout(function(){i&&t.showAnchorPreview(e.target)},t.options.delay)}},bindAnchorPreview:function(){var e,t=this;for(this.editorAnchorObserverWrapper=function(e){t.editorAnchorObserver(e)},e=0;e<this.elements.length;e+=1)this.elements[e].addEventListener("mouseover",this.editorAnchorObserverWrapper);return this},checkLinkFormat:function(e){var t=/^(https?|ftps?|rtmpt?):\/\/|mailto:/;return(t.test(e)?"":"http://")+e},setTargetBlank:function(){var e,t=r();if("a"===t.tagName.toLowerCase())t.target="_blank";else for(t=t.getElementsByTagName("a"),e=0;e<t.length;e+=1)t[e].target="_blank"},createLink:function(e){return 0===e.value.trim().length?void this.hideToolbarActions():(o(this.savedSelection),this.options.checkLinkFormat&&(e.value=this.checkLinkFormat(e.value)),t.execCommand("createLink",!1,e.value),this.options.targetBlank&&this.setTargetBlank(),this.checkSelection(),this.showToolbarActions(),void(e.value=""))},bindWindowActions:function(){var t,i=this;return this.windowResizeHandler=function(){clearTimeout(t),t=setTimeout(function(){i.toolbar&&i.toolbar.classList.contains("medium-editor-toolbar-active")&&i.setToolbarPosition()},100)},e.addEventListener("resize",this.windowResizeHandler),this},activate:function(){this.isActive||this.setup()},deactivate:function(){var i;if(this.isActive)for(this.isActive=!1,void 0!==this.toolbar&&(this.options.elementsContainer.removeChild(this.anchorPreview),this.options.elementsContainer.removeChild(this.toolbar),delete this.toolbar,delete this.anchorPreview),t.documentElement.removeEventListener("mouseup",this.checkSelectionWrapper),e.removeEventListener("resize",this.windowResizeHandler),i=0;i<this.elements.length;i+=1)this.elements[i].removeEventListener("mouseover",this.editorAnchorObserverWrapper),this.elements[i].removeEventListener("keyup",this.checkSelectionWrapper),this.elements[i].removeEventListener("blur",this.checkSelectionWrapper),this.elements[i].removeEventListener("paste",this.pasteWrapper),this.elements[i].removeAttribute("contentEditable"),this.elements[i].removeAttribute("data-medium-element")},htmlEntities:function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},bindPaste:function(){var e,i=this;for(this.pasteWrapper=function(e){var n,o,r="";if(this.classList.remove("medium-editor-placeholder"),!i.options.forcePlainText&&!i.options.cleanPastedHTML)return this;if(e.clipboardData&&e.clipboardData.getData&&!e.defaultPrevented){if(e.preventDefault(),i.options.cleanPastedHTML&&e.clipboardData.getData("text/html"))return i.cleanPaste(e.clipboardData.getData("text/html"));if(i.options.disableReturn||this.getAttribute("data-disable-return"))t.execCommand("insertHTML",!1,e.clipboardData.getData("text/plain"));else{for(n=e.clipboardData.getData("text/plain").split(/[\r\n]/g),o=0;o<n.length;o+=1)""!==n[o]&&(r+=navigator.userAgent.match(/firefox/i)&&0===o?i.htmlEntities(n[o]):"<p>"+i.htmlEntities(n[o])+"</p>");t.execCommand("insertHTML",!1,r)}}},e=0;e<this.elements.length;e+=1)this.elements[e].addEventListener("paste",this.pasteWrapper);return this},setPlaceholders:function(){var e,t=function(e){e.querySelector("img")||e.querySelector("blockquote")||""!==e.textContent.replace(/^\s+|\s+$/g,"")||e.classList.add("medium-editor-placeholder")},i=function(e){this.classList.remove("medium-editor-placeholder"),"keypress"!==e.type&&t(this)};for(e=0;e<this.elements.length;e+=1)t(this.elements[e]),this.elements[e].addEventListener("blur",i),this.elements[e].addEventListener("keypress",i);return this},cleanPaste:function(e){var i,n,o,r=this.getSelectionElement(),a=/<p|<br|<div/.test(e),s=[[new RegExp(/<[^>]*docs-internal-guid[^>]*>/gi),""],[new RegExp(/<\/b>(<br[^>]*>)?$/gi),""],[new RegExp(/<span class="Apple-converted-space">\s+<\/span>/g)," "],[new RegExp(/<br class="Apple-interchange-newline">/g),"<br>"],[new RegExp(/<span[^>]*(font-style:italic;font-weight:bold|font-weight:bold;font-style:italic)[^>]*>/gi),'<span class="replace-with italic bold">'],[new RegExp(/<span[^>]*font-style:italic[^>]*>/gi),'<span class="replace-with italic">'],[new RegExp(/<span[^>]*font-weight:bold[^>]*>/gi),'<span class="replace-with bold">'],[new RegExp(/&lt;(\/?)(i|b|a)&gt;/gi),"<$1$2>"],[new RegExp(/&lt;a\s+href=(&quot;|&rdquo;|&ldquo;|“|”)([^&]+)(&quot;|&rdquo;|&ldquo;|“|”)&gt;/gi),'<a href="$2">']];for(i=0;i<s.length;i+=1)e=e.replace(s[i][0],s[i][1]);if(a)for(n=e.split("<br><br>"),this.pasteHTML("<p>"+n.join("</p><p>")+"</p>"),t.execCommand("insertText",!1,"\n"),n=r.querySelectorAll("p,div,br"),i=0;i<n.length;i+=1)switch(o=n[i],o.tagName.toLowerCase()){case"p":case"div":this.filterCommonBlocks(o);break;case"br":this.filterLineBreak(o)}else this.pasteHTML(e)},pasteHTML:function(e){var i,n,o,r,a=t.createDocumentFragment();for(a.appendChild(t.createElement("body")),r=a.querySelector("body"),r.innerHTML=e,this.cleanupSpans(r),i=r.querySelectorAll("*"),o=0;o<i.length;o+=1)n=i[o],n.removeAttribute("class"),n.removeAttribute("style"),n.removeAttribute("dir"),"meta"===n.tagName.toLowerCase()&&n.parentNode.removeChild(n);t.execCommand("insertHTML",!1,r.innerHTML.replace(/&nbsp;/g," "))},isCommonBlock:function(e){return e&&("p"===e.tagName.toLowerCase()||"div"===e.tagName.toLowerCase())},filterCommonBlocks:function(e){/^\s*$/.test(e.innerText)&&e.parentNode.removeChild(e)},filterLineBreak:function(e){this.isCommonBlock(e.previousElementSibling)?e.parentNode.removeChild(e):!this.isCommonBlock(e.parentNode)||e.parentNode.firstChild!==e&&e.parentNode.lastChild!==e?1===e.parentNode.childElementCount&&this.removeWithParent(e):e.parentNode.removeChild(e)},removeWithParent:function(e){e&&e.parentNode&&(e.parentNode.parentNode&&1===e.parentNode.childElementCount?e.parentNode.parentNode.removeChild(e.parentNode):e.parentNode.removeChild(e.parentNode))},cleanupSpans:function(e){var i,n,o,r=e.querySelectorAll(".replace-with");for(i=0;i<r.length;i+=1)n=r[i],o=t.createElement(n.classList.contains("bold")?"b":"i"),o.innerHTML=n.classList.contains("bold")&&n.classList.contains("italic")?"<i>"+n.innerHTML+"</i>":n.innerHTML,n.parentNode.replaceChild(o,n);for(r=e.querySelectorAll("span"),i=0;i<r.length;i+=1)n=r[i],/^\s*$/.test()?n.parentNode.removeChild(n):n.parentNode.replaceChild(t.createTextNode(n.innerText),n)}}}(window,document);