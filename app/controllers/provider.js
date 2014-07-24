var mongoose = require('mongoose')
    , Provider = mongoose.model('Provider')
    ;




exports.newProviderSave = function (req, res) {
    var providerToSave = {}
        , providerModel
        ;

    providerToSave.name = req.param('name');
    providerToSave.category = req.param('category');
    providerToSave.videoUrl = req.param('videoUrl');

    providerModel = new Provider(providerToSave);
    providerModel.save(function (error, saved) {
        console.log('uraaaaaaa am adaugat providerul');
        res.redirect('/');
    });

};


exports.updProviderSave = function (req, res) {
    var providerToSave = {}
        , providerModel
        ;

    providerToSave.name = req.param('name');
    providerToSave.category = req.param('category');
    providerToSave.videoUrl = req.param('videoUrl');

    providerModel = new Provider();

    providerModel.findByIdAndUpdate(req.param('id'), providerToSave, {}, function (error, saved) {
        console.log('uraaaaaaa am MODIFICAT  providerul');
        res.redirect('/');
    });
//
//    providerModel.save(function (error, saved) {
//        console.log('uraaaaaaa am adaugat providerul');
//        res.redirect('/');
//    });

};
