const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://alex:JgU76Cpq8vSgUmNq@cf-r3ep6.mongodb.net/test?retryWrites=true&w=majority";

/*const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});*/

const mongoConnect = (callback) => {
    MongoClient.connect(URI)
        .then(client => {
            console.log(`MongoDB Connected...`);
            callback(client);
        })
        .catch(error => console.log(error));
};

module.exports = mongoConnect;


