// backend/controllers/verifyController.js
const Sponsor = require('../models/Sponsor');

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Define where to send the user after they click the link
    // Change 5173 to whatever port your React app runs on locally (e.g., 3000, 5173)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; 

    // 2. Find the user with this token
    const sponsor = await Sponsor.findOne({ verificationToken: token });

    if (!sponsor) {
      // Token is invalid or already used
      return res.redirect(`${frontendUrl}?error=invalid_token`);
    }

    // 3. Mark as verified and clear the token
    sponsor.isVerified = true;
    sponsor.verificationToken = undefined;
    await sponsor.save();

    // 4. Redirect them back to your frontend with a success flag!
    res.redirect(`${frontendUrl}?verified=true`);

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).send('Server Error during verification');
  }
};

module.exports = { verifyEmail };