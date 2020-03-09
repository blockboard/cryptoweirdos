// Imports
const express = require('express');
const fileUploader = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Routes
const artistRoutes = require('./routes/artist');

// Controllers

// Utils
//const mongoConnect = require('./util/dbConnection');

// Constants
const app = express();


//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(fileUploader());
//app.use('/app', express.favicon(__dirname + '/public/favicon.ico'));
//app.use(express.static(path.join(__dirname, 'client-suspended/public')));

// CORS Error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/artist', artistRoutes);

mongoose
    .connect(
        `mongodb://alex:S65sDNlkaXzlTCDa@cf-shard-00-00-r3ep6.mongodb.net:27017,cf-shard-00-01-r3ep6.mongodb.net:27017,cf-shard-00-02-r3ep6.mongodb.net:27017/test?ssl=true&replicaSet=cf-shard-0&authSource=admin&retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(result => {
        app.listen(5000);
        console.log('MongoDB Connected...');
        console.log('Server Connected...');
    })
    .catch(err =>{
        console.log(err)
    });
