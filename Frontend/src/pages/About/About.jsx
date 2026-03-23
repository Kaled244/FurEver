import React from 'react';
// Importing the icons you "downloaded" via terminal
import { FaHeart, FaRocket, FaUsers, FaPaw } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page-root">
      <div className="about-content-inner">
        
        <header className="about-header animate-slide-up">
          <div className="about-title-area">
            <h1 className="about-main-title">About FurEver</h1>
            <p className="about-subtitle">Bridging the gap between loving homes and pets in need.</p>
          </div>
        </header>

        <div className="about-sections-container">
          {/* Mission Card */}
          <section className="about-premium-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="about-card-title">Our Mission</h2>
            <p className="about-card-text">
              FurEver is a digital bridge built on the belief that every animal deserves a place to call home. 
              Designed with a warm, "paw-friendly" aesthetic, our platform streamlines the adoption journey 
              by connecting hopeful pet parents with their future companions.
            </p>
          </section>

          {/* The Story Section */}
          <section className="about-premium-card story-split animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="story-text-content">
              <h2 className="about-card-title">How It Started</h2>
              <p className="about-card-text">
                FurEver began when a tiny kitten named <strong>Mochii</strong> was found on a rainy night. 
                He didn't just find a home—he inspired a purpose. FurEver was created to help the 
                "cat distribution system" reach everyone.
              </p>
            </div>
            <div className="story-image-frame">
              <div className="mochii-placeholder">
                <FaPaw className="mochii-icon" />
                <span className="placeholder-label">Mochii</span>
              </div>
            </div>
          </section>

          {/* Values Grid - Now using React Icons */}
          <section className="about-values-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="about-value-box">
              <div className="value-icon-circle">
                <FaHeart className="about-icon" />
              </div>
              <h3>Empathy First</h3>
              <p>Everything we build prioritizes the welfare of the animals and the joy of the adopters.</p>
            </div>

            <div className="about-value-box">
              <div className="value-icon-circle">
                <FaRocket className="about-icon" />
              </div>
              <h3>Modern Tech</h3>
              <p>Developed by Kyle, FurEver blends modern web technology with a deep love for pets.</p>
            </div>

            <div className="about-value-box">
              <div className="value-icon-circle">
                <FaUsers className="about-icon" />
              </div>
              <h3>Community</h3>
              <p>We are a growing family of animal lovers making a real-world impact every day.</p>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="about-cta-footer animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="cta-heading">Ready to grow your family?</h2>
            <button className="cta-action-btn" onClick={() => window.location.href='/adopt'}>
              Find Your Friend
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;