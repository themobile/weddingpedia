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
    if (req.user) {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.render("404");
        }
    } else {
        return res.redirect("/login");
    }
};

exports.isEditor = function (req, res, next) {
    if (req.user) {
        if (req.user.isAdmin || req.user.isEditor) {
            next()
        } else {
            return res.render('404');
        }
    } else {
        return res.redirect('/login');
    }
};

