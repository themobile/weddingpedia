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


        //loading page hides the spinner with 1 sec timeout
        hideSpinner();


        // clear login form errors
        setTimeout(function () {
            $('.login-error-message').stop().toggle();
            $('.input-groups').stop().removeClass('error-border');

        }, 5000);


        //show floating menu if past...

        $('#headersegment').waypoint(function (direction) {
            if (direction == 'down') {
                $('#floating-menu')
                    .addClass('show');
            }
            else {
                $('#floating-menu')
                    .removeClass('show');
            }
        }, -200);


        //start check resize and add dummy column items for promotion
        function appendProviders() {
            var providerContainer = $("#providers");
            var content = '<div data-category="restaurant" class="fake animated fadeIn provider restaurant">' +
                '<div class="image faked"><div class="icon icon-camera"></div></div>' +
                '<div class="details"><h3 class="name">esti furnizor de nunta?</h3><h4 class="category">poti fi si tu aici</h4>' +
                '<div class="watchit">CONTACTEAZA-NE!</div></div></div>';
            providerContainer.append(content);
        }


        var doit;

        function calculateAppendProviders() {
            var providerLength = $('.provider').length;
            var windowWidth = $(window).width() + 15;


            if (windowWidth > 767 && (providerLength % 3 != 0)) {
                var needed = providerLength < 3 ? 3 - providerLength % 3 : providerLength % 3;

                for (var i = 1; i <= needed; i++) {
                    appendProviders();
                }
                console.log('append ' + providerLength % 3 + ' providers');
                return;
            }

            if (windowWidth > 420 && windowWidth <= 767 && (providerLength % 2 != 0)) {
                var needed = providerLength < 2 ? 2 - providerLength % 2 : providerLength % 2;

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
                $(".fake").remove();
                calculateAppendProviders();
            }, 1000);
        };
        // end append dummy column items

        //show mobile menu
        $('.mobile-nav').click(function () {
            $('.mobile-menu').addClass('active animated fadeIn');
        });

        //hide mobile menu

        $('.close-mobile-nav').click(function () {

            $('.mobile-menu').removeClass('active animated fadeIn');
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


        // add un provider
        $('.addProviders').click(function () {
            var furnizorNou = {
                    name: "MyPrecious",
                    category: "restaurant",
                    videoUrl: "http://player.vimeo.com/video/98648575"}
                ;

            var jqxhr = $.post("/furnizori-de-nunta/new", furnizorNou, function () {
                console.log("success");
            })
                .done(function () {
                    console.log("done - success");
                })
                .fail(function () {
                    console.log("error inserting blog post");
                })
                .always(function () {
                    console.log("always triggered on finished");
                });
        });
        $('.updProviders').click(function () {
            var furnizorNou = {
                    id: '53d11fd04e0aaac017b61cad',
                    name: "MyPrecious------",
                    category: "cofetarie",
                    videoUrl: "http://player.vimeo.com/video/98648575"}
                ;

            var jqxhr = $.post("/furnizori-de-nunta/upd", furnizorNou, function () {
                console.log("success");
            })
                .done(function () {
                    console.log("done - success");
                })
                .fail(function () {
                    console.log("error inserting blog post");
                })
                .always(function () {
                    console.log("always triggered on finished");
                });
        });

        // blog add pt ca n-avem inca buton
        $('.formblog .btn-submit').click(function () {

            var blogdata = {
                title: $('.formblog .titlu').val(),
                body: editor.serialize()['element-0'].value
            };

            var jqxhr = $.post("/blog/new", blogdata, function () {
                console.log("success");
            })
                .done(function () {
                    console.log("done - success");
                    window.location = '/blog';
                })
                .fail(function () {
                    console.log("error inserting blog post");
                })
                .always(function () {
                    console.log("always triggered on finished");
                });


        });


        //start medium editor
//        var editor = new MediumEditor('.mediumblog');
        var editor = new MediumEditor('.mediumblog', {
            buttons: ['bold', 'italic', 'anchor', 'header1', 'header2', 'quote']
        });

//        editor.activate();


//
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