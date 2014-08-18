var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , User = mongoose.model('User')
    , Q = require('q')
    , _ = require('underscore')
    ;

exports.mainview = function (req, res) {
    res.render('admin/views/main');
};


exports.getUserList = function (req, res) {

    User.find()
        .exec(function (err, users) {
            if (err) console.log(err);

            res.render('admin/views/users/list', {users: users});
        });
};

exports.showUser = function (req, res) {
    User
        .findById(req.param('id'))
        .exec(function (err, user) {
            if (err) console.log(err);
            res.render('admin/views/users/user', {user: user});
        });

};


__delArrayElement = function (arrayToDel, elementToDel) {
    var newArray = []
        ;
    _.each(arrayToDel, function (item) {
            if (item != elementToDel) {
                newArray.push(item);
            }
        }
    );
    return newArray;
};

_delProviderRef = function (userId, providerList) {
    var promises = []
        ;
    _.each(providerList, function (providerId) {
        Provider.findById(providerId)
            .exec(function (error, provider) {
                if (provider) {
                    provider.userList = __delArrayElement(provider.userList, userId);
                    promises.push(provider.save());
                }
            });
    });
    return promises;
};

exports.userDelete = function (req, res) {
    var userId = req.param('id')
        ;
    User.findById(userId)
        .exec(function (error, user) {
            user.favorites = [];
            user.projects = [];
            Q.allSettled([user.save(), _delProviderRef(userId, user.providersList)])
                .then(function (success) {
                    user.remove(function (err, deleted) {
                        res.json({userId: userId});
                    });
                }, function (error) {
                    console.log(error);
                    res.render('500', {
                        message: error.message,
                        error: {}
                    });
                });
        });
};

exports.userSave = function (req, res) {
    var userId = req.body.id
        ;

    delete  req.body.id;

    User
        .findById(userId)
        .exec(function (error, thisUser) {
            var roles;

            if (req.body.roles.length > 0) {
                roles = req.body.roles.split(',');
                req.body.roles = roles;

            } else {
                req.body.roles = [];
            }

            if (thisUser) {
                _.extend(thisUser, req.body);
                thisUser.save(function (error, saved, counter) {

                    if (error) {
                        console.log(error);
                    }
                    res.redirect('/admin/userlist');
                });
            }


        });
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