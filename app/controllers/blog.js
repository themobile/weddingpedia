var mongoose = require('mongoose')
    , Article = mongoose.model('Article');
//    , Schema = mongoose.Schema;

var articleCounter=1;

ArticleProvider=function(){};
ArticleProvider.prototype.dummyData=[];

ArticleProvider.prototype.findAll=function(callback){

    Article.find(function(err,articles){
        if (err) return console.log(err);
        callback(null,articles);
    });

};

ArticleProvider.prototype.findById=function(id,callback){
    console.log('IDDDD:'+id);
    Article.find({_id:id}, function(err, result){
        if (err) return console.log(err);
        console.log('result');
        console.log(result);
        callback(null,result[0]);

    });

}


ArticleProvider.prototype.save=function(article,callback){
    var new_article=new Article(article)

    new_article.save(function(err,new_article){
        if (err) return console.log(err);
        callback(null,new_article);
    });

}



exports.ArticleProvider = ArticleProvider;
