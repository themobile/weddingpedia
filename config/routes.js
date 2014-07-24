module.exports = function (app, passport, auth) {

    var users = require('../app/controllers/users');
    var blog = require('../app/controllers/blog');
    var various = require('../app/controllers/various');
    var home = require('../app/controllers/home');

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }));
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }));

    // this is home page
    app.get('/', home.index);
    app.get('/furnizori-de-nunta/:category', home.index);
    app.get('/furnizori-de-nunta', home.index);

    // various unessential pages
    //about page
    app.get('/despre', various.despre);

    //bloging
    app.get('/blog', blog.findAll);
    app.get('/blog/new', blog.newPost)
    app.post('/blog/new', blog.newPostSave);
    app.get('/blog/:id', blog.findById);

};
