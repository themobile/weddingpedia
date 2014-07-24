var mongoose = require('mongoose')
    , _ = require('underscore')
    , Schema = mongoose.Schema
    ;

var ProviderSchema = new Schema({
    name: String,
    category: String,
    videoUrl: String,
    otherVideoList: [String],
    userList: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    createdAt: Date,
    updatedAt: Date
//    updatedAt: {type: Date, default: Date.now}
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
