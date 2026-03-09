// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const sponsorRoutes = require("./routes/sponsorRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // If you use Vite. Change to 3000 if you use Create React App.
      "https://find-a-sponsor.vercel.app/", // Paste your exact live Vercel URL here!
      "https://findasponsor.net",
      "https://www.findasponsor.net",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Mount Routes
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/messages", messageRoutes);

// Basic root route for testing
app.get("/", (req, res) => {
  res.send("Find a Sponsor API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
