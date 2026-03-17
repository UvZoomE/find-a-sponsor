// backend/controllers/authController.js
const Sponsor = require("../models/Sponsor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { API_BASE_URL } = require("../utils/config");

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

      const backendUrl = API_BASE_URL;
      const verifyUrl = `${backendUrl}/verify/${newVerificationToken}`;

      // If resend is not initialized above, this exact line will cause the 500 error!
      const { data, error } = await resend.emails.send({
        from: "Find A Sponsor <noreply@findasponsor.net>",
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

// @desc    Forgot Password - Send reset email
// @route   POST /api/auth/forgotpassword
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find the user
    const sponsor = await Sponsor.findOne({ email });
    if (!sponsor) {
      // We still return 200 so hackers can't use this form to guess which emails are registered!
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link was sent." });
    }

    // 2. Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 3. Save the token and set it to expire in 10 minutes
    await Sponsor.updateOne(
      { _id: sponsor._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpire: Date.now() + 10 * 60 * 1000, // 10 minutes from now
        },
      },
    );

    // 4. Build the reset URL (We will build the ResetPasswordView on the frontend later)
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: "Find A Sponsor <noreply@findasponsor.net>", // Use your verified domain!
      to: sponsor.email,
      subject: "Password Reset Request - Find A Sponsor",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2b6cb0;">Password Reset Request</h2>
          <p>Hi ${sponsor.name},</p>
          <p>You requested to reset your password. Click the button below to choose a new one. <strong>This link will expire in 10 minutes.</strong></p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    });

    if (error) {
      console.error(
        "🔴 RESEND ERROR (Forgot Password):",
        JSON.stringify(error, null, 2),
      );
      return res.status(500).json({ message: "Email could not be sent" });
    }

    console.log(
      "🟢 RESEND SUCCESS (Forgot Password):",
      JSON.stringify(data, null, 2),
    );
    res
      .status(200)
      .json({ message: "If that email exists, a reset link was sent." });
  } catch (error) {
    console.error("🔴 FATAL FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
const resetPassword = async (req, res) => {
  try {
    // 1. Find the user by the token AND make sure the 10-minute timer hasn't expired
    const sponsor = await Sponsor.findOne({
      resetPasswordToken: req.params.resettoken,
      resetPasswordExpire: { $gt: Date.now() }, // $gt means "Greater Than" right now
    });

    if (!sponsor) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // 2. Set the new password (your Mongoose pre('save') hook will hash it automatically!)
    sponsor.password = req.body.password;

    // 3. Delete the token fields so they can't be used again
    sponsor.resetPasswordToken = undefined;
    sponsor.resetPasswordExpire = undefined;

    await sponsor.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("🔴 FATAL RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { loginSponsor, getMe, forgotPassword, resetPassword };
