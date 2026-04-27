import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../api/config';
import { 
  Users, 
  Heart, 
  FileText, 
  CheckCircle, 
  Clock, 
  XOctagon, 
  PawPrint 
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdopted: 0,
    activeMembers: 0,
    successStories: 0,
    totalPets: 0,
    totalAvailablePets: 0,
    totalPendingApplications: 0,
    totalRejectedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get(API_ENDPOINTS.STATS_DASHBOARD, config);
      const data = response.data.data || response.data;
      setStats({
        totalAdopted: data.totalAdopted || 0,
        activeMembers: data.activeMembers || 0,
        successStories: data.successStories || 0,
        totalPets: data.totalPets || 0,
        totalAvailablePets: data.totalAvailablePets || 0,
        totalPendingApplications: data.totalPendingApplications || 0,
        totalRejectedApplications: data.totalRejectedApplications || 0
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard metrics. Please check your connection.");
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const response = await axios.get(API_ENDPOINTS.STATS_DASHBOARD, config);
        const data = response.data.data || response.data;
        if (mounted) {
          setStats({
            totalAdopted: data.totalAdopted || 0,
            activeMembers: data.activeMembers || 0,
            successStories: data.successStories || 0,
            totalPets: data.totalPets || 0,
            totalAvailablePets: data.totalAvailablePets || 0,
            totalPendingApplications: data.totalPendingApplications || 0,
            totalRejectedApplications: data.totalRejectedApplications || 0
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        if (mounted) {
          setError("Failed to load dashboard metrics. Please check your connection.");
          setLoading(false);
        }
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        <XOctagon size={48} />
        <h2>Error Loading Analytics</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardStats} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Analytics</h1>
        <p>Overview of platform activities, applications, and pet statuses.</p>
      </div>

      <div className="stats-grid">
        {/* Core Pet Stats */}
        <div className="stat-card primary">
          <div className="stat-icon-wrapper paw">
            <PawPrint size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPets}</h3>
            <p>Total Rescued Pets</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper available">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAvailablePets}</h3>
            <p>Available for Adoption</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon-wrapper heart">
            <Heart size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAdopted}</h3>
            <p>Happily Adopted</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="stat-card">
          <div className="stat-icon-wrapper users">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeMembers}</h3>
            <p>Active Members</p>
          </div>
        </div>

        {/* Application Stats */}
        <div className="stat-card">
          <div className="stat-icon-wrapper file">
            <FileText size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.successStories}</h3>
            <p>Approved Applications</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon-wrapper pending">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPendingApplications}</h3>
            <p>Pending Applications</p>
          </div>
        </div>
        
        <div className="stat-card error">
          <div className="stat-icon-wrapper rejected">
            <XOctagon size={28} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalRejectedApplications}</h3>
            <p>Rejected Applications</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-panel">
           <h2>Welcome to FurEver Admin</h2>
           <p>Manage pets, track adoption applications, and keep health records updated directly from the sidebar.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;