// src/components/NavBar.jsx

import React from "react";
import { Heart } from "lucide-react";
import "../css/NavBar.css"; // Import the dedicated styles

export default function NavBar({ setCurrentView }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setCurrentView("home")}>
        <Heart size={28} color="#2b6cb0" fill="#2b6cb0" />
        <span>Find A Sponsor</span>
      </div>

      <div className="nav-links">
        <button className="nav-link" onClick={() => setCurrentView("home")}>
          Home
        </button>
        <button className="nav-link" onClick={() => setCurrentView("safety")}>
          Safety & Anonymity
        </button>
      </div>
    </nav>
  );
}
