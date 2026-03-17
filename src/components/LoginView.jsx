// src/views/LoginView.jsx
import React, { useState } from "react";
import { ChevronLeft, LogIn, UserPlus, Info } from "lucide-react";
import { API_BASE_URL } from "../config";
import "../css/LoginView.css"; // Ensure this matches your folder structure!

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
    <div className="profile-container login-container">
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

      {error && <div className="login-banner login-error">{error}</div>}

      {resetMessage && isForgotMode && (
        <div className="login-banner login-success">{resetMessage}</div>
      )}

      {isForgotMode ? (
        /* =========================================
           FORGOT PASSWORD FORM
           ========================================= */
        <form onSubmit={handleForgotPasswordSubmit} className="login-form">
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

          <div className="text-center-wrapper">
            <button
              type="button"
              className="text-link-btn"
              onClick={() => {
                setIsForgotMode(false);
                setError("");
                setResetMessage("");
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
          <form onSubmit={handleLoginSubmit} className="login-form">
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
              <div className="password-header">
                <label className="form-label mb-0">Password</label>
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError("");
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
                  <LogIn size={20} /> Log In
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
              className="btn btn-outline btn-full btn-large btn-create-account"
              onClick={() => setCurrentView("becomeSponsor")}
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