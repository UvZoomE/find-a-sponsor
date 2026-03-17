// src/views/BecomeSponsorView.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  RefreshCw,
  Upload,
  AlertCircle,
} from "lucide-react"; 
import { API_BASE_URL } from "../config";
import "../css/BecomeSponsorView.css";

const PROGRAMS = ["AA", "NA", "SA", "SLAA", "OA", "Al-Anon", "CoDA"];

const generateAvatarBatch = () => {
  return Array.from({ length: 10 }, () => {
    const seed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  });
};

export default function BecomeSponsorView({ setCurrentView, setCurrentUser }) {
  const [becomeSponsorSuccess, setBecomeSponsorSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [avatarOptions, setAvatarOptions] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const initialBatch = generateAvatarBatch();
    setAvatarOptions(initialBatch);
    setSelectedAvatar(initialBatch[0]);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    programs: [],
    sobrietyDate: "",
    location: "",
    availability: "",
    bio: "",
    stepExperience: "",
  });

  const loadMoreAvatars = () => {
    const newBatch = generateAvatarBatch();
    setAvatarOptions(newBatch);
    if (selectedAvatar.includes("dicebear")) {
      setSelectedAvatar(newBatch[0]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setSelectedAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (program) => {
    const updatedPrograms = formData.programs.includes(program)
      ? formData.programs.filter((p) => p !== program)
      : [...formData.programs, program];
    setFormData({ ...formData, programs: updatedPrograms });
  };

  const handleBecomeSponsorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const payload = { ...formData, avatar: selectedAvatar };

    try {
      const response = await fetch(`${API_BASE_URL}/sponsors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setBecomeSponsorSuccess(true);
      } else {
        let errData;
        try {
          errData = await response.json();
        } catch (parseError) {
          errData = { message: "An account with this email already exists." };
        }
        setError(errData.message || "Failed to submit profile.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <button
        className="back-btn"
        onClick={() => {
          setCurrentView("home");
          if (becomeSponsorSuccess) {
            setBecomeSponsorSuccess(false);
          }
        }}
      >
        <ChevronLeft size={20} />
        Back to Home
      </button>

      <div className="profile-header">
        <h2 className="profile-name mb-sm">Become a Sponsor</h2>
        <p className="text-muted">
          Thank you for your willingness to carry the message. Please fill out
          the form below.
        </p>
      </div>

      {becomeSponsorSuccess ? (
        <div className="success-view">
          <h2 className="success-title">Profile Created!</h2>
          <p className="success-message-text text-muted">
            Before you can log in, you must verify your email address.
            <br />
            <br />
            <strong>
              Please check your inbox (and spam folder) for a verification link.
            </strong>
          </p>
        </div>
      ) : (
        <>
          {/* Replaced inline styles with .error-banner class */}
          {error && <div className="error-banner">{error}</div>}
          
          <form onSubmit={handleBecomeSponsorSubmit}>
            <div className="sponsor-alert-banner">
              <AlertCircle size={24} className="alert-icon" />
              <div>
                <strong>Looking for a sponsor?</strong>
                <p>
                  You do not need to create an account to browse the directory
                  or message sponsors! This form is <em>strictly</em> for
                  individuals who are ready to sponsor others.
                </p>
              </div>
            </div>

            <div className="avatar-selection-container">
              {/* Replaced inline styles with CSS classes */}
              <div className="avatar-preview-wrapper">
                <img
                  src={selectedAvatar}
                  alt="Selected Avatar"
                  className="avatar-preview-img"
                />
              </div>

              <div className="avatar-info-header">
                <div>
                  <label className="form-label">
                    Choose Your Profile Picture
                  </label>
                  <p className="form-help-text avatar-help-text">
                    Select an illustration below to remain anonymous, or upload
                    a photo of yourself.
                  </p>
                </div>

                <div className="avatar-action-buttons">
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload size={16} />
                    Upload Photo
                  </button>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/jpeg, image/png, image/webp"
                  />

                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={loadMoreAvatars}
                  >
                    <RefreshCw size={16} />
                    New Icons
                  </button>
                </div>
              </div>

              <div className="avatar-grid">
                {avatarOptions.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Avatar Option ${index + 1}`}
                    className={`avatar-option ${selectedAvatar === url ? "selected" : ""}`}
                    onClick={() => setSelectedAvatar(url)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Name (First Name & Last Initial)
              </label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Taylor M."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Email Address (Kept Private)
                </label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="To receive sponsee messages & login"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Create a Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="To manage your profile later"
                  minLength="6"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group mt-lg mb-lg">
              <label className="form-label">Fellowships You Sponsor In</label>
              <div className="checkbox-group">
                {PROGRAMS.map((program) => (
                  <label key={program} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.programs.includes(program)}
                      onChange={() => handleCheckboxChange(program)}
                    />
                    {program}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sobriety / Clean Date</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.sobrietyDate}
                  onChange={(e) =>
                    setFormData({ ...formData, sobrietyDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Austin, TX or Virtual"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Availability</label>
              <select
                className="form-control"
                required
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
              >
                <option value="">Select availability...</option>
                <option value="Taking new sponsees">Taking new sponsees</option>
                <option value="Taking 1 new sponsee">
                  Taking 1 new sponsee
                </option>
                <option value="Full (Not taking sponsees currently)">
                  Full (Not taking sponsees currently)
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                About Your Recovery & Sponsorship Style
              </label>
              <textarea
                className="form-control textarea-large"
                required
                placeholder="Share your journey and expectations..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Experience with the Steps</label>
              <textarea
                className="form-control textarea-medium"
                required
                placeholder="Describe your experience working the steps..."
                value={formData.stepExperience}
                onChange={(e) =>
                  setFormData({ ...formData, stepExperience: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-group mb-lg">
              <label className="checkbox-label checkbox-label-align-top">
                <input
                  type="checkbox"
                  required
                  className="checkbox-top-margin"
                />
                <span>
                  <strong>I agree</strong> to the storage of my data for the
                  purpose of sponsorship matching.
                </span>
              </label>
            </div>

            {/* Replaced secondary inline styles with .error-banner class */}
            {error && <div className="error-banner">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-full btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Profile & Create Account"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}