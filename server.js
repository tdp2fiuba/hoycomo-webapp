const express = require('express');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/release'));
const port = process.env.PORT || 8080;
app.listen(port);
console.log("webapp listen in port " + port);