// Imports
const express = require('express');
const fileUploader = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

// Constants
const app = express();

// Routes
const authRoutes = require('./routes/auth');
const accountsRoutes = require('./routes/accounts');
const artistRoutes = require('./routes/artist');
const tokenRouter = require('./routes/tokens');


app.use(helmet());
app.use(compression());

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

// application/json
app.use(bodyParser.json());
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

// Routes
/*app.use('/api', (route) => {
});*/

app.use('/api/accounts',accountsRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRouter);

app.use((error, req, res, next) => {
    console.log(error);

    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status)
        .json({ message: message, data: data })
});

// TODO: Adding SSL

//const url = `mongodb://admin:1o0ydxALuKk5Ll4u@cf-shard-00-00-r3ep6.mongodb.net:27017,cf-shard-00-01-r3ep6.mongodb.net:27017,cf-shard-00-02-r3ep6.mongodb.net:27017/test?ssl=true&replicaSet=cf-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Connection to db and start server
mongoose
    .connect(
      `mongodb+srv://${process.env.MONDO_USER}:${process.env.MONDO_PASSWORD}@cf-r3ep6.mongodb.net/test?retryWrites=true&w=majority`
    )
    .then(result => {
        app.listen(process.env.PORT || 5000);
        console.log('##################################');
        console.log('MongoDB Connected...');
        console.log('Server Connected...');
        console.log('##################################');
    })
    .catch(err =>{
       // console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%${process.env.production.MONDO_USER}`);
        console.log(err)
    });
