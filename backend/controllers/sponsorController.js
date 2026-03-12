// backend/controllers/sponsorController.js
const Sponsor = require("../models/Sponsor");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

// Initialize Resend (Ensure RESEND_API_KEY is in your backend .env file)
const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Get all sponsors
// @route   GET /api/sponsors
const getSponsors = async (req, res) => {
  try {
    // .select('-password -verificationToken') ensures we don't send sensitive data to the public directory
    const sponsors = await Sponsor.find({}).select("-password -verificationToken");
    res.status(200).json(sponsors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new sponsor
// @route   POST /api/sponsors
const createSponsor = async (req, res) => {
  try {
    const {
      name,
      email,
      programs,
      password,
      sobrietyDate,
      location,
      availability,
      bio,
      stepExperience,
      avatar,
    } = req.body;

    // 1. THE CHECK: Ask MongoDB if this email already exists
    const sponsorExists = await Sponsor.findOne({ email });
    
    // 2. THE RESPONSE: If it does, stop the function and send a 400 error back to the frontend
    if (sponsorExists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    let finalAvatarUrl = avatar; // Default to whatever came from the frontend (likely a Dicebear URL)

    // Check if the avatar is a Base64 string (meaning the user uploaded a custom photo)
    if (avatar && avatar.startsWith("data:image")) {
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "find-a-sponsor", 
        width: 250, 
        crop: "scale",
      });

      // Overwrite the Base64 string with the secure Cloudinary URL
      finalAvatarUrl = uploadResponse.secure_url;
    }

    // 3. Generate a secure, random verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // 4. Save to MongoDB (Remember: The pre-save hook in Sponsor.js will hash the password automatically!)
    const sponsor = new Sponsor({
      name,
      email,
      programs,
      sobrietyDate,
      location,
      availability,
      password, 
      bio,
      stepExperience,
      avatar: finalAvatarUrl,
      verificationToken, // Save the token to the database
    });

    const createdSponsor = await sponsor.save();

    // 5. Build the verification URL
    // Make sure API_BASE_URL is set in your Render environment variables to your actual Render URL!
    // If it's missing, it defaults to localhost for local testing.
    const backendUrl = process.env.API_BASE_URL || "http://localhost:5000/api";
    const verifyUrl = `${backendUrl}/verify/${verificationToken}`;

    // 6. Send the verification email via Resend and log the response!
    console.log(`Attempting to send verification email to: ${createdSponsor.email}`);
    
    const { data, error } = await resend.emails.send({
      from: "Find A Sponsor <onboarding@resend.dev>", // Keep this as onboarding@resend.dev until your domain is verified
      to: createdSponsor.email,
      subject: "Verify your email for Find A Sponsor",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2b6cb0;">Welcome to Find A Sponsor!</h2>
          <p>Hi ${createdSponsor.name},</p>
          <p>Thank you for offering your time to sponsor others. To ensure the security of our directory, please verify your email address by clicking the button below:</p>
          <div style="margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify My Email</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4a5568;">${verifyUrl}</p>
        </div>
      `,
    });

    if (error) {
      console.error("🔴 RESEND ERROR DETECTED:", JSON.stringify(error, null, 2));
    } else {
      console.log("🟢 RESEND SUCCESS:", JSON.stringify(data, null, 2));
    }

    // 7. Generate a JWT so the frontend can temporarily log them in
    const token = jwt.sign(
      { id: createdSponsor._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "30d" }
    );

    // 8. Send back the user data (WITHOUT the password) and the token
    res.status(201).json({
      _id: createdSponsor._id,
      name: createdSponsor.name,
      email: createdSponsor.email,
      avatar: createdSponsor.avatar,
      token: token
    });

  } catch (error) {
    console.error("Error creating sponsor:", error);
    res.status(400).json({ message: "Invalid sponsor data", error: error.message });
  }
};

module.exports = { getSponsors, createSponsor };