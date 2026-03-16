// backend/middleware/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

// Strict limiter for authentication routes (Login, Forgot Password)
// Limits each IP to 5 requests per 15-minute window
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // 🔴 LOWERED TO 2 FOR QUICK TESTING
  message: {
    message:
      "Too many requests from this IP address. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  // THE FIX: We removed the custom keyGenerator completely.
  // Express-rate-limit will securely use its own internal IPv6-safe generator.

  // THIS FIRES ONLY WHEN THE LIMIT IS REACHED (On the 3rd attempt)
  handler: (req, res, next, options) => {
    console.warn(`🛑 BOUNCER ACTIVATED! Blocked IP: ${req.ip || "UNKNOWN_IP"}`);
    return res.status(options.statusCode).json(options.message);
  },
});

// General limiter for all other API routes (Optional but highly recommended!)
// Limits each IP to 100 requests per 15-minute window
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests from this IP address. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
