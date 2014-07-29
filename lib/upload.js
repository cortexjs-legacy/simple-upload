'use strict';

module.exports = upload;

function Uploader (options) {

}

var tar = require('tar');
var fstream = require('fstream');


Uploader.prototype.pack = function(dir, callback) {
  fstream.Reader({
    path: dir,
    type: 'Directory'
  })
  .pipe(tar.Pack())
  .pipe(
    node_zlib.createGzip({
      level: 6,
      memLevel: 6
    })
  )
  .pipe(fstream.Writer(file))
  .on('close', function () {
    
  });
};


function pack (dir, callback) {
  
}