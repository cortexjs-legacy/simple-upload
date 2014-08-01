var async = require('async');
var temp = require('temp');
var path = require('path');
var fs = require('fs');
var fstream = require('fstream');
var tar = require('tar');
var restler = require('restler');
var zlib = require('zlib');
require('colors');

function zip(dir, done){
  var filepath = temp.path({suffix:".zip"});

  console.log("packing".cyan,dir);
  fstream.Reader({
    path: dir,
    type: 'Directory'
  })
  .pipe(tar.Pack())
  .pipe(
    zlib.createGzip({
      level: 6,
      memLevel: 6
    })
  )
  .pipe(fstream.Writer(filepath))
  .on('close', function(){
    done(null, filepath);
  });
}

function upload(zippath, options, done){
  console.log("uploading".cyan,zippath);
  fs.stat(zippath, function(err, stats){
    if(err){return done(err);}
    restler.post(options.server, {
        multipart: true,
        data: {
          "remote": options.remote,
          "dirname": options.dirname,
          "file": restler.file(zippath, null, stats.size, null, "application/zip")
        }
    }).on("success", function(data) {
      fs.unlink(zippath, function(err){
        if(err){return done(err);}
        done(null, data);
      });
    }).on("fail", function(data, response){
      done(data);
    }).on("error", done);
  });
}


module.exports = function(options, callback){
  dir = path.resolve(options.dir);
  async.waterfall([
    function(done){
      zip(dir, done);
    },
    function(zippath, done){
      upload(zippath, {
        server: options.server,
        dirname: path.basename(dir),
        remote: options.remote
      }, done);
    }
  ], callback);
}