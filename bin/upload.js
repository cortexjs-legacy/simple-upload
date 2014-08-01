#!/usr/bin/env node

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var dir = argv.dir;
var server = argv.server;
var upload = require("../");

var remote = argv.remote || ".";

if(!dir){
  die("please specify --dir");
}

if(!server){
  die("please specify --server");
}

function die(message){
  console.log(message.red);
  process.exit(1);
}

upload({
  dir: dir,
  server: server,
  remote: remote
},function(err, result){
  if(err){die(err);}
  console.log(result.green);
});