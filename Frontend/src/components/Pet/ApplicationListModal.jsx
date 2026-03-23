import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const ApplicationListModal = ({ isOpen, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchMySubmissions();
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="pm-modal-overlay" onClick={onClose}>
      <div className="pm-modal-box alm-modal-width" onClick={e => e.stopPropagation()}>
        <button className="pm-close-x" onClick={onClose}>&times;</button>
        <h2 className="pm-modal-title">My Applications</h2>
        <div className="alm-list-container">
          {loading ? (
            <p className="pm-loading-text">Fetching your requests...</p>
          ) : applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="alm-list-card">
                <div className="alm-pet-info">
                  <h3>{app.newPetName || "Unnamed Pet"}</h3>
                  <p>Applied on: {new Date(app.appDate).toLocaleDateString()}</p>
                </div>
                <div className={`alm-status-pill ${app.status.toLowerCase()}`}>
                  {app.status}
                </div>
              </div>
            ))
          ) : (
            <p className="pm-no-records">You haven't made any applications yet.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ApplicationListModal;