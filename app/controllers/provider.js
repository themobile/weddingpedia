var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , _ = require('underscore')
    , createPagination = require('./various').pagePagination
    ;

// ATENTIE: Acest fisier este diferit de admin/provider.js



exports.findAll = function (req, res) {
    var where
        , search = req.params.search
        , perpage = req.cookies.frontHowMany > 0 ? req.cookies.frontHowMany : 5
        , page = req.param('page') > 0 ? req.param('page') : 0
        ;

    //if url lists specific category than build find object for it
    var oneCategory = req.params.category ? {category: req.params.category} : '';


    where = search ? '(this.category+" "+this.name).match(/' + search + '/i)' : 'true';

    //get all categories as a promise then find providers.
    Provider
        .distinct('category')
        .exec()
        .then(function (categories) {
            Provider
                .find(oneCategory) //null or specific category
                .find({publicView: true})
                .limit(perpage)
                .skip(perpage * page)
                .$where(where)
                .sort({createdAt: 'asc'})  //fixme to be decided maybe as a parameter
                .exec(function (err, providers) {

                    //total number of providers
                    Provider
                        .find(oneCategory).find({publicView: true}).$where(where).exec(function (err, providerToBeCounted) {

                        //put thumb large in providers
                        for (var i = 0, len = providers.length; i < len; i++) {
                            var category = encodeURIComponent(providers[i].category).replace(/%20/g, '+');
                            var name = encodeURIComponent(providers[i].name).replace(/%20/g, '+');
                            providers[i].link = category + '/' + name;
                            providers[i].liked = req.user ? req.user.favorites.indexOf(providers[i].id) > -1 : false;
                        }

                        res.locals.createPagination = createPagination;

                        res.render('home/index', {
                            title: 'Index',
                            providers: providers,
                            categories: categories,
                            page: page,
                            pages: providerToBeCounted.length / perpage,
                            perpage: perpage,
                            selectedCategory: req.params.category || req.params.search || 'toti furnizorii',
                            //jade is testing this to include intro video and short description below
                            providerRoot: (req.route.path === '/furnizori-de-nunta' || req.params.category || req.params.search) ? true : false
                        });
                    });
                });
        });

};


// save a reference to the core implementation
var indexOfValue = _.indexOf;

// using .mixin allows both wrapped and unwrapped calls:
// _(array).indexOf(...) and _.indexOf(array, ...)
_.mixin({

    // return the index of the first array element passing a test
    indexOf: function (array, test) {
        // delegate to standard indexOf if the test isn't a function
        if (!_.isFunction(test)) return indexOfValue(array, test);
        // otherwise, look for the index
        for (var x = 0; x < array.length; x++) {
            if (test(array[x])) return x;
        }
        // not found, return fail value
        return -1;
    }

});

exports.findByName = function (req, res) {
    var url = require('url');
    var providerLink = '/furnizori-de-nunta/' + req.param('category') + '/' + req.param('provider');
    Provider
        .find({url: providerLink})
        .exec(function (err, provider) {

            if (typeof provider[0].vimeoId!='undefined') {
                provider[0].vimeoId = "http://player.vimeo.com/video/" + provider[0].vimeoId;
            }

            if (req.user) {
                provider[0].liked = _.indexOf(req.user.favorites, function (favorite) {
                    return favorite.providerId == provider[0].id;
                })
            }

            res.render('providers/provider', {
                provider: provider[0],
                hasVideo: true,
                path: 'http://' + req.headers.host + req.path
            })

        });
};
