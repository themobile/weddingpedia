var moment = require('moment')
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var ProviderSchema = new Schema({
    name: String,
    category: String,
    url: String,
    contact: {
        address: String,
        city: String,
        email: String,
        web: String,
        facebook: String,
        phone: [String]
    },
    description: String,
    logoFileName: String,
    //for SEO
    seoTitle: String,
    seoKeywords: String,
    seoDescription: String,
    vimeoId: String,
    thumbFileName: String,
    otherVideoList: [String],
    userList: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    activeSince: {type: Date, default: Date.now},
    activeTo: {type: Date, default: Date.now},
    liked: String,
    likeCounter: Number,
    unLikeCounter: Number,
    publicView: Boolean,
    createdAt: Date,
    updatedAt: Date
});

var validatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * Virtuals
 */

ProviderSchema
    .virtual('isActive')
    .set(function () {
        //nimic
    })
    .get(function () {
        return (moment(this.activeTo).isAfter(new Date()) && (moment(new Date()).isAfter(this.activeSince)));
    });


ProviderSchema.path('name').validate(function (name) {
    return name.length;
}, 'Name cannot be blank');


ProviderSchema.pre('save', function (next) {
    var now = new Date()
        , publicView = this.publicView
        , newUrl, oldUrl
        ;

    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    this.publicView = publicView || false;

    oldUrl = this.url;
    newUrl = '/furnizori-de-nunta/' + this._wpParseUrl(this.category) + '/' + this._wpParseUrl(this.name);
    this.url = newUrl.toLowerCase();

    if (oldUrl) {
        _wpAddRedirect(oldUrl, newUrl)
            .then(function () {
                next();
            });
    } else {
        next();
    }

});

ProviderSchema.post('save', function (provider) {
//    var Provider = mongoose.model('Provider', ProviderSchema)
//        ;

    _wpFindDuplicates(provider.url)
        .then(function (success) {
            console.log(' * * * * * *  GATA ---- ***');
        }, function (error) {
            console.log(error);
        });
});


var _wpAddRedirect = function (oldUrl, newUrl) {
    var Redirect = mongoose.model('Redirect')
        , Q = require('q')
        , deferred = Q.defer()
        ;

    console.log('**************** *********** ****************');
    console.log(oldUrl);
    console.log(newUrl);

    if (oldUrl == newUrl) {
        deferred.resolve({ok: true});
    } else {
        Redirect
            .find({oldUrl: oldUrl})
            .exec(function (err, urls) {

                if (urls.length > 0) {
                    urls[0].newUrl = newUrl;
                    urls[0].save(function (error, saved, counter) {
                        deferred.resolve(saved);
                    });
                } else {
                    var redirect = new Redirect();
                    redirect.oldUrl = oldUrl;
                    redirect.newUrl = newUrl;
                    redirect.save(function (error, saved, counter) {
                        deferred.resolve(saved);
                    });
                }
            });
    }
    return deferred.promise;
};

var _wpUpdateUrl = function (provider, url) {
    var Q = require('q')
        , deferred = Q.defer()
        , id = provider._id
        ;

    _wpAddRedirect(provider.url, url)
        .then(function (ceva) {
            provider
                .update({_id: id}, { $set: { url: url }})
                .exec(function (err, solved) {
                    deferred.resolve('ok');
                });
        });

    return deferred.promise;
};

var _wpFindDuplicates = function (newUrl, recId) {
    var Provider = mongoose.model('Provider', ProviderSchema)
        , Q = require('q')
        , deferred = Q.defer()
        , rgxPatt
        , i = 0
        , promises = []
        ;

    rgxPatt = '^(' + newUrl + ')(\\d*)$';

    Provider
        .find({url: new RegExp(rgxPatt, 'i')})
        .sort({createdAt: 'desc'})
        .exec(function (err, providers) {
            _.each(providers, function (provider) {
                var replacementUrl
                    ;
                if (i == 0) {
                    replacementUrl = newUrl;
                } else {
                    replacementUrl = newUrl + i.toString();
                }
                promises.push(
                    _wpUpdateUrl(provider, replacementUrl)
                );
                i++;
            });
        });
    //fixme: in punctul asta vectorul promises n-are inregistrari
    Q.allSettled(promises).then(function () {
        deferred.resolve({ok: true});
    });
    return deferred.promise;
};

ProviderSchema.methods = {

    _wpParseUrl: function (inputString) {
        return inputString.replace(/[^-_a-z0-9\s]+/i, "").replace(/\s+/g, "-");
    },

    _wpFindDuplicates1: function (newUrl, recId) {
        var Provider = mongoose.model('Provider', ProviderSchema)
            , Q = require('q')
            , deferred = Q.defer()
            ;
        Provider
            .find({url: newUrl})
            .exec(function (err, providers) {
                var count = providers.length
                    ;
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    if (count > 1) {
                        newUrl = newUrl + count.toString();
                    }
                    deferred.resolve(newUrl);
                }
            });
        return deferred.promise;
    }
};

module.exports = mongoose.model('Provider', ProviderSchema);
