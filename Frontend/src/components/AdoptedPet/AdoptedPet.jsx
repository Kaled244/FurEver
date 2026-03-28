import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import './AdoptedPet.css'; 

const AdoptedPetCard = ({ pet }) => {
  const [showDetails, setShowDetails] = useState(false);
  const BASE_URL = "http://localhost:8080"; 

  if (!pet) return null;

  // --- NEW: Helper function to handle image paths ---
  const getPetImage = (imagePath) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Photo";
    
    // If it starts with http, it's an external link (like Unsplash)
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    // Otherwise, it's a local upload from your backend
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  return (
    <div className="uh-adopted-card">
      <div className="uh-adopted-img-wrapper">
        <img 
          src={getPetImage(pet.pImage)} 
          alt={pet.pName} 
          className="uh-adopted-img"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/400x300?text=Pet+Photo"; 
          }}
        />
        <div className="uh-adopted-badge-species">{pet.pSpecies || "Pet"}</div>
        <div className="uh-adopted-furever-badge">ADOPTED</div>
      </div>

      <div className="uh-adopted-info">
        <h3 className="uh-card-pet-name">{pet.pName || "Unnamed Pet"}</h3>
        <button className="uh-adopted-link-details" onClick={() => setShowDetails(true)}>
          <Info size={16} style={{ marginRight: '8px' }} />
          Check details
        </button>
      </div>

      {showDetails && createPortal(
        <div className="uh-adopted-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="uh-adopted-modal-box" onClick={e => e.stopPropagation()}>
            <button className="uh-adopted-close-x" onClick={() => setShowDetails(false)}>&times;</button>
            
            <div className="uh-modal-header-section">
              <h2 className="uh-adopted-modal-title">Meet <span className="uh-adopted-highlight-name">{pet.pName}</span></h2>
              
              <div className="uh-adopted-stats modal-stats">
                <p><span>Breed :</span> {pet.pBreed || "N/A"}</p>
                <p><span>Age :</span> {pet.pAge || "N/A"} yrs</p>
                <p><span>Sex :</span> {pet.pGender || "N/A"}</p>
              </div>
            </div>

            <hr className="uh-modal-divider" />
            <h3 className="uh-adopted-health-title">DESCRIPTION</h3>
            <p className="uh-adopted-description-text">{pet.pDescription || "No full description provided."}</p>
            
            <div className="uh-adopted-health-section">
              <h2 className="uh-adopted-health-title">Health & <span className="uh-adopted-highlight-name">Vaccination Records</span></h2>
        
              {pet.healthRecords && pet.healthRecords.length > 0 ? (
                <table className="uh-adopted-health-table">
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
                <p className="uh-adopted-no-records">No health records currently on file.</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdoptedPetCard;