// src/views/LoginView.jsx
import React, { useState } from "react";
import { ChevronLeft, LogIn, UserPlus, Info } from "lucide-react";
import { API_BASE_URL } from "../../backend/utils/config";

export default function LoginView({ setCurrentView, setCurrentUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("mySponsorProfile", JSON.stringify(data));
        setCurrentUser(data);
        setCurrentView("home");
        window.scrollTo(0, 0);
      } else {
        setError(data.message || "Failed to login. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please ensure the server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="profile-container"
      style={{ maxWidth: "500px", marginTop: "4rem" }}
    >
      <button className="back-btn" onClick={() => setCurrentView("home")}>
        <ChevronLeft size={20} />
        Back to Home
      </button>

      <div className="profile-header">
        <h2 className="profile-name mb-sm">Sponsor Login</h2>
        <p className="text-muted">
          Welcome back. Please log in to manage your profile.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fed7d7",
            color: "#c53030",
            padding: "1rem",
            borderRadius: "8px",
            margin: "0 0 1.5rem 0",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} style={{ marginBottom: "2rem" }}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full btn-large"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Logging in..."
          ) : (
            <>
              <LogIn size={20} style={{ marginRight: "8px" }} /> Log In
            </>
          )}
        </button>
      </form>

      {/* --- CREATE ACCOUNT PROMPT --- */}
      <div className="login-signup-prompt">
        <h3 className="login-signup-title">New to the directory?</h3>

        <div className="login-info-box">
          <Info size={20} className="info-icon" />
          <p>
            <strong>Looking for a sponsor?</strong> You do not need an account!
            Simply go to the home page to browse and message sponsors securely.
          </p>
        </div>

        <button
          className="btn btn-outline btn-full btn-large"
          onClick={() => setCurrentView("becomeSponsor")}
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <UserPlus size={20} />
          Create a Sponsor Account
        </button>
      </div>
    </div>
  );
}
