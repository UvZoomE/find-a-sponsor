// backend/controllers/authController.js
const Sponsor = require("../models/Sponsor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Authenticate a sponsor & get token
// @route   POST /api/auth/login
const loginSponsor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the sponsor exists
    const sponsor = await Sponsor.findOne({ email });
    if (!sponsor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Check if the password matches the scrambled hash in the database
    const isMatch = await bcrypt.compare(password, sponsor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate the JWT "Wristband"
    const token = jwt.sign(
      { id: sponsor._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }, // Token lasts for 30 days
    );

    // 4. Send back the user data and the token
    res.status(200).json({
      _id: sponsor._id,
      name: sponsor.name,
      email: sponsor.email,
      avatar: sponsor.avatar,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { loginSponsor };
