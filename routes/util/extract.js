var logger = require('tracer').console();
var mkdirp = require('mkdirp');
var config = require('config');
var path = require('path');
var fstream = require('fstream');
var zlib = require('zlib');
var tar = require('tar');
var fs = require('fs');
var chownr = require('chownr');


module.exports = function (zipname, callback) {
  var zippath = path.join(config.temp, zipname);
  var name = path.basename(zippath);
  var dirpath = name.replace(/~/g, '/').replace(".tgz","");
  var root = config.root;

  var rootpath = path.join(root, dirpath);

  var dirname = path.basename(rootpath);

  logger.log("extract", zippath, "to", rootpath);
  fstream.Reader({
    path: zippath,
    type: 'File'
  })
    .pipe(zlib.Unzip())
    .pipe(tar.Extract({
      path: path.dirname(rootpath)
    }))
    .on('end', function () {
      var message = "file uploaded at " + rootpath;
      var uid = config.uid;
      var gid = config.gid;
      if (uid !== undefined && gid !== undefined) {
        logger.log("chownr", rootpath);
        chownr(rootpath, uid, gid, function (err) {
          if (err) {
            return callback(err);
          }
          callback(null,message);
        });
      } else {
        callback(null,message);
      }
    })
    .on('error', callback);
}