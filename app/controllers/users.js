/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , User = mongoose.model('User');

exports.signin = function (req, res) {
};

/**
 * Auth callback
 */

exports.authCallback = function (req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render('users/login', {
        title: 'Login',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User(),
        failureFlash: true
    });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};

/**
 * Session
 */

exports.session = function (req, res) {
//google analytics event login with provider
    req.visitor.event('Login activity', 'login with ' + req.user.provider, function (err) {
        console.log(err);
    });
    res.redirect('/');
};

/**
 * Create user
 */

exports.create = function (req, res) {
    var newUser = new User(req.body);
    newUser.provider = 'local';

    User
        .findOne({ email: newUser.email })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) {
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return res.render('users/signup', { errors: err.errors, user: newUser });
                    }
                    req.logIn(newUser, function (err) {
                        if (err) return next(err);
                        return res.redirect('/')
                    })
                });
            } else {
                return res.render('users/signup', { errors: [
                    {"message": "email already registered"}
                ], user: newUser })
            }
        });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
    User
        .findOne({ _id: req.params['userId'] })
        .populate('favorites')
        .exec(function (err, user) {
            if (err) {
                console.log(err);
                return next(err);
            }
            if (!user) {
                console.log('mmmmm:' + id);
                return next(new Error('Failed to load User ' + id))
            }
//            console.log(user);
            res.render('users/show', {
                title: user.name,
                user: user
            });
        });
};

/**
 *  add a provider to user favorites
 * */
exports.addToFavorites = function (req, res) {
    if (req.user.favorites.indexOf(req.param('providerId')) == -1) {
        req.user.favorites.push(req.param('providerId'));
        req.user.save(function () {
            console.log('ok-ok-ok');
            res.send('ok');
        });
    } else {
        res.send('ok');
    }
};

/**
 *  del  provider from user favorites
 * */
exports.delFromFavorites = function (req, res) {
    var index
        ;
    index = req.user.favorites.indexOf(req.param('providerId'));
    if (index > -1) {
        req.user.favorites.splice(index, 1);
        req.user.save(function () {
            console.log('ok-ok');
            res.send('ok');
        });
    } else {
        res.send('ok');
    }
};


/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
    User
        .findOne({ _id: id })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
//            console.log(user);
            req.profile = user;
            next();
        });
};


