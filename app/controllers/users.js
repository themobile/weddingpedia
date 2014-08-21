/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , _ = require('underscore')
    , User = mongoose.model('User')
    , Provider = mongoose.model('Provider')
    ;

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
        .populate('favorites.providerId')
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

_likeCounterAdmin = function (providerId, vote) {

    Provider.findById(providerId, function (error, provider) {
        var cntLikes = provider.likeCounter || 0
            , cntUnLikes = provider.unLikeCounter || 0
            ;
        if (vote > 0) {
            cntLikes++;
        } else {
            cntUnLikes++;
        }
        provider.update({likeCounter: cntLikes, unLikeCounter: cntUnLikes}, function (err, cntAffected, raw) {
            return true;
        });
    });
};


/**
 *  add a provider to user favorites
 * */
exports.addToFavorites = function (req, res) {
    var provId=req.param('providerId')
        , founded=false
        ;

    founded = _.indexOf(req.user.favorites, function(favorite){
        return favorite.providerId==provId

    });
    if (founded==-1) {
        req.user.favorites.push({providerId:provId});
        req.user.save(function(){
            _likeCounterAdmin(provId, 1);
            res.send('ok');
        })
    } else {
        res.send('ok');
    }

};


// save a reference to the core implementation
var indexOfValue = _.indexOf;

// using .mixin allows both wrapped and unwrapped calls:
// _(array).indexOf(...) and _.indexOf(array, ...)
_.mixin({

    // return the index of the first array element passing a test
    indexOf: function(array, test) {
        // delegate to standard indexOf if the test isn't a function
        if (!_.isFunction(test)) return indexOfValue(array, test);
        // otherwise, look for the index
        for (var x = 0; x < array.length; x++) {
            if (test(array[x])) return x;
        }
        // not found, return fail value
        return -1;
    }

});


/**
 *  del  provider from user favorites
 * */
exports.delFromFavorites = function (req, res) {
    var index,user=req.user
        ;

    index = _.indexOf(user.favorites, function(elem){
        return elem.providerId==req.body.providerId;
    });
    if (index > -1) {
        user.favorites.splice(index, 1);
        user.save(function () {
            _likeCounterAdmin(req.body.providerId, -1);
            console.log('success save');
            res.send('ok');
        });
    } else {
        console.log('eroare salvare');
        res.send('ok');
    }
};

/**
 *      add projects
 * */
exports.addProject = function (req, res) {
    var project = {
        providerId: req.body.providerId,
        amount: req.body.amount || 1.01,
        date: req.body.date || (new Date()),
        comments: req.body.comments || '::empty::'
    };
    req.user.projects.push(project);
    req.user.save(function () {
        res.send('ok');
    });
};

exports.removeProject = function (req, res) {
    var projectId = req.body.projectId
        , result = []
        ;
//    projectId = '53e8cb48fdcddc28276ce5a5';
    _.each(req.user.projects, function (project) {
        if (project._id != projectId) {
            result.push(project);
        }
    });
    req.user.projects = result;
    req.user.save(function () {
        console.log('ok-ok-ok-ok');
        res.send('ok');
    });
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


