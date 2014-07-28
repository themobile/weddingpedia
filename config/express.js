/**
 * Module dependencies.
 */

var express = require('express')
    , session = require('express-session')

    , mongoStore = require('connect-mongo')(session)
    , flash = require('connect-flash')
    , helpers = require('view-helpers')
    , jade = require('jade')

    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-Parser')
    , favicon = require('static-favicon')
    , compress = require('compression')
    , routes = require('../config/routes');


module.exports = function (app, config, passport) {


    app.set('showStackError', true);

    // should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return /json|text|javascript|css|svg/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));


    app.use(favicon());
    app.use(express.static(config.root + '/public'));

    // don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('combined'));
    }


    // set views path, template engine and default layout
    app.set('view engine', 'jade');
    app.set('views', config.root + '/app/views');
    app.set('view cache', process.env.NODE_ENV !== 'development');


    //for robots and EXPRESS removal from head
    app.use(function (req, res, next) {

        res.removeHeader("X-Powered-By");

        if ('/robots.txt' === req.url) {
            res.type('text/plain');
            res.send('User-agent: *\nDisallow: /');
        } else {
            next();
        }
    });

    // cookieParser should be above session
    app.use(cookieParser());


    // bodyParser should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    // express/mongo session storage
    app.use(session({
        secret: 'weddingpedia_237093473',
        saveUninitialized: true,
        resave: true,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // connect flash for flash messages
    app.use(flash());


    app.use(function (req, res, next) {
        var userid = req.session.passport ? req.session.passport.user ? req.session.passport.user : null : null || null;
        res.locals.session = req.session;
        res.locals.userid = userid;

        next();
    });


    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());


    // routes should be at the last
//    app.use(app.router);
    app.use('/', routes);


/// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

/// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);

            console.log(err.status);
            if (err.status == 404) {
                res.render('404');
            } else {
                res.render('500', {
                    message: err.message,
                    error: err
                });
            }

        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);

        if (err.status == 404) {
            res.render('404');
        } else {
            res.render('500', {
                message: err.message,
                error: {}
            });
        }
    });

}

