const express = require('express');
const { body } = require('express-validator/check');

const artistController = require('../controllers/artist');

// Constants
const router = express.Router();

// POST /artist/upload
// POST new Image which means minting new token
router.post('/upload-image', artistController.postImage);


module.exports = router;