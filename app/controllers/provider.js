var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    ;


// function to add dynamic thumbs to providers from vimeo.
// returns a promise to be evaluated
var getVimeoThumbs = function (providers) {
    var Q = require('q');
    var url = require('url');
    var http = require('http');
    var request = Q.denodeify(require('request'));
    var _ = require('underscore');

    var npromises = [];

    providers.forEach(function (el) {
        var path = "http://vimeo.com" + "/api/v2" + url.parse(el.videoUrl).pathname + '.json';
        var response = request({uri: path, method: 'GET'});
        npromises.push(response);
    });

    return Q.allSettled(npromises);

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
                    getVimeoThumbs(providers)
                        .then(function (results) {
                            //put thumb large in providers
                            for (var i = 0, len = results.length; i < len; i++) {
                                providers[i].thumbLink = JSON.parse(results[i].value[1])[0].thumbnail_large;
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
        });

};


exports.newProviderSave = function (req, res) {
    var providerToSave = {}
        , providerModel
        ;

    providerToSave.name = req.param('name');
    providerToSave.category = req.param('category');
    providerToSave.videoUrl = req.param('videoUrl');

    providerModel = new Provider(providerToSave);
    providerModel.save(function (error, saved) {
        console.log('uraaaaaaa am adaugat providerul');
        res.redirect('/');
    });

};


exports.updProviderSave = function (req, res) {
    var providerToSave = {}
        , providerModel
        ;

    providerToSave.name = req.param('name');
    providerToSave.category = req.param('category');
    providerToSave.videoUrl = req.param('videoUrl');

    providerModel = new Provider();

    providerModel.findByIdAndUpdate(req.param('id'), providerToSave, {}, function (error, saved) {
        console.log('uraaaaaaa am MODIFICAT  providerul');
        res.redirect('/');
    });
//
//    providerModel.save(function (error, saved) {
//        console.log('uraaaaaaa am adaugat providerul');
//        res.redirect('/');
//    });

};
