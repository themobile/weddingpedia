var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    ;

exports.findAll = function (req, res) {
    Blog.find(function (err, articles) {
        if (err) return console.log(err);
        res.render('blog/list',
            {
                title: 'Blog',
                articles: articles
            }
        );
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

