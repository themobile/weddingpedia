var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    , moment = require('moment')
    , _ = require('underscore')
    ;


//romanian language for dates
moment.lang('ro');


exports.findAll = function (req, res) {
    //number of posts per page
    var perPage = 4
        , page = req.param('page') > 0 ? req.param('page') : 0
        , where
        ;

    //function to create pagination (sent to jade in res.render)
    var createPagination = function (pages, page) {
        var url = require('url')
            , qs = require('querystring')
            , params = qs.parse(url.parse(req.url).query)
            , str = '';

        // prev/next buttons
        var currPage = parseInt(page);
        var noPages = parseInt(pages);

        //showing previous - next instead
        var prevclas = (currPage < noPages) ? 'prevactive' : 'disabled';
        var nextclas = (currPage > 0) ? 'nextactive' : 'disabled';

        str += '<span class="' + prevclas + ' icon icon-arrow"><a href="?page=' + (currPage + 1) + '">&larr;&nbsp postari mai vechi</a></span>';
        str += '<span class="' + nextclas + ' right"><a href="?page=' + (currPage - 1) + '">&nbsp postari mai noi &nbsp&rarr;</a></span>';
        return str;

    };

    if (req.user) {
        where = req.user.isAdmin || req.user.isEditor ? 'true' : 'this.publicView';
    } else {
        where = 'this.publicView';
    }

    Blog
        .find({publicView:true})
        .$where(where)
        .limit(perPage)
        .skip(perPage * page)
        .sort({createdAt: 'desc'})
        .exec(function (err, articles) {
            Blog
                .count()
                .exec(function (err, count) {
                    //pass function to create pagination
                    res.locals.createPagination = createPagination;

                    res.render('blog/list', {
                        title: 'Blog',
                        page: page,
                        perPage: perPage,
                        pages: count / perPage,
                        articles: articles,
                        moment: moment
                    });
                });
        });

};

exports.newPost = function (req, res) {
    res.render('blog/new');
};

exports.newPostSave = function (req, res) {
//    get data passed by frontend - check to be sure it corresponds to blog post schema
    var newPost = new Blog(req.body);
    newPost.save(function (err, savedArticle) {
        if (err) return console.log(err);
        res.redirect('/blog');
    });
};

exports.findById = function (req, res) {
    Blog.findById(req.param('id')).exec(function (err, result) {
        //get creationdate from objectId
        //        console.log(new mongoose.Types.ObjectId(result._id).getTimestamp() );
        res.render('blog/article', result);
    });
};

