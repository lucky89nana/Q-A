require('dotenv').config();
require('newrelic');
const express = require('express');

// Router
const router = require('./routes.js');

const app = express();

// Logging and parsing
app.use(express.json());

// Set up our routes
app.use('/qa', router);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
