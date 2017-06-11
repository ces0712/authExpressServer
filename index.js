// Main starting point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
// Db setup
mongoose.connect('mongodb://127.0.0.1:auth/auth');

// morgan and body parser are middlewares the incoming request
// are passing to morgan (logging framework) and body parser 
// (parse incoming request as json) by default
// App setup  
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);