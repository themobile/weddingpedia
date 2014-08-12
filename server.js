/**
 * Module dependencies.
 */

var express = require('express')
    , fs = require('fs')
    , passport = require('passport')
    , less = require('less')
    , mongoose = require('mongoose')
    , morgan = require('morgan')
    , multer = require('multer')

    ;


//public available everywhere
logger = require("./config/logger");

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
    , config = require('./config/config')[env]
    , path = require('path');


// Bootstrap db connection
mongoose.connect(config.db);
//
// Load the file, convert to string
fs.readFile(__dirname + '/public/css/app.less', function (error, data) {
    var dataString = data.toString();
    var options = {
        paths: [__dirname + "/public/css"],      // .less file search paths
        outputDir: __dirname + "/public/css/",   // output directory, note the '/'
        optimization: 1,                // optimization level, higher is better but more volatile - 1 is a good value
        filename: "app.less",       // root .less file
        compress: false,             // compress?
        yuicompress: false              // use YUI compressor?
    };


    // Create a file name such that
    //  if options.filename == gaf.js and options.compress = true
    //    outputfile = gaf.min.css
    options.outputfile = options.filename.split(".less")[0] + (options.compress ? ".min" : "") + ".css";
    // Resolves the relative output.dir to an absolute one and ensure the directory exist
    options.outputDir = path.resolve(process.cwd(), options.outputDir) + "/";
//    ensureDirectory( options.outputDir );

    // Create a parser with options, filename is passed even though its loaded
    // to allow less to give us better errors
    var parser = new less.Parser(options);
    parser.parse(dataString, function (error, cssTree) {
        if (error) {
            less.writeError(error, options);
            return;
        }

        // Create the CSS from the cssTree
        var cssString = cssTree.toCSS({
            compress: options.compress,
            yuicompress: options.yuicompress
        });

        // Write output
        fs.writeFileSync(options.outputDir + options.outputfile, cssString, 'utf8');
        console.log("Converted Less: '" + options.filename + "', to CSS: " + options.outputDir + options.outputfile);
    });
});

// Load the file, convert to string
fs.readFile(__dirname + '/public/css/admin.less', function (error, data) {
    var dataString = data.toString();
    var options = {
        paths: [__dirname + "/public/css"],      // .less file search paths
        outputDir: __dirname + "/public/css/",   // output directory, note the '/'
        optimization: 1,                // optimization level, higher is better but more volatile - 1 is a good value
        filename: "admin.less",       // root .less file
        compress: false,             // compress?
        yuicompress: false              // use YUI compressor?
    };


    // Create a file name such that
    //  if options.filename == gaf.js and options.compress = true
    //    outputfile = gaf.min.css
    options.outputfile = options.filename.split(".less")[0] + (options.compress ? ".min" : "") + ".css";
    // Resolves the relative output.dir to an absolute one and ensure the directory exist
    options.outputDir = path.resolve(process.cwd(), options.outputDir) + "/";
//    ensureDirectory( options.outputDir );

    // Create a parser with options, filename is passed even though its loaded
    // to allow less to give us better errors
    var parser = new less.Parser(options);
    parser.parse(dataString, function (error, cssTree) {
        if (error) {
            less.writeError(error, options);
            return;
        }

        // Create the CSS from the cssTree
        var cssString = cssTree.toCSS({
            compress: options.compress,
            yuicompress: options.yuicompress
        });

        // Write output
        fs.writeFileSync(options.outputDir + options.outputfile, cssString, 'utf8');
        console.log("Converted Admin Less: '" + options.filename + "', to CSS: " + options.outputDir + options.outputfile);
    });
});


//
var ensureDirectory = function (filepath) {
    var dir = path.dirname(filepath);
    var existsSync = fs.existsSync || path.existsSync;
    if (!existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};


// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();
app.use(multer(
    {
        dest: config.root + '/public'+ config.imageUploadFolder,
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        }
    }
));


logger.debug("Overriding 'Express' logger");
//app.use(morgan('common',{'stream':logger.stream})); //fixme: de activat la production or test


// express settings
require('./config/express')(app, config, passport);


// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);
logger.debug('Express app started on port ' + port);

// expose app 2
exports = module.exports = app;
