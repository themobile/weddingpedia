$(document)


    .load(function () {

    })
    .ready(function () {


        // blog save new blog post
        $('.formblog button[type="submit"]').click(function () {


            var data = $('#newBlogPost').serializeArray();
            data.push({name: 'body', value: editor.serialize()['element-0'].value})


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
            multiple:true,
            formatAjaxError: 'eroare in citirea rolurilor',
            formatInputTooShort: 'prea putine caractere introduse',

            data: [{id:'admin',text:'admin'},{id:'editor',text:'editor'}],
            initSelection: function (element, callback) {
                // the input tag has a value attribute preloaded that points to a preselected movie's id
                // this function resolves that id attribute to an object that select2 can render
                // using its formatResult renderer - that way the movie name is shown preselected

                var data=[];
                var existingRoles = $(element).val().split(',');

                for (i=0;i<existingRoles.length;i++) {
                    data.push({id:existingRoles[i],text:existingRoles[i]})
                }

                callback(data);
            }
        });


        //load categories into provider combo
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


        function formatUserList(user) {
            return user.name + ' - ' + user.text;
        }

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