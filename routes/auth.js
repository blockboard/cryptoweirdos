const express = require('express');
const { body } = require('express-validator/check');

// Constants
const router = express.Router();

// Controller
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

// DB Model
const User = require('../models/accounts');

//Routes

// POST /api/auth/signup
router.post('/signup'/*[
    body('username')
        .not().isEmpty()
        .trim()
        .custom((value, { req }) => {
            return User.findOne({username: value})
                .then(userDoc => {
                    if(userDoc) {
                        return Promise.reject('Username already exists!');
                    }
                })
        }),

    body('email')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if(userDoc) {
                        return Promise.reject('E-mail address already exits!');
                    }
                })
        })
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 8 })
]*/, authController.signup);

// POST /api/auth/signin
router.post('/signin'/*[
    body('username')
        .not().isEmpty()
        .trim()
        .custom((value, { req }) => {
            return User.findOne({username: value})
                .then(userDoc => {
                    if(userDoc) {
                        return Promise.reject('Username already exists!');
                    }
                })
        }),

    body('email')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if(userDoc) {
                        return Promise.reject('E-mail address already exits!');
                    }
                })
        })
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 8 })
]*/, authController.signupMetaMask);

// POST /signin
//router.post('/signin', authController.signin);

module.exports = router;
