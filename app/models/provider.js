var moment = require('moment')
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var ProviderSchema = new Schema({
    name: String,
    category: String,
    contact: {
        address: String,
        city: String,
        email: String,
        web: String,
        facebook: String,
        phone: [String]
    },
    description: String,
    logoUrl: String,
    //for SEO
    seoTitle: String,
    seoKeywords: String,
    seoDescription: String,
    videoUrl: String,
    thumbUrl: String,
    otherVideoList: [String],
    userList: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    activeSince: {type: Date, default: Date.now},
    activeTo: {type: Date, default: Date.now},
    createdAt: Date,
    updatedAt: Date
});

var validatePresenceOf = function (value) {
    return value && value.length;
};

ProviderSchema.path('name').validate(function (name) {
    return name.length;
}, 'Name cannot be blank');

ProviderSchema.pre('save', function (next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    //todo: aici tratament array video-uri


    next();
});


ProviderSchema.methods = {

};

module.exports = mongoose.model('Provider', ProviderSchema);
