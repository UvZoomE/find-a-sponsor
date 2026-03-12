// backend/routes/verifyRoutes.js
const express = require('express');
const router = express.Router();
const { verifyEmail } = require('../controllers/verifyController');

// This is a GET request because clicking a link in an email is always a GET request
router.get('/:token', verifyEmail);

module.exports = router;