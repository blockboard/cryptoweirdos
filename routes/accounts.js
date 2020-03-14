const express = require('express');
const { body } = require('express-validator/check');

const accountsController = require('../controllers/accounts');

// Constants
const router = express.Router();

// GET /api/accounts/:publicAddress
router.get('/:publicAddress', accountsController.getAccount);

// POST /api/accounts/
router.post('/', accountsController.postAccount);

module.exports = router;
