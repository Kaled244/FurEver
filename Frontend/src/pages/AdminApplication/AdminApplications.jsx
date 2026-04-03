import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { NotificationContext } from "../../components/Notification/NotificationContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  PawPrint,
  Eye,
  X,
  PackageCheck,
  Heart, // Added for the final step
} from "lucide-react";
import "./AdminApplications.css";

const AdminApplications = () => {
  const showNotification = useContext(NotificationContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        // eslint-disable-next-line no-undef
        API_ENDPOINTS.APPLICATIONS_ALL,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const appData = response.data.data || [];
      const sortedApps = appData.sort((a, b) => b.id - a.id);
      setApplications(sortedApps);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const statusLabels = {
      APPROVED: "APPROVE",
      REJECTED: "REJECT",
      READY_TO_CLAIM: "mark as READY FOR PICKUP",
      ADOPTED: "mark as OFFICIALLY ADOPTED" // Added label
    };

    const confirmAction = window.confirm(
      `Are you sure you want to ${statusLabels[newStatus] || newStatus} this application?`
    );
    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        // eslint-disable-next-line no-undef
        API_ENDPOINTS.APPLICATIONS_UPDATE_STATUS(id),
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );

      setSelectedApp(null);
      showNotification(`Success! Application is now ${newStatus}.`, "success");
    } catch (error) {
      console.error("❌ Status update failed:", error);
      showNotification("Failed to update status. Check backend console.", "error");
    }
  };

  const filteredApps = applications.filter((app) => {
    if (activeTab === "ALL") return true;
    return app.status === activeTab;
  });

  if (loading) return <div className="adm-loader">Grooming the data...</div>;

  return (
    <div className="admin-inbox-page">
      <div className="inbox-container">
        <header className="inbox-header">
          <div className="header-text">
            <h1>Application Inbox</h1>
            <p>Review and manage incoming adoption requests.</p>
          </div>
          <div className="stats-pill">
            <span>
              {applications.filter((a) => a.status === "PENDING").length} Action Required
            </span>
          </div>
        </header>

        <div className="inbox-tabs">
          {["PENDING", "APPROVED", "REJECTED", "READY_TO_CLAIM", "ADOPTED", "ALL"].map(
            (tab) => (
              <button
                key={tab}
                className={`inbox-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "PENDING" && <Clock size={16} />}
                {tab === "APPROVED" && <CheckCircle size={16} />}
                {tab === "READY_TO_CLAIM" && <PawPrint size={16} />}
                {tab === "ADOPTED" && <Heart size={16} />}
                {tab === "REJECTED" && <XCircle size={16} />}
                {tab.replace(/_/g, " ")}
              </button>
            )
          )}
        </div>

        <div className="apps-grid">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className={`app-card-premium status-${app.status.toLowerCase()}`}
              >
                <div className="card-top">
                  <span className="app-tag">APP #{String(app.id).padStart(4, "0")}</span>
                  <div className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status.replace(/_/g, " ")}
                  </div>
                </div>

                <div className="card-main">
                  <div className="app-entities">
                    <div className="entity-block">
                      <User size={16} className="entity-icon" />
                      <div>
                        <label>Applicant</label>
                        <p>{app.user?.username || "Guest User"}</p>
                      </div>
                    </div>
                    <div className="entity-block">
                      <PawPrint size={16} className="entity-icon" />
                      <div>
                        <label>Target Pet</label>
                        <p>{app.pet?.pName || "The Pet"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer-actions">
                  <button className="btn-view-details" onClick={() => setSelectedApp(app)}>
                    <Eye size={18} /> Review Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-inbox">
              <p>No {activeTab !== "ALL" ? activeTab.toLowerCase().replace(/_/g, " ") : ""} applications found.</p>
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <div className="adm-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="adm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Application #{String(selectedApp.id).padStart(4, "0")}</h2>
              <button className="adm-modal-close" onClick={() => setSelectedApp(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="adm-modal-body">
              <div className="modal-info-split">
                <div>
                  <label>Applicant Name</label>
                  <p>{selectedApp.user?.username || "Guest User"}</p>
                </div>
                <div>
                  <label>Pet Requested</label>
                  <p>{selectedApp.pet?.pName || "The Pet"}</p>
                </div>
              </div>
              <div className="modal-info-full">
                <label>Applicant's Pitch</label>
                <div className="reason-bubble-large">"{selectedApp.answers}"</div>
              </div>
            </div>

            <div className="adm-modal-actions">
              {/* Step 1: PENDING */}
              {selectedApp.status === "PENDING" && (
                <>
                  <button className="btn-approve-admin" onClick={() => handleStatusUpdate(selectedApp.id, "APPROVED")}>
                    <CheckCircle size={18} /> Approve Adoption
                  </button>
                  <button className="btn-reject-admin" onClick={() => handleStatusUpdate(selectedApp.id, "REJECTED")}>
                    <XCircle size={18} /> Reject
                  </button>
                </>
              )}

              {/* Step 2: APPROVED */}
              {selectedApp.status === "APPROVED" && (
                <button className="btn-claim-admin" onClick={() => handleStatusUpdate(selectedApp.id, "READY_TO_CLAIM")}>
                  <PawPrint size={18} /> Mark as Ready to Claim
                </button>
              )}

              {/* Step 3: READY_TO_CLAIM -> ADOPTED */}
              {selectedApp.status === "READY_TO_CLAIM" && (
                <button className="btn-final-adopted" onClick={() => handleStatusUpdate(selectedApp.id, "ADOPTED")}>
                  <Heart size={18} /> Mark as Adopted
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;