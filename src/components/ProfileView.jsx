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
import "../css/ProfileView.css";
import { API_BASE_URL } from "../../backend/utils/config";

// FIX 1: Added currentUser to the props here!
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

  console.log(selectedSponsor);

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

              {/* FIX 2: Cleaned up the title area so the name only appears once with the pencil */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
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

            {/* FIX 3: Hide the message button if I am looking at my own profile */}
            {!isMyProfile && (
              <button
                className="btn btn-primary"
                disabled={!selectedSponsor.availability.includes("Taking")}
                onClick={() => setShowConnectModal(true)}
              >
                <MessageCircle size={20} />
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
              <Calendar size={18} />
              <strong>Sobriety Date:</strong>{" "}
              {new Date(displayProfile.sobrietyDate).toLocaleDateString()}
            </div>
            <div className="detail-row mb-md">
              <MapPin size={18} />
              <strong>Location Preference:</strong> {displayProfile.location}
            </div>
            <div className="detail-row mb-md">
              <User size={18} />
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

        {/* FIX 3 (Continued): Show a nice Edit prompt at the bottom instead of the message button */}
        {isMyProfile && (
          <div
            className="profile-actions mt-lg"
            style={{
              backgroundColor: "#ebf8ff",
              padding: "1.5rem",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #bee3f8",
            }}
          >
            <h3 style={{ color: "#2b6cb0", marginBottom: "0.5rem" }}>
              This is your public profile
            </h3>
            <p style={{ color: "#4a5568", marginBottom: "1.25rem" }}>
              This is exactly how other users see you on the directory.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                className="btn btn-primary btn-full"
                onClick={() => setCurrentView("editProfile")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Edit2 size={18} style={{ marginRight: "8px" }} />
                Edit Profile & Settings
              </button>

              <button
                className="btn btn-outline btn-full"
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  borderColor: "#2b6cb0",
                  color: "#2b6cb0",
                }}
              >
                <LogOut size={18} style={{ marginRight: "8px" }} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

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
