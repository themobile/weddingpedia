/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

/*****
 * Blog Schema
 */


var articleSchema = new Schema({
    title: String,
    body: String
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


/**
 * Methods
 */

articleSchema.methods = {


};

//module.exports = mongoose.model('User', UserSchema);
mongoose.model('Article', articleSchema);