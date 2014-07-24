var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    ;


var getVimeoThumbs = function (providers) {
    var Q = require('q');
    var url = require('url');
    var http=require('http');
    var request= Q.denodeify(require('request'));
    var _ = require('underscore');

    var npromises=[];

    providers.forEach(function (el) {
        var path = "http://vimeo.com" + "/api/v2" + url.parse(el.videoUrl).pathname + '.json';
        var response = request({uri: path, method: 'GET'});
        npromises.push(response);
    });

    Q.allSettled(npromises)
        .then(function(result){
            //put thumb large in providers
            for (var i = 0, len = result.length; i < len; i++) {
                providers[i].thumbLink = JSON.parse(result[i].value[1])[0].thumbnail_large;
            }
           return providers;
        });
};


exports.findAll = function (req, res) {
    var Q = require('q');
    var url = require("url");
    var http = require('http');
    var request = Q.denodeify(require('request'));
    var _ = require('underscore');
    var categories = [];

    //array of promises
    var npromises = [];


    Provider
        .distinct('category')
        .exec(function (err, result) {
            categories = result;
        });

    Provider
        .find()
        .sort({createdAt: 'desc'})
        .exec(function (err, providers) {

            //cycle providers and get thumb large from vimeo according to videoUrl
            providers.forEach(function (el) {
                var path = "http://vimeo.com" + "/api/v2" + url.parse(el.videoUrl).pathname + '.json';
                var response = request({uri: path, method: 'GET'});
                npromises.push(response);
            });

            //when all thumbs from vimeo were fetched
            Q.allSettled(npromises)
                .then(function (result) {

                    //put thumb large in providers
                    for (var i = 0, len = result.length; i < len; i++) {
                        providers[i].thumbLink = JSON.parse(result[i].value[1])[0].thumbnail_large;
                    }
                    ;


                    // return data to view
//                    var categories = _.uniq(_.pluck(providers, 'category'));
                    res.render('home/index', {
                        title: 'Index',
                        providers: providers,
                        categories: categories,
                        selectedCategory: req.params.category || 'all',
                        providerRoot: req.route.path === '/furnizori-de-nunta' ? true : false
                    })
                })
                .then(function (error) {
                    //fixme to treat errors
                });
        });
};


exports.findByCategory = function (req, res) {
    var Q = require('q');
    var url = require("url");
    var http = require('http');
    var request = Q.denodeify(require('request'));
    var _ = require('underscore');
    //array of promises
    var npromises = [];
    var categories = [];


    Provider
        .distinct('category')
        .exec(function (err, result) {
            categories = result;
        });

    Provider
        .find({category: req.params.category})
        .sort({createdAt: 'desc'})
        .exec(function (err, providers) {

            //cycle providers and get thumb large from vimeo according to videoUrl
            providers.forEach(function (el) {
                var path = "http://vimeo.com" + "/api/v2" + url.parse(el.videoUrl).pathname + '.json';
                var response = request({uri: path, method: 'GET'});
                console.log(el);
                npromises.push(response);
            });

            //when all thumbs from vimeo were fetched
            Q.allSettled(npromises)
                .then(function (result) {

                    //put thumb large in providers
                    for (var i = 0, len = result.length; i < len; i++) {
                        providers[i].thumbLink = JSON.parse(result[i].value[1])[0].thumbnail_large;
                    }
                    ;

                    // return data to view
                    res.render('home/index', {
                        title: 'Index',
                        providers: providers,
                        categories: categories,
                        selectedCategory: req.params.category || 'all',
                        providerRoot: true
                    });
                })
                .then(function (error) {
                    //fixme to treat errors
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
