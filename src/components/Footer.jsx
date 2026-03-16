// src/components/Footer.jsx
import React from "react";
import { Shield } from "lucide-react";

export default function Footer({ setCurrentView }) {
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "2rem 1rem",
        textAlign: "center",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f7fafc",
        color: "#718096",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Shield size={18} color="#2b6cb0" />
        <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>
          Your anonymity is protected. Emails are kept strictly private and
          never sold.
        </span>
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>
        &copy; {new Date().getFullYear()} Find A Sponsor. All rights reserved.
      </p>
    </footer>
  );
}
