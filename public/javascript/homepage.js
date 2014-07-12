$(document)

    .load(function(){

    })
    .ready(function () {

        var hideSpinner=function(){
            setTimeout(function(){
                $('#spinner').hide();
            },1000);
        };

        var showSpinner=function(){
            setTimeout(function(){
                $('#spinner').show();
            },100);
        };

        hideSpinner();



        $('#video-main').fitVids();



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


        var onComplete = function (href) {
            console.log('slideup');

            $('li.fly')
                .animate({top: 0},
                {
                    easing: 'easeOutCubic',
                    duration: 200
                });
            setTimeout(function(){
                hideSpinner();
                window.location= href;
            },600);
        };
//        NProgress.start();


        //on page load bring down the menu
        $('li.fly')
            .animate({top: 0}, {
                duration:200,
                easing:'easeOutCirc'
            });


        $('.desktop-nav ul li a,.logo a')
            .click(function (e) {
                showSpinner();
                e.preventDefault();
                var href = this.href;
//                $('.logo a img').attr('src','/images/weddingpedia_logo2.png');
                //fly out the menu
                $('li.fly')
                    .animate({top: -125}, {
                        duration:200,
                        easing:'easeOutCirc',
                        complete: onComplete(href)
                    });
            });

        $('.ui.dropdown')
            .dropdown({
                on: 'hover'
            })
        ;

        $('.ui.form')
            .form(validationRules, {
                on: 'blur'
            })
        ;


        //blocks that appear fadeIn
        $('.appearFadeIn')
            .transition('fade in')
        ;

        setInterval(changeSides, 3000);

    })
;