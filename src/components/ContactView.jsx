// src/views/ContactView.jsx
import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../config";
import "../css/ContactView.css"; // Ensure this path matches your folder structure!

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "General Question",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          issueType: "General Question",
          message: "",
        });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Something went wrong.");
        setStatus("error");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="profile-container contact-container">
      <div className="profile-header text-center">
        <h2 className="profile-name mb-sm">Contact Support</h2>
        <p className="text-muted">
          Report a bug, request a feature, or ask a question.
        </p>
      </div>

      {status === "success" ? (
        <div className="contact-success-box">
          <CheckCircle size={48} className="contact-success-icon" />
          <h3 className="contact-success-title">Message Sent!</h3>
          <p className="contact-success-text">
            Thank you for reaching out. We will get back to you soon.
          </p>
          <button
            className="btn btn-outline mt-md"
            onClick={() => setStatus("idle")}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {status === "error" && (
            <div className="contact-error-box">{errorMessage}</div>
          )}

          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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
            <label className="form-label">What is this regarding?</label>
            <select
              className="form-control"
              value={formData.issueType}
              onChange={(e) =>
                setFormData({ ...formData, issueType: e.target.value })
              }
            >
              <option>General Question</option>
              <option>Report a Bug / Glitch</option>
              <option>Feature Request</option>
              <option>Account Issue</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="5"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-large"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              "Sending..."
            ) : (
              <>
                <Send size={20} className="contact-send-icon" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}