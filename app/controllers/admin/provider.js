var moment = require('moment')
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    , User = mongoose.model('User')
    , Q = require('q')
    , env = process.env.NODE_ENV || 'development'
    , config = require('../../../config/config')[env]
    ;


exports.findAll = function (req, res) {
    var where = req.user.isAdmin ? 'true' : 'this.userList.join().match(/' + req.user.id + '/i)'
        ;

    Provider
        .find() //null or specific category
        .$where(where)
        .sort({createdAt: 'asc'})  //fixme to be decided maybe as a parameter
        .exec(function (err, providers) {
            var providersGrouped
                ;
            providersGrouped = _.groupBy(providers, 'category');
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
            provider[0].vimeoId = "http://player.vimeo.com/video/" + provider[0].vimeoId;
//            provider[0].userList= provider[0].userList.toString();
            res.render('providers/provider', {
                provider: provider[0]
            })
        });
};

_prepareForEdit = function (inputObject, addAYear) {
    var outputObject = {}
        ;
    _.extend(outputObject, inputObject);
    outputObject.activeSince = moment(inputObject.activeSince).format('YYYY-MM-DD').toString();
    if (addAYear) {
        outputObject.activeTo = moment(inputObject.activeTo).add('years', 1).format('YYYY-MM-DD').toString();
    } else {
        outputObject.activeTo = moment(inputObject.activeTo).format('YYYY-MM-DD').toString();

    }
    return outputObject;
};

exports.addProvider = function (req, res) {
    var newProvider
        ;
    if (req.user.isAdmin) {
        newProvider = _prepareForEdit(new Provider, true);
        res.locals.title = 'Furnizor nou';
        res.locals.isNew=true;
        res.render('admin/views/providers/new', newProvider);
    } else {
        res.render("404");
    }
};

exports.updProvider = function (req, res) {
    Provider.findById(req.param('id')).exec(function (err, result) {
        var editProvider
            ;
        if (req.user.isAdmin || result.userList.indexOf(req.user.id) > -1) {
            editProvider = _prepareForEdit(result, false);
            res.locals.title = 'Editare furnizor';
            res.locals.isNew=false;
            res.render('admin/views/providers/new', editProvider);
        } else {
            res.render("404");
        }

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

exports.delProviderSave = function (req, res) {
    var providerId = req.param('id')
        ;
    Provider.findById(providerId)
        .exec(function (error, provider) {
            Q.allSettled([_delUserRef(providerId, provider.userList)])
                .then(function (success) {
                    provider.remove(function (err, deleted) {
                        res.redirect('/admin/providers');
                    });
                }, function (error) {
                    console.log(error);
                    res.render('500', {
                        message: error.message,
                        error: {}
                    });
                });
        });
};

exports.newProviderSave = function (req, res) {
    var providerId = req.body.id
        , userRefForDelete = []
        ;

    delete  req.body.id;

    Provider.findById(providerId)
        .exec(function (error, thisProvider) {
            var prov = req.body
                ;


            //modify some data before save and test for existance
            if (prov.userList) {
                prov.userList = prov.userList.length > 0 ? prov.userList.split(',') : [];
            }
            if (!req.user.isAdmin && prov.userList.indexOf(req.user.id) == -1) {
                // daca se autosterge accidental si nu este admin...
                prov.userList.push(req.user.id);
            }
            if (prov.otherVideoList) {
                prov.otherVideoList = prov.otherVideoList.length > 0 ? prov.otherVideoList.split(',') : [];
            }

            if (prov.contact && prov.contact.phone) {
                prov.contact.phone = prov.contact.phone.length > 0 ? prov.contact.phone.split(',') : [];
            }


            _.each(req.files, function (value, key) {
                prov[key] = config.imageUploadFolder + value.name;
            });

            //test if provider is updated or new
            if (thisProvider) {
                userRefForDelete = _testUserRefDel(thisProvider.userList, prov.userList);
                _.extend(thisProvider, prov);

            } else {
                thisProvider = new Provider(prov);
            }

            //save the provider
            thisProvider.save(function (error, saved, counter) {

                if (error) {
                    console.log(error);
                }
                else {
                    Q.allSettled(
                        [
                            _delUserRef(saved.id, userRefForDelete),
                            _addUserRef(saved.id, saved.userList)
                        ])
                        .then(function (succes) {
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

