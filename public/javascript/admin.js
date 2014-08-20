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


        $('.howmany').bind("enterKey", function (e) {
            setCookie('howmany', $(this).val());
            location.reload(true);
        });
        $('.howmany').keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });

        //start medium editor for provider form edit
        var providerEditor = new MediumEditor('.providerEditor', {
            disableDoubleReturn: false,
            disableToolbar:true,
            cleanPastedHTML: true,
            targetBlank:true
        });

        //load existing data into medium editor
        var providerHtml = $('#providerHtml');
        if (providerHtml.length > 0) {
            if (providerHtml.val().length > 0) {
                $('.providerEditor').html(providerHtml.val());
            }
        }



        $('#saveUser').click(function(event){
            event.preventDefault();
            $('#userForm').submit();
        });



        // blog save new provider with medium body editor
        $('#saveProvider').click(function (event) {
            event.preventDefault();

            var input = $("<input>")
                .attr("type", "hidden")
                .attr("name", "description").val(providerEditor.serialize()['element-0'].value);
            $('#formprovider').append($(input));

            //trick to save checkbox

            if ($('#publicView').attr('checked') === 'checked') {
                $('#publicView').val(true);
            } else {
                $('#publicView').attr('checked', true);
                $('#publicView').val(false);
            }

            $('#formprovider').submit();

        });


        // blog save new blog post with medium body editor
        $('.formblog button[type="submit"]').click(function () {


            var data = $('#newBlogPost').serializeArray();
            data.push({name: 'body', value: editor.serialize()['element-0'].value})


            $.post("/admin/blog/new", data, function () {
                console.log("success");
            })
                .done(function () {
                    console.log("done - success");
                    window.location = '/admin/blog';
                })
                .fail(function () {
                    console.log("error inserting blog post");
                })
                .always(function () {
                    console.log("always triggered on finished");
                });


        });


        $('#deleteProvider').click(function (event) {
            event.preventDefault();
            var pathForDelete
                ;
            if (confirm('Esti sigur ca vrei sa stergi furnizorul?')) {
                pathForDelete = '/admin/providers/delete/' + $('#idProvider').val();
                $.post(pathForDelete)
                    .done(function (data) {
                        window.location = '/admin/providers';
                    })
                    .fail(function (error) {
                        //fixme: tratament de eroare
                        console.log('eroare la stergerea provider-ului din calea ' + pathForDelete);
                    });
            }
        });


        $('#deleteUser').click(function (event) {
            var pathForDelete
                ;
            event.preventDefault();
            if (confirm('Esti sigur ca vrei sa stergi user-ul?')) {
                pathForDelete = '/admin/users/delete/'+$('#idUser').val();

                $.post(pathForDelete)
                    .done(function(data) {
                        console.log('success');
                        window.location = '/admin/users';
                    })
                    .fail(function (error) {
                        console.log('eroare la stergerea user-ului din calea ' + pathForDelete);
                    });
            }
        });


        //load existing data(if any) into medium editor for blog post edit
        var hiddenHtml = $('#hiddenHtml');
        if (hiddenHtml.length > 0) {
            if (hiddenHtml.val().length > 0) {
                $('.mediumblog').html(hiddenHtml.val());
            }
        }


        //start medium editor
