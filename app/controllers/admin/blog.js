var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    , moment = require('moment')
    , _ = require('underscore');
;


//romanian language for dates
moment.lang('ro');

exports.findAll = function (req, res) {


    //number of posts per page
    var perPage = 6
        , page = req.param('page') > 0 ? req.param('page') : 0;

    //function to create pagination (sent to jade in res.render)
    var createPagination = function (pages, page) {
        var url = require('url')
            , qs = require('querystring')
            , params = qs.parse(url.parse(req.url).query)
            , str = '';

// pagination with figures
        //code for showing page numbers
        params.page = 0;
        var clas = page == 0 ? "active" : "no";
        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">&larr;</a></li>';
        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">1</a></li>';

        for (var p = 1; p < pages; p++) {
            params.page = p;
            var pg = parseInt(p) + 1;
            clas = page == p ? "active" : "no";
            str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' + pg + '</a></li>';
        }

        params.page = --p;
        clas = page == params.page ? "active" : "no";
        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">&rarr;</a></li>';

        return str;

    };

    Blog
        .find()
        .limit(perPage)
        .skip(perPage * page)
        .sort({createdAt: 'desc'})
        .exec(function (err, articles) {

//            var articles=articles;

//
            Blog.count().exec(function (err, count) {
                //pass function to create pagination
//                res.locals.createPagination = createPagination;
                console.log('count:' + count);
                if (err) console.log(err);

                res.render('admin/views/blog/list', {
                    title: 'Blog',
//                    page: page,
//                    perPage: perPage,
//                    pages: count / perPage,
                    articles: articles
//                    ,
//                    moment:moment
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

