var fstream = require('fstream');
var temp = require('temp');
var zlib = require('zlib');
var tar = require('tar');

module.exports = function zip(dir, path, done){
  var filepath = path || temp.path({suffix:".tgz"});

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