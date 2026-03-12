import React from 'react';
import { Link } from 'react-router-dom';
import './Index.css';
import cloud from '../../assets/cloud.png';
import paw from '../../assets/paw.png';
import mobileImg from '../../assets/Mobile.png';

const Index = () => {
  return (
    <div className="main-container index-page">
      {/* SECTION 1: HERO (Top Fold) */}
      <div className="hero-full-screen">
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
        
        <Link to="/login" className="adopt-btn">
          <span className="adopt-btn-text">Adopt now!</span>
        </Link>
      </div>

      {/* SECTION 2: THE INFO DESIGN (The section below) */}
      <div className="info-section-container">
        <div className="info-content-wrapper">
          
          {/* Left Side: Text and Branding */}
          <div className="info-text-side">
            <h2 className="info-brand">Furever</h2>
            <h1 className="info-headline">Adopt and bring home <br/> your new bestfriend.</h1>
            
            <p className="info-para">
              It is a digital bridge built on the belief that every animal deserves a place to call home. 
              Designed with a warm, "paw-friendly" aesthetic, the application streamlines the adoption 
              journey by connecting hopeful pet parents with their future companions through an 
              intuitive and heartfelt interface.
            </p>

            <Link to="/register" className="start-now-btn">
              Start and Adopt now &lt;3
            </Link>

            <p className="info-para para-bottom">
              By blending modern technology with a deep empathy for animal welfare, FurEver transforms 
              the often-overwhelming process of finding a pet into a joyful, seamless experience, 
              ensuring that the transition from a shelter to a "furever" home is just a click away.
            </p>

            <div className="footer-links">
               <p>Application Download: <a href="https://www.furevermobile.com" target="_blank" rel="noreferrer">https://www.furevermobile.com</a></p>
               <p>Facebook Link: <a href="https://www.facebook.com/furever" target="_blank" rel="noreferrer">https://www.facebook/furever.com</a></p>
            </div>
          </div>

          {/* Right Side: Your Mobile Image Asset */}
          <div className="mobile-image-container">
            <img src={mobileImg} alt="FurEver Mobile App" className="mobile-mockup-img" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;