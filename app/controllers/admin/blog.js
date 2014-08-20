var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    , moment = require('moment')
    , createPagination=require('../various').pagePagination
    , _ = require('underscore');
;


//romanian language for dates
moment.lang('ro');

exports.findAll = function (req, res) {
    var perpage = req.cookies.howmany>0 ? req.cookies.howmany : 5
        , page = req.param('page') > 0 ? req.param('page') : 0;

    Blog
        .find()
        .limit(perpage)
        .skip(perpage * page)
        .sort({createdAt: 'desc'})
        .exec(function (err, articles) {


//
            Blog.count().exec(function (err, count) {
                //pass function to create pagination
//                res.locals.createPagination = createPagination;
                if (err) console.log(err);

                res.render('admin/views/blog/list', {
                    title: 'Blog',
                    page: page,
                    pages: count / perpage,
                    perpage: perpage,
                    createPagination: createPagination,
                    articles: articles,
                    moment:moment
                })

            })
        });

};


exports.newPost = function (req, res) {
    var newPost = new Blog;
    res.locals.title = 'Postare noua';
    res.render('admin/views/blog/new', newPost);
};

exports.updPost = function (req, res) {
    Blog.findById(req.param('id')).exec(function (err, result) {
        res.locals.title = 'Editare postare blog';
        res.render('admin/views/blog/new', result);
    });
};


exports.newPost = function (req, res) {
    res.render('admin/views/blog/new');
};

exports.newPostSave = function (req, res) {

//    logger.debug('req body id:'+req.body.id);
    var postId = req.body.id
        ;

    delete  req.body.id;


    Blog.findById(postId)
        .exec(function (error, thisPost) {
            if (thisPost) {
                _.extend(thisPost, req.body);
            } else {
                thisPost = new Blog(req.body);
            }

            thisPost.save(function (error, saved, counter) {
                if (error) {
                    console.log(error);
                }
                else {
                    res.redirect('/admin/blog');
                }
            });
        });
};

exports.findById = function (req, res) {
    Blog.findById(req.param('id')).exec(function (err, result) {
        //get creationdate from objectId
        //        console.log(new mongoose.Types.ObjectId(result._id).getTimestamp() );
        res.render('blog/article', result);
    });
};

