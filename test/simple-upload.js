'use strict';

process.env.NODE_ENV="test";

var expect = require('chai').expect;
var simple_upload = require('../');

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


describe('server', function() {

  it('download', function(done) {
    request(app)
      .get('/download/test-package/0.0.1.tgz')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done(null, res);
      });
  });
});

