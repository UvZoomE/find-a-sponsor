// src/views/ListView.jsx
import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar, ChevronLeft } from "lucide-react";
import { calculateYearsSober } from "../utils/helpers";
import { API_BASE_URL } from "../config";
import "../css/ListView.css";

const PROGRAMS = ["All", "AA", "NA", "SA", "SLAA", "OA", "Al-Anon", "CoDA"];

export default function ListView({ setCurrentView, handleSponsorClick }) {
  const [selectedProgram, setSelectedProgram] = useState("All");

  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sponsors`);

        if (!response.ok) {
          throw new Error("Failed to fetch sponsors from the database.");
        }

        const data = await response.json();
        setSponsors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const filteredSponsors = sponsors.filter((sponsor) => {
    if (selectedProgram === "All") return true;
    return sponsor.programs.includes(selectedProgram);
  });

  return (
    <div className="list-view-container">
      <button className="back-btn" onClick={() => setCurrentView("home")}>
        <ChevronLeft size={20} />
        Back to Home
      </button>

      <div className="filters">
        <div className="filters-header">
          <Search size={20} />
          <span>Filter by Fellowship</span>
        </div>
        <div className="program-tags">
          {PROGRAMS.map((program) => (
            <button
              key={program}
              className={`tag ${selectedProgram === program ? "active" : ""}`}
              onClick={() => setSelectedProgram(program)}
            >
              {program}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="no-results">Loading sponsors...</div>
      ) : error ? (
        <div className="no-results" style={{ color: "#e53e3e" }}>
          Error: {error}
        </div>
      ) : (
        <>
          <div className="sponsor-grid">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor._id}
                className="sponsor-card"
                onClick={() => handleSponsorClick(sponsor)}
              >
                <div className="card-header">
                  <div className="card-header-info">
                    <img
                      src={sponsor.avatar}
                      alt={sponsor.name}
                      className="card-avatar"
                    />
                    <div>
                      <div className="sponsor-name">{sponsor.name}</div>
                      <div className="sponsor-programs">
                        {sponsor.programs.map((p) => (
                          <span key={p} className="program-badge">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`status-badge ${
                      sponsor.availability.includes("Taking")
                        ? "status-available"
                        : "status-full"
                    }`}
                  >
                    {sponsor.availability.includes("Taking")
                      ? "Available"
                      : "Full"}
                  </span>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <Calendar size={16} className="detail-icon" />
                    <span>
                      Sober since{" "}
                      {new Date(sponsor.sobrietyDate).getFullYear()} (~
                      {calculateYearsSober(sponsor.sobrietyDate)} years)
                    </span>
                  </div>
                  <div className="detail-row">
                    <MapPin size={16} className="detail-icon" />
                    <span>{sponsor.location}</span>
                  </div>
                </div>

                <div className="card-bio">{sponsor.bio}</div>

                <div className="card-action">
                  <button className="btn btn-outline btn-full">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSponsors.length === 0 && (
            <div className="no-results">
              No sponsors found for {selectedProgram} at this time. Please check
              back later.
            </div>
          )}
        </>
      )}
    </div>
  );
}