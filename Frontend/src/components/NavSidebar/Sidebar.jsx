import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import { FaSignOutAlt, FaHome, FaPaw, FaInfoCircle, FaQuestionCircle, FaUser } from 'react-icons/fa';
import pawIcon from '../../assets/paw.png';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", address: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal State
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        setUser({
          email: userData.role || "MEMBER", 
          name: userData.username || "User", 
          address: userData.address || "" 
        });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Error updating sidebar info.");
      }
    }
    };

    loadUserData();

    window.addEventListener('userUpdated', loadUserData);
    window.addEventListener('storage', loadUserData);
    
    return () => {
    window.removeEventListener('userUpdated', loadUserData);
    window.removeEventListener('storage', loadUserData);
  };
}, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    document.body.classList.toggle('sidebar-collapsed', !isCollapsed);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/login'); // Clean redirect
  };

  return (
    <>
      <div className={`sidebar-nav ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="sidebar-collapse-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <img src={pawIcon} alt="toggle" className={`paw-toggle-icon ${isCollapsed ? 'flipped' : ''}`} />
        </button>

        <div className="sidebar-logo">
          <h1 className="logo-text">{isCollapsed ? "F" : "FurEver"}</h1>
          {!isCollapsed && <p className="sub-logo-text">petshop</p>}
        </div>

        <div className="sidebar-separator" />

        <ul className="sidebar-links">
          <li><NavLink to="/home" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaHome className="sidebar-icon" />{!isCollapsed && <span className="sidebar-link-text">Home</span>}</NavLink></li>
          <li><NavLink to="/adopt" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaPaw className="sidebar-icon" />{!isCollapsed && <span className="sidebar-link-text">Adopt</span>}</NavLink></li>
          <li><NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaUser className="sidebar-icon" />{!isCollapsed && <span className="sidebar-link-text">Profile</span>}</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaInfoCircle className="sidebar-icon" />{!isCollapsed && <span className="sidebar-link-text">About Us</span>}</NavLink></li>
          <li><NavLink to="/help" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaQuestionCircle className="sidebar-icon" />{!isCollapsed && <span className="sidebar-link-text">Help</span>}</NavLink></li>
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-separator" />
          
          <div className="user-info-section">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <span className="user-name">{user.name || "User"}</span>
                <span className="user-email">{user.email}</span>
              </div>
            )}
          </div>

          {/* Changed NavLink to a div/button for the modal trigger */}
          <div className="sidebar-link logout-link" onClick={() => setShowLogoutModal(true)} style={{cursor: 'pointer'}}>
            <FaSignOutAlt className="sidebar-icon" />
            {!isCollapsed && <span className="sidebar-link-text">Logout</span>}
          </div>
        </div>
      </div>

      {/* --- Logout Confirmation Modal --- */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content logout-confirm" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title-logout">Confirmation</h2>
            <p className="modal-p-logout">Do you want to end your session?</p>
            <div className="modal-actions-logout">
              <button className="btn-cancel-logout" onClick={() => setShowLogoutModal(false)}>Stay</button>
              <button className="btn-confirm-logout" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;