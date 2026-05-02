import React from "react";
import { Link } from "react-router-dom";
import "./Index.css";

// Existing imports
import cloud from "../../assets/cloud.png";
import paw from "../../assets/paw.png";
import mobileImg from "../../assets/Mobile.png";

// --- NEW ASSET IMPORTS ---
import Logo from "../../assets/Logo.png";
import grayTabby from "../../assets/GrayTabby.png";
import mochii1 from "../../assets/Mochii1.png"; // Re-added
import puppy from "../../assets/Puppy.png";
import grayTabby1 from "../../assets/GrayTabby1.png"; // Re-added
import HelpCat from "../../assets/HelpCat.jfif";
import HelpDog from "../../assets/HelpDog.jfif";

const Index = () => {
  return (
    <div className="main-container index-page">
      {/* SECTION 1: HERO (Top Fold) */}
      <div className="hero-full-screen">
        {/* REFINED BRANDING & NAV HEADER */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <img
              src={Logo}
              alt="FurEver Logo"
              className="logo-image-holder"
            />
            <div className="top-logo-text">FurEver</div>
          </div>
          {/* Your New Professional Motto */}
          <div className="brand-motto">
            a sub-branch of <strong>Ampathy</strong>
          </div>
        </div>

        {/* LOGIN & GET STARTED BUTTONS */}
        <div className="nav-group">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Get Started
          </Link>
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

        <div className="slogan-container1">
          <span className="slogan-text">
            Adopt and treat like a family member{" "}
          </span>
        </div>

        {/* --- BOTTOM RIGHT DECOR --- */}
        <div className="hero-bottom-right-decor">
          <div className="hero-corner-shape"></div>
          <img className="hero-decor-img-1" src={grayTabby} alt="Gray Tabby" />
          <img className="hero-decor-img-2" src={mochii1} alt="Mochii" />
        </div>
      </div>

      {/* SECTION 2: MOCHI SECTION (Middle) */}
      <div className="mochi-section-container">
        <div className="mochi-bg-shape-top"></div>
        <img className="mochi-bg-img-top" src={grayTabby1}alt="Gray Tabby" />

        <div className="mochi-bg-shape-bottom"></div>
        <img className="mochi-bg-img-bottom" src={puppy} alt="Puppy"/>

        <div className="mochi-content-wrapper">
          <div className="mochi-card align-right">
            <div className="mochi-text-content">
              <h2 className="mochi-title">“ Innocent and loving “</h2>
              <h2 className="mochi-title">
                breed cats for catlovers “
              </h2>
              <p className="mochi-desc">
                They say humans don't choose cats; cats choose their humans.
                Sometimes, the "Cat Distribution System" just needs a little
                help from technology to find the right lap. Every stray has a
                story, and every shelter cat is just one purr away from turning
                a house into a furever home.
              </p>
            </div>
            <div className="mochi-img-placeholder">
              <img src={HelpCat} alt="Mochii" className="mochi-card-img" />
            </div>
          </div>

          <div className="mochi-card align-left">
            <div className="mochi-text-content">
              <h2 className="mochi-title">“ Every animal deserves</h2>
              <h2 className="mochi-title">a happy furever home “</h2>
              <p className="mochi-desc">
                By blending modern technology with a deep empathy for animal
                welfare, FurEver transforms the process of finding a pet into a
                joyful, seamless experience.
              </p>
            </div>
            <div className="mochi-img-placeholder">
              <img src={HelpDog} alt="Rescue Dog" className="mochi-card-img" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: THE INFO & MOBILE DESIGN (Bottom) */}
      <div className="info-section-container">
        <div className="info-content-wrapper">
          <div className="info-text-side">
            <h2 className="info-brand">Furever</h2>
            <h1 className="info-headline">
              Adopt and bring home <br /> your new bestfriend.
            </h1>

            <p className="info-para">
              It is a digital bridge built on the belief that every animal
              deserves a place to call home. Designed with a warm,
              "paw-friendly" aesthetic.
            </p>

            <Link to="/register" className="start-now-btn">
              Start and Adopt now &lt;3
            </Link>

            <div className="footer-links">
              <p>
                Application Download:{" "}
                <a
                  href="https://www.furevermobile.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  furevermobile.com
                </a>
              </p>
              <p>
                Facebook Link:{" "}
                <a
                  href="https://www.facebook.com/furever"
                  target="_blank"
                  rel="noreferrer"
                >
                  facebook.com/furever
                </a>
              </p>
            </div>
          </div>

          <div className="mobile-image-container">
            <img
              src={mobileImg}
              alt="FurEver Mobile App"
              className="mobile-mockup-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
