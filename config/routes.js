var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth=require('../config/middlewares/authorization');


var users = require('../app/controllers/users');
var blog = require('../app/controllers/blog');
var various = require('../app/controllers/various');
var provider = require('../app/controllers/provider');
var upload = require('../app/controllers/upload')

// user routes
router.get('/login', users.login);
router.get('/signup', users.signup);
router.get('/logout', users.logout);

router.post('/users', users.create);
router.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
router.get('/users/:userId', users.show);
router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }));
router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }));

// this is home page
router.get('/', provider.findAll);
router.get('/furnizori-de-nunta/:category', provider.findAll);
router.get('/furnizori-de-nunta', provider.findAll);

//providers
router.post('/furnizori-de-nunta/new', provider.newProviderSave);
router.post('/furnizori-de-nunta/upd', provider.updProviderSave);

// various unessential pages
//about page
router.get('/despre', various.despre);

//bloging
router.get('/blog', blog.findAll);
router.get('/blog/new', blog.newPost);
router.post('/blog/new', blog.newPostSave);
router.get('/blog/:id', blog.findById);

//uploading images
router.post('/uploadimage', upload.uploadimage);


module.exports = router;