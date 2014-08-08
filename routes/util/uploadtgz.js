var mkdirp = require('mkdirp');
var logger = require('tracer').console();
var config = require('config');
var path = require('path');
var fse = require('fs-extra');

module.exports = function(options, callback){
  var remote = options.remote;
  var file = options.file;
  var dirname = options.dirname;
  var filepath = file && file.path;

  if(!file){
    return callback("file not specified");
  }

  if(!dirname){
    return callback("dirname not specified");
  }

  if(!remote){
    return callback("remote not specified");
  }

  var tempfilename = path.join(remote,dirname).replace(/\//g,"~") + ".tgz";
  var tempfilepath = path.join(config.temp,  tempfilename);

  logger.log("upload to", tempfilepath);
  fse.copy(filepath, tempfilepath, function(err){
    if(err){return callback(err);}
    fse.unlink(filepath,function(err){
      if(err){return callback(err);}
      callback(null, tempfilename);
    });
  });
}