import React, { useState } from 'react';
import axios from 'axios';

const AdoptionModal = ({ pet, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    app_new_pet_name: '',
    app_contact: '',
    app_home_type: 'House with Yard', 
    app_experience: 'FIRST_TIMER',
    app_answer: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Get the token from localStorage (assuming you save it as 'token')
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert("Please log in to adopt a pet!");
      return;
    }

    // 2. Map data to match your Java 'ApplicationRequest' Record EXACTLY
    const submissionData = {
      petId: pet.pId || pet.id,          // maps to request.petId()
      appContact: formData.app_contact,   // maps to request.appContact()
      appHomeType: formData.app_home_type, // maps to request.appHomeType()
      appExperience: formData.app_experience, // maps to request.appExperience()
      appNewpetname: formData.app_new_pet_name, // maps to request.appNewpetname()
      appAnswer: formData.app_answer      // maps to request.appAnswer()
    };

    try {
      // 3. Use your specific backend endpoint: /submit
      const response = await axios.post('http://localhost:8080/api/applications/submit', submissionData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Needed for SecurityContextHolder in Java
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert(response.data); // "Application submitted successfully..."
        onClose();
      }
    } catch (error) {
      console.error("❌ Submission Error:", error);
      const errorMsg = error.response?.data || "Check if your Spring Boot is running!";
      alert(errorMsg);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">Application Form : <span>{pet.pName || pet.name}</span></h2>

        <form className="adoption-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>New Pet Name</label>
              <input 
                type="text" name="app_new_pet_name" 
                placeholder="e.g. Mr. Brown" 
                value={formData.app_new_pet_name} 
                onChange={handleChange} required 
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input 
                type="tel" name="app_contact" 
                placeholder="0912-345-6789" 
                value={formData.app_contact} 
                onChange={handleChange} required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Home Type</label>
              <select name="app_home_type" value={formData.app_home_type} onChange={handleChange}>
                <option value="House with Yard">House with Yard</option>
                <option value="Apartment (Pet Friendly)">Apartment</option>
                <option value="Condo/Studio">Condo</option>
                <option value="Farm/Rural">Rural</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select name="app_experience" value={formData.app_experience} onChange={handleChange}>
                <option value="FIRST_TIMER">First Timer</option>
                <option value="MID_PARENTING">Mid Parenting</option>
                <option value="PRO_PARENTING">Pro Parenting</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Why do you want to adopt?</label>
            <textarea 
              name="app_answer" 
              rows="4" 
              placeholder="Tell us why you're a good fit..."
              value={formData.app_answer} 
              onChange={handleChange} required
            ></textarea>
          </div>

          <button type="submit" className="submit-app-btn">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default AdoptionModal;