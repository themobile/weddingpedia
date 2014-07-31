var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , moment = require('moment')
    ;


exports.findAll = function (req, res) {
    var categories = [];
    var _ = require('underscore');
    var oneCategory = req.params.category ? {category: req.params.category} : '';

    Provider
        .find(oneCategory) //null or specific category
        .sort({createdAt: 'asc'})  //fixme to be decided maybe as a parameter
        .exec(function (err, providers) {
            var providersGrouped= _.map(providers,function(provider){
                moment(provider.activeTo).isBefore(new Date()) ? provider.isActive=true: provider.isActive=false;
                return provider;
            });

            providersGrouped=_.groupBy(providersGrouped, 'category');

            res.render('admin/views/providers/list', {
                providers: providersGrouped
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


exports.addProvider = function (req, res) {
    res.locals.title = 'Furnizor nou';
    res.render('admin/views/providers/new', new Provider);
//    res.render('providers/new');
};

exports.updProvider = function (req, res) {
    Provider.findById(req.param('id')).exec(function (err, result) {
        var tempResult=result.toJSON();
        res.locals.title = 'Editare furnizor';
        tempResult.activeSince=moment(result.activeSince).format('YYYY-MM-DD').toString();
        tempResult.activeTo=moment(result.activeTo).format('YYYY-MM-DD').toString();
        res.render('admin/views/providers/new', tempResult);
    });
};

exports.newProviderSave = function (req, res) {
    var xId = req.body.id
        , _ = require('underscore')
        ;

    delete  req.body.id;

    Provider.findById(xId).exec(function (error, result) {
        if (result) {
            _.extend(result, req.body);
        } else {
            result = new Provider(req.body);
        }
        result.save(function (error, saved, counter) {
            res.redirect('/admin/providers');
        });
    });
};

