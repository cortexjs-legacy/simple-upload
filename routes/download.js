var fs = require('fs');
var path = require('path');
var config = require('config');
var logger = require('tracer').console();
var zip = require('./util/zip');

module.exports = function(req,res,next){
  var filepath = path.join(config.temp,req.params[0].replace(/\//g,'~'));
  var rootdir = path.join(config.root,req.params[0]).replace(/\.tgz$/,"");

  function sendfile(filepath){
    logger.log("downloading", filepath);
    fs.createReadStream(filepath).pipe(res);
  }

  fs.exists(filepath,function(exists){
    if(!exists){

      fs.exists(rootdir, function(exists){
        console.log("rootdir",rootdir)
        if(!exists){
          return next();
        }

        zip(rootdir, filepath, function(err, filepath){
          sendfile(filepath);
        });

      });

    }else{
      sendfile(filepath);
    }
  });
}