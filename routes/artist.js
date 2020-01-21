// Imports
const express = require('express');

// Controllers
const artistController = require('../controllers/artist');

// Constants
const router = express.Router();

// POST /artist/upload
router.post('/upload', artistController.postImage);

module.exports = router;