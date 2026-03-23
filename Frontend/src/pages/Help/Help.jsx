import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaEnvelope, FaHeadset } from 'react-icons/fa';
import './Help.css';

const Help = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does the adoption process work?",
      answer: "Once you find a pet you love, click 'Adopt Me' to submit an application. Our team will review your profile and contact you for a meet-and-greet if it's a good match!"
    },
    {
      question: "Are there any adoption fees?",
      answer: "Yes, FurEver charges a small processing fee that goes directly toward the pet's vaccinations, microchipping, and supporting our partner shelters."
    },
    {
      question: "Can I return a pet if it's not a good fit?",
      answer: "We offer a 2-week 'Trial Period.' If things aren't working out, we'll help you transition the pet back to our care and find a companion better suited for your home."
    },
    {
      question: "How can I update my profile information?",
      answer: "Head over to your Profile page! You can edit your contact details, address, and profile picture directly from there."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="help-page-root">
      <div className="help-content-inner">
        
        {/* Header */}
        <header className="help-header animate-slide-up">
          <div className="help-title-area">
            <h1 className="help-main-title">Need a Hand?</h1>
            <p className="help-subtitle">Find answers to common questions or reach out to our team.</p>
          </div>
        </header>

        <div className="help-sections-container">
          
          {/* FAQ Accordion Section */}
          <section className="help-premium-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="help-card-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="faq-question">
                    <span>{faq.question}</span>
                    {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Cards */}
          <div className="help-contact-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="contact-box">
              <FaHeadset className="contact-icon" />
              <h3>Support Chat</h3>
              <p>Our team is available Mon-Fri, 9am - 5pm to help with adoption hurdles.</p>
              <button className="contact-btn">Start Chat</button>
            </div>

            <div className="contact-box">
              <FaEnvelope className="contact-icon" />
              <h3>Email Us</h3>
              <p>For official inquiries or partnership requests, drop us a line anytime.</p>
              <button className="contact-btn">Send Email</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Help;