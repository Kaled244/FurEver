import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminApplications.css';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/applications/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sorting by most recent first
      const sortedApps = response.data.sort((a, b) => b.id - a.id);
      setApplications(sortedApps);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`);
    if (!confirmAction) return;

    try {
      const token = localStorage.getItem('token');
      // Backend expects raw String for status
      await axios.patch(`http://localhost:8080/api/applications/${id}/status`, newStatus, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      
      // Update the local list instantly
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      
    } catch (error) {
      console.error("❌ Status update failed:", error);
      alert("Error updating status. Check console.");
    }
  };

  if (loading) return <div className="admin-loader">Grooming the data...</div>;

  return (
    <div className="admin-inbox-page">
      <div className="inbox-container">
        <header className="inbox-header">
          <div className="header-text">
            <h1>Application Inbox</h1>
            <p>Manage adoption requests and find forever homes.</p>
          </div>
          <div className="stats-pill">
            <span>{applications.filter(a => a.status === 'PENDING').length} Pending</span>
          </div>
        </header>

        <div className="apps-grid">
          {applications.length > 0 ? (
            applications.map(app => (
              <div key={app.id} className={`app-card-premium ${app.status.toLowerCase()}`}>
                <div className="card-top">
                  <span className="app-tag">Application #{app.id}</span>
                  <div className={`status-dot ${app.status.toLowerCase()}`}>{app.status}</div>
                </div>

                <div className="card-main">
                  <div className="pet-mini-profile">
                    <h3>{app.pet?.name || "The Pet"}</h3>
                    <span className="pet-breed">{app.pet?.breed || "Unknown Breed"}</span>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <label>Applicant</label>
                      <p>{app.user?.username || "Guest User"}</p>
                    </div>
                    <div className="info-item">
                      <label>Experience</label>
                      <p>{app.experience ? app.experience.replace('_', ' ') : "No experience listed"}</p>
                    </div>
                  </div>

                  <div className="reason-section">
                    <label>Why they want to adopt:</label>
                    <div className="reason-bubble">
                      "{app.answers}"
                    </div>
                  </div>
                </div>

                {app.status === 'PENDING' && (
                  <div className="card-footer-actions">
                    <button className="btn-approve-admin" onClick={() => handleStatusUpdate(app.id, 'APPROVED')}>
                      Approve Adoption
                    </button>
                    <button className="btn-reject-admin" onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-inbox">
              <p>No applications found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;