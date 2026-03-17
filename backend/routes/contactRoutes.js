// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../controllers/contactController");

// Import your general rate limiter to prevent spam!
const { apiLimiter } = require("../middleware/rateLimitMiddleware");

router.post("/", apiLimiter, submitContactForm);

module.exports = router;
