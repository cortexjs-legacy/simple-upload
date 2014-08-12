var fs = require('fs');
var path = require('path');
var config = require('config');
var logger = require('tracer').console();

module.exports = function(req,res,next){
  console.log(req);
  var filepath = path.join(config.temp,req.params[0].replace(/\//g,'~'));

  fs.exists(filepath,function(exists){
    if(!exists){
      return next();
    }else{
      logger.log("downloading", filepath);
      fs.createReadStream(filepath).pipe(res);
    }
  });
}