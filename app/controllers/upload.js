var  fs = require('fs')
    , path = require('path');


exports.uploadimage = function (req, res) {


        res.writeHead(200, { 'Connection': 'close' });
        res.end('/uploads/images/'+req.files.file.name);


//    var uploadPath = path.join(__dirname, '../../public/uploads/');
//    var finalFile;
//
//    var busboy = new Busboy({ headers: req.headers });
//    busboy.on('file', function (fieldname, file, filename) {
////        var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
//        var saveTo = uploadPath + filename;
//        finalFile = '/uploads/' + filename;
//        file.pipe(fs.createWriteStream(saveTo));
//    });
//    busboy.on('finish', function () {
//        res.writeHead(200, { 'Connection': 'close' });
//        res.end(finalFile);
//    });
//
//
//    return req.pipe(busboy);


};