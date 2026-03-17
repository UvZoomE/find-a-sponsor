import React, { useState, useEffect } from "react";
import "../css/App.css"; // Make sure to import the CSS file!

// Components
import Navbar from "./NavBar";
import ContactView from "./ContactView";
import Footer from "./Footer";

// Views
import HomeView from "./HomeView";
import ListView from "./ListView";
import ProfileView from "./ProfileView";
import BecomeSponsorView from "./BecomeSponsorView";
import SafetyView from "./SafetyView";
import LoginView from "./LoginView";
import EditProfileView from "./EditProfileView";
import { API_BASE_URL } from "../config";
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

  // ==========================================
  // EFFECT 1: THE MASTER URL CHECKER
  // (Combines your old routing/verification effects)
  // ==========================================
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Scenario A: User clicked an email Verification Link (e.g., /verify/12345)
    if (path.startsWith("/verify/")) {
      const token = path.split("/verify/")[1];
      fetch(`${API_BASE_URL}/auth/verify/${token}`)
        .then((res) => res.json())
        .then((data) => {
          setAlertBanner({
            type: "success",
            message: "Email verified successfully! You can now log in.",
          });
          setCurrentView("login");
          window.history.replaceState({}, document.title, "/"); // Clean the URL
          setTimeout(() => setAlertBanner(null), 6000);
        })
        .catch((err) => {
          console.error(err);
          setAlertBanner({
            type: "error",
            message: "Verification failed or link expired.",
          });
        });
      return; // Stop checking other URLs
    }

    // Scenario B: User clicked a Password Reset Link (e.g., /reset-password/12345)
    if (path.startsWith("/reset-password/")) {
      const token = path.split("/")[2];
      setResetToken(token);
      setCurrentView("resetPassword");
      return;
    }

    // Scenario C: User landed with query params from a redirect (e.g., ?verified=true)
    const isVerified = params.get("verified");
    const hasError = params.get("error");

    if (isVerified === "true") {
      setAlertBanner({
        type: "success",
        message: "Email verified successfully! Please log in to your account.",
      });
      setCurrentView("login");
      window.history.replaceState({}, document.title, window.location.pathname);
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
  }, []); // Only runs once on app load

  // ==========================================
  // EFFECT 2: THE ZOMBIE KILLER (Session Validation)
  // ==========================================
  useEffect(() => {
    const validateSession = async () => {
      if (!currentUser || !currentUser.token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (response.status === 401) {
          console.log(
            "Session invalid or user deleted. Clearing local storage.",
          );
          localStorage.removeItem("mySponsorProfile");
          setCurrentUser(null);
          setCurrentView("home");
        }
      } catch (error) {
        console.error("Failed to validate session:", error);
      }
    };

    validateSession();
  }, []);

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
        {currentView === "contact" && <ContactView />}
      </main>

      <Footer setCurrentView={setCurrentView} />
      <Analytics />
    </div>
  );
}
