import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Mail, PawPrint, Users, LogOut, ChevronRight } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <aside className={`adm-sidebar ${isCollapsed ? 'adm-collapsed' : ''}`}>
        <button className="adm-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <ChevronRight className={`adm-chevron-icon ${isCollapsed ? '' : 'adm-flipped'}`} size={20} />
        </button>

        <div className="adm-logo-wrap">
          <h2 className="adm-logo-main">
            {isCollapsed ? <>F<span>E</span></> : <>Fur<span>Ever</span></>}
          </h2>
          {!isCollapsed && <p className="adm-logo-sub">ADMIN PANEL</p>}
        </div>

        <nav className="adm-nav-list">
          <NavLink to="/admin-dashboard" className="adm-nav-item">
            <LayoutDashboard className="adm-nav-icon" size={22} />
            {!isCollapsed && <span className="adm-nav-text">Dashboard</span>}
          </NavLink>
          <NavLink to="/admin/applications" className="adm-nav-item">
            <Mail className="adm-nav-icon" size={22} />
            {!isCollapsed && <span className="adm-nav-text">Applications</span>}
          </NavLink>
          <NavLink to="/admin/manage-pets" className="adm-nav-item">
            <PawPrint className="adm-nav-icon" size={22} />
            {!isCollapsed && <span className="adm-nav-text">Manage Pets</span>}
          </NavLink>
        </nav>

        <div className="adm-footer">
          <div className="adm-user-card">
            <div className="adm-avatar">{username.charAt(0).toUpperCase()}</div>
            {!isCollapsed && <div className="adm-u-info"><span className="adm-u-name">{username}</span></div>}
          </div>
          <button className="adm-nav-item adm-logout-trigger" onClick={() => setShowLogoutModal(true)}>
            <LogOut className="adm-nav-icon" size={22} />
            {!isCollapsed && <span className="adm-nav-text">Logout</span>}
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="adm-modal-bg">
          <div className="adm-confirm-box adm-animate-pop">
            <h2 className="adm-modal-h2">Confirm Logout</h2>
            <div className="adm-modal-btns">
              <button className="adm-btn-stay" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="adm-btn-out" onClick={handleConfirmLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;