// src/views/EditProfileView.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, Trash2, LogOut } from "lucide-react";
import { API_BASE_URL } from "../../backend/utils/config";

const PROGRAMS = ["AA", "NA", "SA", "SLAA", "OA", "Al-Anon", "CoDA"];

export default function EditProfileView({
  setCurrentView,
  currentUser,
  setCurrentUser,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize form with whatever data we currently have in state
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    location: currentUser?.location || "",
    availability: currentUser?.availability || "",
    bio: currentUser?.bio || "",
    programs: currentUser?.programs || [],
    stepExperience: currentUser?.stepExperience || "",
  });

  // If the user's full data wasn't in local storage, fetch it to pre-fill the form
  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sponsors`);
        if (response.ok) {
          const allSponsors = await response.json();
          const myProfile = allSponsors.find((s) => s._id === currentUser._id);
          if (myProfile) {
            setFormData({
              name: myProfile.name || "",
              location: myProfile.location || "",
              availability: myProfile.availability || "",
              bio: myProfile.bio || "",
              programs: myProfile.programs || [],
              stepExperience: myProfile.stepExperience || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to load full profile data");
      }
    };
    fetchFullProfile();
  }, [currentUser._id]);

  const handleCheckboxChange = (program) => {
    const updatedPrograms = formData.programs.includes(program)
      ? formData.programs.filter((p) => p !== program)
      : [...formData.programs, program];
    setFormData({ ...formData, programs: updatedPrograms });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/sponsors/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`, // Send their VIP wristband!
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        // 1. Catch the updated profile data the backend just sent us
        const updatedProfileData = await response.json();

        // 2. Crucial Step: The backend doesn't send the JWT token back on updates,
        // so we need to merge our existing token with the fresh profile data!
        const updatedUser = {
          ...updatedProfileData,
          token: currentUser.token,
        };

        // 3. Update React's state so the UI changes instantly
        if (setCurrentUser) {
          setCurrentUser(updatedUser);
        }

        // 4. Update localStorage so the changes stay if they refresh the page
        localStorage.setItem("mySponsorProfile", JSON.stringify(updatedUser));

        // Show the success message
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("Network error. Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your profile? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/sponsors/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      if (response.ok) {
        // Clear them out of the browser and send them home
        localStorage.removeItem("mySponsorProfile");
        setCurrentUser(null);
        setCurrentView("home");
        window.scrollTo(0, 0);
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      alert("Network error while trying to delete account.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("mySponsorProfile");
    setCurrentUser(null);
    setCurrentView("home");
  };

  return (
    <div className="profile-container" style={{ marginTop: "2rem" }}>
      <button className="back-btn" onClick={() => setCurrentView("home")}>
        <ChevronLeft size={20} />
        Back to Directory
      </button>

      <div
        className="profile-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 className="profile-name mb-sm">Manage Profile</h2>
          <p className="text-muted">
            Update your current availability or edit your details.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="btn btn-outline"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {message && (
        <div
          style={{
            backgroundColor: "#c6f6d5",
            color: "#2f855a",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} style={{ marginBottom: "3rem" }}>
        <div className="form-group">
          <label className="form-label">Name (First Name & Last Initial)</label>
          <input
            type="text"
            className="form-control"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Availability</label>
            <select
              className="form-control"
              required
              value={formData.availability}
              onChange={(e) =>
                setFormData({ ...formData, availability: e.target.value })
              }
            >
              <option value="Taking new sponsees">Taking new sponsees</option>
              <option value="Taking 1 new sponsee">Taking 1 new sponsee</option>
              <option value="Full (Not taking sponsees currently)">
                Full (Not taking sponsees currently)
              </option>
            </select>
          </div>
        </div>

        <div className="form-group mt-lg mb-lg">
          <label className="form-label">Fellowships You Sponsor In</label>
          <div className="checkbox-group">
            {PROGRAMS.map((program) => (
              <label key={program} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.programs.includes(program)}
                  onChange={() => handleCheckboxChange(program)}
                />
                {program}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">About Your Recovery</label>
          <textarea
            className="form-control textarea-large"
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          ></textarea>
        </div>

        <div className="form-group mt-md mb-md">
          <label className="form-label">Experience with the Steps</label>
          <textarea
            className="form-control textarea-large"
            required
            value={formData.stepExperience}
            onChange={(e) =>
              setFormData({ ...formData, stepExperience: e.target.value })
            }
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full btn-large"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save size={20} style={{ marginRight: "8px" }} /> Save Changes
            </>
          )}
        </button>
      </form>

      {/* DANGER ZONE */}
      <div
        style={{
          borderTop: "2px solid #fed7d7",
          paddingTop: "2rem",
          marginTop: "2rem",
        }}
      >
        <h3 style={{ color: "#c53030", marginBottom: "0.5rem" }}>
          Danger Zone
        </h3>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          Permanently remove your profile from the directory. This action cannot
          be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          style={{
            backgroundColor: "transparent",
            color: "#e53e3e",
            border: "2px solid #e53e3e",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <Trash2 size={18} /> Delete My Account
        </button>
      </div>
    </div>
  );
}
