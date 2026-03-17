// backend/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Sponsor = require("../models/Sponsor");

// Load your environment variables so we can connect to MongoDB
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB Connected for Seeding");
  } catch (error) {
    console.error("🔴 MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

const generateSponsors = () => {
  const sponsors = [];

  // Data pools to randomly select from
  const programOptions = ["AA", "NA", "Al-Anon", "CMA", "HA", "ACA", "SLAA"];
  const cities = [
    "Pasadena, MD",
    "Baltimore, MD",
    "Annapolis, MD",
    "Glen Burnie, MD",
    "Severna Park, MD",
    "Washington, DC",
  ];
  const availabilities = [
    "Taking 1 new sponsee",
    "Taking new sponsees",
    "Full (Not taking sponsees currently)",
  ];
  const stepExperiences = [
    "Have worked all 12 steps multiple times and sponsored others.",
    "Completed the steps and currently living in steps 10, 11, and 12.",
    "Have a firm grasp of the Big Book and have guided several sponsees.",
    "Actively working the steps with my own sponsor, ready to help newcomers.",
    "10+ years of step work experience.",
  ];
  const firstNames = [
    "James",
    "Sarah",
    "Mike",
    "Emily",
    "David",
    "Jessica",
    "John",
    "Amanda",
    "Robert",
    "Ashley",
    "William",
    "Kim",
    "Richard",
    "Melissa",
    "Joe",
    "Steph",
    "Tom",
    "Becca",
    "Charles",
    "Laura",
  ];
  const bios = [
    "I am grateful for this program and ready to take you through the steps.",
    "Recovery changed my life. Available to sponsor locally or via Zoom.",
    "Strictly big book focused. Let's get to work.",
    "I focus on a compassionate, thorough approach to the 12 steps.",
    "Step 12 says carry the message. I'm here to help.",
  ];

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i];
    const lastInitial = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
    ); // Random A-Z

    // Generate a random sobriety date between 1 and 15 years ago
    const yearsAgo = Math.floor(Math.random() * 15) + 1;
    const randomSobrietyDate = new Date();
    randomSobrietyDate.setFullYear(randomSobrietyDate.getFullYear() - yearsAgo);
    // Add a random month offset so they aren't all the exact same month
    randomSobrietyDate.setMonth(Math.floor(Math.random() * 12));

    // Randomly assign 1 or 2 programs to the array
    const numPrograms = Math.floor(Math.random() * 2) + 1;
    const selectedPrograms = [];
    for (let p = 0; p < numPrograms; p++) {
      const prog =
        programOptions[Math.floor(Math.random() * programOptions.length)];
      if (!selectedPrograms.includes(prog)) selectedPrograms.push(prog);
    }
    // Fallback just in case the loop picked duplicates
    if (selectedPrograms.length === 0) selectedPrograms.push("AA");

    sponsors.push({
      name: `${firstName} ${lastInitial}.`,
      email: `seeduser${i}@findasponsor.net`, // Custom email so you know they are fake
      password: "Password123!",
      programs: selectedPrograms,
      sobrietyDate: randomSobrietyDate,
      location: cities[Math.floor(Math.random() * cities.length)],
      availability:
        availabilities[Math.floor(Math.random() * availabilities.length)],
      bio: bios[Math.floor(Math.random() * bios.length)],
      stepExperience:
        stepExperiences[Math.floor(Math.random() * stepExperiences.length)],
      isVerified: true, // Forces them to show up in the directory immediately
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
    });
  }

  return sponsors;
};

const seedDatabase = async () => {
  await connectDB();

  try {
    // Delete ONLY the old seed users so we don't accidentally delete YOUR real admin/test accounts!
    await Sponsor.deleteMany({ email: { $regex: "seeduser" } });
    console.log("🧹 Cleared old seed data");

    const usersToInsert = generateSponsors();

    // Loop through and create them one by one to ensure the password hashing hook runs
    for (const user of usersToInsert) {
      await Sponsor.create(user);
    }

    console.log("🌱 Successfully planted 20 detailed seed sponsors!");
    process.exit();
  } catch (error) {
    console.error("🔴 Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
