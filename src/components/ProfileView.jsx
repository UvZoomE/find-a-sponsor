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
} from "lucide-react";
import "../css/ProfileView.css";

export default function ProfileView({ setCurrentView, selectedSponsor }) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Grab the values directly from the form event
    const senderName = e.target.senderName.value;
    const senderEmail = e.target.senderEmail.value;
    const message = e.target.message.value;

    const payload = {
      sponsorId: selectedSponsor._id, // Sending the MongoDB ID, NOT their email
      senderName,
      senderEmail,
      message,
    };

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
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
                src={selectedSponsor.avatar}
                alt={selectedSponsor.name}
                className="profile-avatar"
              />
              <div>
                <h2 className="profile-name">{selectedSponsor.name}</h2>
                <div className="sponsor-programs mt-sm">
                  {selectedSponsor.programs.map((p) => (
                    <span key={p} className="program-badge program-badge-large">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              disabled={!selectedSponsor.availability.includes("Taking")}
              onClick={() => setShowConnectModal(true)}
            >
              <MessageCircle size={20} />
              Message {selectedSponsor.name.split(" ")[0]}
            </button>
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
              {new Date(selectedSponsor.sobrietyDate).toLocaleDateString()}
            </div>
            <div className="detail-row mb-md">
              <MapPin size={18} />
              <strong>Location Preference:</strong> {selectedSponsor.location}
            </div>
            <div className="detail-row mb-md">
              <User size={18} />
              <strong>Availability:</strong> {selectedSponsor.availability}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>
            <Heart size={20} color="#2b6cb0" /> About My Recovery
          </h3>
          <p className="profile-bio-text">{selectedSponsor.bio}</p>
        </div>

        <div className="profile-section">
          <h3>Experience with the Steps</h3>
          <p className="profile-bio-text">{selectedSponsor.stepExperience}</p>
        </div>
      </div>

      {showConnectModal && (
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
