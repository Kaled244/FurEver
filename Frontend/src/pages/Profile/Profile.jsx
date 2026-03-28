import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../api/config';
import './Profile.css';
import eyeOpen from '../../assets/eyeopen.png';
import eyeClose from '../../assets/eyeclose.png';

const Profile = () => {
  const [user, setUser] = useState({ name: "", l_name: "", email: "", address: "", role: "", username: "", avatarUrl: "" });
  const [applications, setApplications] = useState([]);
  const [, setLoading] = useState(true);

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Form States
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  
  // Edit Profile States
  const [editProfileData, setEditProfileData] = useState({ name: "", l_name: "", username: "", address: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // eslint-disable-next-line no-undef
        const userRes = await axios.get(API_ENDPOINTS.PROFILE_ME, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Handle standardized ApiResponse wrapping if it exists
        const userData = userRes.data.data ? userRes.data.data : userRes.data;
        setUser({
            ...userData,
            l_name: userData.l_name || userData.lName || ""
        });

        // eslint-disable-next-line no-undef
        const appRes = await axios.get(API_ENDPOINTS.APPLICATIONS_MY_SUBMISSIONS, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Handle standardized ApiResponse mapping for applications Array
        const appsData = appRes.data.data ? appRes.data.data : appRes.data;
        setApplications(appsData);
      } catch (err) {
        console.error("❌ Profile Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
        fetchProfileData();
    } else {
        // Redirect if they aren't logged in
        window.location.href = '/login'; 
    }
  }, []);

  // --- Handlers ---
  const handleOpenEditProfile = () => {
    setEditProfileData({
      name: user.name || "",
      l_name: user.l_name || user.lName || "", 
      username: user.username || "",
      address: user.address || ""
    });
    setAvatarPreview(null);
    setShowEditProfileModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', editProfileData.name);
      formData.append('l_name', editProfileData.l_name);
      formData.append('username', editProfileData.username);
      formData.append('address', editProfileData.address);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      // eslint-disable-next-line no-undef
      const response = await axios.put(API_ENDPOINTS.PROFILE_UPDATE, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedUser = response.data;
      alert("Profile updated successfully!");
      
      setUser({ 
          ...user, 
          ...updatedUser, 
          l_name: updatedUser.l_name || updatedUser.lName,
          avatarUrl: updatedUser.avatarUrl 
      });
      
      setShowEditProfileModal(false);
    } catch (error) {
      console.error("Update Error:", error);
      alert("Error updating profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // eslint-disable-next-line no-undef
      await axios.put(API_ENDPOINTS.PROFILE_CHANGE_PASSWORD, passwordData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error updating password.");
    }
  };

  const handleDeleteAccount = () => {
    alert("Account deletion request submitted.");
    setShowDeleteModal(false);
  };

  return (
    <div className="user-profile-page-root">
      <main className="user-profile-main-content">
        <div className="up-layout-container">

          {/* LEFT COLUMN - Profile Card */}
          <div className="up-profile-card animate-slide-up">
            <div className="up-header-bg"></div>

            <div className="up-body">
              <div className="up-avatar-badge-group">
                <div className="up-avatar-container">
                  <div className="up-avatar-main">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt="Profile" 
                        onError={(e) => {
                            e.target.src = "fallback_image_url";
                        }}
                      />
                    ) : (
                      <div className="up-avatar-placeholder">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </div>
                <span className="up-user-role-badge">{user.role || "MEMBER"}</span>
              </div>

              <h1 className="up-user-fullname">{user.name} {user.l_name}</h1>

              <div className="up-user-info-grid">
                <div className="up-info-box">
                  <label>Username </label>
                  <p>@{user.username || "n/a"}</p>
                </div>
                <div className="up-info-box">
                  <label>Email Address </label>
                  <p>{user.email}</p>
                </div>
                <div className="up-info-box">
                  <label>Home Address </label>
                  <p>{user.address || "Address not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Side Cards */}
          <div className="up-side-column animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="up-action-card up-upload-card">
              <h3>Upload Content</h3>
              <p className="up-card-desc">Share your pet's journey with the community!</p>
              <button className="up-action-btn up-upload-btn">➕ Create Post</button>
            </div>

            <div className="up-action-card">
              <h3>Quick Actions</h3>
              <button className="up-action-btn" onClick={handleOpenEditProfile}>Edit Profile</button>
              <button className="up-action-btn" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
              <button className="up-action-btn">Settings</button>
            </div>

            <div className="up-action-card up-danger-card">
              <h3>Danger Zone</h3>
              <p className="up-card-desc">Once you delete it, all data is lost forever!</p>
              <button className="up-delete-btn" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* APPLICATIONS SECTION */}
        <section className="up-applications-section animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h2 className="up-section-title">My Applications</h2>
          <div className="up-table-container">
            {applications.length > 0 ? (
              <table className="up-table">
                <thead>
                  <tr>
                    <th>Pet Details</th>
                    <th className="up-status-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="up-app-details">
                          <h3>{app.newPetName || "Unnamed Pet"}</h3>
                          <p>Applied on: {new Date(app.appDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="up-status-cell">
                        <div className={`up-status-badge ${(app.status || "pending").toLowerCase()}`}>
                          {app.status || "PENDING"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="up-empty-state">
                <p>No active requests found.</p>
              </div>
            )}
          </div>
        </section>

        {/* MODAL: EDIT PROFILE */}
        {showEditProfileModal && (
          <div className="pm-modal-overlay" onClick={() => setShowEditProfileModal(false)}>
            <div className="pm-modal-box animate-scale-up" onClick={e => e.stopPropagation()}>
              <h2 className="pm-modal-title">Edit Profile</h2>
              
              <div className="up-edit-avatar-section">
                <div className="up-edit-avatar-preview">
                  {avatarPreview || user.avatarUrl ? (
                     <img src={avatarPreview || user.avatarUrl} alt="Preview" />
                  ) : (
                     <div className="up-avatar-placeholder">{editProfileData.name ? editProfileData.name.charAt(0).toUpperCase() : "U"}</div>
                  )}
                </div>
                <input 
                  type="file" 
                  id="upAvatarUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarChange} 
                />
                <label htmlFor="upAvatarUpload" className="up-upload-avatar-label">
                  Choose New Picture
                </label>
              </div>

              <div className="pm-modern-form">
                <div className="pm-input-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={editProfileData.name} 
                    onChange={(e) => setEditProfileData({...editProfileData, name: e.target.value})} 
                  />
                </div>
                <div className="pm-input-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={editProfileData.l_name} 
                    onChange={(e) => setEditProfileData({...editProfileData, l_name: e.target.value})} 
                  />
                </div>
                <div className="pm-input-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={editProfileData.username} 
                    onChange={(e) => setEditProfileData({...editProfileData, username: e.target.value})} 
                  />
                </div>
                <div className="pm-input-group">
                  <label>Home Address</label>
                  <input 
                    type="text" 
                    value={editProfileData.address} 
                    onChange={(e) => setEditProfileData({...editProfileData, address: e.target.value})} 
                  />
                </div>
              </div>

              <div className="pm-modal-actions">
                <button className="pm-btn-cancel" onClick={() => setShowEditProfileModal(false)}>Cancel</button>
                <button className="pm-btn-confirm" onClick={handleSaveProfile}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CHANGE PASSWORD */}
        {showPasswordModal && (
          <div className="pm-modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="pm-modal-box animate-scale-up" onClick={e => e.stopPropagation()}>
              <h2 className="pm-modal-title">Change Password</h2>
              <div className="pm-modern-form">
                <div className="pm-input-group">
                  <label>Current Password</label>
                  <div className="pm-password-wrapper">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                    <img
                      src={showCurrentPassword ? eyeOpen : eyeClose}
                      alt="toggle"
                      className="pm-password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                  </div>
                </div>
                <div className="pm-input-group">
                  <label>New Password</label>
                  <div className="pm-password-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <img
                      src={showNewPassword ? eyeOpen : eyeClose}
                      alt="toggle"
                      className="pm-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </div>
                </div>
              </div>
              <div className="pm-modal-actions">
                <button className="pm-btn-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button className="pm-btn-confirm" onClick={handlePasswordChange}>Update</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE ACCOUNT */}
        {showDeleteModal && (
          <div className="pm-modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="pm-modal-box animate-scale-up" onClick={e => e.stopPropagation()}>
              <h2 className="pm-modal-title pm-text-danger">Are you sure?</h2>
              <p className="pm-modal-desc">This action cannot be undone. All your data will be permanently removed.</p>
              <div className="pm-modal-actions">
                <button className="pm-btn-cancel" onClick={() => setShowDeleteModal(false)}>Keep it</button>
                <button className="pm-btn-delete" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;