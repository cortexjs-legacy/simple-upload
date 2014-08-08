#!/usr/bin/env node

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var dir = argv.dir;
var action = argv.action;
var server = argv.server;
var simpleupload = require("../");

var remote = argv.remote || ".";

if(!dir){
  die("please specify --dir");
}

if(!server){
  die("please specify --server");
}

if(!action){
  action = "normal";
}

function die(message){
  console.log(message.red);
  process.exit(1);
}

function done(err,message){
  if(err){die(err);}
  console.log(message.green);
}

var options = {
  dir: path.resolve(dir),
  server: server,
  remote: remote,
  dirname: path.basename(dir)
};

switch(action){
  case "normal":
    simpleupload(options, done);
    break;
  case "uploadtgz":
    simpleupload.uploadtgz(options, done);
    break;
  case "extract":
    simpleupload.extract(options, done);
    break;
  default:
    die("action not specified correctly");
}
