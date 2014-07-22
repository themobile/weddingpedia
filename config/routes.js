module.exports = function (app, passport, auth) {
    // user routes
    var users = require('../app/controllers/users');
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
//    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }));
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }));


    // this is home page
    var home = require('../app/controllers/home');
    app.get('/', home.index);
    app.get('/furnizori-de-nunta/:category', home.index);
    app.get('/furnizori-de-nunta', home.index);

    // various unessential pages
    var various = require('../app/controllers/various');

    //about page
    app.get('/despre', various.despre);


    //blogging
    var ArticleProvider = require('../app/controllers/blog').ArticleProvider;
    var blog = new ArticleProvider;
    app.get('/blog', function (req, res) {
        blog.findAll(function (error, docs) {
            res.render('blog/list',
                {
                    title: 'Blog',
                    articles: docs

                }
            );
        });
    });

    app.get('/blog/new', function(req,res){
        res.render('blog/new');
    });

    app.post('/blog/new', function(req,res){
        blog.save({
            title:req.param('title'),
            body:req.param('body')
        }
            , function(error,docs){
            res.redirect('/blog');
        }
        );
    });

    app.get('/blog/:id', function(req,res){
        blog.findById(req.params.id,function(err,article){
            res.render('blog/article',
                {
                    title:article.title,
                    article:article
                }
            );
        });
    });


}
