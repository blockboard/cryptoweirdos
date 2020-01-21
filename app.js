// Imports
const express = require('express');
const fileUploader = require('express-fileupload');
const path = require('path');

// Routes
const artistRoutes = require('./routes/artist');

// Constants
const app = express();

app.use(fileUploader());
//app.use('/app', express.favicon(__dirname + '/public/favicon.ico'));
//app.use(express.static(path.join(__dirname, 'client/public')));

console.log(path.join(__dirname, '/client/public'));

app.use('/artist', artistRoutes);

app.listen(5000, () => console.log('Server Started...'));