const express = require("express");
const router = express.Router();
const { loginSponsor } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/authController");

router.post("/login", loginSponsor);

router.get("/me", protect, getMe);

module.exports = router;
