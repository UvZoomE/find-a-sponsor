// backend/models/Sponsor.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    isVerified: {
      type: Boolean,
      default: false, // This ensures every new account starts as false!
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// 2. The Pre-Save Hook
sponsorSchema.pre("save", async function () {
  // If the password hasn't been modified (e.g., they just updated their bio), skip hashing
  if (!this.isModified("password")) {
    return; // Just return to exit the function, no next() needed!
  }

  // Generate the salt and scramble the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Optional but highly recommended: Add a method to check the password later
sponsorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Sponsor", sponsorSchema);
