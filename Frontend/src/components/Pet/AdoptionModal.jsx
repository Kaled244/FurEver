import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

const AdoptionModal = ({ pet, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    app_new_pet_name: "",
    app_contact: "",
    app_home_type: "House with Yard",
    app_experience: "FIRST_TIMER",
    app_answer: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to adopt a pet!");
      return;
    }

    const submissionData = {
      petId: pet.pId || pet.id,
      appContact: formData.app_contact,
      appHomeType: formData.app_home_type,
      appExperience: formData.app_experience,
      appNewpetname: formData.app_new_pet_name,
      appAnswer: formData.app_answer,
    };

    console.log("📤 Submitting application:", submissionData);
    console.log("🔑 Token:", token ? "✓ Present" : "✗ Missing");

    try {
      const response = await axios.post(
        // eslint-disable-next-line no-undef
        API_ENDPOINTS.APPLICATIONS_SUBMIT,
        submissionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Application submitted:", response.data);
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("❌ Application submit error:", error);
      const errorMessage = error.response?.data?.message 
        || error.response?.statusText 
        || error.message 
        || "Failed to submit application. Please try again.";
      alert(errorMessage);
    }
  };

  return createPortal(
    <div className="pm-modal-overlay" onClick={onClose}>
      <div className="pm-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="pm-close-x" onClick={onClose}>&times;</button>

        <h2 className="am-form-title">
          Application Form : <span>{pet.pName || pet.name}</span>
        </h2>

        <form className="am-form-container" onSubmit={handleSubmit}>
          <div className="am-form-row">
            <div className="am-input-group">
              <label>New Pet Name</label>
              <input type="text" name="app_new_pet_name" value={formData.app_new_pet_name} onChange={handleChange} required />
            </div>
            <div className="am-input-group">
              <label>Contact Number</label>
              <input type="tel" name="app_contact" value={formData.app_contact} onChange={handleChange} required />
            </div>
          </div>

          <div className="am-form-row">
            <div className="am-input-group">
              <label>Home Type</label>
              <select name="app_home_type" value={formData.app_home_type} onChange={handleChange}>
                <option value="House with Yard">House with Yard</option>
                <option value="Apartment (Pet Friendly)">Apartment</option>
                <option value="Condo/Studio">Condo</option>
                <option value="Farm/Rural">Rural</option>
              </select>
            </div>

            <div className="am-input-group">
              <label>Experience Level</label>
              <select name="app_experience" value={formData.app_experience} onChange={handleChange}>
                <option value="FIRST_TIMER">First Timer</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="PRO_PARENTING">Pro Parenting</option>
              </select>
            </div>
          </div>

          <div className="am-input-group">
            <label>Why do you want to adopt?</label>
            <textarea name="app_answer" rows="4" value={formData.app_answer} onChange={handleChange} required></textarea>
          </div>

          <button type="submit" className="am-submit-btn">Submit Application</button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AdoptionModal;