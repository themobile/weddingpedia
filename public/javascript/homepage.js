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


        //menu dropdown

        // -----------  close all on load
        $('.submenu ul').hide();

        $('.submenu').mouseover(function (e) {
            $(this).children('ul').toggle();
        }).mouseout(function (e) {
            $(this).children('ul').toggle();
        });

        // -----------  end menu dropdown



    })
;