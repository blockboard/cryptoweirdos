const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Token = require('../models/tokens');

// GET /api/accounts/:publicAddress
exports.getToken = (req, res, next) => {
  const tokenId = req.params.tokenId;

  Token.findOne({ tokenId: tokenId })
    .then(token => {
      if (!token) {
        const error = new Error(`Token ${tokenId} is not found in database`);
        error.statusCode = 404; // Not found
        throw error;
      }
      res.status(200).send({
        image: token.image,
        name: token.name
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

// POST /api/tokens
exports.postToken = (req, res,  next) => {
  const tokenId = req.body.tokenId;
  const image = req.body.image;
  const name = req.body.name;

  const token = new Token({
    tokenId: tokenId,
    image: image,
    name: name
  }).save()
    .then(result => {
      res.status(201).json({
        message: 'Token Minted!',
        tokenId: result.tokenId
      })
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
