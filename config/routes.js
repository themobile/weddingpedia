var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../config/middlewares/authorization');


var users = require('../app/controllers/users');
var blog = require('../app/controllers/blog');
var various = require('../app/controllers/various');
var provider = require('../app/controllers/provider');
var upload = require('../app/controllers/upload');

//ADMIN CONTROLLERS
var admin = require('../app/controllers/admin/admin');
var adminProvider = require('../app/controllers/admin/provider');
var adminBlog = require('../app/controllers/admin/blog');


// user routes
router.get('/login', users.login);
router.get('/signup', users.signup);
router.get('/logout', users.logout);


router.get('/users/:userId', users.show);

router.post('/users', users.create);
router.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login'}), users.session);
router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), users.session);

// this is home page

router.get('/', provider.findAll);

//providers
router.get('/furnizori-de-nunta/:category', provider.findAll);
router.get('/furnizori-de-nunta', provider.findAll);
router.get('/furnizori-de-nunta/:category/:provider', provider.findByName);


//bloging
router.get('/blog', blog.findAll);
router.get('/blog/:id', blog.findById);


//uploading images
router.post('/admin/blog/uploadimage', upload.uploadimage);

// various unessential pages
//about page
router.get('/despre', various.despre);


//admin routes

//providers
router.get('/admin', auth.hasMenuAdmin, admin.mainview);
router.get('/admin/providers', auth.hasProviders, adminProvider.findAll);                   //securizat pe providerii asignati
router.get('/admin/providers/new', auth.isAdmin, adminProvider.addProvider);
router.get('/admin/providers/update/:id', auth.hasProviders, adminProvider.updProvider);    //securizat
router.post('/admin/providers/save', auth.hasProviders, adminProvider.newProviderSave);

//blog
router.get('/admin/blog', auth.isEditor, adminBlog.findAll);
router.get('/admin/blog/new', auth.isEditor, adminBlog.newPost);
router.post('/admin/blog/new', auth.isEditor, adminBlog.newPostSave);
router.get('/admin/blog/update/:id', auth.isEditor, adminBlog.updPost);


//users
//for users that can edit a specific providers
router.get('/queryusers', admin.queryUsers);

router.post('/usersbyid', admin.findUsersById);

//to get all provider categories
router.get('/querycategories', admin.queryCategories);


router.get('/admin/userlist', auth.isAdmin, admin.getUserList);
router.get('/admin/users/update/:id', auth.isAdmin, admin.showUser);
router.post('/admin/users/save', auth.isAdmin, admin.userSave);


module.exports = router;