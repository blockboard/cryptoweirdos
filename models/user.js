const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nonce: {
        type: Number,
        required: true
    },
    publicAddress: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        unique: true
    },
    userEmail: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);