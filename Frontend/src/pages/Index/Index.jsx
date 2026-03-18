import React from 'react';
import { Link } from 'react-router-dom';
import './Index.css';

// Existing imports
import cloud from '../../assets/cloud.png';
import paw from '../../assets/paw.png';
import mobileImg from '../../assets/Mobile.png';

// --- NEW ASSET IMPORTS ---
import grayTabby from '../../assets/GrayTabby.png';
import mochii1 from '../../assets/Mochii1.png';
import puppy from '../../assets/Puppy.png';
import grayTabby1 from '../../assets/GrayTabby1.png';

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

        {/* --- BOTTOM RIGHT DECOR --- */}
        <div className="hero-bottom-right-decor">
          <div className="hero-corner-shape"></div>
          {/* Swapped to local assets */}
          <img className="hero-decor-img-1" src={grayTabby} alt="Gray Tabby" />
          <img className="hero-decor-img-2" src={mochii1} alt="Mochii" />
        </div>
      </div>

      {/* SECTION 2: MOCHI SECTION (Middle) */}
      <div className="mochi-section-container">
        
        {/* Decorative Background Elements */}
        <div className="mochi-bg-shape-top"></div>
        {/* Swapped to local asset */}
        <img className="mochi-bg-img-top" src={puppy} alt="Puppy Background Element" />
        
        <div className="mochi-bg-shape-bottom"></div>
        {/* Swapped to local asset */}
        <img className="mochi-bg-img-bottom" src={grayTabby1} alt="Gray Tabby Background Element" />

        <div className="mochi-content-wrapper">
          
          {/* Mochi Card 1 (Right Aligned) */}
          <div className="mochi-card align-right">
            <div className="mochi-text-content">
              <h2 className="mochi-title">“ Get to know with mochi</h2>
              <h2 className="mochi-title">the model of this website “</h2>
              <p className="mochi-desc">
                Mochii is the first pet of the owner in this website. He was found on the car on random rainy night, and found his owner, me, mochii has been so nice to me and lick my hands. If cat destribution is true then I know mochii was destined to be mine.
              </p>
            </div>
            <div className="mochi-img-placeholder">img holder</div>
          </div>

          {/* Mochi Card 2 (Left Aligned) */}
          <div className="mochi-card align-left">
            <div className="mochi-text-content">
              <h2 className="mochi-title">“ Get to know with mochi</h2>
              <h2 className="mochi-title">the model of this website “</h2>
              <p className="mochi-desc">
                Mochii is the first pet of the owner in this website. He was found on the car on random rainy night, and found his owner, me, mochii has been so nice to me and lick my hands. If cat destribution is true then I know mochii was destined to be mine.
              </p>
            </div>
            <div className="mochi-img-placeholder">img holder</div>
          </div>

        </div>
      </div>

      {/* SECTION 3: THE INFO & MOBILE DESIGN (Bottom) */}
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

          {/* Right Side: Mobile Image Asset */}
          <div className="mobile-image-container">
            <img src={mobileImg} alt="FurEver Mobile App" className="mobile-mockup-img" />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Index;