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


        var $categorySelect = $('#categorySelect').selectize({
            create: true,
            preload: true,
            valueField: 'category',
            labelField: 'category',
            searchField: 'category',
            maxItems: 1,
            render: {
                item: function (item) {
                    return "<div>" + item.category + "</div>";

                }
            }
        });

        if ($categorySelect[0]) {
            var catSelect = $categorySelect[0].selectize;
            catSelect.clear();
            catSelect.clearOptions();
            catSelect.load(function (callback) {
                $.ajax({
                    url: window.location.protocol + '//' + window.location.host + '/querycategories',
                    type: 'GET',
                    dataType: 'json',

                    error: function (error) {
                        callback(error);
                    },
                    success: function (res) {
                        console.log(res.categories);
                        var itemstoadd = res.categories.map(function (item) {
                            var obj = {};
                            obj.category = item;
                            return obj;
                        });


                        callback(itemstoadd);
                    }
                });
            });
        }



        var $selectUsersAsAdmin = $('#selectUsersAsAdmin').selectize({
//            preload:true,
            maxItems: 3,
            valueField: '_id',
            labelField: 'email',
            searchField: 'email',
            create: true,
            render: {
                item: function (item, escape) {
                    var name = item.name;
                    return '<div>' +
                        (name ? '<span class="name">' + escape(name) + '&nbsp</span>' : '') +
                        (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
                        '</div>';
                },
                option: function (item, escape) {
                    var name = item.name;
                    var email = item.email;
                    return '<div>' +
                        '<span class="label">' + escape(name) + '&nbsp</span>' +
                        (email ? '<span class="caption">' + escape(email) + '</span>' : '') +
                        '</div>';
                }
            },
            load: function (query, callback) {
                if (query.length < 3) return callback();
                $.ajax({
                    url: window.location.protocol + '//' + window.location.host + '/queryusers',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        q: query,
                        page_limit: 10
                    },
                    error: function (error) {
                        callback(error);
                    },
                    success: function (res) {
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