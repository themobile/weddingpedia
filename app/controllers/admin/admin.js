var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , User = mongoose.model('User')
    , _ = require('underscore');

exports.mainview = function (req, res) {
    res.render('admin/views/main');
};


exports.findUsersById = function (req, res) {
    var categories = []


    User
        .find({
            '_id': { $in: req.body.ids}
        })
        .exec(function (err, users) {
            res.json(users);
        });
};

exports.queryUsers = function (req, res) {

    var mongoose = require('mongoose')
        , _ = require('underscore')
        , url = require('url')
        , qs = require('querystring')
        , params = qs.parse(url.parse(req.url).query);

    User
        .find({email: new RegExp(params.q, 'i')})
        .limit(params.page_limit)
        .sort({createdAt: 'desc'})
        .exec(function (err, users) {
            var retUsers = _.map(users, function (user) {
                var retUser = {}
                    ;
                retUser._id = user._id;
                retUser.name = user.name;
                retUser.email = user.email;
                return retUser;
            });
            res.send({
                users: retUsers
            });
        });
};


exports.queryCategories = function (req, res) {

    Provider
        .distinct('category')
        .exec()
        .then(function (categories) {
            res.send({
                categories: categories
            });
        });
};