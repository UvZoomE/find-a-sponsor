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
const { verifyEmail } = require("../controllers/verifyController");

router.post("/login", authLimiter, loginSponsor);

router.get("/me", protect, getMe);
router.post("/forgotpassword", authLimiter, forgotPassword);
router.put("/resetpassword/:resettoken", authLimiter, resetPassword);
router.get("/verify/:token", verifyEmail);

module.exports = router;
