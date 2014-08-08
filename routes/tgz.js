var uploadtgz = require('./util/uploadtgz');

module.exports = function(req, res, next){
  var body = req.body;
  var remote = body.remote;
  var dirname = body.dirname;
  uploadtgz({
    file: req.files.file,
    remote: remote,
    dirname: dirname
  }, function(err, result){
    if(err){return next(err);}
    res.status(200).send(result);
  });
}