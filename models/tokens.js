const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    tokenId: {
        type: Number,
        unique: true,
    },
    image: {
        type: String,
        unique: true,
    },
    external_url: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        default: () => {
            return  'Glitched Weirdos!'
        }
    },
    name: {
        type: String,
        default: () => {
            return  'GlitchedWeirdo #'+Math.floor(Math.random() * 1000000)
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('Tokens', tokenSchema);