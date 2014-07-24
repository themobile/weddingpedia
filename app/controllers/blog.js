var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    ;

exports.findAll = function (req, res) {

    var perPage = 3
        , page = req.param('page') > 0 ? req.param('page') : 0;


    var createPagination = function (pages, page) {
        var url = require('url')
            , qs = require('querystring')
            , params = qs.parse(url.parse(req.url).query)
            , str = '';
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
//        .sort({title:'asc')
        .exec(function (err, articles) {
            Blog.count().exec(function (err, count) {
                res.locals.createPagination = createPagination;

                res.render('blog/list', {
                    title: 'Blog',
                    page: page,
                    perPage: perPage,
                    pages: count / perPage,
                    articles: articles
                })
            })
        });

};

exports.newPost = function (req, res) {
    res.render('blog/new');
};

exports.newPostSave = function (req, res) {
    var new_article = new Blog({
        title: req.param('title'),
        body: req.param('body')
    });
    new_article.save(function (err, savedArticle) {
        if (err) return console.log(err);
        console.log(savedArticle);
        res.redirect('/blog');
    });
};

exports.findById = function (req, res) {
    Blog.findById(req.param('id')).exec(function (err, result) {
        res.render('blog/article', result);
    });
};

