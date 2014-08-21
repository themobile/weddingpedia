var moment = require('moment')
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var ProviderSchema = new Schema({
    name: String,
    category: String,
    url:String,
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
        ;
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.publicView = publicView || false;
    next();
});


ProviderSchema.methods = {

};

module.exports = mongoose.model('Provider', ProviderSchema);
