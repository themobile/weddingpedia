$(document)

    .load(function () {

    })
    .ready(function () {





        //show floating menu if past...

        $('#logo').waypoint(function (direction) {
            if (direction == 'down') {
                $('#floating-menu')
                    .addClass('show');
            }
            else {
                $('#floating-menu')
                    .removeClass('show');
            }
        }, {offset:-50});




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
        $('.submenu').click(function (e) {
            $(this).children('ul').toggle('fast');
        });

        // -----------  end menu dropdown






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