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
        , testUrl
        ;

    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    this.publicView = publicView || false;

    testUrl = '/furnizori-de-nunta/' + this._wpParseUrl(this.category) + '/' + this._wpParseUrl(this.name);
    this.url = testUrl.toLowerCase();

    next();

});

ProviderSchema.post('save', function (provider) {
    var id = provider._id
        , Provider = mongoose.model('Provider', ProviderSchema)
        ;
    this._wpFindDuplicates(provider.url, provider._id)
        .then(function (success) {
            Provider.update({_id: id}, { $set: { url: success }}).exec();
        }, function (error) {
            console.log(error);
        });
});

ProviderSchema.methods = {

    _wpParseUrl: function (inputString) {
        return inputString.replace(/[^-_a-z0-9\s]+/i, "").replace(/\s+/g, "-");
    },

    _wpFindDuplicates: function (newUrl, recId) {
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
