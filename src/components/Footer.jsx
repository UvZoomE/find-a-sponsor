import React from "react";
import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Find A Sponsor. A tool for recovery.</p>
      <p className="footer-subtext">
        This site is not affiliated with any specific 12-step organization.
      </p>
    </footer>
  );
}
