// Imports
const express = require('express');

// Controllers
const artistController = require('../controllers/artist');

// Constants
const router = express.Router();

// POST /artist/upload
// POST new Image which means minting new token
router.post('/upload', artistController.postImage);


module.exports = router;