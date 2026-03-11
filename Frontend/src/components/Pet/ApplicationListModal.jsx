import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PetCard.css';

const ApplicationListModal = ({ isOpen, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMySubmissions();
    }
  }, [isOpen]);

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/applications/my-submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content list-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title1">My Applications</h2>
        <p className="modal-subtitle">Track the status of your fur-ever friends.</p>

        <div className="app-list-wrapper">
          {loading ? (
            <p className="loading-text">Fetching your requests...</p>
          ) : applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="app-list-item">
                <div className="app-pet-details">
                  <h3>{app.newPetName || "Unnamed Pet"}</h3>
                  <p>Applied on: {new Date(app.appDate).toLocaleDateString()}</p>
                </div>
                {/* Big visible status tag */}
                <div className={`status-badge-big ${app.status.toLowerCase()}`}>
                  {app.status}
                </div>
              </div>
            ))
          ) : (
            <p className="no-records">You haven't made any applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationListModal;