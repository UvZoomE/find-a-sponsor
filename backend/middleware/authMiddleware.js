// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Sponsor = require("../models/Sponsor");

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the frontend sent the Authorization: Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token string
      token = req.headers.authorization.split(" ")[1];

      // 2. Mathematically verify the token hasn't been tampered with
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. THE ZOMBIE KILLER: Look up the user by the ID inside the token
      req.sponsor = await Sponsor.findById(decoded.id).select("-password");

      // If the token is valid but the user was deleted from the database:
      if (!req.sponsor) {
        return res
          .status(401)
          .json({ message: "Not authorized, user account no longer exists." });
      }

      // 4. If everything is good, pass the request to the next controller!
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ message: "Not authorized, token failed or expired." });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }
};

module.exports = { protect };
