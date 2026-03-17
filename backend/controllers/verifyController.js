// backend/controllers/verifyController.js
const Sponsor = require("../models/Sponsor");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Find the user with this token
    const sponsor = await Sponsor.findOne({ verificationToken: token });

    if (!sponsor) {
      // THE FIX: Stop redirecting! Just send a 400 error as JSON so React can catch it.
      return res.status(400).json({ 
        message: "This verification link is invalid or has already been used." 
      });
    }

    // 2. Mark as verified and clear the token
    sponsor.isVerified = true;
    sponsor.verificationToken = undefined;
    await sponsor.save();

    // 3. Send a clean success JSON response
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    // THE FIX: Make sure server errors also send JSON instead of raw text (.send)
    res.status(500).json({ message: "Server Error during verification" });
  }
};

module.exports = { verifyEmail };