import React, { useState, useEffect, useRef } from "react";
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
  
  // Safe initialization of local storage to prevent JSON parsing crashes
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("mySponsorProfile");
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (error) {
      console.error("Corrupted local storage data. Clearing session.");
      localStorage.removeItem("mySponsorProfile");
      return null;
    }
  });

  const [alertBanner, setAlertBanner] = useState(null);

  // 1. ADD THE GATEKEEPER REF
  const hasFetchedVerify = useRef(false);

  // ==========================================
  // EFFECT 1: THE MASTER URL CHECKER
  // ==========================================
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith("/verify/")) {
      // 2. THE STRICT MODE SHIELD: If this already ran, stop immediately!
      if (hasFetchedVerify.current) return;
      hasFetchedVerify.current = true;

      const token = path.split("/verify/")[1];

      fetch(`${API_BASE_URL}/auth/verify/${token}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(
              errorData.message || `Server responded with status ${res.status}`,
            );
          }
          return res.json();
        })
        .then((data) => {
          setAlertBanner({
            type: "success",
            message: "Email verified successfully! You can now log in.",
          });
          setCurrentView("login");
          window.history.replaceState({}, document.title, "/"); 
          setTimeout(() => setAlertBanner(null), 6000);
        })
        .catch((err) => {
          console.error("Full Verification Error:", err);
          setAlertBanner({
            type: "error",
            message: `Error: ${err.message}`, 
          });
        });
      return; 
    }

    if (path.startsWith("/reset-password/")) {
      const token = path.split("/")[2];
      setResetToken(token);
      setCurrentView("resetPassword");
      return;
    }

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
  }, []);

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

      {/* Cleaned up the inline styles to use CSS classes */}
      {alertBanner && (
        <div className={`alert-banner alert-${alertBanner.type}`}>
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