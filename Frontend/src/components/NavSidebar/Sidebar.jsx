import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  HeartHandshake,
  PawPrint,
  User,
  Info,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [user, setUser] = useState({ name: "", email: "", address: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser({
            email: userData.role || "MEMBER",
            name: userData.username || "User",
            address: userData.address || "",
          });
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.error("Error updating sidebar info.");
        }
      }
    };

    loadUserData();
    window.addEventListener("userUpdated", loadUserData);
    window.addEventListener("storage", loadUserData);

    return () => {
      window.removeEventListener("userUpdated", loadUserData);
      window.removeEventListener("storage", loadUserData);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      <div className={`sidebar-nav ${isCollapsed ? "collapsed" : ""}`}>
        {/* Modern CSS-only Toggle Button using Lucide Chevron */}
        <button
          className="sidebar-collapse-btn"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          <ChevronLeft
            size={20}
            strokeWidth={2.5}
            className={`paw-toggle-icon ${isCollapsed ? "flipped" : ""}`}
          />
        </button>

        <div className="sidebar-logo">
          <h1 className="logo-text">
            {isCollapsed ? (
              <>
                F<span>E</span>
              </>
            ) : (
              <>
                Fur<span>Ever</span>
              </>
            )}
          </h1>
          {!isCollapsed && <p className="sub-logo-text">ADOPTION PANEL</p>}
        </div>

        <div className="sidebar-separator" />

        <ul className="sidebar-links">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Home className="sidebar-icon" size={22} strokeWidth={2} />
              {!isCollapsed && <span className="sidebar-link-text">Home</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/adopt"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <PawPrint
                className="sidebar-icon"
                size={22}
                strokeWidth={2}
              />
              {!isCollapsed && <span className="sidebar-link-text">Adopt</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }            >
              <HeartHandshake
                className="sidebar-icon"
                size={22}
                strokeWidth={2}
              />
              {!isCollapsed && (
                <span className="sidebar-link-text">Applications</span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <User className="sidebar-icon" size={22} strokeWidth={2} />
              {!isCollapsed && (
                <span className="sidebar-link-text">Profile</span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <HelpCircle className="sidebar-icon" size={22} strokeWidth={2} />
              {!isCollapsed && <span className="sidebar-link-text">Help</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Info className="sidebar-icon" size={22} strokeWidth={2} />
              {!isCollapsed && (
                <span className="sidebar-link-text">About Us</span>
              )}
            </NavLink>
          </li>
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

          <div
            className="sidebar-link logout-link"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="sidebar-icon" size={22} strokeWidth={2} />
            {!isCollapsed && <span className="sidebar-link-text">Logout</span>}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="modal-content logout-confirm animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title-logout">Sign Out</h2>
            <p className="modal-p-logout">
              Are you sure you want to end your session?
            </p>
            <div className="modal-actions-logout">
              <button
                className="btn-cancel-logout"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="btn-confirm-logout" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
