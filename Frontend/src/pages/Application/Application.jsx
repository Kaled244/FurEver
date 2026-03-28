import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Search, CheckCircle, Info } from "lucide-react";
import { API_ENDPOINTS } from '../../config/apiConfig.js';
import "./Application.css";

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState(null);

  const filters = [
    "PENDING",
    "REJECTED",
    "APPROVED",
    "READY_TO_CLAIM",
    "ADOPTED",
  ];

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        // eslint-disable-next-line no-undef
        API_ENDPOINTS.APPLICATIONS_MY_SUBMISSIONS,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = response.data.data || response.data;
      setApplications(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (appId, petName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        // eslint-disable-next-line no-undef
        API_ENDPOINTS.APPLICATIONS_UPDATE_STATUS(appId),
        { status: "READY_TO_CLAIM" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: "READY_TO_CLAIM" } : app,
        ),
      );
      setSelectedApp(null);
      alert(`${petName} is ready for pick-up!`);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error updating status. Please check backend.");
    }
  };

  const filteredApps = applications.filter((app) =>
    activeFilter === "ALL" ? true : app.status === activeFilter,
  );

  return (
    <div className="ap-page-wrapper">
      <div className="ap-main-content">
        <header className="ap-page-header">
          <div className="ap-title-section animate-slide-up">
            <h1 className="ap-main-title">My Application Request</h1>
            <p className="ap-main-subtitle">
              Track your requests and get ready to welcome your new family
              member.
            </p>
          </div>

          <div className="ap-filter-row animate-slide-up">
            <button
              className={`ap-filter-pill ${activeFilter === "ALL" ? "ap-active" : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              ALL
            </button>
            {filters.map((f) => (
              <button
                key={f}
                className={`ap-filter-pill ${activeFilter === f ? "ap-active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </header>

        <div className="ap-application-grid animate-slide-up">
          {loading ? (
            <div className="ap-state-msg">Grooming the data...</div>
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className={`ap-card-v2 status-${app.status.toLowerCase()}`}
              >
                <div className="ap-card-v2-img-wrapper">
                  <img
                    src={
                      app.pet?.pImage?.startsWith("http")
                        ? app.pet.pImage
                        : app.pet?.pImage
                          // eslint-disable-next-line no-undef
                          ? API_ENDPOINTS.UPLOADS(app.pet.pImage)
                          : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"
                    }
                    alt={app.pet?.pName || "Pet"}
                    className="ap-card-v2-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400";
                    }}
                  />
                  {/* Corrected Badge Line */}
                  <div className="ap-card-v2-status-badge species">
                    {app.pet?.pSpecies || "Pet"}
                  </div>
                  <div className="ap-card-v2-id-badge">
                    {app.status.replace("_", " ")}
                  </div>
                </div>

                <div className="ap-card-v2-info">
                  <div className="ap-card-v2-header">
                    <h3 className="ap-card-v2-pet-name">
                      {app.pet?.pName || "Unnamed Pet"}
                    </h3>
                    <span className="ap-card-v2-date">
                      {new Date(app.appDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="ap-card-v2-breed">
                    #{String(app.id).padStart(4, "0")}
                  </p>
                  <button
                    className="ap-card-v2-details-btn"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Info size={16} style={{ marginRight: "8px" }} />
                    View Application
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="ap-empty-view animate-slide-up">
              <h3>No requests found</h3>
              <p>Looks like you haven't submitted any applications yet.</p>
              <button
                className="ap-browse-btn"
                onClick={() => (window.location.href = "/adopt")}
              >
                Browse Pets
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedApp &&
        createPortal(
          <div
            className="ap-modal-overlay"
            onClick={() => setSelectedApp(null)}
          >
            <div className="ap-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="ap-modal-close"
                onClick={() => setSelectedApp(null)}
              >
                &times;
              </button>

              <div className="ap-modal-header">
                <span className="ap-modal-badge">
                  Application #{String(selectedApp.id).padStart(4, "0")}
                </span>
                <h2 className="ap-modal-title">
                  Review for {selectedApp.pet?.pName}
                </h2>
              </div>

              <div className="ap-modal-body">
                {/* Info Grid */}
                <div className="ap-info-grid">
                  <div className="ap-info-item">
                    <label>Proposed Name</label>
                    <p>{selectedApp.newPetName || selectedApp.pet?.pName}</p>
                  </div>
                  <div className="ap-info-item">
                    <label>Contact Number</label>
                    <p>{selectedApp.contactNumber}</p>
                  </div>
                  <div className="ap-info-item">
                    <label>Home Environment</label>
                    <p>{selectedApp.homeType}</p>
                  </div>
                  <div className="ap-info-item">
                    <label>Experience</label>
                    <p>{selectedApp.experience}</p>
                  </div>
                </div>

                {/* Long Answer Section */}
                <div className="ap-answer-section">
                  <label>Why do you want to adopt?</label>
                  <div className="ap-answer-box">
                    {selectedApp.answers || "No detailed response provided."}
                  </div>
                </div>
              </div>

              {selectedApp.status === "APPROVED" && (
                <div className="ap-modal-footer">
                  <button
                    className="ap-btn-primary"
                    onClick={() =>
                      handleClaim(selectedApp.id, selectedApp.pet?.pName)
                    }
                  >
                    <CheckCircle size={18} /> Confirm Readiness to Claim
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default UserApplications;
