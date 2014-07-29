var mongoose = require('mongoose')
    , Blog = mongoose.model('Blog')
    , Provider = mongoose.model('Provider')
    , moment=require('moment')
    , _ = require('underscore');
;



//generic functions

//function to create pagination (sent to jade in res.render)
var createPagination = function (pages, page) {
    var url = require('url')
        , qs = require('querystring')
        , params = qs.parse(url.parse(req.url).query)
        , str = '';

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

exports.mainview = function(req,res){
    res.render('admin/views/main');
}

exports.providerList=function(req,res){
    //number of posts per page
    var perPage = 6
        , page = req.param('page') > 0 ? req.param('page') : 0;

    Provider
        .find()
        .limit(perPage)
        .skip(perPage * page)
        .sort({createdAt: 'desc'})
        .exec(function (err, providers) {
            Blog.count().exec(function (err, count) {
                //pass function to create pagination
                res.locals.createPagination = createPagination;
                res.render('admin/provider/list', {
                    page: page,
                    perPage: perPage,
                    pages: count / perPage,
                    providers: providers
                })
            })
        });

};