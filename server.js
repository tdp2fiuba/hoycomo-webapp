'use strict';

var express = require("express");
var app = express();

var http = require('http');
var path = require('path')

app.use(express.static(__dirname + '/src/'));

http.createServer(app).listen(8080);

console.log('Server started');

app.route('/').get(function(req, res){
	 res.sendFile(path.join(__dirname + '/src/webapp/index.html'));
});


app.get('/backoffice/', function (req, res) {
	res.sendFile(path.join(__dirname + '/src/backoffice/index.html'));
});
