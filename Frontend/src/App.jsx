import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Sidebar from './components/NavSidebar/Sidebar';
import AdminSidebar from './components/AdminSidebar/AdminSidebar';

// Page Components
import Index from './pages/Index/Index';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Adopt from './pages/Adopt/Adopt';
import Profile from './pages/Profile/Profile';
import About from './pages/About/About';
import Help from './pages/Help/Help';
import Application from './pages/Application/Application';

// Admin Page Components
import AdminManagePets from './pages/AdminManagePets/AdminManagePets';
import AdminApplications from './pages/AdminApplication/AdminApplications';
const AppContent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem('role');
  
  const noSidebarPaths = ["/", "/login", "/register"];
  const isNoSidebarPage = noSidebarPaths.includes(location.pathname);
  
  const showAdminSidebar = !isNoSidebarPage && role === 'ADMIN';
  const showUserSidebar = !isNoSidebarPage && role !== 'ADMIN';

  const getMarginLeft = () => {
  if (showAdminSidebar) return isCollapsed ? '90px' : '280px';
  if (showUserSidebar) return isCollapsed ? '90px' : '280px'; 
  
  return '0';
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {showAdminSidebar && (
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
      
      {showUserSidebar && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )} 
      
      <div style={{ 
        flexGrow: 1, 
        width: `calc(100% - ${getMarginLeft()})`,
        marginLeft: getMarginLeft(),
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        minHeight: '100vh',
        backgroundColor: '#fcfcfb',
        overflowX: 'hidden'
      }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/applications" element={<Application />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<div style={{padding: '40px'}}><h1>Dashboard coming soon!</h1></div>} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/manage-pets" element={<AdminManagePets />} />
          <Route path="/admin/users" element={<div style={{padding: '40px'}}><h1>User Management coming soon!</h1></div>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;