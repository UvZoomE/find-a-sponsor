import React, { useState, useEffect } from "react";
import "../css/App.css"; // Make sure to import the CSS file!

// Components
import Navbar from "./NavBar";
import Footer from "./Footer";

// Views
import HomeView from "./HomeView";
import ListView from "./ListView";
import ProfileView from "./ProfileView";
import BecomeSponsorView from "./BecomeSponsorView";
import SafetyView from "./SafetyView";
import LoginView from "./LoginView";
import EditProfileView from "./EditProfileView";
import { API_BASE_URL } from "../../backend/utils/config";
import ResetPasswordView from "./ResetPasswordView";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedProfile = localStorage.getItem("mySponsorProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  // 1. ADD THIS NEW STATE: To hold our banner message
  const [alertBanner, setAlertBanner] = useState(null);

  // 2. ADD THIS EFFECT: It checks the URL for the verification flags
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isVerified = params.get("verified");
    const hasError = params.get("error");

    if (isVerified === "true") {
      setAlertBanner({
        type: "success",
        message: "Email verified successfully! Please log in to your account.",
      });
      setCurrentView("login"); // Send them straight to the login page!

      // Clean up the URL so the '?verified=true' disappears
      window.history.replaceState({}, document.title, window.location.pathname);

      // Optional: Automatically hide the banner after 6 seconds
      setTimeout(() => setAlertBanner(null), 6000);
    } else if (hasError === "invalid_token") {
      setAlertBanner({
        type: "error",
        message: "This verification link is invalid or has already been used.",
      });
      setCurrentView("login");
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setAlertBanner(null), 6000);
    }
  }, []);

  useEffect(() => {
    const validateSession = async () => {
      // If there's no user saved in localStorage, we don't need to check anything!
      if (!currentUser || !currentUser.token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        // 🔴 THE ZOMBIE KILLER
        if (response.status === 401) {
          console.log(
            "Session invalid or user deleted. Clearing local storage.",
          );
          localStorage.removeItem("mySponsorProfile");
          setCurrentUser(null);
          setCurrentView("home");
        }
        // 🟢 (Optional Bonus): If response.ok, you could theoretically use the
        // fresh data from the backend to silently update the user's profile in the background!
      } catch (error) {
        console.error("Failed to validate session:", error);
      }
    };

    validateSession();
  }, []);

  // Catch the Forgot Password email link on page load
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      // Extract the token from the URL (e.g., "/reset-password/abc123xyz" -> "abc123xyz")
      const token = path.split("/")[2];
      setResetToken(token);
      setCurrentView("resetPassword");
    }
  }, []);

  const handleSponsorClick = (sponsor) => {
    setSelectedSponsor(sponsor);
    setCurrentView("profile");
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <Navbar
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setSelectedSponsor={setSelectedSponsor}
      />

      {alertBanner && (
        <div
          style={{
            backgroundColor:
              alertBanner.type === "success" ? "#c6f6d5" : "#fed7d7",
            color: alertBanner.type === "success" ? "#2f855a" : "#c53030",
            padding: "1rem",
            textAlign: "center",
            fontWeight: "bold",
            borderBottom: `2px solid ${alertBanner.type === "success" ? "#9ae6b4" : "#fc8181"}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {alertBanner.message}
        </div>
      )}

      <main className="main-content">
        {currentView === "home" && (
          <HomeView setCurrentView={setCurrentView} currentUser={currentUser} />
        )}

        {currentView === "list" && (
          <ListView
            setCurrentView={setCurrentView}
            handleSponsorClick={handleSponsorClick}
          />
        )}

        {currentView === "profile" && selectedSponsor && (
          <ProfileView
            setCurrentView={setCurrentView}
            selectedSponsor={selectedSponsor}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}

        {currentView === "becomeSponsor" && (
          <BecomeSponsorView
            setCurrentView={setCurrentView}
            setCurrentUser={setCurrentUser}
          />
        )}

        {currentView === "login" && (
          <LoginView
            setCurrentView={setCurrentView}
            setCurrentUser={setCurrentUser}
          />
        )}

        {currentView === "resetPassword" && (
          <ResetPasswordView
            setCurrentView={setCurrentView}
            resetToken={resetToken}
          />
        )}

        {currentView === "editProfile" && (
          <EditProfileView
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}

        {currentView === "safety" && (
          <SafetyView setCurrentView={setCurrentView} />
        )}
      </main>

      <Footer setCurrentView={setCurrentView} />
      <Analytics />
    </div>
  );
}
