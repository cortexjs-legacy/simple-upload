var extract = require('./util/extract');
var path = require('path');

module.exports = function(req, res, next){
  var body = req.body;
  var remote = body.remote;
  var dirname = body.dirname;

  if(!remote){
    return next("remote not set");
  }

  if(!dirname){
    return next("dirname not set");
  }


  var zipname = path.join(remote,dirname).replace(/\//g,"~") + ".tgz";

  extract(zipname, function(err, message){
    if(err){return next(err);}
    res.status(200).send(message);
  });
}