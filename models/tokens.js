const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    tokenId: {
        type: Number,
        unique: true,
    },
    image: {
        type: String,
    },
    name: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Tokens', tokenSchema);