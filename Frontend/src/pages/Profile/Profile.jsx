import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import eyeOpen from '../../assets/eyeopen.png';
import eyeClose from '../../assets/eyeclose.png';

const Profile = () => {
  const [user, setUser] = useState({ name: "", l_name: "", email: "", address: "", role: "", username: "", avatarUrl: "" });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const userRes = await axios.get('http://localhost:8080/api/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Ensure we handle both potential naming conventions from backend
        const userData = userRes.data;
        setUser({
            ...userData,
            l_name: userData.l_name || userData.lName || ""
        });

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

  // --- Handlers ---
  const handleOpenEditProfile = () => {
    setEditProfileData({
      name: user.name || "",
      l_name: user.l_name || user.lName || "", // Fallback for last name
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
      
      // We capture the response so we can get the actual Supabase URL
      const response = await axios.put('http://localhost:8080/api/profile/update', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedUser = response.data;
      alert("Profile updated successfully!");
      
      // Update local state with the actual data returned from Spring Boot
      setUser({ 
          ...user, 
          ...updatedUser, 
          l_name: updatedUser.l_name || updatedUser.lName,
          avatarUrl: updatedUser.avatarUrl // This is the real Supabase URL
      });
      
      setShowEditProfileModal(false);
    } catch (error) {
      console.error("Update Error:", error);
      alert("Error updating profile. Check console for details.");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/api/profile/change-password', passwordData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error updating password. Please check your current password.");
    }
  };

  const handleDeleteAccount = () => {
    alert("Account deletion request submitted.");
    setShowDeleteModal(false);
  };

  if (loading) return <div className="loading-state">Loading fuzzy profile...</div>;

  return (
    <div className="profile-page-wrapper">
      <main className="profile-content">
        <div className="profile-layout-container">

          {/* LEFT COLUMN - Profile Card */}
          <div className="profile-card">
            <div className="profile-header-bg"></div>

            <div className="profile-body">
              <div className="avatar-badge-group">
                <div className="profile-avatar-container">
                  <div className="profile-avatar-main">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt="Profile" 
                        onError={(e) => {
                            console.error("Image failed to load:", user.avatarUrl);
                            e.target.src = "fallback_image_url";
                        }}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <button className="edit-avatar-btn" onClick={handleOpenEditProfile}>✏️</button>
                </div>
                <span className="user-role-badge">{user.role}</span>
              </div>

              <h1 className="user-fullname">{user.name} {user.l_name}</h1>

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

          {/* RIGHT COLUMN - Side Cards */}
          <div className="profile-side-column">
            <div className="action-card upload-card">
              <h3>Upload Content</h3>
              <p className="card-desc">Share your pet's journey with the community!</p>
              <button className="action-btn upload-btn">➕ Create Post</button>
            </div>

            <div className="action-card">
              <h3>Quick Actions</h3>
              <button className="action-btn" onClick={handleOpenEditProfile}>Edit Profile</button>
              <button className="action-btn" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
              <button className="action-btn">Settings</button>
            </div>

            <div className="action-card danger-card">
              <h3>Danger Zone</h3>
              <p>Once you delete it, all data is lost forever!</p>
              <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* APPLICATIONS SECTION */}
        <section className="pending-section">
          <div className="applications-table-container">
            {applications.length > 0 ? (
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applications</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="app-details">
                          <h3>{app.newPetName || "Unnamed Pet"}</h3>
                          <p>Applied on: {new Date(app.appDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="status-cell">
                        <div className={`status-badge-big ${(app.status || "pending").toLowerCase()}`}>
                          {app.status || "PENDING"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="pets-empty-state">
                <p>No active requests found.</p>
              </div>
            )}
          </div>
        </section>

        {/* MODAL: EDIT PROFILE */}
        {showEditProfileModal && (
          <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
            <div className="modal-content edit-profile-modal" onClick={e => e.stopPropagation()}>
              <h2>Edit Profile</h2>
              
              <div className="edit-avatar-section">
                <div className="edit-avatar-preview">
                  {avatarPreview || user.avatarUrl ? (
                     <img src={avatarPreview || user.avatarUrl} alt="Preview" />
                  ) : (
                     <div className="avatar-placeholder">{editProfileData.name ? editProfileData.name.charAt(0).toUpperCase() : "U"}</div>
                  )}
                </div>
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarChange} 
                />
                <label htmlFor="avatarUpload" className="upload-avatar-btn">
                  Choose New Picture
                </label>
              </div>

              <div className="password-form">
                <div className="input-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={editProfileData.name} 
                    onChange={(e) => setEditProfileData({...editProfileData, name: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={editProfileData.l_name} 
                    onChange={(e) => setEditProfileData({...editProfileData, l_name: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={editProfileData.username} 
                    onChange={(e) => setEditProfileData({...editProfileData, username: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>Home Address</label>
                  <input 
                    type="text" 
                    value={editProfileData.address} 
                    onChange={(e) => setEditProfileData({...editProfileData, address: e.target.value})} 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEditProfileModal(false)}>Cancel</button>
                <button className="btn-confirm-save" onClick={handleSaveProfile}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CHANGE PASSWORD */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content password-confirm" onClick={e => e.stopPropagation()}>
              <h2>Change Password</h2>
              <div className="password-form">
                <div className="input-group">
                  <label>Current Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                    <img
                      src={showCurrentPassword ? eyeOpen : eyeClose}
                      alt="toggle visibility"
                      className="password-toggle-icon"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <img
                      src={showNewPassword ? eyeOpen : eyeClose}
                      alt="toggle visibility"
                      className="password-toggle-icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button className="btn-confirm-save" onClick={handlePasswordChange}>Update</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE ACCOUNT */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content delete-confirm" onClick={e => e.stopPropagation()}>
              <h2>Are you sure?</h2>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Keep it</button>
                <button className="btn-confirm-delete" onClick={handleDeleteAccount}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;