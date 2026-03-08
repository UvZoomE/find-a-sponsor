// backend/seedDatabase.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables so we can access MONGO_URI
dotenv.config();

const connectDB = require("../config/db");
const Sponsor = require("../models/Sponsor");

const mockSponsors = [
  {
    name: "Michael T.",
    email: "michael.t@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelT",
    programs: ["AA"],
    sobrietyDate: new Date("2015-04-12"),
    location: "Virtual / New York, NY",
    bio: "Hi, I'm Michael. I've been working the steps for 8 years and sponsoring for 5. I believe in a Big Book focused approach, rigorous honesty, and daily contact. I am available for weekly step work and daily check-ins.",
    availability: "Taking new sponsees",
    stepExperience: "Has worked all 12 steps multiple times.",
  },
  {
    name: "Sarah W.",
    email: "sarah.w@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW",
    programs: ["AA", "Al-Anon"],
    sobrietyDate: new Date("2018-11-01"),
    location: "Virtual Only",
    bio: "Recovery gave me my life back. I sponsor women in AA and Al-Anon. My approach is gentle but firm, focusing on spiritual progress rather than spiritual perfection.",
    availability: "Taking 1 new sponsee",
    stepExperience: "Currently on Step 10/11/12 maintenance.",
  },
  {
    name: "David K.",
    email: "david.k@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidK",
    programs: ["SA", "SLAA"],
    sobrietyDate: new Date("2020-02-14"),
    location: "Chicago, IL / Virtual",
    bio: "I carry the message of recovery from lust and sex addiction. I require my sponsees to attend at least 3 meetings a week and call me regularly. Willing to read the White Book together.",
    availability: "Taking new sponsees",
    stepExperience: "Has completed the steps.",
  },
  {
    name: "Elena R.",
    email: "elena.r@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaR",
    programs: ["NA"],
    sobrietyDate: new Date("2010-08-30"),
    location: "Los Angeles, CA",
    bio: "Clean and serene. I focus on the NA Basic Text and how to apply the spiritual principles of the program to everyday life. No matter what, we don't pick up.",
    availability: "Full (Not taking sponsees currently)",
    stepExperience: "Has worked all 12 steps.",
  },
  {
    name: "James L.",
    email: "james.l@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesL",
    programs: ["OA"],
    sobrietyDate: new Date("2021-05-10"),
    location: "Virtual Only",
    bio: "Abstinent from my bottom-line behaviors for 2 years. I work the OA 12 steps and 12 traditions. Looking for sponsees who are ready to get honest about their food and willing to go to any lengths.",
    availability: "Taking new sponsees",
    stepExperience: "Working the steps with my own sponsor.",
  },
];

const seedDB = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data to avoid duplicates if you run this multiple times
    console.log("Clearing old sponsor data...");
    await Sponsor.deleteMany();

    // Insert the mock data
    console.log("Inserting mock sponsors...");
    await Sponsor.insertMany(mockSponsors);

    console.log("Database successfully seeded!");
    process.exit(0); // Exit with a "success" code
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1); // Exit with a "failure" code
  }
};

// Execute the function
seedDB();
