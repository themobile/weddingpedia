/**
 * Module dependencies.
 */

var express = require('express')
    , fs = require('fs')
    , passport = require('passport')
    , less = require('less');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
    , config = require('./config/config')[env]
    , auth = require('./config/middlewares/authorization')
    , path = require('path')
    , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Load the file, convert to string
fs.readFile(__dirname + '/public/css/app.less', function (error, data) {
    var dataString = data.toString();
    var options = {
        paths: [__dirname + "/public/css"],      // .less file search paths
        outputDir: __dirname + "/public/css/",   // output directory, note the '/'
        optimization: 1,                // optimization level, higher is better but more volatile - 1 is a good value
        filename: "app.less",       // root .less file
        compress: false,             // compress?
        yuicompress: true              // use YUI compressor?
    };


    // Create a file name such that
    //  if options.filename == gaf.js and options.compress = true
    //    outputfile = gaf.min.css
    options.outputfile = options.filename.split(".less")[0] + (options.compress ? ".min" : "") + ".css";
    // Resolves the relative output.dir to an absolute one and ensure the directory exist
    options.outputDir = path.resolve( process.cwd(), options.outputDir) + "/";
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

//
var ensureDirectory = function (filepath) {
    var dir = path.dirname(filepath);
    var existsSync = fs.existsSync || path.existsSync;
    if (!existsSync(dir)) { fs.mkdirSync(dir); }
};


// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();
// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// expose app 2
exports = module.exports = app;
