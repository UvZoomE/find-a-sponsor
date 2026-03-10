const express = require('express');
const router = express.Router();
const { loginSponsor } = require('../controllers/authController');

router.post('/login', loginSponsor);

module.exports = router;