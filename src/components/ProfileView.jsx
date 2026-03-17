// src/views/ProfileView.jsx
import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  User,
  Shield,
  MessageCircle,
  ChevronLeft,
  X,
  Heart,
  Edit2,
  LogOut,
} from "lucide-react";
import { API_BASE_URL } from "../config";
import "../css/ProfileView.css"; // Make sure this matches your folder structure!

export default function ProfileView({
  setCurrentView,
  selectedSponsor,
  currentUser,
  setCurrentUser,
}) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const isMyProfile = currentUser && currentUser._id === selectedSponsor._id;

  const displayProfile = isMyProfile ? currentUser : selectedSponsor;

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const senderName = e.target.senderName.value;
    const senderEmail = e.target.senderEmail.value;
    const message = e.target.message.value;

    const payload = {
      sponsorId: selectedSponsor._id,
      senderName,
      senderEmail,
      message,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessageSent(true);
        setTimeout(() => {
          setShowConnectModal(false);
          setMessageSent(false);
        }, 3000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Make sure your backend is running.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("mySponsorProfile");
    setCurrentUser(null);
    setCurrentView("list");
    window.scrollTo(0, 0);
  };

  if (!selectedSponsor) return null;

  return (
    <>
      <div className="profile-container">
        <button className="back-btn" onClick={() => setCurrentView("list")}>
          <ChevronLeft size={20} />
          Back to search
        </button>

        <div className="profile-header">
          <div className="profile-title-area">
            <div className="profile-title-wrapper">
              <img
                src={displayProfile.avatar}
                alt={displayProfile.name}
                className="profile-avatar"
              />

              <div>
                <div className="profile-name-group">
                  <h2 className="profile-name m-0">{displayProfile.name}</h2>
                </div>

                <div className="sponsor-programs mt-sm">
                  {displayProfile.programs?.map((p) => (
                    <span key={p} className="program-badge program-badge-large">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {!isMyProfile && (
              <button
                className="btn btn-primary"
                disabled={!selectedSponsor.availability.includes("Taking")}
                onClick={() => setShowConnectModal(true)}
              >
                <MessageCircle size={20} className="icon-mr" />
                Message {selectedSponsor.name.split(" ")[0]}
              </button>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>
            <Shield size={20} color="#2b6cb0" /> Recovery Details
          </h3>
          <div className="card-details details-large">
            <div className="detail-row mb-md">
              <Calendar size={18} className="icon-shrink" />
              <strong>Sobriety Date:</strong>{" "}
              {new Date(displayProfile.sobrietyDate).toLocaleDateString()}
            </div>
            <div className="detail-row mb-md">
              <MapPin size={18} className="icon-shrink" />
              <strong>Location Preference:</strong> {displayProfile.location}
            </div>
            <div className="detail-row mb-md">
              <User size={18} className="icon-shrink" />
              <strong>Availability:</strong> {displayProfile.availability}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>
            <Heart size={20} color="#2b6cb0" /> About My Recovery
          </h3>
          <p className="profile-bio-text">{displayProfile.bio}</p>
        </div>

        <div className="profile-section">
          <h3>Experience with the Steps</h3>
          <p className="profile-bio-text">{displayProfile.stepExperience}</p>
        </div>

        {/* --- OWNER ACTIONS --- */}
        {isMyProfile && (
          <div className="profile-owner-banner">
            <h3 className="owner-banner-title">This is your public profile</h3>
            <p className="owner-banner-text">
              This is exactly how other users see you on the directory.
            </p>

            <div className="owner-action-group">
              <button
                className="btn btn-primary btn-full btn-edit"
                onClick={() => setCurrentView("editProfile")}
              >
                <Edit2 size={18} className="icon-mr" />
                Edit Profile & Settings
              </button>

              <button
                className="btn btn-outline btn-full btn-signout"
                onClick={handleSignOut}
              >
                <LogOut size={18} className="icon-mr" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- CONNECT MODAL --- */}
      {showConnectModal && !isMyProfile && (
        <div
          className="modal-overlay"
          onClick={() => setShowConnectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Contact {selectedSponsor.name}</h3>
              <button
                className="close-btn"
                onClick={() => setShowConnectModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            {messageSent ? (
              <div className="modal-success">
                <Shield size={48} className="modal-success-icon" />
                <h4>Message Sent Securely</h4>
                <p className="modal-success-text">
                  {selectedSponsor.name} has been notified and will reply to the
                  email you provided.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="form-group">
                  <label className="form-label">
                    Your First Name & Last Initial
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    className="form-control"
                    required
                    placeholder="e.g. John D."
                    defaultValue={currentUser ? currentUser.name : ""}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Your Email (Kept private)
                  </label>
                  <input
                    type="email"
                    name="senderEmail"
                    className="form-control"
                    required
                    placeholder="you@example.com"
                    defaultValue={currentUser ? currentUser.email : ""}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    className="form-control textarea-large"
                    required
                    placeholder="Hi, I'm looking for a sponsor..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-large"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}