var moment = require('moment')
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , User = mongoose.model('User')
    , Q = require('q')
    ;


exports.findAll = function (req, res) {
    var categories = [];
    var _ = require('underscore');
    var oneCategory = req.params.category ? {category: req.params.category} : '';

    Provider
        .find(oneCategory) //null or specific category
        .sort({createdAt: 'asc'})  //fixme to be decided maybe as a parameter
        .exec(function (err, providers) {
            var providersGrouped = _.map(providers, function (provider) {
                moment(provider.activeTo).isBefore(new Date()) ? provider.isActive = true : provider.isActive = false;
                return provider;
            });
            providersGrouped = _.groupBy(providersGrouped, 'category');
            res.render('admin/views/providers/list', {
                providers: providersGrouped
            });
        });
};


exports.findByName = function (req, res) {
    var url = require('url');

    //replace back + in links with spaces !Attention to not put nonalphanumeric in names
    //TODO if two providers have the same name in the same category?!!!!!!
    //categories cannot have spaces
    var providerLink = req.param('provider').replace(/\W/g, ' ');
    Provider
        .find({name: providerLink, category: req.param('category')})
        .exec(function (err, provider) {
            provider[0].videoUrl = "http://player.vimeo.com/video/" + provider[0].videoUrl;
//            provider[0].userList= provider[0].userList.toString();
            res.render('providers/provider', {
                provider: provider[0]
            })
        });
};

_prepareForEdit = function (inputObject, yearsToAdd) {
    var outputObject = {}
        ;
    _.extend(outputObject, inputObject);
    outputObject.activeSince = moment(inputObject.activeSince).format('YYYY-MM-DD').toString();
    outputObject.activeTo = moment(inputObject.activeTo).add('years', yearsToAdd).format('YYYY-MM-DD').toString();
    return outputObject;
};

exports.addProvider = function (req, res) {
    var newProvider = _prepareForEdit(new Provider, 1)
        ;
    res.locals.title = 'Furnizor nou';
    res.render('admin/views/providers/new', newProvider);
};

exports.updProvider = function (req, res) {
    Provider.findById(req.param('id')).exec(function (err, result) {
        var editProvider = _prepareForEdit(result, 0)
            ;
        res.locals.title = 'Editare furnizor';
        res.render('admin/views/providers/new', editProvider);

    });
};

_testUserRefDel = function (oldArray, newArray) {
    var retArray = []
        , isKeeped = false
        ;
    _.each(oldArray, function (userRef) {
        isKeeped = false;
        _.each(newArray, function (newRefUser) {
            if (userRef == newRefUser) {
                isKeeped = true;
            }
        });
        if (!isKeeped) {
            retArray.push(userRef);
        }
    });
    return retArray;
};
__delArrayElement = function (arrayToDel, elementToDel) {
    var newArray = []
        ;
    _.each(arrayToDel, function (item) {
            if (item != elementToDel) {
                newArray.push(item);
            }
        }
    );
    return newArray;
};
_delUserRef = function (providerId, userArray) {
    var promises = []
        ;
    _.each(userArray, function (userId) {
        User.findById(userId).exec(function (error, thisUser) {
            if (thisUser) {
                thisUser.providersList = __delArrayElement(thisUser.providersList, providerId);
                promises.push(thisUser.save());
            }
        });
    });
    return promises;
};
__addArrayElement = function (arrayToAdd, elementToAdd) {
    var newArray = []
        , itIs
        ;
    newArray.push(elementToAdd);
    _.each(arrayToAdd, function (item) {
        itIs = false;
        _.each(newArray, function (newItem) {
            if (newItem == item) {
                itIs = true;
            }
        });
        if (!itIs) {
            newArray.push(item);
        }
    });
    return newArray;
};
_addUserRef = function (providerId, userArray) {
    var promises = []
        ;
    _.each(userArray, function (userId) {
        User.findById(userId).exec(function (error, thisUser) {
            if (thisUser) {
                thisUser.providersList = __addArrayElement(thisUser.providersList, providerId);
                promises.push(thisUser.save());
            }
        });
    });
    return promises;
};

exports.newProviderSave = function (req, res) {
    var providerId = req.body.id
        , userRefForDelete = []
        ;

    delete  req.body.id;

    Provider.findById(providerId).exec(function (error, thisProvider) {
        var prov = req.body;

        if (prov.userList.length > 0) {
            prov.userList = prov.userList.split(',');
        } else {
            prov.userList = [];
        }

        if (thisProvider) {
            userRefForDelete = _testUserRefDel(thisProvider.userList, prov.userList);
            _.extend(thisProvider, prov);

        } else {
            thisProvider = new Provider(prov);
        }

        thisProvider.save(function (error, saved, counter) {

            if (error) {
                console.log(error);
            }
            else {
                Q.allSettled(
                    [_delUserRef(saved.id, userRefForDelete),
                        _addUserRef(saved.id, saved.userList)]
                ).then(function (succes) {
                        res.redirect('/admin/providers');
                    }, function (error) {
                        console.log(error);
                        res.render('500', {
                            message: error.message,
                            error: {}
                        });
                    });
            }

        });
    });
};

