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
  var filepath = temp.path({suffix:".tgz"});

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

function uploadtgz(zippath, options, done){
  console.log("uploadtgz".cyan,zippath);
  fs.stat(zippath, function(err, stats){
    if(err){return done(err);}
    restler.post(options.server + "/tgz", {
        multipart: true,
        data: {
          "remote": options.remote,
          "dirname": options.dirname,
          "file": restler.file(zippath, null, stats.size, null, "application/x-tgz")
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

function extract(options, done){
  console.log("extract".cyan,options);
  restler.post(options.server + "/extract", {
    data:{
      "remote": options.remote,
      "dirname": options.dirname
    }
  }).on("success", function(data) {
    done(null, data);
  }).on("fail", function(data, response){
    done(data);
  }).on("error", done);
}

var simpleupload = function(options, done){
  async.waterfall([
    function(done){
      zip(options.dir, done);
    },
    function(zippath, done){
      uploadtgz(zippath, options, done);
    },
    function(message, done){
      extract(options, done);
    }
  ], done);
}

simpleupload.uploadtgz = function(options, done){
  async.waterfall([
    function(done){
      zip(options.dir, done);
    },
    function(zippath, done){
      uploadtgz(zippath, options, done);
    }
  ], done);
};
simpleupload.extract = extract;

module.exports = simpleupload;