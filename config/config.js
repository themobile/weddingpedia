var path = require('path')
    , rootPath = path.normalize(__dirname + '/..')
    , templatePath = path.normalize(__dirname + '/../app/mailer/templates');

module.exports = {

    //user roles
    userRoles: ['admins', 'editors'],
    adminRole: 'admin',
    editorRole: 'editor',



    development: {
        db: 'mongodb://weddingpedia:danielch092@188.215.55.43/weddingpedia',
        apppath: 'http://weddingpedia.ro:3000',
        root: rootPath,
        imageUploadFolder:'/uploads/images/',

        app: {
            name: 'weddingpedia'
        },
        facebook: {
            clientID: "1445888285683036",
            clientSecret: "1a610de9b5208fd7fbe0428aba2e0702",
            callbackURL: "http://weddingpedia.ro:3000/auth/facebook/callback"
        },
        google: {
            clientID: '324018144315-hj729vivb1ut1p3275v4bp0qjrbagbf2.apps.googleusercontent.com',
            clientSecret: 'NuphDJM7-BhIRtylhQRw9RTb',
            callbackURL: "http://weddingpedia.ro:3000/auth/google/callback"
        }
    },
    test: {
        db: 'mongodb://weddingpedia:danielch092@188.215.55.43/weddingpedia',
        apppath: 'http://weddingpedia-ro.herokuapp.com',
        root: rootPath,
        imageUploadFolder:'/uploads/images/',

        app: {
            name: 'weddingpedia'
        },
        facebook: {
            clientID: "1445888285683036",
            clientSecret: "1a610de9b5208fd7fbe0428aba2e0702",
            callbackURL: "http://weddingpedia-ro.herokuapp.com/auth/facebook/callback"
        },

        google: {
            clientID: '324018144315-hj729vivb1ut1p3275v4bp0qjrbagbf2.apps.googleusercontent.com',
            clientSecret: 'NuphDJM7-BhIRtylhQRw9RTb',
            callbackURL: "http://weddingpedia-ro.herokuapp.com/auth/google/callback"
        }

    },
    production: {
        root: rootPath,
        imageUploadFolder:rootPath+'/uploads/images/'
    }
};
