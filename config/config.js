var path = require('path')
    , rootPath = path.normalize(__dirname + '/..')
    , templatePath = path.normalize(__dirname + '/../app/mailer/templates');

module.exports = {

    //user roles
    userRoles: ['admins','editors'],


    development: {
//        db: 'mongodb://themobile:danny092@lennon.mongohq.com:10052/app27003758',
        db: 'mongodb://weddingpedia:danielch092@188.215.55.43/weddingpedia',
        apppath: 'http://weddingpedia.ro:3000',
        root: rootPath,
        app: {
            name: 'weddingpedia'
        },
        facebook: {
            clientID: "1445888285683036",
            clientSecret: "1a610de9b5208fd7fbe0428aba2e0702",
            callbackURL: "http://weddingpedia.ro:3000/auth/facebook/callback"
        },
        twitter: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://weddingpedia.ro:3000/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://APP_URL/auth/github/callback'
        },
        google: {
            clientID: '324018144315-hj729vivb1ut1p3275v4bp0qjrbagbf2.apps.googleusercontent.com',
            clientSecret: 'NuphDJM7-BhIRtylhQRw9RTb',
            callbackURL: 'http://weddingpedia.ro:3000/auth/google/callback'
        }

    },
    test: {
        db: 'mongodb://localhost/noobjs_test',

        root: rootPath,
        app: {
            name: 'weddingpedia'
        },
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        twitter: {
            clientID: "CONSUMER_KEY",
            clientSecret: "CONSUMER_SECRET",
            callbackURL: "http://localhost:3000/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/google/callback"
        }
    },
    production: {}
}
