var  fs = require('fs')
    , path = require('path');


exports.uploadimage = function (req, res) {


        res.writeHead(200, { 'Connection': 'close' });
        res.end('/uploads/images/'+req.files.file.name);

};