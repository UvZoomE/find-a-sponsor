// src/components/Footer.jsx
import React from "react";
import { Shield } from "lucide-react";
import "../css/Footer.css"; // Added the missing CSS import!

export default function Footer({ setCurrentView }) {
  return (
    <footer className="app-footer">
      <div className="footer-shield-container">
        <Shield size={18} color="#2b6cb0" className="footer-shield-icon" />
        <span className="footer-shield-text">
          Your anonymity is protected. Emails are kept strictly private and
          never sold.
        </span>
      </div>
      
      <div className="footer-link-container">
        <button
          onClick={() => {
            setCurrentView("contact");
            window.scrollTo(0, 0);
          }}
          className="footer-link-btn"
        >
          Contact Us
        </button>
      </div>

      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} Find A Sponsor. All rights reserved.
      </p>
    </footer>
  );
}