const express = require('express');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/release'));

app.listen(process.env.PORT || 8080);