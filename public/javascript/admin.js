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


        $("#categorySelect").select2({
            placeholder: "Alege categoria",
            minimumInputLength: 1,
            maximumSelectionSize: 3,
            placeholder: 'categorie',
            formatAjaxError: 'eroare in citirea categoriilor',
            formatInputTooShort: 'prea putine caractere introduse',

            multiple: true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "/querycategories",
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

                    for (i = 0; i < data.categories.length; i++) {
                        final.results.push({id: data.categories[i], text: data.categories[i]});
                    }
                    return final;
                }
            },

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


        $("#selectUsersAsAdmin").select2({
            placeholder: "Alege userii care administreaza",
            minimumInputLength: 2,
//            maximumSelectionSize: 4,
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
                        final.results.push({id: data.users[i]._id, text: data.users[i].email});
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
                    data:{ids:userIds},

                    error: function (error) {
                        callback(error);
                    },
                    success: function (res) {
                        var existingItems=[];

                        for(i=0;i<res.length;i++){
                            existingItems.push({id:res[i]._id,text:res[i].email});
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