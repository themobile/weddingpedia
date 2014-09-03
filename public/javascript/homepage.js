$(document)

    .load(function () {

    })
    .ready(function () {


        // for cookies

        function setCookie(key, value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        }

        function getCookie(key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        }


        $('.btnWorkWithIt').click(function (event) {
            var thisRow = $(this).parent().parent();
            if (thisRow.children('.favorite-details').length==0) {
                var htmlToAppend = $('<div class="favorite-details">' +
                    '<form class="favorite-details-form">' +
                    '<label class="favorite-amount fav-change">Suma (eur):<input type="number" name="amount" placeholder="suma"/></label>' +
                    '<label class="favorite-date fav-change">Data:<input class="datepicker" type="text" name="date" placeholder="data"/></label>' +
                    '<textarea class="favorite-comments fav-change" name="comments" placeholder="observatii" rows="3"/>' +
                    '</form>' +
                    '</div>' +
                    '<div style="overflow: hidden; display: block;"><button class="positive right favSave">save</button></div>' +
                    '</div>');

                thisRow.append(htmlToAppend);
            }

        });




        $('body').on('click','.datepicker',function(e){
            $(this).pickadate(
                {
                    today:'Astazi',
                    clear:'Sterge',
                    close:'Inchide',
                    formatSubmit:'yyyy-mm-dd',
                    hiddenName:true,
                    editable:true,
                    firstDay:1,
                    onSet:function(context){
                        console.log('Just set stuff:', context);
//                        $(this).close();

                    },
                    onClose:function(context){
                        console.log('closing...');
                    }
                }
            );
        });


        $('body').on('blur keyup paste input', '.fav-change', function () {
            var $this = $(this);
            if ($this.data('before') !== $this.html()) {
                var thisButtonSave = $this.parents('tr').find('.favSave');
                if (!thisButtonSave.is(':visible')) thisButtonSave.toggle();
            }
            return $this;
        });


//display favourite works (if it's there)
        $('.btnDisplayWork').click(function (event) {
            //get the row
            var thisRow = $(this).parent().parent();
            var that = $(this);
            if ($(this).hasClass('upArrow')) {
                thisRow.next().find('div').slideUp(200, function () {
                    that.removeClass('upArrow');
                });

            } else {
                thisRow.next().find('div').slideDown(200, function () {
                    that.addClass('upArrow');
                });

            }
        });


        $('.howmany').bind("enterKey", function (e) {
            setCookie('howmany', $(this).val());
            window.location = '/furnizori-de-nunta';
        });
        $('.howmany').keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });

//modify mobile-nav on scroll

        $('#logo').waypoint(function (direction) {
            if (direction == 'down') {
                $('.mobile-nav').addClass('mobile-menu-fixed');
            }
            else {
                $('.mobile-nav').removeClass('mobile-menu-fixed');
            }
        }, {offset: -40});


//show floating menu if past...
        $('nav.desktop-menu').waypoint(function (direction) {
            if (direction == 'down') {
                $('#floating-menu')
                    .addClass('show');
            }
            else {
                $('#floating-menu')
                    .removeClass('show');
            }
        }, {offset: -50});


//show mobile menu
        $('.mobile-nav').click(function () {
            $('.mobile-menu').addClass('active animated fadeIn');
        });

//hide mobile menu
        $('.close-mobile-nav').click(function () {
            $('.mobile-menu').removeClass('active animated fadeIn');
        });

        var rowCount = $('.userProviderList tr').length;
        if (rowCount == 1) {
            $('.noFavorites').fadeToggle();
        }


//vars to keep details when overlay confirm
        var delFavProviderId, btnDelFavorite;

//unfavourite button click
        $('.btnDeleteFavorite').click(function (event) {
            event.preventDefault();
            $('.overlay.delFavorite').addClass('overlay-show');
            delFavProviderId = $(this).attr('data-providerid');
            btnDelFavorite = $(this);

        });

        $('#delFavoriteOk').click(function (event) {
            $.ajax({
                url: "/like",
                type: 'DELETE',
                data: {providerId: delFavProviderId},
                success: function (response) {
                    var tr = btnDelFavorite.closest('tr');
                    var rowCount = $('.userProviderList tr').length;
                    tr.css("background-color", "#c29da3");
                    tr.fadeOut(400, function () {
                        tr.remove();
                        if (rowCount == 2) {
                            $('.userProviderList caption div').toggle();
                            $('.noFavorites').fadeToggle();
                        }
                    });
                    btnDelFavorite.parent().parent().toggle('slow')
                },
                error: function (error) {
                    console.log('error');
                }
            });
        });


