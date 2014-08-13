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

exports.pagePagination=function(pages,page){
    var url = require('url')
        , qs = require('querystring')
        , params = qs.parse(url.parse(req.url).query)
        , str = '';

    params.page = 0;
    var clas = page == 0 ? "active" : "no";
    str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">First</a></li>';

    for (var p = 1; p < pages; p++) {
        params.page = p;
        clas = page == p ? "active" : "no";
        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' + p + '</a></li>';
    }

    params.page = --p;
    clas = page == params.page ? "active" : "no";
    str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">Last</a></li>';

    return str;
};