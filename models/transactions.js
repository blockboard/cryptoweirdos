const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionsSchema= new Schema({
   tokenId: {
       type: Number,
       require: true,
       unique: true
   },
   fromAddress: {
       type: String,
       require: true,
       unique: true
   },
   toAddress: {
       type: String,
       require: true,
       unique: true
   }
});

module.exports = mongoose.model('Transactions', transactionsSchema);