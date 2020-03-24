const validationResult = require('express-validator/check');
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../models/accounts');

// POST /api/auth/signup
exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422; // Unprocessable Entity
        error.data = errors.array();
        throw error;
    }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const account = new Account({
                username: username,
                email: email,
                password: hashedPassword
            });
            return account.save();
        })
        .then(result => {
            res.status(201).json({
              message: 'Account created!',
              userId: result._id
            });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// POST /api/auth/signin
exports.signupMetaMask = (req, res, next) => {
 /* const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation Failed');
    error.statusCode = 422; // Unprocessable Entity
    error.data = errors.array();
    throw error;
  }*/
  const { publicAddress, signature } = req.body;

  if (!signature || !publicAddress) {
    const error = new Error('Request should have signature and publicAddress');
    error.statusCode = 400;
    throw error;
  }

  Account.findOne({ publicAddress: publicAddress })
  // Step 1: Get the user with the given publicAddress
      .then(account => {
        if (!account) {
          const error = new Error(`User with publicAddress ${publicAddress} is not found in database`);
          error.statusCode = 401;
          throw error;
        }
        return account;
      })
  // Step 2: Verify digital signature
      .then(acount => {
        if (!(acount instanceof Account)) {
          // Should not happen, we should have already sent the response
          throw new Error(
              'User is not defined in "Verify digital signature".'
          );
        }

        const msg = `I am signing my one-time nonce: ${acount.nonce}`;

        const msgBuffer = Buffer.from(msg, 'utf8');

        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = ethUtil.bufferToHex(msgBuffer);
        const address = sigUtil.recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature
        });

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          return acount;
        } else {
          const error = new Error('Signature verification failed');
          error.statusCode = 401;
          throw error;
        }
      })
  // Step 3: Generate a new nonce for the user
      .then(account => {
        if (!(account instanceof Account)) {
          // Should not happen, we should have already sent the response
          throw new Error(
              'User is not defined in "Generate a new nonce for the account".'
          );
        }

        account.nonce = Math.floor(Math.random() * 10000);
        return account.save();
      })
  // Step 4: Create JWT
      .then(account => {
        const jwtToken = jwt.sign({
          id: account._id.toString(),
          publicAddress: publicAddress
        }, config.secret);

        return res.status(200).json({
          message: 'Successful authentication',
          token: jwtToken,
          publicAddress: publicAddress
        })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

// signin
exports.signin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  let loodedUser;

  Account.findOne({ username: username })
      .then(account => {
        if (!account) {
          const error = new Error('A account with this email could not be found.');
          error.statusCode = 404; // Not found
          throw error;
        }
        loodedUser = account;
        return bcrypt.compare(password, account.password);
      })
      .then(isEqual => {
        if (!isEqual) {
          const error = new Error('Wrong password!');
          error.statusCode = 401;
          throw error;
        }
        // TODO: check the role
        const token = jwt.sign({
          username: loodedUser.username,
          userId: loodedUser._id.toString()
        }, 'secret', {
          expiresIn: '1h'
        });

        res.status(200).json({
          token: token,
          userId: loodedUser._id.toString()
        })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
};
