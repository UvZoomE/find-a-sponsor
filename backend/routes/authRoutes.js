const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMe,
  forgotPassword,
  loginSponsor,
  resetPassword,
} = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

router.post("/login", authLimiter, loginSponsor);

router.get("/me", protect, getMe);
router.post("/forgotpassword", authLimiter, forgotPassword);
router.put("/resetpassword/:resettoken", authLimiter, resetPassword);

module.exports = router;
