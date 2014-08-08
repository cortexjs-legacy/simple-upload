var config = require('config');
var logger = require('tracer').console();
var uploadtgz = require('./util/uploadtgz');
var extract = require('./util/extract');
var async = require('async');

module.exports = function (req, res, next) {

  var body = req.body;
  var remote = body.remote;
  var dirname = body.dirname;

  async.waterfall([
    function (done) {
      uploadtgz({
        file: req.files.file,
        remote: remote,
        dirname: dirname
      }, done);
    },
    function (zippath, done) {
      extract(zippath, done);
    }
  ], function (err, message) {
    if (err) {
      return next(err);
    }

    res.status(200).send(message);
  });
}