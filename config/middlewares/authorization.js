var _ = require('underscore')
    ;
exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        return res.redirect('/login')
    }
};

exports.isAdmin = function (req, res, next) {
    //todo function to check if is admin
    var isAdmin = _.indexOf(req.user.roles, 'admin') > -1
        ;
    if (isAdmin) {
        next()
    } else {
        return res.render('404');
    }
};

exports.isEditor = function (req, res, next) {
    //todo function to check if is admin
    var isAdmin = _.indexOf(req.user.roles, 'editor') > -1
        ;
    if (isAdmin) {
        next()
    } else {
        return res.render('404');
    }
};

