// Imports
const express = require('express');
const fileUploader = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');

// Routes
const artistRoutes = require('./routes/artist');

// Controllers

// Utils
const mongoConnect = require('./util/dbConnection');

// Constants
const app = express();


//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(fileUploader());
//app.use('/app', express.favicon(__dirname + '/public/favicon.ico'));
//app.use(express.static(path.join(__dirname, 'client/public')));

// CORS Error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/artist', artistRoutes);

mongoConnect(client => {
   //console.log(client);
   app.listen(5000, () => console.log('Server Started...'));
});