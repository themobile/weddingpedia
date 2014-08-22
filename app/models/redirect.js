var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require('moment')
    , _ = require('underscore')
    ;

var RedirectSchema = new Schema({
    oldUrl: String,
    newUrl: String,
    createdAt: Date,
    updatedAt: Date
});

RedirectSchema.pre('save', function (next) {
    var now = new Date()
        ;

    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    next();

});

RedirectSchema.methods = {

};

module.exports = mongoose.model('Redirect', RedirectSchema);