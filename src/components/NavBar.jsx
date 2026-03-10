// src/components/NavBar.jsx

import React from "react";
import { Heart, LogIn } from "lucide-react";
import "../css/NavBar.css";

export default function NavBar({
  setCurrentView,
  currentUser,
  setCurrentUser,
}) {
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

        {currentUser ? (
          <div
            className="user-menu"
            onClick={() => setCurrentView("editProfile")}
            title="Manage Profile"
          >
            <img
              src={currentUser.avatar}
              alt="My Profile"
              className="header-avatar"
            />
          </div>
        ) : (
          <div className="nav-auth-group">
            <button
              className="nav-login-btn"
              onClick={() => setCurrentView("login")}
            >
              <LogIn size={16} />
              Log In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
