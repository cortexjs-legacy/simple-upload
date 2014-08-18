var async = require('async');
var fs = require('fs');
var restler = require('restler');
var zip = require('./routes/util/zip');
var path = require('path');
require('colors');


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
  console.log("extract".cyan, path.join(options.server,options.remote,options.dirname)) ;
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
      zip(options.dir, null, done);
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
      zip(options.dir, null, done);
    },
    function(zippath, done){
      uploadtgz(zippath, options, done);
    }
  ], done);
};
simpleupload.extract = extract;

module.exports = simpleupload;