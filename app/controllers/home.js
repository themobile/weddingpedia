var providersInitial = [
    {
        name: 'provider1',
        videoLink: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider2',
        videoLink: 'http://player.vimeo.com/video/98648575',
        category: 'fotograf'
    },
    {
        name: 'provider3',
        videoLink: 'http://player.vimeo.com/video/45720709',
        category: 'fotograf'
    },
    {
        name: 'provider4',
        videoLink: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider5',
        videoLink: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider6',
        videoLink: 'http://player.vimeo.com/video/98648575',
        category: 'makeup'
    },
    {
        name: 'provider7',
        videoLink: 'http://player.vimeo.com/video/46880926',
        category: 'restaurant'
    },
    {
        name: 'provider8',
        videoLink: 'http://player.vimeo.com/video/98648575',
        category: 'restaurant'
    },
    {
        name: 'provider9',
        videoLink: 'http://player.vimeo.com/video/44261752',
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
    //array of promises
    var npromises = [];


    if (!req.session.notFirstTime)  req.session.notFirstTime = true;

    //if request is filtered by category
    if (req.route.path == '/furnizori-de-nunta/:category' && req.params.category) {
        var providers = _.filter(providersInitial, function (elem) {
            return elem.category === req.params.category;
        });
    } else {
        var providers = providersInitial;
    }


    //cycle providers and get thumb large from vimeo according to videoLink
    providers.forEach(function (el) {
        var path = "http://vimeo.com" + "/api/v2" + url.parse(el.videoLink).pathname + '.json';
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

            var categories = _.uniq(_.pluck(providersInitial, 'category'));
            if (req.route.path === '/furnizori-de-nunta' || typeof(req.params.category) != 'undefined') {
                providerRoot = true;
            } else {
                providerRoot = false;
            }

//        return data to view
            res.locals = {
                providers: providers,
                categories: categories,
                providerRoot: providerRoot,
                selectedCategory:req.params.category || 'all'
            };


            res.render('home/index', {
                title: 'weddingpedia home'
            });


        })
        .then(function (error) {

        });


};