$(document)

    .load(function () {

    })
    .ready(function () {


        //modify mobile-nav on scroll

        $('#logo').waypoint(function (direction) {
            if (direction == 'down') {
                $('.mobile-nav').addClass('mobile-menu-fixed');
            }
            else {
                $('.mobile-nav').removeClass('mobile-menu-fixed');
            }
        },{offset:-40});


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


        //like button mechanics
        $('#fav-button').click(function () {
            var likeBtn = $('#fav-button');
            var providerId = likeBtn.attr('data-provider');
            var isChecked = likeBtn.attr('data-ischecked');

            if (isChecked == 'false') { // server returns boolean
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
                $('#overlay').addClass('overlay-show');

            }
        });

        // hide overlay on click outside
        $('#overlay').click(function (event) {
            if (!$(event.target).is('.overlay-container')) {
                $('#overlay').removeClass('overlay-show');
            }
        });

        //go to login on overlay login click
        $('#overlay-login').click(function (event) {
            window.location = '/login';
        });

        var iframe = $('#vmPlayer')[0];
        var player = $f(iframe);
        player.addEvent('ready', function () {
            console.log('ready');

//            player.addEvent('pause', onPause);
//            player.addEvent('finish', onFinish);
            player.addEvent('play', onPlay);
            player.addEvent('pause', onPause);
        });


        function onPlay(data, id) {
            console.log('play hit');
            $('.video-socialbuttons').addClass('playing');
        }

        function onPause(data, id) {
            console.log('pause hit');
            $('.video-socialbuttons').removeClass('playing');
        }


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