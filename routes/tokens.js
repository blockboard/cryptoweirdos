const express = require('express');
const { body } = require('express-validator/check');

const tokensController = require('../controllers/token');

// Constants
const router = express.Router();

// GET /api/tokens/:tokenId
router.get('/:tokenId', tokensController.getToken);

// POST /api/tokens/
router.post('/', tokensController.postToken);

module.exports = router;