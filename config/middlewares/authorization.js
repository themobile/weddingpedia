var _ = require('underscore')
    ;
exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        return res.redirect('/login');
    }
};

exports.isAdmin = function (req, res, next) {
    var isAdmin
        ;
    if (req.user) {
        isAdmin = _.indexOf(req.user.roles, 'admin') > -1;
        if (isAdmin) {
            next()
        } else {
            return res.render('404');
        }
    } else {
        return res.redirect('/login');
    }
};

exports.isEditor = function (req, res, next) {
    var isEditor
        , isAdmin
        ;
    if (req.user) {
        isEditor = _.indexOf(req.user.roles, 'editor') > -1;
        isAdmin = _.indexOf(req.user.roles, 'admin') > -1;
        if (isAdmin || isEditor) {
            next()
        } else {
            return res.render('404');
        }
    } else {
        return res.redirect('/login');
    }
};

