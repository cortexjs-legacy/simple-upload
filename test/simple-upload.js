'use strict';

process.env.NODE_ENV="test";

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var simple_upload = require('../');

var fs = require('fs');
var path = require('path');
var config = require('config');
var request = require('supertest');
var express = require('express');
var multer  = require('multer');
var bodyParser = require('body-parser');
var app = express();

app.use(multer());
app.use(bodyParser.urlencoded({extended:true}));
app.post("/", require('../routes/main'));
app.post("/tgz", require('../routes/tgz'));
app.post("/extract", require('../routes/extract'));
app.get("/download/*", require('../routes/download'));

app.use(function(req,res){
  res.status(400).send("bad request");
});

app.listen(config.port,function(){
  console.log("simple upload server started at " + config.port);
});


describe('server', function() {

  function validate(done,pairs){
    return function(err,res){
      if(err){return done(err);}
      var generated = fs.readFileSync( path.resolve(__dirname, pairs[0]),'utf8');
      var expected = fs.readFileSync( path.resolve(__dirname, pairs[1]),'utf8');

      assert.ok(generated == expected);
      done()
    }
  }

  it('uploadtgz', function(done){
    simple_upload.uploadtgz({
      dir: path.resolve(__dirname, "fixtures/test-package/0.0.1"),
      server: "http://127.0.0.1:" + config.port,
      remote: "mod/test-package/",
      dirname: "0.0.1"
    },validate(done, ['temp/cortex-build/mod~test-package~0.0.1.tgz','expected/test-package.tgz']));
  });

  it('extract', function(done){
    simple_upload.extract({
      dir: path.resolve(__dirname, "fixtures/test-package/0.0.1"),
      server: "http://127.0.0.1:" + config.port,
      remote: "mod/test-package/",
      dirname: "0.0.1"
    }, validate(done, ['temp/cortex-build/mod~test-package~0.0.1.tgz','expected/test-package.tgz']));
  });


  it('download', function(done) {
    request(app)
      .get('/download/test-package/0.0.1.tgz')
      .expect(200)
      .end(validate(done, ['temp/cortex-build/mod~test-package~0.0.1.tgz','expected/test-package.tgz']));
  });
});

