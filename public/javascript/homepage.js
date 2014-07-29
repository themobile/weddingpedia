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
                '<div class="watchit ">CONTACTEAZA-NE!</div></div></div>';
            providerContainer.append(content);
        }


        var doit;

        function calculateAppendProviders() {
            var providerLength = $('.provider').length;
            var windowWidth = $(window).width() + 15;


            if (windowWidth > 767 && (providerLength % 3 != 0)) {
                var needed = providerLength < 3 ? 3 - providerLength % 3 : 3 - providerLength % 3;

                for (var i = 1; i <= needed; i++) {
                    appendProviders();
                }
                console.log('append ' + providerLength % 3 + ' providers');
                return;
            }

            if (windowWidth > 420 && windowWidth <= 767 && (providerLength % 2 != 0)) {
                var needed = providerLength < 2 ? 2 - providerLength % 2 : 2 - providerLength % 2;

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




        // blog save new blog post

        $('.formblog button[type="submit"]').click(function () {


            var data = $('#newBlogPost').serializeArray();
            data.push({name:'body', value:editor.serialize()['element-0'].value})


            var jqxhr = $.post("/blog/new", data, function () {
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
            buttons: ['bold', 'italic', 'anchor', 'header2', 'quote']
        });


        $('.mediumblog').mediumInsert({
            editor: editor,
            addons: {
                images: {
                    imagesUploadScript: '../uploadimage'
                },
                embeds: {
                    urlPlaceholder: 'adresa web a imaginii'
                }
            }
        });



        // <select id="select-to"></select>

        var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
            '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';


        var $selectm=$('#selectize').selectize({
//            preload:true,
            maxItems: 3,
            valueField: '_id',
            labelField: 'email',
            searchField: 'email',
            create:false,
            render: {
                item: function(item, escape) {
                    var name = item.name;
                    return '<div>' +
                        (name ? '<span class="name">' + escape(name) + '&nbsp</span>' : '') +
                        (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var name = item.name;
                    var email = item.email;
                    return '<div>' +
                        '<span class="label">' + escape(name) + '&nbsp</span>' +
                        (email ? '<span class="caption">' + escape(email) + '</span>' : '') +
                        '</div>';
                }
            }
            ,
            load: function(query, callback) {
                if (query.length<3) return callback();
                $.ajax({
                    url: window.location.protocol+'//'+window.location.host+'/queryusers',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        q: query,
                        page_limit: 10
                    },
                    error: function(error) {
                        callback(error);
                    },
                    success: function(res) {
                        console.log(res);
                        callback(res.users);
                    }
                });
            }
        });


        //how to set initial values
        //var k=$('selectize')[0].selectize
        //k.addOptions(user)
        //k.setValue(user._id);


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