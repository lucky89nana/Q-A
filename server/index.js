var express = require('express');
var db = require('./db');
require('dotenv').config();

// Router
var router = require('./routes.js');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 5432);

// Logging and parsing
app.use(express.json());

// Set up our routes
app.use('', router);

// Serve the client files
// app.use(express.static('client/dist'));

const PORT = 5432 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
