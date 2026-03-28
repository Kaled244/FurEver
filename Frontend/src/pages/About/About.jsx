import React from "react";
// Importing the icons you "downloaded" via terminal
import {
  FaHeart,
  FaRocket,
  FaUsers,
  FaPaw,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <div className="about-page-root">
      <div className="about-content-inner">
        <header className="about-header animate-slide-up">
          <div className="about-title-area">
            <h1 className="about-main-title">About FurEver</h1>
            <p className="about-subtitle">
              Bridging the gap between loving homes and pets in need.
            </p>
          </div>
        </header>

        <div className="about-sections-container">
          {/* Mission Card */}
          <section
            className="about-premium-card animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="about-card-title">Our Mission</h2>
            <p className="about-card-text">
              FurEver is a digital bridge built on the belief that every animal
              deserves a place to call home. Designed with a warm,
              "paw-friendly" aesthetic, our platform streamlines the adoption
              journey by connecting hopeful pet parents with their future
              companions.
            </p>
          </section>

          {/* The Story Section */}
          <section
            className="about-premium-card story-split animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="story-text-content">
              <h2 className="about-card-title">How It Started</h2>
              <p className="about-card-text">
                FurEver began when a tiny kitten named <strong>Mochii</strong>{" "}
                was found on a rainy night. He didn't just find a home—he
                inspired a purpose. FurEver was created to help the "cat
                distribution system" reach everyone.
              </p>
            </div>
            <div className="story-image-frame">
              <div className="mochii-placeholder">
                <FaPaw className="mochii-icon" />
                <span className="placeholder-label">Mochii</span>
              </div>
            </div>
          </section>

          {/* Values Grid */}
          <section
            className="about-values-grid animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="about-value-box">
              <div className="value-icon-circle">
                <FaHeart className="about-icon" />
              </div>
              <h3>Empathy First</h3>
              <p>
                Everything we build prioritizes the welfare of the animals and
                the joy of the adopters.
              </p>
            </div>

            <div className="about-value-box">
              <div className="value-icon-circle">
                <FaRocket className="about-icon" />
              </div>
              <h3>Modern Tech</h3>
              <p>
                Developed by Kyle, FurEver blends modern web technology with a
                deep love for pets.
              </p>
            </div>

            <div className="about-value-box">
              <div className="value-icon-circle">
                <FaUsers className="about-icon" />
              </div>
              <h3>Community</h3>
              <p>
                We are a growing family of animal lovers making a real-world
                impact every day.
              </p>
            </div>
          </section>

          {/* Location Section */}
          <section
            className="about-premium-card animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="about-card-title">
              <FaMapMarkerAlt
                style={{ marginRight: "10px", color: "#ff6b6b" }}
              />
              Find Us
            </h2>
            <p className="about-card-text">
              Stop by our adoption center to meet the pets in person! Our team is here
              to guide you through the process.
            </p>
            <div className="map-container">
              <iframe
                title="FurEver Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7851.307716235338!2d123.86038599357913!3d10.289448600000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99da666cc4a8f%3A0x6133bb51ed1dc9d2!2sFurever%20Friends%20Emegency%20Animal%20Hospital!5e0!3m2!1sen!2sus!4v1774607381499!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "15px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>

          {/* Footer CTA - Delayed to 0.5s for sequence */}
          <section
            className="about-cta-footer animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <h2 className="cta-heading">Ready to grow your family?</h2>
            <button
              className="cta-action-btn"
              onClick={() => (window.location.href = "/adopt")}
            >
              Find Your Friend
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
