/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , crypto = require('crypto')
    , _ = require('underscore')
    , authTypes = ['github', 'twitter', 'facebook', 'google']
    , config = require('./../../config/config')
    ;



var FavSchema = new Schema({
    providerId: {type: Schema.Types.ObjectId, ref: 'Provider'},
    amount: String,
    date: Date,
    comments: String,
    _id:false
});


FavSchema
    .virtual('working')
    .set(function () {
        // nimic
    })
    .get(function(){
        return (this.amount || this.date || this.comments);
    });


/**
 * User Schema
 */

var UserSchema = new Schema({
    name: String,
    email: {type: String, lowercase: true},
    username: String,
    roles: [String],
    provider: String,
    providersList: [
        {type: Schema.Types.ObjectId, ref: 'Provider'}
    ],

    favorites:[FavSchema],
    hashed_password: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    createdAt: Date,
    updatedAt: Date

});




/**
 * Virtuals
 */


UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema
    .virtual('isAdmin')
    .set(function (isAdmin) {
        if (isAdmin) {
            if (_.indexOf(this.roles, config.adminRole) == -1) {
                this.roles.push(config.adminRole);
            }
        } else {
            if (_.indexOf(this.roles, config.adminRole) > -1) {
                this.roles = _.without(this.roles, config.adminRole);
            }
        }
    })
    .get(function () {
        return _.indexOf(this.roles, config.adminRole) > -1
    });

UserSchema
    .virtual('isEditor')
    .set(function (isEditor) {
        if (isEditor) {
            if (_.indexOf(this.roles, config.editorRole) == -1) {
                this.roles.push(config.editorRole);
            }
        } else {
            if (_.indexOf(this.roles, config.editorRole) > -1) {
                this.roles = _.without(this.roles, config.editorRole);
            }
        }
    })
    .get(function () {
        return _.indexOf(this.roles, config.editorRole) > -1
    });

UserSchema
    .virtual('hasProviders')
    .set(function () {
        // nimic
    })
    .get(function () {
        return (this.providersList || []).length > 0
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (username) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */



    encryptPassword: function (password) {
        if (!password) return '';
//        return crypto.createHmac('sha1', this.salt).update(new Buffer(password, 'utf-8')).digest('hex');
//        return crypto.createHmac('sha1', password).update(this.salt).digest('hex');

        var hmac;

        hmac = crypto.createHmac('sha1', 'saltulumasa');

// change to 'binary' if you want a binary digest
        hmac.setEncoding('hex');

// write in the text that you want the hmac digest for
        hmac.write(password);

// you can't read from the stream until you call end()
        hmac.end();

// read out hmac digest
        return hmac.read();


    }
};

module.exports = mongoose.model('User', UserSchema);