//        var editor = new MediumEditor('.mediumblog');
        var editor = new MediumEditor('.mediumblog', {
            disableDoubleReturn: true,
//            cleanPastedHTML: true,
//            targetBlank:true,
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


        var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
            '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

        $("#e10").select2({
            data: [
                {id: 0, text: 'enhancement'},
                {id: 1, text: 'bug'},
                {id: 2, text: 'duplicate'},
                {id: 3, text: 'invalid'},
                {id: 4, text: 'wontfix'}
            ]
        });


        //load user roles into combo
        $("#selectUserRoles").select2({
            placeholder: "Alege rolurile",
//                    minimumInputLength: 1,
            maximumSelectionSize: 5,
            multiple: true,
            formatAjaxError: 'eroare in citirea rolurilor',
            formatInputTooShort: 'prea putine caractere introduse',

            data: [
                {id: 'admin', text: 'admin'},
                {id: 'editor', text: 'editor'}
            ],
            initSelection: function (element, callback) {
                // the input tag has a value attribute preloaded that points to a preselected movie's id
                // this function resolves that id attribute to an object that select2 can render
                // using its formatResult renderer - that way the movie name is shown preselected

                var data = [];
                var existingRoles = $(element).val().split(',');

                for (i = 0; i < existingRoles.length; i++) {
                    data.push({id: existingRoles[i], text: existingRoles[i]})
                }

                callback(data);
            }
        });


        //load categories into provider combo and selectize the control

        if ($('#categorySelect').length){
            $.ajax({
                url: window.location.protocol + '//' + window.location.host + '/querycategories',
                type: 'GET',
                dataType: 'json',

                error: function (error) {
//                        return error;
                },
                success: function (data) {
                    var final = [];

                    for (i = 0; i < data.categories.length; i++) {
                        final.push({id: data.categories[i], text: data.categories[i]});
                    }


                    $("#categorySelect").select2({
                        placeholder: "Alege categoria",
//                    minimumInputLength: 1,
                        maximumSelectionSize: 1,
                        placeholder: 'categorie',
                        formatAjaxError: 'eroare in citirea categoriilor',
                        formatInputTooShort: 'prea putine caractere introduse',

                        data: final,
                        initSelection: function (element, callback) {
                            // the input tag has a value attribute preloaded that points to a preselected movie's id
                            // this function resolves that id attribute to an object that select2 can render
                            // using its formatResult renderer - that way the movie name is shown preselected
                            var existingCateg = $(element).val();

                            var data = {id: existingCateg, text: existingCateg};
                            callback(data);
                        },
                        createSearchChoice: function (term) {
                            return {id: term, text: term};
                        }
                    });


                }
            });
        }



        //function to format selectize selection for userlist
        function formatUserList(user) {
            return user.name + ' - ' + user.text;
        }

        //selectize control to select users as admins for a provider
        $("#selectUsersAsAdmin").select2({
            minimumInputLength: 2,
            formatResult: formatUserList,
            formatSelection: formatUserList,
            placeholder: 'userii care administreaza',
            formatAjaxError: 'eroare in citirea userilor',
            formatInputTooShort: 'prea putine caractere introduse',

            multiple: true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "/queryusers",
                dataType: 'json',
                data: function (term, page) {
                    return {
                        q: term, // search term
                        page_limit: 10
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data

                    var final = {results: []};

                    for (i = 0; i < data.users.length; i++) {
                        final.results.push({id: data.users[i]._id, text: data.users[i].email, name: data.users[i].name });
                    }
                    return final;
                }
            },

            initSelection: function (element, callback) {
                // the input tag has a value attribute preloaded that points to a preselected movie's id
                // this function resolves that id attribute to an object that select2 can render
                // using its formatResult renderer - that way the movie name is shown preselected
                var userIds = $(element).val().split(',');
//
                $.ajax({
                    url: window.location.protocol + '//' + window.location.host + '/usersbyid',
                    type: 'POST',
                    dataType: 'json',
                    data: {ids: userIds},

                    error: function (error) {
                        callback(error);
                    },
                    success: function (res) {
                        var existingItems = [];

                        for (i = 0; i < res.length; i++) {
                            existingItems.push({id: res[i]._id, text: res[i].email, name: res[i].name});
                        }
                        callback(existingItems);
                    }
                });
            }
        });


        //format selectize control to append links to videos
        function formatVimeoIdsList(videoId) {
            return '<a onclick=\"window.open(\'http://vimeo.com/' + videoId.text + '\')\" href="#">' + videoId.text + '</a>';
//            return videoId.text;
        };


        //selectize control
        $("#selectVimeoIdList").select2({
            formatSelection: formatVimeoIdsList,
            placeholder: 'id-uri vimeo',
            multiple: true,
            tags: function () {
                var vimeoIds = $('#selectVimeoIdList').val().split(',');
                return vimeoIds;
            }
        })
            .on("change", function (e) {
                // clear vimeoId control if list is empty (obviously)
                if (e.val.length == 0) {
                    $('#vimeoId').select2('data', null);
                }
                ;
            });


        //selectize control to select active video Url only from list of ids
        $("#vimeoId").select2({
            maximumSelectionSize: 1,
            placeholder: 'id-uri vimeo',
            data: function () {
                var vimeoIds = $('#selectVimeoIdList').val().split(',');
                var elems = [];
                for (i = 0; i < vimeoIds.length; i++) {
                    elems.push({id: vimeoIds[i], text: vimeoIds[i]});
                }
                return {results: elems};
            }
        });


        function displayPhoneNumber(number) {
//            var phone= number.text.replace(/\D+/, "");
//            return phone;

            phone = number.text.replace(/[^\d]/g, "");

            //check if number length equals to 10
            if (phone.length == 10) {
                //reformat and return phone number
                return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            }

            return 'nr gresit: ' + number.text;

        }

        //selectize control for phone numbers
        $("#selectPhoneNumbers").select2({
            formatSelection: displayPhoneNumber,
            multiple: true,
            tags: function () {
                return $('#selectPhoneNumbers').val().split(',');
            }
        });
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