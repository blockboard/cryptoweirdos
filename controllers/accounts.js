const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../models/accounts');

// GET /api/accounts/:publicAddress
exports.getAccount = (req, res, next) => {
  const publicAddress = req.params.publicAddress;

  Account.findOne({ publicAddress: publicAddress })
      .then(account => {
        if (!account) {
          const error = new Error(`Account with publicAddress ${publicAddress} is not found in database`);
          error.statusCode = 404; // Not found
          throw error;
        }
        res.status(200).send({
          message: `Account with publicAddress ${publicAddress} is found in database`,
          account: account
        })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
};

// POST /api/accounts
exports.postAccount = (req, res,  next) => {
  const publicAddress = req.body.publicAddress;

  const account = new Account({
    publicAddress: publicAddress
  }).save()
      .then(result => {
        res.status(201).json({
          message: 'Account created!',
          publicAddress: result.publicAddress
        })
      })
      .catch(err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};
