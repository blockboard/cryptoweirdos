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
    sparse: true
  },
  email: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
  },
  isArtist: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Accounts', userSchema);
