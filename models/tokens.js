const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    imageHash: {
        type: String,
        required: true
    },
    tokenID: {
        type: Number,
        required: true,
        unique: true
    },
    ownerAddress: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tokens', tokenSchema);