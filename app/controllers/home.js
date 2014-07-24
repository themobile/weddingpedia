var providersInitial = [
    {
        name: 'provider1',
        videoUrl: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider2',
        videoUrl: 'http://player.vimeo.com/video/101063892',
        category: 'fotograf'
    },
    {
        name: 'provider3',
        videoUrl: 'http://player.vimeo.com/video/45720709',
        category: 'fotograf'
    },
    {
        name: 'provider4',
        videoUrl: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider5',
        videoUrl: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider6',
        videoUrl: 'http://player.vimeo.com/video/98648575',
        category: 'makeup'
    },
    {
        name: 'provider7',
        videoUrl: 'http://player.vimeo.com/video/46880926',
        category: 'restaurant'
    },
    {
        name: 'provider8',
        videoUrl: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider9',
        videoUrl: 'http://player.vimeo.com/video/44261752',
        category: 'restaurant'
    }

];


exports.index = function (req, res) {
    var Q = require('q');
    var url = require("url");
    var http = require('http');
    var request = Q.denodeify(require('request'));
    var _ = require('underscore');
    var providerRoot = false;

    var qs = require('querystring')
    var params = qs.parse(url.parse(req.url).query)
    var str = '';

    //array of promises
    var npromises = [];
    var providers

//    if (!req.session.notFirstTime)  req.session.notFirstTime = true;

    //if request is filtered by category
    if (req.route.path == '/furnizori-de-nunta/:category' && req.params.category) {
        providers = _.filter(providersInitial, function (elem) {
            return elem.category === req.params.category;
        });
    } else {
        var providers = providersInitial;
    }


    //cycle providers and get thumb large from vimeo according to videoUrl
    providers.forEach(function (el) {
        var path = "http://vimeo.com" + "/api/v2" + url.parse(el.videoUrl).pathname + '.json';
        var response = request({uri: path, method: 'GET'});
        npromises.push(response);
    });

    //add fake provider if number % 3 or %2 is not 0


    //when all thumbs from vimeo were fetched
    Q.allSettled(npromises)
        .then(function (result) {

            //put thumb large in providers
            for (var i = 0, len = result.length; i < len; i++) {
                providers[i].thumbLink = JSON.parse(result[i].value[1])[0].thumbnail_large;
            }
            ;

            var categories = _.uniq(_.pluck(providersInitial, 'category'));
            if (req.route.path === '/furnizori-de-nunta' || typeof(req.params.category) != 'undefined') {
                providerRoot = true;
            } else {
                providerRoot = false;
            }

//        return data to view

            res.locals.providers = providers;
            res.locals.categories = categories;
            res.locals.providerRoot = providerRoot;
            res.locals.selectedCategory = req.params.category || 'all';

            res.render('home/index', {
                title: 'weddingpedia home'
            });


        })
        .then(function (error) {

        });


};
