// src/utils/config.js

// Replace the Render URL with the actual URL you got from your Render dashboard
export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://find-a-sponsor.onrender.com/api";
