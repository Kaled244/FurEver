import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdoptionModal from './AdoptionModal'; 
import './PetCard.css';

const PetCard = ({ pet }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  if (!pet) return null;

  // Helper function to construct full image URL
  const getPetImage = (imagePath) => {
    if (!imagePath) return "https://placehold.co/400x300?text=Pet+Photo";
    if (imagePath.startsWith("http")) return imagePath; // External link
    if (imagePath.startsWith("/api/")) return `${BASE_URL}${imagePath}`; // API endpoint
    return `${BASE_URL}/uploads/${imagePath}`; // Local upload
  };

  return (
    <div className="pc-card-container">
      <div className="pc-image-wrapper">
        <img 
          src={getPetImage(pet.pImage)} 
          alt={pet.pName} 
          className="pc-main-img"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/400x300?text=Pet+Photo"; 
          }}
        />
        <div className="pc-badge-species">{pet.pSpecies}</div>
        <div className={`pc-badge-status ${(pet.pStatus || "").toLowerCase()}`}>
          {pet.pStatus}
        </div>
      </div>

      <div className="pc-content-body">
        <div className="pc-header-row">
          <h3 className="pc-pet-name">{pet.pName}</h3>
          <span className="pc-pet-price">${pet.pPrice}</span>
        </div>

        <div className="pc-stats-grid">
          <p><span className="pc-label">Breed :</span> {pet.pBreed}</p>
          <p><span className="pc-label">Age :</span> {pet.pAge} yrs</p>
          <p><span className="pc-label">Sex :</span> {pet.pGender}</p>
        </div>

        <button className="pc-link-details" onClick={() => setShowDetails(true)}>
          Check details
        </button>
        
        <button className="pc-btn-adopt" onClick={() => setShowForm(true)}>
          Adopt me !
        </button>
      </div>

      {showDetails && createPortal(
        <div className="pm-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="pm-modal-box" onClick={e => e.stopPropagation()}>
            <button className="pm-close-x" onClick={() => setShowDetails(false)}>&times;</button>
            
            <h2 className="pm-modal-title">About : <span className="pm-highlight-name">{pet.pName}</span></h2>
            <p className="pm-description-text">{pet.pDescription || "No full description provided."}</p>
            
            <div className="pc-health-section">
            <h2 className="pc-health-title">Health & <span className="pc-highlight-name">Vaccination Records</span></h2>
        
              {pet.healthRecords && pet.healthRecords.length > 0 ? (
                <table className="pc-health-table">
                  <thead>
                    <tr>
                      <th>Vaccination Type</th>
                      <th>Date Administered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pet.healthRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.vacType}</td>
                        <td>{record.vacDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="pm-no-records">No health records currently on file.</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <AdoptionModal 
        pet={pet} 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
};

export default PetCard;