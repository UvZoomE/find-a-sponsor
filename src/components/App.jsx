import React, { useState } from "react";
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

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  const handleSponsorClick = (sponsor) => {
    setSelectedSponsor(sponsor);
    setCurrentView("profile");
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <Navbar setCurrentView={setCurrentView} />

      <main className="main-content">
        {currentView === "home" && <HomeView setCurrentView={setCurrentView} />}

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
          />
        )}

        {currentView === "become-sponsor" && (
          <BecomeSponsorView setCurrentView={setCurrentView} />
        )}

        {currentView === "safety" && (
          <SafetyView setCurrentView={setCurrentView} />
        )}
      </main>

      <Footer />
    </div>
  );
}
