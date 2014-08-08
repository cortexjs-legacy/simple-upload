var express = require('express');
var multer  = require('multer');
var config = require('config');
var bodyParser = require('body-parser');
var app = express();

app.use(multer());
app.use(bodyParser.urlencoded({extended:true}));
app.post("/", require('./routes/main'));
app.post("/tgz", require('./routes/tgz'));
app.post("/extract", require('./routes/extract'));

app.use(function(req,res){
  res.status(400).send("bad request");
});

app.listen(config.get('port'),function(){
  console.log("simple upload server started at " + config.get("port"));
});