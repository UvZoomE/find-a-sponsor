// src/views/ResetPasswordView.jsx
import React, { useState } from "react";
import { Lock, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../config";
import "../css/ResetPasswordView.css"; // Added the CSS import!

export default function ResetPasswordView({ setCurrentView, resetToken }) {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Check if passwords match before bothering the backend
    if (passwords.password !== passwords.confirmPassword) {
      return setError("Passwords do not match");
    }

    // 2. Make sure it's a strong password (at least 6 characters)
    if (passwords.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/resetpassword/${resetToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwords.password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Give them 3 seconds to see the success message, then send to login
        setTimeout(() => {
          setCurrentView("login");
          // Clean up the URL so it doesn't stay on /reset-password/...
          window.history.pushState({}, "", "/");
        }, 3000);
      } else {
        setError(
          data.message ||
            "Failed to reset password. The link may have expired.",
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container reset-password-container">
      <div className="profile-header text-center">
        <h2 className="profile-name mb-sm">Create New Password</h2>
        <p className="text-muted">
          Enter a new strong password for your account.
        </p>
      </div>

      {success ? (
        <div className="reset-success-box">
          <CheckCircle size={64} className="reset-success-icon" />
          <h3 className="reset-success-title">Password Reset Complete!</h3>
          <p className="text-muted mt-md">
            Redirecting you to the login page...
          </p>
        </div>
      ) : (
        <>
          {error && <div className="reset-error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={passwords.password}
                onChange={(e) =>
                  setPasswords({ ...passwords, password: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Lock size={20} /> Save New Password
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}