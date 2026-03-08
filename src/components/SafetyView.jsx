import React from "react";
import { Shield, Heart, Search, ChevronLeft } from "lucide-react";
import "../css/SafetyView.css";

export default function SafetyView({ setCurrentView }) {
  return (
    <div className="profile-container">
      <button className="back-btn" onClick={() => setCurrentView("home")}>
        <ChevronLeft size={20} />
        Back to Home
      </button>

      <div className="profile-header">
        <h2 className="profile-name mb-sm">Safety & Anonymity</h2>
        <p className="text-muted">
          Our top priority is providing a secure, anonymous environment to help
          you find the support you need in your recovery journey.
        </p>
      </div>

      <div className="profile-section">
        <h3>
          <Shield size={20} color="#2b6cb0" /> Protecting Your Anonymity
        </h3>
        <p className="profile-bio-text mb-md">
          In accordance with Tradition 11 (
          <em>
            "Our public relations policy is based on attraction rather than
            promotion; we need always maintain personal anonymity at the level
            of press, radio, and films"
          </em>
          ) and Tradition 12 (
          <em>"Anonymity is the spiritual foundation of all our traditions"</em>
          ), this platform takes the following steps:
        </p>
        <ul className="safety-list">
          <li>
            <strong>Names:</strong> We only display First Names and Last
            Initials.
          </li>
          <li>
            <strong>Contact Info:</strong> Your email address is never displayed
            publicly. All initial contact is routed securely through our system.
          </li>
          <li>
            <strong>Profile Pictures:</strong> We use generated avatars rather
            than personal photos to prevent public identification.
          </li>
        </ul>
      </div>

      <div className="profile-section">
        <h3>
          <Heart size={20} color="#2b6cb0" /> Personal Boundaries & Safety
        </h3>
        <p className="profile-bio-text mb-md">
          A sponsor is a guide through the 12 steps, not a therapist, banker, or
          romantic partner. For your physical and emotional safety, please keep
          the following in mind:
        </p>
        <ul className="safety-list">
          <li>
            <strong>"13th Stepping":</strong> Romantic or sexual advances toward
            newcomers are inappropriate and harmful. A healthy sponsor will
            respect your boundaries.
          </li>
          <li>
            <strong>Financial Requests:</strong> You should never be asked to
            pay for sponsorship, nor should a sponsor ask to borrow money.
          </li>
          <li>
            <strong>Control:</strong> A sponsor shares their experience,
            strength, and hope. They should not attempt to control your personal
            life, medical decisions, or relationships.
          </li>
        </ul>
      </div>

      <div className="profile-section">
        <h3>
          <Search size={20} color="#2b6cb0" /> Data Privacy
        </h3>
        <p className="profile-bio-text">
          If you register as a sponsor, your provided information is stored
          securely in our database solely for the purpose of matching you with
          potential sponsees. You maintain full control over your data and can
          delete your profile and all associated information at any time through
          your account settings. We do not sell or share your data with third
          parties.
        </p>
      </div>

      <div className="disclaimer mt-lg">
        If you encounter a user violating these safety guidelines, please stop
        communicating with them immediately and report the behavior to our
        moderation team.
      </div>
    </div>
  );
}
