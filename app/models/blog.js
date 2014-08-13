/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

/*****
 * Blog Schema
 */


var BlogSchema = new Schema({
    title: String,
    body: String,
    keywords: String,
    seoDescription: String,
    url: String,
    creationDate: Date,
    publicView: Boolean,
    createdAt: Date,
    updatedAt: Date

});


/***
 * Virtuals
 */


/***
 * Validations
 *

 var validatePresenceOf = function (value) {
    return value && value.length;
};

 // the below 4 validations only apply if you are signing up traditionally


 /**
 * Pre-save hook
 */
BlogSchema.pre('save', function (next) {
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

/**
 * Methods
 */

BlogSchema.methods = {


};

module.exports = mongoose.model('Blog', BlogSchema);