import React from 'react';
import { Link } from 'react-router-dom';
import './Index.css';
import cloud from '../../assets/cloud.png';
import paw from '../../assets/paw.png';

const Index = () => {
  return (
    <div className="main-container">
      <div className="top-logo">FurEver</div>
      <div className="nav-group">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      
      </div>
      
      <div className="hero-section">
        <div className="hero-title">FurEver</div>
        <img className="img-cloud-large" src={cloud} alt="cloud" />
        <img className="img-cloud-main" src={cloud} alt="cloud" />
        <img className="img-cloud-small" src={cloud} alt="cloud" />
        <img className="img-paw-small" src={paw} alt="paw" />
        <img className="img-cloud-wide" src={cloud} alt="cloud" />
        <img className="img-cloud-medium" src={cloud} alt="cloud" />
      </div>

        <div className="slogan-container">
          <span className="slogan-text">Adopt and treat like a family member &lt;3</span>
        </div>
        
        <Link to="/adopt" className="adopt-btn">
          <span className="adopt-btn-text">Adopt now!</span>
        </Link>

    </div>
  );
};

export default Index;