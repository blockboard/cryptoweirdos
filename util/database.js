const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://alex:JgU76Cpq8vSgUmNq@cf-r3ep6.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log(`MongoDB Connected...`);
            callback(client);
        })
        .catch(error => console.log(error));
};

module.exports = mongoConnect;


