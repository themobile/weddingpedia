module.exports = function (app, passport, auth) {
    // user routes
    var users = require('../app/controllers/users');
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
//    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }));
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }));

    // this is home page
    var home = require('../app/controllers/home');
    app.get('/', home.index);

    // various unessential pages
    var various = require('../app/controllers/various');

    //about page
    app.get('/despre', various.despre);




}
