$(document)

    .load(function () {

    })
    .ready(function () {

        var hideSpinner = function () {
            setTimeout(function () {
                $('#spinner').hide();
            }, 1000);
        };

        var showSpinner = function () {
            setTimeout(function () {
                $('#spinner').show();
            }, 100);
        };


        //display spinner on menu links
        $('nav ul li a,.logo a').not('.submenu a')
            .click(function (e) {
                showSpinner();
                e.preventDefault();
                var href = this.href;
                setTimeout(function () {
                    hideSpinner();
                    window.location = href;
                }, 300);
            });

        var
            changeSides = function () {
                $('.ui.shape')
                    .eq(0)
                    .shape('flip over')
                    .end()
                    .eq(1)
                    .shape('flip over')
                    .end()
                    .eq(2)
                    .shape('flip back')
                    .end()
                    .eq(3)
                    .shape('flip back')
                    .end()
                ;
            },
            validationRules = {
                firstName: {
                    identifier: 'email',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter an e-mail'
                        },
                        {
                            type: 'email',
                            prompt: 'Please enter a valid e-mail'
                        }
                    ]
                }
            }
            ;


        //loading page hides the spinner with 1 sec timeout
        hideSpinner();


        // clear login form errors
        setTimeout(function () {
            $('.login-error-message').stop().toggle();
            $('.input-groups').stop().removeClass('error-border');

        }, 5000);


        function appendProviders() {
            var providerContainer = $("#providers");

            var content = '<div data-category="restaurant" class="faked provider restaurant"><div class="image"><img src="http://i.vimeocdn.com/video/479438191_640.jpg" width="100%"><div class="icon icon-camera"></div></div><div class="name">faked provider</div><div class="category">no category/div></div>';


            providerContainer.append(content);
        }


        //check resize and add dummy column items for promotion
        var doit;

        function calculateAppendProviders() {
            var providerLength = $('.provider').length;
            var windowWidth = $(window).width() + 15;




            if (windowWidth > 767 && (providerLength % 3 != 0)) {
                var needed= providerLength<3 ? 3-providerLength%3 : providerLength%3;

                for (var i = 1; i <= needed; i++) {
                    appendProviders();
                }
                console.log('append ' + providerLength % 3 + ' providers');
                return;
            }

            if (windowWidth > 420 && windowWidth <= 767 && (providerLength % 2 != 0)) {
                var needed= providerLength<2 ? 2-providerLength%2 : providerLength%2;

                for (var i = 1; i <= needed; i++) {
                    appendProviders();
                }
                console.log('append ' + providerLength % 2 + ' providers');
                return;
            }
        };

        //initial check
        calculateAppendProviders();

        //trigger appendProviders on resize with a 1s timeout
        window.onresize = function () {
            clearTimeout(doit);
            doit = setTimeout(function () {
                $(".faked").remove();
                calculateAppendProviders();
            }, 1000);
        };


        //show mobile menu
        $('.mobile-nav').click(function () {
            $('.mobile-menu').addClass('active animated fadeIn');
        });

        //hide mobile menu

        $('.close-mobile-nav').click(function () {

            $('.mobile-menu').removeClass('active animated fadeIn');
        });


        //arrow down on first screen
        $(".goproviders").click(function () {
            $('html, body').animate({
                scrollTop: $("#two").offset().top
            }, 600);
            $('#headersegment').addClass('show');

        });


        //menu dropdown

        // -----------  close all on load
        $('.submenu ul').hide();

        $('.submenu').mouseover(function (e) {
            $(this).children('ul').toggle();
        }).mouseout(function (e) {
            $(this).children('ul').toggle();
        });

        // -----------  end menu dropdown


        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
        var disqus_shortname = 'weddingpedia'; // required: replace example with your forum shortname

        /* * * DON'T EDIT BELOW THIS LINE * * */
        (function () {
            var dsq = document.createElement('script');
            dsq.type = 'text/javascript';
            dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();

    })
;