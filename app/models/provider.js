var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

var ProviderSchema = new Schema({
    name: String,
    category: String,
    videoUrl: String
});

var validatePresenceOf = function (value) {
    return value && value.length;
};

ProviderSchema.path('name').validate(function (name) {
    return name.length;
}, 'Name cannot be blank');

ProviderSchema.pre('save', function (next) {
    next();
});

ProviderSchema.methods = {

};

module.exports = mongoose.model('Provider', ProviderSchema);
