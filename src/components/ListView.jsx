import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar, ChevronLeft } from "lucide-react";
import { calculateYearsSober } from "../utils/helpers";
import "../css/ListView.css";
import { API_BASE_URL } from "../../backend/utils/config";

// If you haven't exported PROGRAMS from a data file, you can define it here.
// We keep this static since it represents the fixed filter categories.
const PROGRAMS = ["All", "AA", "NA", "SA", "SLAA", "OA", "Al-Anon", "CoDA"];

export default function ListView({ setCurrentView, handleSponsorClick }) {
  const [selectedProgram, setSelectedProgram] = useState("All");

  // New state variables for database fetching
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend when the component mounts
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // Adjust this URL if your backend is running on a different port or hosted elsewhere
        const response = await fetch(API_BASE_URL);

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
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filter against the newly fetched 'sponsors' state instead of MOCK_SPONSORS
  const filteredSponsors = sponsors.filter((sponsor) => {
    if (selectedProgram === "All") return true;
    return sponsor.programs.includes(selectedProgram);
  });

  return (
    <div>
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

      {/* Show Loading or Error states before rendering the grid */}
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
                key={sponsor._id} // Updated from sponsor.id to sponsor._id for MongoDB
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
                    <Calendar size={16} />
                    <span>
                      Sober since {new Date(sponsor.sobrietyDate).getFullYear()}{" "}
                      (~
                      {calculateYearsSober(sponsor.sobrietyDate)} years)
                    </span>
                  </div>
                  <div className="detail-row">
                    <MapPin size={16} />
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
