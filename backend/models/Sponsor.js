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
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    },
    isVerified: {
      type: Boolean,
      default: false, 
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
    timestamps: true, 
  },
);

// 2. The Modern Pre-Save Hook (No 'next' needed!)
sponsorSchema.pre("save", async function () {
  // If the password hasn't been modified, exit the function. 
  // Mongoose sees the Promise resolve and moves on to saving!
  if (!this.isModified("password")) {
    return; 
  }

  // Generate the salt and scramble the password.
  // If bcrypt fails, it automatically throws an error, which Mongoose 
  // catches and handles safely to prevent a broken save.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Method to check the password later
sponsorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Sponsor", sponsorSchema);