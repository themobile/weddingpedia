var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    , moment=require('moment')
    , _ = require('underscore');
    ;

moment.lang('ro');

exports.findAll = function (req, res) {


    //number of posts per page
    var perPage = 4
        , page = req.param('page') > 0 ? req.param('page') : 0;


    var createPagination = function (pages, page) {
        var url = require('url')
            , qs = require('querystring')
            , params = qs.parse(url.parse(req.url).query)
            , str = '';


        //code for showing page numbers
//        params.page = 0;
//        var clas = page == 0 ? "active" : "no";
//        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">&larr;</a></li>';
//        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">1</a></li>';
//
//        for (var p = 1; p < pages; p++) {
//            params.page = p;
//            var pg = parseInt(p) + 1;
//            clas = page == p ? "active" : "no";
//            str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' + pg + '</a></li>';
//        }
//
//        params.page = --p;
//        clas = page == params.page ? "active" : "no";
//        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">&rarr;</a></li>';
//
//
//
        console.log(page+'.....'+pages);


        // prev/next buttons
        var currPage=parseInt(page);
        var noPages=parseInt(pages);

        //showing previous - next instead
        var prevclas = (currPage<noPages) ? 'prevactive' : 'disabled';
        var nextclas = (currPage > 0) ? 'nextactive' : 'disabled';


        str += '<span class="'+prevclas+' icon icon-arrow"><a href="?page='+ (currPage+1) +'">&larr;&nbsp postari mai vechi</a></span>';
        str += '<span class="'+nextclas+' right"><a href="?page='+ (currPage-1) +'">&nbsp postari mai noi &nbsp&rarr;</a></span>';
        return str;

    };

    Blog
        .find()
        .limit(perPage)
        .skip(perPage * page)
        .sort({createdAt: 'desc'})
        .exec(function (err, articles) {
            Blog.count().exec(function (err, count) {
                res.locals.createPagination = createPagination;

                res.render('blog/list', {
                    title: 'Blog',
                    page: page,
                    perPage: perPage,
                    pages: count / perPage,
                    articles: articles,
                    moment:moment
                })

            })
        });

};

exports.newPost = function (req, res) {
    res.render('blog/new');
};

exports.newPostSave = function (req, res) {
    console.log(req.param());
    console.log('&&&&&&&&&&&&')
//    var new_article = new Blog({
//        title: req.param('title'),
//        body: req.param('body')
//    });

    var new_article = new Blog(req.body);
    new_article.save(function (err, savedArticle) {
        if (err) return console.log(err);
        console.log(savedArticle);
        res.redirect('/blog');
    });
};

exports.findById = function (req, res) {
    Blog.findById(req.param('id')).exec(function (err, result) {
        console.log(result);
        res.render('blog/article', result);
    });
};

