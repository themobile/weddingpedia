var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , User = mongoose.model('User')
    , _ = require('underscore');

exports.mainview = function (req, res) {
    res.render('admin/views/main');
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
            var enduser={};

            var endusers= _.map(users,function(user){
                enduser._id=user._id;
                enduser.name=user.name;
                enduser.email=user.email;
                return enduser;
            });
            res.send({
                users: endusers
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