var express = require('express');
var multer  = require('multer');
var config = require('config');
var fs = require('fs');
var zlib = require('zlib');
var fstream = require('fstream');
var tar = require('tar');
var mkdirp = require('mkdirp');
var path = require('path');

var app = express();

app.use(multer());
app.post("/", function(req,res,next){
  var remote = req.body.remote || ".";
  var root = config.get('root');

  var files = req.files;
  if(!files || !files.file){
    return next();
  }

  if(~remote.indexOf("..")){
    return next();
  }

  var file = files.file;
  var filepath = file.path;
  var rootpath = path.join(root, remote);

  mkdirp(rootpath, function(err){
    if(err){return next(err);}
    fstream.Reader({
      path: filepath,
      type: 'File'
    })
    .pipe(zlib.Unzip())
    .pipe(tar.Extract({
      path: rootpath
    }))
    .on('end', function() {
      res.status(200).send("ok");
    })
    .on('error', next);
  });
});

app.use(function(req,res){
  res.status(400).send("bad request");
});

app.listen(config.get('port'),function(){
  console.log("server started at " + config.get("port"));
});