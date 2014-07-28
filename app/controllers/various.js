exports.despre = function (req, res) {
    res.render('various/despre', {
        title: 'despre weddingpedia'
    });
};

exports.queryusers = function (req, res) {

    var mongoose = require('mongoose')
        , User = mongoose.model('User')
        , _ = require('underscore')
        , url = require('url')
        , qs = require('querystring')
        , params = qs.parse(url.parse(req.url).query)
        , str = '';
    console.log('*********************');
    console.log(params);



    User
        .find({email:new RegExp(params.q, 'i')})
        .limit(params.page_limit)
        .sort({createdAt: 'desc'})
        .exec(function (err, users) {
            console.log('resuuuuults');
            console.log(users);
            res.send({
                users:users
            });
        });
};