// backend/controllers/authController.js
const Sponsor = require("../models/Sponsor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. MAKE SURE THESE TWO IMPORTS ARE HERE
const crypto = require("crypto");
const { Resend } = require("resend");

// 2. MAKE SURE RESEND IS INITIALIZED
const resend = new Resend(process.env.RESEND_API_KEY);

const loginSponsor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const sponsor = await Sponsor.findOne({ email });
    if (!sponsor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, sponsor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // THE SMART VERIFICATION CHECK
    if (sponsor.isVerified === false) {
      const newVerificationToken = crypto.randomBytes(20).toString("hex");

      await Sponsor.updateOne(
        { _id: sponsor._id },
        { $set: { verificationToken: newVerificationToken } },
      );

      const backendUrl =
        process.env.API_BASE_URL || "http://localhost:5000/api";
      const verifyUrl = `${backendUrl}/verify/${newVerificationToken}`;

      console.log(`Resending verification email to: ${sponsor.email}`);

      // If resend is not initialized above, this exact line will cause the 500 error!
      const { data, error } = await resend.emails.send({
        from: "Find A Sponsor <onboarding@resend.dev>",
        to: sponsor.email,
        subject: "Action Required: Verify your email for Find A Sponsor",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #2b6cb0;">Verify Your Account</h2>
            <p>Hi ${sponsor.name},</p>
            <p>You recently tried to log in, but we still need to verify your email address. Please click the button below to secure your account:</p>
            <div style="margin: 30px 0;">
              <a href="${verifyUrl}" style="background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify My Email</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4a5568;">${verifyUrl}</p>
          </div>
        `,
      });

      if (error) {
        console.error(
          "🔴 RESEND ERROR (Login Retry):",
          JSON.stringify(error, null, 2),
        );
      } else {
        console.log(
          "🟢 RESEND SUCCESS (Login Retry):",
          JSON.stringify(data, null, 2),
        );
      }

      return res.status(403).json({
        message:
          "Your account is not verified. A new verification link has just been sent to your email!",
      });
    }

    // Generate the JWT
    const token = jwt.sign({ id: sponsor._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: sponsor._id,
      name: sponsor.name,
      email: sponsor.email,
      avatar: sponsor.avatar,
      programs: sponsor.programs,
      location: sponsor.location,
      availability: sponsor.availability,
      bio: sponsor.bio,
      stepExperience: sponsor.stepExperience,
      sobrietyDate: sponsor.sobrietyDate,
      token: token,
    });
  } catch (error) {
    // 3. THIS WILL CATCH THE CRASH AND TELL US WHY!
    console.error("🔴 FATAL LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get current logged in sponsor data (Validate Token)
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  // If the code makes it this far, the 'protect' middleware already verified
  // the token AND confirmed the user exists in the database!
  // It even conveniently attached the user data to req.sponsor for us.
  res.status(200).json(req.sponsor);
};

module.exports = { loginSponsor, getMe };
