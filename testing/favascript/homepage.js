$(document).load(function(){}).ready(function(){function e(e,a){var t=new Date;t.setTime(t.getTime()+864e5),document.cookie=e+"="+a+";expires="+t.toUTCString()}function a(){$(".video-socialbuttons").addClass("playing")}function t(){$(".video-socialbuttons").removeClass("playing")}function o(e,a,t,o){function n(e){console.log(e)}var i=/(<([^>]+)>)/gi;a=a?a.replace(i," ").trim():"";var r={method:"feed",name:e,description:a,link:t,picture:"http://www.weddingpedia.ro"+o};FB.ui(r,n)}$("body").on("click",".btnWorkWithIt",function(){var e=$(this).parents(".favorite-row");if(0==e.children(".favorite-details").length){var a=$('<div class="favorite-details"><form class="favorite-details-form"><label class="favorite-amount">Suma:<input class="fav-change" type="number" name="amount" placeholder="in EUR"/></label><label class="favorite-date">Data:<input class="datepicker fav-change" type="date" name="date" placeholder="data"/></label><textarea class="favorite-comments fav-change" name="comments" placeholder="observatii" rows="3"/></form><div class="btnsActionFavorite"><span class="favSave" title="Salveaza detaliile"></span><span class="favCancel" title="Nu mai lucrez cu acest furnizor"></span></div></div>');e.append(a),e.children(".favorite-details").slideDown(200,function(){var a='<span class="btnDisplayWork" title="Vezi detalii"></span>';e.children(".buttons").children(".btnWorkWithIt").remove(),e.children(".buttons").append(a),e.children(".buttons").children(".btnDisplayWork").addClass("upArrow")})}}),$(".datepicker").pickadate({today:"Astazi",clear:"Sterge",close:"Inchide",format:"d mmmm yyyy",formatSubmit:"yyyy-mm-dd",firstDay:1,onSet:function(){},onClose:function(){console.log("closing...")}}),$("body").on("click",".datepicker",function(){$(this).pickadate({today:"Astazi",clear:"Sterge",close:"Inchide",format:"d mmmm yyyy",firstDay:1,onSet:function(){},onClose:function(){console.log("closing...")}})}),$("body").on("click",".favCancel",function(){var e=$(this);$target=e.parents(".favorite-details");var a=e.parents(".favorite-row").attr("data-providerid");$.ajax({url:"/workingwithit",type:"DELETE",data:{providerId:a},success:function(){$target.hide("fast",function(){var a=e.parents(".favorite-row"),t='<span class="btnWorkWithIt" title="Lucrezi cu acest furnizor?"></span>';a.children(".buttons").children(".btnDisplayWork").remove(),a.children(".buttons").append(t),a.removeClass("isWorking"),$target.remove()})},error:function(){console.log("error")}})}),$("body").on("click",".favSave",function(){var e=$(this).parents(".favorite-row").attr("data-providerid"),a=$(this).parents(".favorite-details"),t=$(this).parent().prev(".favorite-details-form").serializeArray();t.push({name:"providerId",value:e}),console.log(t),$.post("/workingwithit",t,function(){console.log("success")}).done(function(){console.log("done - success"),a.slideUp(200,function(){a.parents(".favorite-row").find(".btnDisplayWork").removeClass("upArrow"),a.parents(".favorite-row").addClass("isWorking")})}).fail(function(){console.log("error inserting workingwithit")}).always(function(){console.log("always triggered on finished")})}),$("body").on("blur keyup paste input",".fav-change",function(){var e=$(this),a=e.parents(".favorite-details").find(".favSave");return a.fadeTo(300,1),e}),$("body").on("click",".btnDisplayWork",function(){var e=$(this).parents(".favorite-row"),a=$(this);return e.children(".hiddenId").length?void e.children(".favorite-details").hide("fast",function(){e.children(".favorite-details").remove();var a='<span class="btnWorkWithIt" title="Lucrezi cu acest furnizor?"></span>';e.children(".buttons").children(".btnDisplayWork").remove(),e.children(".buttons").append(a)}):void(a.hasClass("upArrow")?e.children(".favorite-details").slideUp(200,function(){a.removeClass("upArrow")}):e.children(".favorite-details").slideDown(200,function(){a.addClass("upArrow")}))}),$(".howmany").bind("enterKey",function(){e("frontHowMany",$(this).val()),window.location="/furnizori-de-nunta"}),$(".howmany").keyup(function(e){13==e.keyCode&&$(this).trigger("enterKey")}),$("#logo").waypoint(function(e){"down"==e?$(".mobile-nav").addClass("mobile-menu-fixed"):$(".mobile-nav").removeClass("mobile-menu-fixed")},{offset:-40}),$("nav.desktop-menu").waypoint(function(e){"down"==e?$("#floating-menu").addClass("show"):$("#floating-menu").removeClass("show")},{offset:-50}),$(".mobile-nav").click(function(){$(".mobile-menu").addClass("active animated fadeIn")}),$(".close-mobile-nav").click(function(){$(".mobile-menu").removeClass("active animated fadeIn")});var n=$(".favorite-row").length;0==n&&$(".noFavorites").fadeToggle();var i,r;$(".btnDeleteFavorite").click(function(e){e.preventDefault(),$(".overlay.delFavorite").addClass("overlay-show"),i=$(this).attr("data-providerid"),r=$(this),0==$(".favorite-row").length&&$(".noFavorites").fadeToggle()}),$("#delFavoriteOk").click(function(){$.ajax({url:"/like",type:"DELETE",data:{providerId:i},success:function(){var e=r.closest(".favorite-row"),a=$(".favorite-row").length;e.css("background-color","#c29da3"),e.fadeOut(400,function(){e.remove(),1==a&&$(".noFavorites").fadeToggle()}),r.parents(".favorite-row").toggle("fast")},error:function(){console.log("error")}})});var s=!1;if($("#fav-button").click(function(){var e=$("#fav-button"),a=e.attr("data-provider"),t=e.attr("data-ischecked");-1==t||"false"==t?s||(s=!0,$.ajax({url:"/like",type:"POST",data:{providerId:a},success:function(){e.addClass("liked-true").attr("data-ischecked","true").html('<span class="footer-heart icon icon-heart" ></span> este favorit'),s=!1},error:function(){s=!1}})):s||(s=!0,$.ajax({url:"/like",type:"DELETE",data:{providerId:a},success:function(){e.removeClass("liked-true").attr("data-ischecked","false").html('<span class="footer-heart icon icon-heart" ></span> adauga la favorite'),s=!1},error:function(){s=!1}}))}),$("#search").bind("enterKey",function(){data=$("#search").val(),window.location="/furnizori-de-nunta/cautare/"+data}).keyup(function(e){13==e.keyCode&&$(this).trigger("enterKey")}),$(".providerLink").click(function(e){0==$("#usermenu").length&&(e.preventDefault(),$(".overlay.ifVisitor").addClass("overlay-show"))}),$(".overlay").click(function(e){$(e.target).is(".overlay-container")||$(".overlay").removeClass("overlay-show")}),$("#overlay-login").click(function(){window.location="/login"}),"undefined"!=typeof $f){var l=$("#vmPlayer")[0],c=$f(l);c.addEvent("ready",function(){c.addEvent("play",a),c.addEvent("pause",t)})}$(".fb").click(function(){return elem=$(this),o(elem.data("title"),elem.data("desc"),elem.data("link"),elem.data("image")),!1}),window.fbAsyncInit=function(){FB.init({appId:"1445888285683036",status:!0,cookie:!0,xfbml:!0})},function(e,a){var t,o="facebook-jssdk",n=e.getElementsByTagName("script")[0];e.getElementById(o)||(t=e.createElement("script"),t.id=o,t.async=!0,t.src="//connect.facebook.net/en_US/all"+(a?"/debug":"")+".js",n.parentNode.insertBefore(t,n))}(document,!1)});