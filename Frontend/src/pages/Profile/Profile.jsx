import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", address: "", role: "" });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get('http://localhost:8080/api/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(userRes.data);

        const appRes = await axios.get('http://localhost:8080/api/applications/my-submissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setApplications(appRes.data);
      } catch (err) {
        console.error("❌ Profile Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfileData();
  }, []);

  const handleDeleteAccount = () => {
    alert("Account deletion request submitted.");
    setShowDeleteModal(false);
  };

  if (loading) return <div className="loading-state">Loading fuzzy profile...</div>;

  return (
    <div className="profile-page-wrapper">
      <main className="profile-content">
        <header className="adopt-header">
          <div className="title-section">
            <h1 className="main-title1">Your Profile</h1>
            <p className="main-subtitle">Manage your personal information and track your furry family.</p>
          </div>
        </header>

        <div className="profile-layout-container">
          {/* LEFT COLUMN */}
          <div className="profile-card">
            <div className="profile-header-bg">
              <div className="profile-avatar-container">
                <div className="profile-avatar-main">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <button className="edit-avatar-btn">✏️</button>
              </div>
            </div>
            
            <div className="profile-body">
              <h1 className="user-fullname">{user.name}</h1>
              <span className="user-role-badge">{user.role}</span>
              
              <div className="user-info-grid">
                <div className="info-box">
                <label>Username</label>
                <p>@{user.username || "n/a"}</p>
                </div>
                <div className="info-box">
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-box">
                  <label>Home Address</label>
                  <p>{user.address || "Address not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Stacked Cards */}
          <div className="profile-side-column">
            {/* 1. Upload Content Card */}
            <div className="action-card upload-card">
              <div className="card-header">
                <h3>Upload Content</h3>
              </div>
              <p className="card-desc">Share your pet's journey with the community!</p>
              <button className="action-btn upload-btn">➕ Create Post</button>
            </div>

            {/* 2. Quick Actions Card */}
            <div className="action-card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <button className="action-btn">Edit Profile</button>
              <button className="action-btn">Change Password</button>
              <button className="action-btn">Settings</button>
            </div>

            {/* 3. Danger Zone Card */}
            <div className="action-card danger-card">
              <h3>Danger Zone</h3>
              <p>Once you delete your account, all data is lost forever.</p>
              <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
            </div>
          </div>
        </div>

        <section className="pending-section">
          <h2 className="section-title">Pending Applications 🐾</h2>
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="app-row">
                  <div className="app-details">
                    <h3>{app.newPetName || "Unnamed Pet"}</h3>
                    <p>Applied on: {new Date(app.appDate).toLocaleDateString()}</p>
                  </div>
                  <div className={`status-badge-big ${(app.status || "pending").toLowerCase()}`}>
                    {app.status || "PENDING"}
                  </div>
                </div>
              ))
            ) : (
              <div className="pets-empty-state">
                <p>No active requests found.</p>
              </div>
            )}
          </div>
        </section>

        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content delete-confirm" onClick={e => e.stopPropagation()}>
              <h2>Are you sure?</h2>
              <p>Do you really want to delete your account? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>No, Keep it</button>
                <button className="btn-confirm-delete" onClick={handleDeleteAccount}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;