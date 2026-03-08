// backend/controllers/sponsorController.js
const Sponsor = require("../models/Sponsor");
const cloudinary = require("../config/cloudinary");

// @desc    Get all sponsors
// @route   GET /api/sponsors
const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({});
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
      sobrietyDate,
      location,
      availability,
      bio,
      stepExperience,
      avatar,
    } = req.body;

    let finalAvatarUrl = avatar; // Default to whatever came from the frontend (likely a Dicebear URL)

    // Check if the avatar is a Base64 string (meaning the user uploaded a custom photo)
    if (avatar && avatar.startsWith("data:image")) {
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "find-a-sponsor", // This creates a neat folder in your Cloudinary dashboard
        width: 250, // Resize it so you aren't storing massive 4k selfies
        crop: "scale",
      });

      // Overwrite the Base64 string with the secure Cloudinary URL
      finalAvatarUrl = uploadResponse.secure_url;
    }

    // Save to MongoDB
    const sponsor = new Sponsor({
      name,
      email,
      programs,
      sobrietyDate,
      location,
      availability,
      bio,
      stepExperience,
      avatar: finalAvatarUrl, // Saves either the DiceBear URL or the new Cloudinary URL
    });

    const createdSponsor = await sponsor.save();
    res.status(201).json(createdSponsor);
  } catch (error) {
    console.error("Error creating sponsor:", error);
    res
      .status(400)
      .json({ message: "Invalid sponsor data", error: error.message });
  }
};

module.exports = { getSponsors, createSponsor };
