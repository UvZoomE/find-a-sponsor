// src/views/HomeView.jsx

import React from "react";
import { Search, User } from "lucide-react";
import "../css/HomeView.css"; // Import the dedicated styles

export default function HomeView({ setCurrentView }) {
  return (
    <div className="hero-section">
      <div className="hero">
        <h1>You don't have to do this alone.</h1>
        <p>
          Connecting individuals in 12-step recovery programs with experienced
          sponsors. Because we can only keep what we have by giving it away.
        </p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentView("list")}
          >
            <Search size={20} />
            Find a Sponsor
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setCurrentView("become-sponsor")}
          >
            <User size={20} />
            Become a Sponsor
          </button>
        </div>
      </div>

      <div className="disclaimer">
        <strong>Tradition 11 Reminder:</strong> Our public relations policy is
        based on attraction rather than promotion; we need always maintain
        personal anonymity at the level of press, radio, and films (and the
        internet).
        <br />
        <em>
          Only first names and last initials are used on this platform to
          protect anonymity.
        </em>
      </div>
    </div>
  );
}
