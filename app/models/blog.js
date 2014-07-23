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
    createdAt: Date
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
    //fixme: atentie cand o sa facem update
    this.createdAt = new Date();
    next();
});

/**
 * Methods
 */

BlogSchema.methods = {


};

module.exports = mongoose.model('Blog', BlogSchema);