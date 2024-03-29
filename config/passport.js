var mongoose = require('mongoose')
    , LocalStrategy = require('passport-local').Strategy
//    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
//    , GitHubStrategy = require('passport-github').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , User = mongoose.model('User')
    ;






module.exports = function (passport, config) {
    // require('./initializer')

    // serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        })
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, { message: 'adresa de email incorecta' })
                }
                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'ai gresit parola' })
                }

                return done(null, user)
            })
        }
    ));


    // use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID, clientSecret: config.facebook.clientSecret, callbackURL: config.facebook.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {

            User.findOne({ 'email': profile.emails[0].value}, function (err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    user = new User({
                        name: profile.displayName, email: profile.emails[0].value, username: profile.username, provider: 'facebook', facebook: profile
                    });
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            return done(err, user);
                        }
                    })
                } else {
                    user.update({facebook: profile}, function (err, numberAffected, raw) {
                        if (err) return handleError(err);
                        console.log('facebook info updated');
                        return done(err, user)
                    });
                }
            });


        }
    ));



    // use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {

            User.findOne({ 'email': profile.emails[0].value }, function (err, user) {

                if (!user) {
                    // make a new google profile without key start with $
                    user = new User({
                        name: profile.displayName, email: profile.emails[0].value, username: profile.username, provider: 'google', google: profile
                    });
                    user.save(function (err) {

                        if (err) {
//                            console.log(err);
                            return done(err, user);
                        }
                    });
                } else {
                    user.update({google: profile, name: profile.displayName, provider: "google"}, function (err, numberAffected, raw) {
                        if (err) return handleError(err);
//                        console.log('google info updated');

                        return done(err, user)
                    });
                }
            })
        }
    ));
};
