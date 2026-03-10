// backend/models/Sponsor.js
const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    programs: { type: [String], required: true },
    sobrietyDate: { type: Date, required: true },
    location: { type: String, required: true },
    availability: { type: String, required: true },
    bio: { type: String, required: true },
    stepExperience: { type: String, required: true },
    // Optional: add avatar URL or generate a default one later
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

module.exports = mongoose.model("Sponsor", sponsorSchema);
