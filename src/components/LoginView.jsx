// src/views/LoginView.jsx
import React, { useState } from "react";
import { ChevronLeft, LogIn, UserPlus, Info } from "lucide-react";
import { API_BASE_URL } from "../../backend/utils/config";

export default function LoginView({ setCurrentView, setCurrentUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);

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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setError("");
    setResetMessage("");

    const email = e.target.resetEmail.value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show the success message from the backend
        setResetMessage(data.message);
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsResetting(false);
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
        <h2 className="profile-name mb-sm">
          {isForgotMode ? "Reset Password" : "Sponsor Login"}
        </h2>
        <p className="text-muted">
          {isForgotMode
            ? "Enter the email associated with your account and we'll send you a link to reset your password."
            : "Welcome back. Please log in to manage your profile."}
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

      {resetMessage && isForgotMode && (
        <div
          style={{
            backgroundColor: "#c6f6d5",
            color: "#2f855a",
            padding: "1rem",
            borderRadius: "8px",
            margin: "0 0 1.5rem 0",
          }}
        >
          {resetMessage}
        </div>
      )}

      {isForgotMode ? (
        /* =========================================
           FORGOT PASSWORD FORM
           ========================================= */
        <form
          onSubmit={handleForgotPasswordSubmit}
          style={{ marginBottom: "2rem" }}
        >
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="resetEmail"
              className="form-control"
              required
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-large"
            disabled={isResetting}
          >
            {isResetting ? "Sending..." : "Send Reset Link"}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setError("");
                setResetMessage("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#2b6cb0",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Back to Login
            </button>
          </div>
        </form>
      ) : (
        /* =========================================
           STANDARD LOGIN FORM
           ========================================= */
        <>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label className="form-label mb-0">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2b6cb0",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="form-control mt-xs"
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
                <strong>Looking for a sponsor?</strong> You do not need an
                account! Simply go to the home page to browse and message
                sponsors securely.
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
        </>
      )}
    </div>
  );
}
