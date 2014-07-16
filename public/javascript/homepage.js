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
        setTimeout(function(){
            $('.login-error-message').toggle();
            $('.input-groups').removeClass('error-border');

        },5000);



        //show mobile menu
        $('.mobile-nav').click(function(){
           $('.mobile-menu').addClass('active');
        });

        //hide mobile menu

        $('.close-mobile-nav').click(function(){
            $('.mobile-menu').removeClass('active');
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
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();

    })
;