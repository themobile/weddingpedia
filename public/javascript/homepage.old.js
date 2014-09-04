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


        $('body').on('click', '.btnWorkWithIt', function (event) {
            var thisRow = $(this).parents('.favorite-row');
            if (thisRow.children('.favorite-details').length == 0) {
                var htmlToAppend = $('<div class="favorite-details">' +
                    '<form class="favorite-details-form">' +
                    '<label class="favorite-amount">Suma:<input class="fav-change" type="number" name="amount" placeholder="in EUR"/></label>' +
                    '<label class="favorite-date">Data:<input class="datepicker fav-change" type="date" name="date" placeholder="data"/></label>' +
                    '<textarea class="favorite-comments fav-change" name="comments" placeholder="observatii" rows="3"/>' +
                    '</form>' +
                    '<div class="btnsActionFavorite">' +
                    '<span class="favSave" title="Salveaza detaliile"></span>' +
                    '<span class="favCancel" title="Nu mai lucrez cu acest furnizor"></span>' +
                    '</div></div>');

                thisRow.append(htmlToAppend);
                thisRow.children('.favorite-details').slideDown(200, function (elem) {
                    var html = '<span class="btnDisplayWork" title="Vezi detalii"></span>';
                    thisRow.children('.buttons').children('.btnWorkWithIt').remove();
                    thisRow.children('.buttons').append(html);
                    thisRow.children('.buttons').children('.btnDisplayWork').addClass('upArrow');
                });
            }

        });


        $('.datepicker').pickadate(
            {
                today: 'Astazi',
                clear: 'Sterge',
                close: 'Inchide',
                format: 'd mmmm yyyy',
                formatSubmit: 'yyyy-mm-dd',
//                hiddenName: true,
                firstDay: 1,
                onSet: function (context) {
//                        $(this).close();

                },
                onClose: function (context) {
                    console.log('closing...');
                }
            }
        );


        $('body').on('click', '.datepicker', function (e) {
            $(this).pickadate(
                {
                    today: 'Astazi',
                    clear: 'Sterge',
                    close: 'Inchide',
                    format: 'd mmmm yyyy',
//                    formatSubmit: 'yyyy-mm-dd',
//                    hiddenName: true,
                    firstDay: 1,
                    onSet: function (context) {
//                        $(this).close();

                    },
                    onClose: function (context) {
                        console.log('closing...');
                    }
                }
            );
        });

        //cancel working with the provider
        // TODO delete from database
        $('body').on('click', '.favCancel', function (e) {
            var that=$(this);
            $target = that.parents('.favorite-details');
            var providerId = that.parents('.favorite-row').attr('data-providerid');
            $.ajax({
                url: "/workingwithit",
                type: 'DELETE',
                data: {providerId: providerId},
                success: function (response) {
                    $target.hide('fast', function () {
                        var thisRow=that.parents('.favorite-row');
                        var html = '<span class="btnWorkWithIt" title="Lucrezi cu acest furnizor?"></span>';
                        thisRow.children('.buttons').children('.btnDisplayWork').remove();
                        thisRow.children('.buttons').append(html);
                        thisRow.removeClass('isWorking');

                        //delete details
                        $target.remove();

                    });

                },
                error: function (error) {
                    console.log('error');
                }
            });


        });


        $('body').on('click', '.favSave', function (e) {
            var provider = $(this).parents('.favorite-row').attr('data-providerid');
            var thisRow=$(this).parents('.favorite-details');
            var data = $(this).parent().prev('.favorite-details-form').serializeArray();
            data.push({name: 'providerId', value: provider});

            console.log(data);
            $.post("/workingwithit", data, function () {
                console.log("success");
            })
                .done(function () {
                    console.log("done - success");
                    thisRow.slideUp(200, function () {
                        thisRow.parents('.favorite-row').find('.btnDisplayWork').removeClass('upArrow');
                        thisRow.parents('.favorite-row').addClass('isWorking');
                    });
                })
                .fail(function () {
                    console.log("error inserting workingwithit");
                })
                .always(function () {
                    console.log("always triggered on finished");
                });
        });


        $('body').on('blur keyup paste input', '.fav-change', function () {
            var $this = $(this);
            var thisButtonSave = $this.parents('.favorite-details').find('.favSave');
            thisButtonSave.fadeTo(300, 1);
            return $this;
        });


        //display favourite works (if it's there)
        $('body').on('click', '.btnDisplayWork', function (event) {
            //get the row
            var thisRow = $(this).parents('.favorite-row');
            var that = $(this);

            if (thisRow.children('.hiddenId').length) {
                thisRow.children('.favorite-details').hide('fast', function () {
                    thisRow.children('.favorite-details').remove();
                    var html = '<span class="btnWorkWithIt" title="Lucrezi cu acest furnizor?"></span>';
                    thisRow.children('.buttons').children('.btnDisplayWork').remove();
                    thisRow.children('.buttons').append(html);
                });
                return;
            }

            if (that.hasClass('upArrow')) {
                thisRow.children('.favorite-details').slideUp(200, function () {
                    that.removeClass('upArrow');
                });

            } else {
                thisRow.children('.favorite-details').slideDown(200, function () {
                    that.addClass('upArrow');
                });

            }
        });


        $('.howmany').bind("enterKey", function (e) {
            setCookie('frontHowMany', $(this).val());
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

        var rowCount = $('.favorite-row').length;
        if (rowCount == 0) {
            $('.noFavorites').fadeToggle();
        }


//vars to keep details when overlay confirm
        var delFavProviderId, btnDelFavorite;

//unfavourite button click shows overlay
        $('.btnDeleteFavorite').click(function (event) {
            event.preventDefault();
            $('.overlay.delFavorite').addClass('overlay-show');
            delFavProviderId = $(this).attr('data-providerid');
            btnDelFavorite = $(this);

            if ($('.favorite-row').length==0) {
                $('.noFavorites').fadeToggle();
            }
        });

//overlay confirmation to del favorite
        $('#delFavoriteOk').click(function (event) {
            $.ajax({
                url: "/like",
                type: 'DELETE',
                data: {providerId: delFavProviderId},
                success: function (response) {
                    var row = btnDelFavorite.closest('.favorite-row');
                    var rowCount = $('.favorite-row').length;
                    row.css("background-color", "#c29da3");
                    row.fadeOut(400, function () {
                        row.remove();
                        if (rowCount == 1) {
                            $('.noFavorites').fadeToggle();
                        }
                    });
                    btnDelFavorite.parents('.favorite-row').toggle('fast')
                },
                error: function (error) {
                    console.log('error');
                }
            });
        });


        var isInLikeProgress = false;

//like button mechanics
        $('#fav-button').click(function () {
            var likeBtn = $('#fav-button');
            var providerId = likeBtn.attr('data-provider');
            var isChecked = likeBtn.attr('data-ischecked');


            if (isChecked == -1 || isChecked=='false') { // server returns boolean

                if (!isInLikeProgress) {

                    isInLikeProgress = true;

                    $.ajax({
                        url: "/like",
                        type: 'POST',
                        data: {providerId: providerId},
                        success: function (response) {
                            likeBtn
                                .addClass('liked-true')
                                .attr('data-ischecked', 'true')
                                .html('<span class="footer-heart icon icon-heart" ></span> este favorit');
                            isInLikeProgress = false;
                        },
                        error: function (error) {
//                            likeBtn.attr('data-ischecked', 'false');
                            isInLikeProgress = false;
                        }
                    });
                }

            } else {
                if (!isInLikeProgress) {
                    isInLikeProgress = true;
                    $.ajax({
                        url: "/like",
                        type: 'DELETE',
                        data: {providerId: providerId},
                        success: function (response) {
                            likeBtn
                                .removeClass('liked-true')
                                .attr('data-ischecked', 'false')
                                .html('<span class="footer-heart icon icon-heart" ></span> adauga la favorite');
                            isInLikeProgress = false;
                        },
                        error: function (error) {
//                            likeBtn.attr('data-ischecked', 'true');
                            isInLikeProgress = false;
                        }
                    });
                }
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