import React, { useState } from 'react';
import AdoptionModal from './AdoptionModal'; // Make sure the path matches your file
import './PetCard.css';

const PetCard = ({ pet }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false); // New state for the form modal

  if (!pet) return null;

  return (
    <div className="pet-card-container">
      {/* Image Section */}
      <div className="pet-card-image-wrapper">
        <img 
          src={pet.pImage || "https://placehold.co/400x300?text=Pet+Photo"} 
          alt={pet.pName} 
          className="pet-card-img"
        />
        <div className="badge-type">{pet.pSpecies}</div>
        <div className={`badge-status ${(pet.pStatus || "").toLowerCase()}`}>
          {pet.pStatus}
        </div>
      </div>

      {/* Info Section */}
      <div className="pet-card-info">
        <div className="pet-card-header">
          <h3 className="pet-card-name">{pet.pName}</h3>
          <span className="pet-card-price">${pet.pPrice}</span>
        </div>

        <div className="pet-card-specs">
          <p><span className="spec-label">Breed :</span> {pet.pBreed}</p>
          <p><span className="spec-label">Age :</span> {pet.pAge} yrs</p>
          <p><span className="spec-label">Sex :</span> {pet.pGender}</p>
        </div>

        <button className="link-details" onClick={() => setShowDetails(true)}>
          Check details
        </button>
        
        {/* Trigger the Application Modal here */}
        <button className="btn-adopt" onClick={() => setShowForm(true)}>
          Adopt me !
        </button>
      </div>

      {/* --- MODAL 1: DETAILS --- */}
      {showDetails && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>&times;</button>
            
            <h2>About {pet.pName}</h2>
            <p className="full-desc">{pet.pDescription || "No full description provided."}</p>
            
            <div className="health-records-section">
              <h3>Health & Vaccination Records</h3>
        
              {pet.healthRecords && pet.healthRecords.length > 0 ? (
                <table className="health-table">
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
                <p className="no-records">No health records currently on file.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: APPLICATION FORM --- */}
      <AdoptionModal 
        pet={pet} 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
};

export default PetCard;