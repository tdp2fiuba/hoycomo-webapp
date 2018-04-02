'use strict';

var express = require("express");
var app = express();

var http = require('http');
var path = require('path')

http.createServer(app).listen(8080);

console.log('Server started in port 8080');

// Esta línea es para poder acceder directamente a los archivos de angular y angular material cuando se referencian
// en un tag <script> o <link>
app.use(express.static(path.join(__dirname, '/src/static')));


app.route('/').get(function(req, res){
	 res.sendFile(path.join(__dirname + '/src/webapp/index.html'));
});

app.get('/backoffice/', function (req, res) {
	res.sendFile(path.join(__dirname + '/src/backoffice/index.html'));
});