//like button mechanics
        $('#fav-button').click(function () {
            var likeBtn = $('#fav-button');
            var providerId = likeBtn.attr('data-provider');
            var isChecked = likeBtn.attr('data-ischecked');

            if (isChecked == -1) { // server returns boolean
                $.ajax({
                    url: "/like",
                    type: 'POST',
                    data: {providerId: providerId},
                    success: function (response) {
                        likeBtn.addClass('liked-true');
                        likeBtn.attr('data-ischecked', 'true');
                        likeBtn.html('<span class="footer-heart icon icon-heart" ></span> este favorit')
                    },
                    error: function (error) {
                        likeBtn.attr('data-ischecked', 'false');
                        console.log(error);
                    }
                });


            } else {
                $.ajax({
                    url: "/like",
                    type: 'DELETE',
                    data: {providerId: providerId},
                    success: function (response) {
                        likeBtn.removeClass('liked-true');
                        likeBtn.attr('data-ischecked', 'false');
                        likeBtn.html('<span class="footer-heart icon icon-heart" ></span> adauga la favorite')

                    },
                    error: function (error) {
                        likeBtn.attr('data-ischecked', 'true');
                        console.log(error);
                    }
                });
            }
        });


// on search enter
        $('#search')
            .bind("enterKey", function (e) {
                data = $('#search').val();
                window.location = '/furnizori-de-nunta/cautare/' + data;
            })
            .keyup(function (e) {
                if (e.keyCode == 13) {

                    $(this).trigger("enterKey");
                }
            });


//test if logged in, otherwise show overlay login
        $('.providerLink').click(function (event) {
            if ($('#usermenu').length == 0) {
                event.preventDefault();
                $('.overlay.ifVisitor').addClass('overlay-show');

            }
        });

// hide overlay on click outside
        $('.overlay').click(function (event) {
            if (!$(event.target).is('.overlay-container')) {
                $('.overlay').removeClass('overlay-show');
            }
        });

//go to login on overlay login click
        $('#overlay-login').click(function (event) {
            window.location = '/login';
        });


//vimeo froogaloop player controller
        if (!((typeof $f) == 'undefined')) {
            var iframe = $('#vmPlayer')[0]
                , player = $f(iframe);

            player.addEvent('ready', function () {
//            player.addEvent('pause', onPause);
//            player.addEvent('finish', onFinish);
                player.addEvent('play', onPlay);
                player.addEvent('pause', onPause);
            });


            //shift social buttons on play
            function onPlay(data, id) {
                $('.video-socialbuttons').addClass('playing');
            }

            //shift social buttons on play
            function onPause(data, id) {
                $('.video-socialbuttons').removeClass('playing');
            }
        }

//social button share
        $('.fb').click(function () {
            elem = $(this);
            postToFeed(elem.data('title'), elem.data('desc'), elem.data('link'), elem.data('image'));
            return false;
        });


//facebook
        window.fbAsyncInit = function () {
            FB.init({
                appId: '1445888285683036', status: true, cookie: true, xfbml: true });
        };
        (function (d, debug) {
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
            ref.parentNode.insertBefore(js, ref);
        }(document, /*debug*/ false));

        function postToFeed(title, desc, url, image) {

            //remove all html from description
            var regexpretion = /(<([^>]+)>)/ig;

            desc = desc ? desc.replace(regexpretion, ' ').trim() : '';

            var obj = {method: 'feed', name: title, description: desc, link: url, picture: 'http://www.weddingpedia.ro' + image};

            function callback(response) {
                console.log(response);
            }

            FB.ui(obj, callback);
        }


//        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
//        var disqus_shortname = 'weddingpedia'; // required: replace example with your forum shortname
//
//        /* * * DON'T EDIT BELOW THIS LINE * * */
//        (function () {
//            var dsq = document.createElement('script');
//            dsq.type = 'text/javascript';
//            dsq.async = true;
//            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
//            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
//        })();

    })
;