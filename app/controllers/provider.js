var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
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
    var categories = [];

    //if url lists specific category than build find object for it
    var oneCategory = req.params.category ? {category: req.params.category} : '';

    //get all categories as a promise then find providers.
    Provider
        .distinct('category')
        .exec()
        .then(function (categories) {
            Provider
                .find(oneCategory) //null or specific category
                .sort({createdAt: 'asc'})  //fixme to be decided maybe as a parameter
                .exec(function (err, providers) {

                            //put thumb large in providers
                            for (var i = 0, len = providers.length; i < len; i++) {
                                var category = encodeURIComponent(providers[i].category).replace(/%20/g, '+');
                                var name = encodeURIComponent(providers[i].name).replace(/%20/g, '+');
                                providers[i].link = category + '/' + name;
                            }

                            res.render('home/index', {
                                title: 'Index',
                                providers: providers,
                                categories: categories,
                                selectedCategory: req.params.category || 'all',
                                //jade is testing this to include intro video and short description below
                                providerRoot: (req.route.path === '/furnizori-de-nunta' || req.params.category) ? true : false
                            });

                        }, function (error) {
                            console.log(error);

                        });
        });

};


exports.findByName = function (req, res) {
    var url = require('url');

    //replace back + in links with spaces !Attention to not put nonalphanumeric in names
    //TODO if two providers have the same name in the same category?!!!!!!
    //categories cannot have spaces
    var providerLink = req.param('provider').replace(/\W/g, ' ');
    Provider
        .find({name: providerLink, category: req.param('category')})
        .exec(function (err, provider) {
            provider[0].videoUrl = "http://player.vimeo.com/video/" + provider[0].videoUrl;
            res.render('providers/provider', {
                provider: provider[0]
            })

        });
};
