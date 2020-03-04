const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nonce: {
    type: Number,
    required: true,
    default: () => Math.floor(Math.random() * 1000000)
  },
  publicAddress: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  artist: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
