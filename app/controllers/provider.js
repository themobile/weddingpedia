var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , createPagination = require('./various').pagePagination
    ;

// ATENTIE: Acest fisier este diferit de admin/provider.js


var isJson = function (string) {
    try {
        json = JSON.parse(string);
    } catch (exception) {
        json = false;
    }

    return json ? true : false;
};

exports.findAll = function (req, res) {
    var where
        , search = req.params.search
        , perpage = req.cookies.howmany > 0 ? req.cookies.howmany : 5
        , page = req.param('page') > 0 ? req.param('page') : 0
        ;

    //if url lists specific category than build find object for it
    var oneCategory = req.params.category ? {category: req.params.category} : '';


    where = search ? '(this.category+" "+this.name).match(/' + search + '/i)' : 'true';

    console.log(where);
    //get all categories as a promise then find providers.
    Provider
        .distinct('category')
        .exec()
        .then(function (categories) {
            Provider
                .find(oneCategory) //null or specific category
                .limit(perpage)
                .skip(perpage * page)
                .find({publicView:true})
                .$where(where)
                .sort({createdAt: 'asc'})  //fixme to be decided maybe as a parameter
                .exec(function (err, providers) {
                    //total number of providers
                    Provider.count().exec(function (err, count) {

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
                            pages: count / perpage,
                            perpage: perpage,
                            selectedCategory: req.params.category || req.params.search || 'toti furnizorii',
                            //jade is testing this to include intro video and short description below
                            providerRoot: (req.route.path === '/furnizori-de-nunta' || req.params.category || req.params.search) ? true : false
                        });
                    });
                });
        });

};


exports.findByName = function (req, res) {
    var url = require('url');

    //replace back + in links with spaces !Attention to not put nonalphanumeric in names
    //TODO if two providers have the same name in the same category?!!!!!!
    //categories cannot have spaces
    var providerLink = req.param('provider').replace(/\W+/g, ' ');
    Provider
        .find({name: providerLink, category: req.param('category')})
        .exec(function (err, provider) {

            provider[0].vimeoId = "http://player.vimeo.com/video/" + provider[0].vimeoId;
            if (req.user) {
//                provider[0].liked = (req.user.favorites.indexOf(provider[0].id) > -1).toString() ? 'true' : 'false';
                provider[0].liked = (req.user.favorites.indexOf(provider[0].id) > -1).toString();
            }

            res.render('providers/provider', {
                provider: provider[0],

                path: 'http://' + req.headers.host + req.path
            })

        });
};
